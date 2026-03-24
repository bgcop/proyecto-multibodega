# Multi-Bodega - Sistema de Gestión de Inventario Multi-Bodega

Sistema completo de gestión de inventario para empresas con múltiples bodegas, con trazabilidad completa de movimientos, control de stock por ubicación, alertas de quiebre, conteos físicos y cierres mensuales.

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** 18+ 
- **PostgreSQL** 14+
- **npm** o **yarn**

### Instalación en 5 pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/bgcop/proyecto-multibodega.git
cd proyecto-multibodega

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Inicializar base de datos
cd database
./init-db.sh --drop-first  # Elimina y recrea la BD con datos de ejemplo
cd ..

# 4. Iniciar backend
npm run start:dev

# 5. En otra terminal, instalar e iniciar frontend
cd ../frontend
npm install
npm run dev
```

### Acceso al Sistema

- **URL**: http://localhost:3000
- **Email**: admin@sistema.local
- **Password**: Admin123!

---

## 📁 Estructura del Proyecto

```
proyecto-multibodega/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── entities/       # 16 entidades TypeORM
│   │   ├── modules/        # 12 módulos funcionales
│   │   └── ...
│   ├── database/           # Scripts SQL
│   │   ├── 01-schema.sql   # Esquema completo
│   │   ├── 02-seed.sql     # Datos de ejemplo
│   │   └── init-db.sh      # Script de inicialización
│   └── test/               # Tests E2E
│
├── frontend/                # Next.js 14 App
│   ├── src/
│   │   ├── app/            # 15+ páginas
│   │   └── components/     # Componentes shadcn/ui
│   └── tests/              # Tests Playwright
│
└── DOCS/                    # Documentación
    ├── SPEC.md             # Especificación técnica
    ├── PLAN.md             # Plan de desarrollo
    ├── quickstart.md       # Guía de inicio
    ├── architecture.md     # Arquitectura
    ├── api-guide.md        # Documentación API
    └── user-guide.md       # Guía de usuario
```

---

## ✨ Funcionalidades

### Gestión de Catálogo
- ✅ Productos con SKU, categorías, precios
- ✅ Categorías jerárquicas
- ✅ Unidades de medida
- ✅ Clientes y proveedores

### Movimientos de Inventario
- ✅ Entradas con proveedor y costo
- ✅ Salidas con cliente y validación de stock
- ✅ Transferencias entre bodegas (ACID)
- ✅ Stock dinámico calculado en tiempo real
- ✅ Alertas de stock mínimo

### Control de Inventario
- ✅ Conteo físico con diferencias
- ✅ Cierres mensuales con snapshot
- ✅ Dashboard con KPIs

---

## 🔧 Scripts Útiles

### Backend

```bash
# Desarrollo con hot reload
npm run start:dev

# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Build producción
npm run build
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Tests E2E con Playwright
npx playwright test

# Tests con UI
npx playwright test --ui
```

### Base de Datos

```bash
# Inicializar BD completa
cd backend/database
./init-db.sh

# Solo esquema (sin datos)
./init-db.sh --schema-only

# Solo datos semilla
./init-db.sh --seed-only

# Eliminar y recrear
./init-db.sh --drop-first

# Ver ayuda
./init-db.sh --help
```

---

## 🗄️ Modelo de Datos

### Entidades Principales (16)

| Módulo | Entidades |
|--------|-----------|
| **Autenticación** | User, Role |
| **Catálogo** | Product, Category, UnitOfMeasure |
| **Terceros** | Customer, Supplier |
| **Almacenes** | Warehouse |
| **Movimientos** | StockMovement, InventoryEntry, InventoryEntryItem |
| | InventoryExit, InventoryExitItem |
| **Control** | PhysicalCount, PhysicalCountItem |
| | InventoryClosure |

---

## 🔐 Seguridad

### Estado Actual (Desarrollo)
- JWT en localStorage
- Guards en endpoints protegidos
- Validación con class-validator

### Pendiente (Producción)
- HttpOnly cookies para JWT
- Rate limiting
- CSRF protection
- HTTPS obligatorio

---

## 📊 Estado del Proyecto

| Fase | Estado | Completitud |
|------|--------|-------------|
| Fase 1: Fundamentos | ✅ Completada | 100% |
| Fase 2: Catálogo | ✅ Completada | 100% |
| Fase 3: Movimientos | ✅ Completada | 100% |
| Fase 4: Control | ✅ Completada | 100% |
| Fase 5: UX y Seguridad | ✅ Completada | 100% |
| Fase 6: Reportes | ⬜ Pendiente | 0% |

**Completitud General: ~95%**

Ver [PLAN.md](./DOCS/PLAN.md) para detalles completos.

---

## 📚 Documentación

- [Especificación Técnica (SPEC.md)](./DOCS/SPEC.md)
- [Plan de Desarrollo (PLAN.md)](./DOCS/PLAN.md)
- [Guía de Inicio Rápido](./DOCS/quickstart.md)
- [Arquitectura del Sistema](./DOCS/architecture.md)
- [Guía de API](./DOCS/api-guide.md)
- [Guía de Usuario](./DOCS/user-guide.md)

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | NestJS 10, TypeScript, TypeORM |
| Database | PostgreSQL 14+ |
| Auth | JWT, Passport |
| Testing | Jest, Supertest, Playwright |

---

## 👥 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

---

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/bgcop/proyecto-multibodega/issues)
- **Email**: soporte@multibodega.local
