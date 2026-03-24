# Guía de API

## Autenticación

Todas las requests a endpoints protegidos deben incluir el header:

\`\`\`
Authorization: Bearer <token>
\`\`\`

### Endpoints de Auth

#### Crear Admin Inicial
\`\`\`http
POST /api/auth/seed-admin
\`\`\`

#### Login
\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@sistema.local",
  "password": "admin123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
\`\`\`

---

## Productos

### Listar Productos (Público)
\`\`\`http
GET /api/products?page=1&limit=10
\`\`\`

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "sku": "PROD-001",
      "name": "Producto Ejemplo",
      "price": 100.00,
      "minStock": 5,
      "category": { "id": 1, "name": "Categoría" }
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
\`\`\`

### Crear Producto (Requiere Auth)
\`\`\`http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "sku": "PROD-002",
  "name": "Nuevo Producto",
  "price": 150.00,
  "minStock": 10,
  "categoryId": 1
}
\`\`\`

---

## Stock

### Consultar Stock
\`\`\`http
GET /api/stock-movements/stock?productId=1&warehouseId=1
\`\`\`

**Response:**
\`\`\`json
150
\`\`\`

### Transferencia
\`\`\`http
POST /api/stock-movements/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "sourceId": 1,
  "targetId": 2,
  "qty": 50,
  "reason": "Reposición de stock"
}
\`\`\`

### Alertas de Stock Bajo
\`\`\`http
GET /api/stock-movements/low-warnings
\`\`\`

**Response:**
\`\`\`json
[
  {
    "id": 1,
    "name": "Producto Crítico",
    "min_stock": 10,
    "current_stock": 2
  }
]
\`\`\`

---

## Entradas

### Crear Entrada
\`\`\`http
POST /api/entries
Authorization: Bearer <token>
Content-Type: application/json

{
  "warehouse_id": 1,
  "supplier_id": 1,
  "notes": "Compra de proveedor",
  "items": [
    {
      "product_id": 1,
      "quantity": 100,
      "unit_cost": 50.00
    }
  ]
}
\`\`\`

---

## Salidas

### Crear Salida
\`\`\`http
POST /api/exits
Authorization: Bearer <token>
Content-Type: application/json

{
  "warehouse_id": 1,
  "customer_id": 1,
  "notes": "Venta",
  "items": [
    {
      "product_id": 1,
      "quantity": 10,
      "unit_price": 100.00
    }
  ]
}
\`\`\`

**Error si no hay stock:**
\`\`\`json
{
  "statusCode": 400,
  "message": "Stock insuficiente para producto 1. Disponible: 5, Solicitado: 10"
}
\`\`\`

---

## Conteo Físico

### Crear Conteo
\`\`\`http
POST /api/physical-counts
Authorization: Bearer <token>
Content-Type: application/json

{
  "warehouse_id": 1
}
\`\`\`

### Actualizar Item de Conteo
\`\`\`http
PUT /api/physical-counts/1/items/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "physical_stock": 95,
  "notes": "Faltan 5 unidades"
}
\`\`\`

### Completar Conteo
\`\`\`http
PUT /api/physical-counts/1/complete
Authorization: Bearer <token>
\`\`\`

---

## Cierres

### Crear Cierre Mensual
\`\`\`http
POST /api/closures
Authorization: Bearer <token>
Content-Type: application/json

{
  "warehouse_id": 1,
  "notes": "Cierre mensual marzo 2026"
}
\`\`\`

### Ver Cierres
\`\`\`http
GET /api/closures
\`\`\`

---

## Códigos de Error

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Creado |
| 400 | Bad Request (validación) |
| 401 | No autorizado |
| 404 | No encontrado |
| 500 | Error interno |
