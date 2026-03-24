#!/bin/bash

# ============================================================================
# Script de Inicialización de Base de Datos - Proyecto Multi-Bodega
# ============================================================================

set -e  # Salir en error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables de conexión (usar .env o valores por defecto)
ENV_FILE="../.env"
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASS="postgres"
DB_NAME="multibodega"

# Leer variables desde .env si existe
if [ -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Leyendo configuración desde $ENV_FILE${NC}"
    source <(grep -E '^(DB_HOST|DB_PORT|DB_USERNAME|DB_PASSWORD|DB_DATABASE)=' "$ENV_FILE" | sed 's/DB_USERNAME/DB_USER/g; s/DB_PASSWORD/DB_PASS/g; s/DB_DATABASE/DB_NAME/g')
else
    echo -e "${YELLOW}Archivo .env no encontrado, usando valores por defecto${NC}"
fi

# Determinar método de conexión (psql o docker exec)
DB_CONTAINER="multibodega-db"
PSQL_CMD=""
if command -v psql &> /dev/null; then
    PSQL_CMD="psql"
    echo -e "${GREEN}Usando psql local${NC}"
elif docker ps --filter "name=$DB_CONTAINER" --format "{{.Names}}" | grep -q "$DB_CONTAINER"; then
    PSQL_CMD="docker exec -i $DB_CONTAINER psql"
    echo -e "${GREEN}Usando docker exec en contenedor $DB_CONTAINER${NC}"
else
    echo -e "${RED}Error: No se encontró psql ni el contenedor PostgreSQL.${NC}"
    echo "  Instale postgresql-client o inicie el contenedor con:"
    echo "  docker run --name $DB_CONTAINER -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=$DB_NAME -p 5432:5432 -d postgres:15"
    exit 1
fi

# Mostrar configuración
echo -e "${GREEN}Configuración de conexión:${NC}"
echo "  Host:     $DB_HOST"
echo "  Puerto:   $DB_PORT"
echo "  Usuario:  $DB_USER"
echo "  Base de datos: $DB_NAME"
echo "  Comando:  $PSQL_CMD"
echo ""

# Función para ejecutar SQL
execute_sql() {
    local sql_file="$1"
    local description="$2"
    
    echo -e "${YELLOW}Ejecutando: $description${NC}"
    
    if [ -f "$sql_file" ]; then
        # Usar el comando determinado (psql o docker exec)
        if [ "$PSQL_CMD" = "psql" ]; then
            PGPASSWORD="$DB_PASS" psql \
                -h "$DB_HOST" \
                -p "$DB_PORT" \
                -U "$DB_USER" \
                -d "$DB_NAME" \
                -f "$sql_file" \
                --quiet \
                --no-password \
                --single-transaction
        else
            # docker exec - pasar el archivo SQL via stdin
            docker exec -i "$DB_CONTAINER" psql \
                -h "$DB_HOST" \
                -p "$DB_PORT" \
                -U "$DB_USER" \
                -d "$DB_NAME" \
                --quiet \
                --no-password \
                --single-transaction < "$sql_file"
        fi
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ $description completado${NC}"
            return 0
        else
            echo -e "${RED}✗ Error en $description${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ Archivo no encontrado: $sql_file${NC}"
        return 1
    fi
}

# Función para verificar conexión
check_connection() {
    echo -e "${YELLOW}Verificando conexión a PostgreSQL...${NC}"
    
    local connect_cmd
    if [ "$PSQL_CMD" = "psql" ]; then
        if PGPASSWORD="$DB_PASS" psql \
            -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            -d "postgres" \
            -c "SELECT 1;" \
            --quiet \
            --no-password > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Conexión exitosa${NC}"
            return 0
        else
            echo -e "${RED}✗ No se puede conectar a PostgreSQL${NC}"
            echo "  Verifique que:"
            echo "  1. PostgreSQL esté ejecutándose en $DB_HOST:$DB_PORT"
            echo "  2. El usuario '$DB_USER' tenga permisos"
            echo "  3. La contraseña sea correcta"
            return 1
        fi
    else
        # Usar docker exec
        if docker exec "$DB_CONTAINER" psql \
            -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            -d "postgres" \
            -c "SELECT 1;" \
            --quiet \
            --no-password > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Conexión exitosa${NC}"
            return 0
        else
            echo -e "${RED}✗ No se puede conectar a PostgreSQL${NC}"
            echo "  Verifique que el contenedor '$DB_CONTAINER' esté ejecutándose."
            return 1
        fi
    fi
}

# Función para crear base de datos
create_database() {
    echo -e "${YELLOW}Creando base de datos '$DB_NAME'...${NC}"
    
    if PGPASSWORD="$DB_PASS" psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "postgres" \
        -c "CREATE DATABASE $DB_NAME;" \
        --quiet \
        --no-password > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Base de datos creada${NC}"
        return 0
    else
        echo -e "${YELLOW}La base de datos ya existe, continuando...${NC}"
        return 0
    fi
}

# Función para eliminar base de datos (solo con --reset)
drop_database() {
    echo -e "${YELLOW}Eliminando base de datos '$DB_NAME'...${NC}"
    
    # Terminar conexiones activas primero
    PGPASSWORD="$DB_PASS" psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "postgres" \
        -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" \
        --quiet \
        --no-password > /dev/null 2>&1
    
    sleep 1
    
    if PGPASSWORD="$DB_PASS" psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "postgres" \
        -c "DROP DATABASE IF EXISTS $DB_NAME;" \
        --quiet \
        --no-password > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Base de datos eliminada${NC}"
        return 0
    else
        echo -e "${RED}✗ Error al eliminar base de datos${NC}"
        return 1
    fi
}

# Función para validar tablas creadas
validate_tables() {
    echo -e "${YELLOW}Validando tablas creadas...${NC}"
    
    local table_count=$(PGPASSWORD="$DB_PASS" psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -t \
        -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" \
        --quiet \
        --no-password | tr -d '[:space:]')
    
    if [ "$table_count" -ge 16 ]; then
        echo -e "${GREEN}✓ $table_count tablas creadas (esperado: 16+)${NC}"
        
        # Listar tablas
        echo -e "${YELLOW}Tablas en la base de datos:${NC}"
        PGPASSWORD="$DB_PASS" psql \
            -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            -d "$DB_NAME" \
            -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" \
            --quiet \
            --no-password
        return 0
    else
        echo -e "${RED}✗ Solo se crearon $table_count tablas (esperado: 16+)${NC}"
        return 1
    fi
}

# Procesar argumentos
RESET_DB=0

while [[ $# -gt 0 ]]; do
    case $1 in
        --reset)
            RESET_DB=1
            shift
            ;;
        --help)
            echo "Uso: $0 [--reset]"
            echo ""
            echo "Inicializa la base de datos del proyecto Multi-Bodega."
            echo ""
            echo "Opciones:"
            echo "  --reset    Elimina y recrea la base de datos desde cero"
            echo "  --help     Muestra esta ayuda"
            echo ""
            echo "Variables de entorno (desde .env o por defecto):"
            echo "  DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE"
            exit 0
            ;;
        *)
            echo -e "${RED}Argumento desconocido: $1${NC}"
            echo "Use $0 --help para ayuda"
            exit 1
            ;;
    esac
done

# ============================================================================
# Inicio del script
# ============================================================================

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Inicialización de Base de Datos${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 1. Verificar conexión
check_connection || exit 1

# 2. Resetear base de datos si se solicita
if [ $RESET_DB -eq 1 ]; then
    echo -e "${YELLOW}Modo reset activado${NC}"
    drop_database || exit 1
fi

# 3. Crear base de datos si no existe
create_database || exit 1

# 4. Ejecutar script de esquema
execute_sql "01-schema.sql" "Esquema de base de datos (16 tablas)" || exit 1

# 5. Ejecutar script de datos semilla
execute_sql "02-seed.sql" "Datos semilla (categorías, productos, usuarios, etc.)" || exit 1

# 6. Validar resultado
validate_tables || exit 1

# 7. Mensaje final
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Base de datos inicializada exitosamente!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Resumen:"
echo "- Esquema: 16 tablas con relaciones e índices"
echo "- Datos: Categorías, productos, bodegas, clientes, proveedores, etc."
echo "- Usuario admin: admin@sistema.local / Admin123!"
echo ""
echo "Para ejecutar la aplicación:"
echo "  cd .. && npm run start:dev"
echo ""
echo "Para reiniciar la base de datos desde cero:"
echo "  ./init-db.sh --reset"
echo ""