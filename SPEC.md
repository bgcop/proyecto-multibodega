# SPEC.md - Sistema Multi-Bodega

## 1. Análisis del Problema

### Problema de Negocio
Las empresas con múltiples bodegas necesitan controlar su inventario de forma centralizada, con trazabilidad completa de movimientos (entradas, salidas, transferencias), control de stock por ubicación, alertas de quiebre de stock, y capacidad de realizar conteos físicos y cierres periódicos.

### Usuarios
- **Administradores**: Control total del sistema, gestión de usuarios y configuración
- **Bodegueros**: Registro de entradas, salidas, transferencias y conteos físicos
- **Compradores**: Gestión de proveedores y órdenes de compra
- **Vendedores**: Gestión de clientes y órdenes de venta

### Alcance
**INCLUDED:**
- Gestión de productos con categorías jerárquicas
- Gestión de bodegas múltiples
- Gestión de terceros (clientes, proveedores)
- Entradas de inventario con proveedor
- Salidas de inventario con cliente
- Transferencias entre bodegas (ACID)
- Cálculo dinámico de stock
- Alertas de stock mínimo
- Conteo físico de inventario
- Cierres mensuales con snapshot
- Dashboard con KPIs

**EXCLUDED:**
- Facturación electrónica
- Integración con sistemas contables
- App móvil
- Multi-empresa (SaaS)
- Órdenes de compra/venta automatizadas
- Reportes PDF/Excel avanzados

---

## 2. Tipo de Proyecto
- [x] NUEVO DESARROLLO
- [ ] SOLUCIÓN EXISTENTE (modificación)

---

## 3. Análisis Técnico

### Arquitectura Propuesta
```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 14)                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ Pages   │ │ Layout  │ │ Comp.   │ │ Hooks   │           │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
│       └───────────┴───────────┴───────────┘                 │
│                         │ HTTP/REST                         │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                    BACKEND (NestJS 10)                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ Auth    │ │ Products│ │ Stock   │ │ Reports │           │
│  │ Module  │ │ Module  │ │ Module  │ │ Module  │           │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
│       └───────────┴───────────┴───────────┘                 │
│                         │ TypeORM                            │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                    DATABASE (PostgreSQL)                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 16 Entidades | ACID Transactions | Dynamic Stock Calc   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Stack Tecnológico
| Componente | Tecnología | Razón |
|------------|------------|-------|
| Frontend | Next.js 14 + TypeScript | SSR, App Router, DX moderna |
| UI Framework | Tailwind CSS + shadcn/ui | Diseño rápido, accesible, consistente |
| Backend | NestJS 10 + TypeScript | Modular, decoradores, validación |
| ORM | TypeORM | Relaciones complejas, migraciones |
| Database | PostgreSQL | ACID, JSONB para snapshots |
| Auth | JWT + Passport | Stateless, escalable |
| Testing E2E | Playwright | Browser automation, screenshots |
| Testing API | Jest + Supertest | Unit tests, integration tests |

---

## 4. Modelo de Datos

### Entidades Principales (16)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    User      │       │   Product    │       │   Category   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │       │ id           │       │ id           │
│ email        │       │ sku          │       │ name         │
│ password     │       │ name         │       │ description  │
│ name         │       │ price        │       │ parentId     │
│ roleId       │       │ minStock     │       └──────────────┘
└──────────────┘       │ categoryId   │
                       └──────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  Warehouse   │       │   Customer   │       │   Supplier   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │       │ id           │       │ id           │
│ code         │       │ code         │       │ code         │
│ name         │       │ name         │       │ name         │
│ address      │       │ taxId        │       │ taxId        │
│ isActive     │       │ email        │       │ contactName  │
└──────────────┘       │ phone        │       │ email        │
                       │ address      │       │ phone        │
                       └──────────────┘       └──────────────┘

┌──────────────────────────────────────────────────────────┐
│                    StockMovement                          │
├──────────────────────────────────────────────────────────┤
│ id | type | quantity | productId | sourceWH | targetWH   │
│ reason | userId | date | reference                       │
└──────────────────────────────────────────────────────────┘

┌──────────────────┐       ┌──────────────────┐
│ InventoryEntry   │       │ InventoryExit    │
├──────────────────┤       ├──────────────────┤
│ id               │       │ id               │
│ reference        │       │ reference        │
│ warehouseId      │       │ warehouseId      │
│ supplierId       │       │ customerId       │
│ entryDate        │       │ exitDate         │
│ totalValue       │       │ totalValue       │
│ status           │       │ status           │
└────────┬─────────┘       └────────┬─────────┘
         │                          │
         ▼                          ▼
┌──────────────────┐       ┌──────────────────┐
│ EntryItem        │       │ ExitItem         │
├──────────────────┤       ├──────────────────┤
│ productId        │       │ productId        │
│ quantity         │       │ quantity         │
│ unitCost         │       │ unitPrice        │
│ subtotal         │       │ subtotal         │
└──────────────────┘       └──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│ PhysicalCount    │       │ InventoryClosure │
├──────────────────┤       ├──────────────────┤
│ id               │       │ id               │
│ reference        │       │ reference        │
│ warehouseId      │       │ warehouseId      │
│ countDate        │       │ periodMonth/Year │
│ status           │       │ totalValue       │
│ matchedItems     │       │ totalProducts    │
│ mismatchedItems  │       │ snapshot (JSONB) │
└────────┬─────────┘       └──────────────────┘
         │
         ▼
┌──────────────────┐
│ PhysicalCountItem│
├──────────────────┤
│ productId        │
│ systemStock      │
│ physicalStock    │
│ difference       │
└──────────────────┘
```

