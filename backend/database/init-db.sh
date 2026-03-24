#!/bin/bash

# ============================================================================
# MULTI-BODEGA - Script de Inicialización de Base de Datos
# ============================================================================
# Uso: ./init-db.sh [opciones]
#
# Opciones:
#   -h, --host HOST        Host de PostgreSQL (default: localhost)
#   -p, --port PORT        Puerto de PostgreSQL (default: 5432)
#   -U, --user USER        Usuario de PostgreSQL (default: postgres)
#   -d, --database DB      Base de datos (default: multibodega)
#   -W, --password         Pedir password
#   --drop-first           Eliminar base de datos antes de crear
#   --schema-only          Solo crear esquema (sin datos seed)
#   --seed-only            Solo insertar datos seed
#   --help                 Mostrar ayuda
# ============================================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Valores por defecto
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_NAME="multibodega"
DB_PASSWORD=""
DROP_FIRST=false
SCHEMA_ONLY=false
SEED_ONLY=false
ASK_PASSWORD=false

# Directorio del script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Función de ayuda
show_help() {
    echo "Multi-Bodega - Inicialización de Base de Datos"
    echo ""
    echo "Uso: $0 [opciones]"
    echo ""
    echo "Opciones:"
    echo "  -h, --host HOST        Host de PostgreSQL (default: localhost)"
    echo "  -p, --port PORT        Puerto de PostgreSQL (default: 5432)"
    echo "  -U, --user USER        Usuario de PostgreSQL (default: postgres)"
    echo "  -d, --database DB      Base de datos (default: multibodega)"
    echo "  -W, --password         Pedir password de PostgreSQL"
    echo "  --drop-first           Eliminar base de datos antes de crear"
    echo "  --schema-only          Solo crear esquema (sin datos seed)"
    echo "  --seed-only            Solo insertar datos seed"
    echo "  --help                 Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0                              # Inicialización completa"
    echo "  $0 --drop-first                 # Eliminar y recrear base de datos"
    echo "  $0 -h 192.168.1.100 -U admin    # Conectar a servidor remoto"
    echo "  $0 --schema-only                # Solo crear tablas"
    exit 0
}

# Parsear argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)
            DB_HOST="$2"
            shift 2
            ;;
        -p|--port)
            DB_PORT="$2"
            shift 2
            ;;
        -U|--user)
            DB_USER="$2"
            shift 2
            ;;
        -d|--database)
            DB_NAME="$2"
            shift 2
            ;;
        -W|--password)
            ASK_PASSWORD=true
            shift
            ;;
        --drop-first)
            DROP_FIRST=true
            shift
            ;;
        --schema-only)
            SCHEMA_ONLY=true
            shift
            ;;
        --seed-only)
            SEED_ONLY=true
            shift
            ;;
        --help)
            show_help
            ;;
        *)
            echo -e "${RED}Error: Opción desconocida: $1${NC}"
            show_help
            ;;
    esac
done

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           MULTI-BODEGA - Inicialización de BD                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Pedir password si es necesario
if [ "$ASK_PASSWORD" = true ]; then
    echo -n "Password de PostgreSQL: "
    read -s DB_PASSWORD
    echo ""
    export PGPASSWORD="$DB_PASSWORD"
fi

# Construir string de conexión
PSQL_CMD="psql -h $DB_HOST -p $DB_PORT -U $DB_USER"

# Verificar conexión
echo -e "${YELLOW}Verificando conexión a PostgreSQL...${NC}"
if ! $PSQL_CMD -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw postgres; then
    echo -e "${RED}Error: No se puede conectar a PostgreSQL${NC}"
    echo "Verifique que PostgreSQL esté corriendo y las credenciales sean correctas"
    exit 1
fi
echo -e "${GREEN}✓ Conexión exitosa${NC}"

# Eliminar base de datos si se solicita
if [ "$DROP_FIRST" = true ]; then
    echo -e "${YELLOW}Eliminando base de datos '$DB_NAME' si existe...${NC}"
    $PSQL_CMD -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null || {
        echo -e "${RED}Error: No se pudo eliminar la base de datos${NC}"
        echo "Puede haber conexiones activas. Intente:"
        echo "  SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME';"
        exit 1
    }
    echo -e "${GREEN}✓ Base de datos eliminada${NC}"
fi

# Crear base de datos si no existe
if [ "$SEED_ONLY" = false ]; then
    echo -e "${YELLOW}Verificando existencia de base de datos '$DB_NAME'...${NC}"
    if ! $PSQL_CMD -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw $DB_NAME; then
        echo -e "${YELLOW}Creando base de datos '$DB_NAME'...${NC}"
        $PSQL_CMD -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || {
            echo -e "${RED}Error: No se pudo crear la base de datos${NC}"
            exit 1
        }
        echo -e "${GREEN}✓ Base de datos creada${NC}"
    else
        echo -e "${GREEN}✓ Base de datos ya existe${NC}"
    fi
fi

# Ejecutar scripts SQL
PSQL_DB_CMD="$PSQL_CMD -d $DB_NAME"

if [ "$SEED_ONLY" = false ]; then
    echo -e "${YELLOW}Ejecutando script de esquema...${NC}"
    if [ ! -f "$SCRIPT_DIR/01-schema.sql" ]; then
        echo -e "${RED}Error: No se encuentra $SCRIPT_DIR/01-schema.sql${NC}"
        exit 1
    fi
    $PSQL_DB_CMD -f "$SCRIPT_DIR/01-schema.sql" 2>/dev/null || {
        echo -e "${RED}Error al ejecutar 01-schema.sql${NC}"
        exit 1
    }
    echo -e "${GREEN}✓ Esquema creado exitosamente${NC}"
fi

if [ "$SCHEMA_ONLY" = false ]; then
    echo -e "${YELLOW}Ejecutando script de datos semilla...${NC}"
    if [ ! -f "$SCRIPT_DIR/02-seed.sql" ]; then
        echo -e "${RED}Error: No se encuentra $SCRIPT_DIR/02-seed.sql${NC}"
        exit 1
    fi
    $PSQL_DB_CMD -f "$SCRIPT_DIR/02-seed.sql" 2>/dev/null || {
        echo -e "${RED}Error al ejecutar 02-seed.sql${NC}"
        exit 1
    }
    echo -e "${GREEN}✓ Datos semilla insertados${NC}"
fi

# Verificar estructura
echo -e "${YELLOW}Verificando estructura de base de datos...${NC}"
TABLE_COUNT=$($PSQL_DB_CMD -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>/dev/null | tr -d ' ')
echo -e "${GREEN}✓ Tablas creadas: $TABLE_COUNT${NC}"

# Resumen final
echo ""
echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Base de datos inicializada exitosamente${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Detalles de conexión:"
echo "  Host:     $DB_HOST:$DB_PORT"
echo "  Database: $DB_NAME"
echo "  User:     $DB_USER"
echo ""
echo "Credenciales de acceso:"
echo "  Email:    admin@sistema.local"
echo "  Password: Admin123!"
echo ""
echo "Para conectar manualmente:"
echo "  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
echo ""

# Limpiar variable de password
unset PGPASSWORD

exit 0
