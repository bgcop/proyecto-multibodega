# Arquitectura del Sistema

## Visión General

Multi-Bodega es un sistema de gestión de inventario multi-bodega construido con arquitectura de tres capas:

1. **Frontend**: Next.js 14 con App Router
2. **Backend**: NestJS 10 con TypeORM
3. **Database**: PostgreSQL

## Diagrama de Arquitectura

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser)                       │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js 14)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Pages     │  │   Layout    │  │  Components │          │
│  │ /productos  │  │  Sidebar    │  │  Tables     │          │
│  │ /entradas   │  │  Header     │  │  Forms      │          │
│  │ /stock      │  │             │  │  Modals     │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────┬───────────────────────────────┘
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (NestJS 10)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ Controllers │  │  Services   │  │  Modules    │          │
│  │ /api/auth   │  │  Products   │  │  AuthMod    │          │
│  │ /api/stock  │  │  Stock      │  │  StockMod   │          │
│  │ /api/entries│  │  Entries    │  │  EntryMod   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Guards    │  │  Interceptors│  │   Pipes    │          │
│  │ JwtAuthGuard│  │  Logging    │  │ Validation │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────┬───────────────────────────────┘
                              │ TypeORM
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (PostgreSQL)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Tables: products, warehouses, stock_movements,       │  │
│  │          inventory_entries, inventory_exits,          │  │
│  │          physical_counts, inventory_closures...       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Patrones Utilizados

### Backend
- **MVC**: Controllers → Services → Entities
- **Repository Pattern**: TypeORM Repositories
- **Dependency Injection**: NestJS DI Container
- **Guard Pattern**: Autenticación JWT
- **DTO Pattern**: Validación de entrada

### Frontend
- **Component-Based**: Componentes reutilizables
- **Page-Based Routing**: Next.js App Router
- **Client Components**: React hooks para estado
- **Server Components**: Renderizado SSR

## Flujo de Datos

### Entrada de Inventario
1. Usuario llena formulario en `/entradas/nuevo`
2. Frontend envía POST a `/api/entries`
3. Backend inicia transacción QueryRunner
4. Crea InventoryEntry + InventoryEntryItem
5. Inserta registros en stock_movements (IN)
6. Commit transacción
7. Stock actualizado dinámicamente

### Salida de Inventario
1. Usuario llena formulario en `/salidas/nuevo`
2. Frontend envía POST a `/api/exits`
3. Backend valida stock disponible por producto
4. Si hay stock, inicia transacción
5. Crea InventoryExit + InventoryExitItem
6. Inserta registros en stock_movements (OUT negativo)
7. Commit transacción

### Transferencia
1. Usuario selecciona bodega origen y destino
2. Backend valida stock en origen
3. Transacción ACID:
   - INSERT stock_movement (OUT de origen)
   - INSERT stock_movement (IN a destino)
4. Ambos o ninguno (rollback en error)

## Seguridad

### Actual (Desarrollo)
- JWT almacenado en localStorage
- Guards en endpoints protegidos
- Validación básica con class-validator

### Pendiente (Producción)
- HttpOnly cookies para JWT
- CSRF protection
- Rate limiting
- Input sanitization
- HTTPS obligatorio

## Escalabilidad

### Horizontal
- Backend stateless (puede replicarse)
- JWT sin estado en servidor
- Load balancer delante de múltiples instancias

### Vertical
- PostgreSQL puede escalar con réplicas de lectura
- Cache Redis para consultas frecuentes
- CDN para assets estáticos