---

## 5. API Contracts

### Autenticación
```
POST /api/auth/seed-admin    → Crea usuario admin inicial
POST /api/auth/login         → { email, password } → { access_token }
```

### Productos
```
GET    /api/products         → { data: Product[], total, page, limit }
GET    /api/products/:id     → Product
POST   /api/products         → CreateProductDto → Product
PUT    /api/products/:id     → UpdateProductDto → Product
DELETE /api/products/:id     → { message }
```

### Stock y Movimientos
```
GET  /api/stock-movements/stock?productId=&warehouseId=  → number
POST /api/stock-movements/transfer   → TransferDto → StockMovement
GET  /api/stock-movements/low-warnings → LowStockWarning[]
```

### Entradas y Salidas
```
GET  /api/entries           → InventoryEntry[]
GET  /api/entries/:id       → InventoryEntry
POST /api/entries           → CreateEntryDto → InventoryEntry

GET  /api/exits             → InventoryExit[]
GET  /api/exits/:id         → InventoryExit
POST /api/exits             → CreateExitDto → InventoryExit
```

### Conteo Físico y Cierres
```
GET  /api/physical-counts           → PhysicalCount[]
GET  /api/physical-counts/:id       → PhysicalCount
POST /api/physical-counts           → { warehouse_id } → PhysicalCount
PUT  /api/physical-counts/:id/items/:itemId  → UpdateItemDto
PUT  /api/physical-counts/:id/complete       → PhysicalCount

GET  /api/closures          → InventoryClosure[]
GET  /api/closures/:id      → InventoryClosure
POST /api/closures          → { warehouse_id, notes? } → InventoryClosure
```

### CRUD Básico
```
/api/warehouses   | GET, POST, GET/:id, PUT/:id, DELETE/:id
/api/categories   | GET, POST, GET/:id, PUT/:id, DELETE/:id
/api/units        | GET, POST, GET/:id, PUT/:id, DELETE/:id
/api/customers    | GET, POST, GET/:id, PUT/:id, DELETE/:id
/api/suppliers    | GET, POST, GET/:id, PUT/:id, DELETE/:id
```

---

## 6. Plan de Funcionalidades y Pruebas

### 6.1 Funcionalidades Implementadas

| # | Funcionalidad | Estado | Prioridad |
|---|--------------|--------|-----------|
| 1 | Login JWT | ✅ Completo | Must |
| 2 | Dashboard KPIs | ✅ Completo | Must |
| 3 | Productos CRUD | ✅ Completo | Must |
| 4 | Categorías CRUD | ✅ Completo | Must |
| 5 | Unidades CRUD | ✅ Completo | Must |
| 6 | Bodegas CRUD | ✅ Completo | Must |
| 7 | Clientes CRUD | ✅ Completo | Must |
| 8 | Proveedores CRUD | ✅ Completo | Must |
| 9 | Entradas Inventario | ✅ Completo | Must |
| 10 | Salidas Inventario | ✅ Completo | Must |
| 11 | Transferencias ACID | ✅ Completo | Must |
| 12 | Stock Dinámico | ✅ Completo | Must |
| 13 | Alertas Stock Bajo | ✅ Completo | Must |
| 14 | Conteo Físico | ✅ Completo | Must |
| 15 | Cierres Mensuales | ✅ Completo | Must |
| 16 | Formularios Creación | ✅ Completo | Must |

### 6.2 Funcionalidades Parcialmente Implementadas

| # | Funcionalidad | Falta | Prioridad |
|---|--------------|-------|-----------|
| 1 | Editar Productos | Página /productos/:id/editar | Should |
| 2 | Editar Categorías | Página edición | Should |
| 3 | Editar Bodegas | Página edición | Should |
| 4 | Editar Clientes | Página edición | Should |
| 5 | Editar Proveedores | Página edición | Should |
| 6 | Detalle Entradas | Página /entradas/:id | Should |
| 7 | Detalle Salidas | Página /salidas/:id | Should |
| 8 | Editar Conteo | Página de captura de conteo | Should |
| 9 | Tests Playwright | Ejecutar y verificar | Must |

### 6.3 Funcionalidades NO Implementadas (Gap)

| # | Funcionalidad | Descripción | Prioridad |
|---|--------------|-------------|-----------|
| 1 | Ajuste Post-Conteo | Aplicar diferencias del conteo físico al stock | Must |
| 2 | Reportes PDF | Entradas, salidas, stock por bodega | Could |
| 3 | Búsqueda Global | Buscar en productos, clientes, etc | Should |
| 4 | Historial por Producto | Ver movimientos de un producto | Should |
| 5 | Auditoría de Cambios | Log de quién modificó qué | Could |
| 6 | Multi-usuario activo | Mostrar sesión actual, logout | Must |
| 7 | HttpOnly Cookies | Migrar de localStorage a cookies seguras | Must |
| 8 | Paginación Frontend | Tablas con paginación real | Should |
| 9 | Filtros en listados | Filtrar por fecha, estado, etc | Should |
| 10 | Dashboard exportar | Excel/PDF del dashboard | Could |

### 6.4 Plan de Testing

| # | Funcionalidad | Test Type | Criterio Éxito |
|---|--------------|-----------|----------------|
| 1 | Login | E2E Playwright | Usuario autenticado recibe token |
| 2 | Login inválido | E2E | Sistema rechaza credenciales |
| 3 | Crear producto | E2E + API | Producto aparece en lista |
| 4 | Stock insuficiente | API | Salida rechazada con error claro |
| 5 | Transferencia ACID | API | Stock correcto en ambas bodegas |
| 6 | Conteo físico | API | Diferencias calculadas correctamente |
| 7 | Cierre mensual | API | Snapshot guardado, no duplicado |

---

## 7. Decisiones Arquitectónicas (ADR)

| # | Decisión | Razón | Alternativas Consideradas |
|---|----------|-------|--------------------------|
| 1 | Stock dinámico desde StockMovement | Trazabilidad completa, no se pierde historial | Campo stock estático en Product (descartado) |
| 2 | QueryRunner para transferencias | ACID garantizado, rollback en error | Transacciones manuales (descartado) |
| 3 | JSONB para snapshot de cierre | Flexible, queryable, sin nuevas tablas | Tablas relacionales (más complejo) |
| 4 | localStorage para JWT | MVP rápido | HttpOnly cookies (pendiente migrar) |
| 5 | TypeORM synchronize:true | Desarrollo rápido | Migraciones formales (producción) |
| 6 | Next.js App Router | Futuro del framework | Pages Router (legacy) |
| 7 | shadcn/ui componentes | Calidad, accesibilidad, customización | Componentes propios (más tiempo) |

---

## 8. Deuda Técnica Identificada

### Crítica (Resolver antes de producción)
1. **HttpOnly Cookies**: localStorage es vulnerable a XSS
2. **Validación de entrada**: Faltan DTOs en entries/exits
3. **Tests E2E**: No ejecutados, pueden estar rotos

### Media (Mejorar en siguiente sprint)
1. **Paginación real**: Frontend no pagina, carga todo
2. **Manejo de errores**: Mensajes genéricos, mejorar UX
3. **TypeScript strict**: Algunos `any` en servicios
4. **Environment variables**: URLs hardcodeadas

### Baja (Nice to have)
1. **Logging estructurado**: winston/pino para producción
2. **Rate limiting**: Protección contra abuso
3. **Cache Redis**: Para consultas frecuentes
4. **CI/CD pipeline**: GitHub Actions para tests

---

## 9. URLs del Proyecto

- **Repositorio**: https://github.com/bgcop/proyecto-multibodega
- **Local Backend**: http://localhost:3000
- **Local Frontend**: http://localhost:3001 (o 3000 si backend en otro puerto)
- **Credenciales**: admin@sistema.local / admin123
