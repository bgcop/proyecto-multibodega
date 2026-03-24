# Guía de Usuario

## Introducción

Multi-Bodega es un sistema de gestión de inventario para empresas con múltiples bodegas. Permite controlar el stock, realizar entradas y salidas, transferir entre bodegas, y mantener un historial completo de movimientos.

## Primeros Pasos

### Acceso al Sistema

1. Abrir el navegador en la URL del sistema
2. Ingresar con las credenciales proporcionadas
3. Verá el Dashboard principal

### Dashboard

El Dashboard muestra:
- **Total de Productos**: Cantidad de productos activos
- **Valor del Inventario**: Suma de stock × precio
- **Entradas del Mes**: Cantidad de entradas registradas
- **Salidas del Mes**: Cantidad de salidas realizadas
- **Stock Crítico**: Productos bajo mínimos
- **Alertas Activas**: Productos con stock muy bajo

---

## Gestión de Catálogo

### Productos

**Ver Productos:**
1. Click en "Productos" en el menú lateral
2. Se muestra la lista con: SKU, nombre, precio, categoría, stock mínimo

**Crear Producto:**
1. Click en "+ Nuevo Producto"
2. Completar campos:
   - **SKU**: Código único (ej: PROD-001)
   - **Nombre**: Descripción del producto
   - **Precio**: Precio de venta
   - **Stock Mínimo**: Nivel para alertas
   - **Categoría**: (opcional) Seleccione categoría
3. Click en "Guardar Producto"

### Categorías

Las categorías permiten organizar los productos jerárquicamente.

**Crear Categoría:**
1. Click en "Categorías" → "+ Nueva Categoría"
2. Ingrese nombre y descripción
3. Opcionalmente seleccione una categoría padre

### Unidades de Medida

Define las unidades para los productos (kg, unidades, litros, etc.)

**Crear Unidad:**
1. Click en "Unidades de Medida" → "+ Nueva Unidad"
2. Ingrese código (ej: KG), nombre (Kilogramos), símbolo (kg)

---

## Gestión de Terceros

### Clientes

Registre sus clientes para asociarlos a las salidas de inventario.

**Crear Cliente:**
1. Click en "Clientes" → "+ Nuevo Cliente"
2. Complete datos: código, nombre, NIT/RUC, email, teléfono, dirección

### Proveedores

Registre sus proveedores para asociarlos a las entradas de inventario.

**Crear Proveedor:**
1. Click en "Proveedores" → "+ Nuevo Proveedor"
2. Complete datos similares al cliente

---

## Movimientos de Inventario

### Entradas

Registre ingresos de mercadería.

**Crear Entrada:**
1. Click en "Entradas" → "+ Nueva Entrada"
2. Seleccione:
   - **Bodega Destino**: Dónde se guardará
   - **Proveedor**: (opcional) Quién vendió
   - **Notas**: Observaciones
3. Agregue productos:
   - Seleccione producto
   - Ingrese cantidad
   - Ingrese costo unitario
4. Click en "Registrar Entrada"

El sistema actualiza automáticamente el stock.

### Salidas

Registre egresos de mercadería.

**Crear Salida:**
1. Click en "Salidas" → "+ Nueva Salida"
2. Seleccione:
   - **Bodega Origen**: De dónde sale
   - **Cliente**: (opcional) Quién compró
3. Agregue productos con cantidad y precio
4. Click en "Registrar Salida"

⚠️ **Importante:** El sistema valida que haya stock suficiente antes de procesar.

### Transferencias

Mueva productos entre bodegas.

**Realizar Transferencia:**
1. Click en "Transferencias"
2. Seleccione:
   - **Producto**: Qué mover
   - **Bodega Origen**: De dónde sale
   - **Bodega Destino**: A dónde va
   - **Cantidad**: Cuánto mover
   - **Motivo**: (opcional) Razón
3. Click en "Transferir"

El sistema valida stock y actualiza ambas bodegas atómicamente.

---

## Control de Inventario

### Stock

Vea el stock consolidado por producto y bodega.

1. Click en "Stock"
2. Filtre por bodega o producto
3. Vea cantidades disponibles

### Alertas

Vea productos con stock bajo.

1. Click en "Alertas"
2. Los productos con stock < mínimos aparecen aquí
3. Tome acción: comprar o transferir

### Conteo Físico

Realice inventarios físicos.

**Crear Conteo:**
1. Click en "Conteo Físico" → "+ Nuevo Conteo"
2. Seleccione la bodega
3. El sistema genera la lista de productos con stock del sistema

**Realizar Conteo:**
1. Ingrese las cantidades físicas contadas
2. El sistema calcula diferencias automáticamente
3. Al finalizar, click en "Completar Conteo"

### Cierres Mensuales

Genere snapshots del inventario para reportes.

**Crear Cierre:**
1. Click en "Cierres" → "+ Nuevo Cierre"
2. Seleccione la bodega
3. El sistema guarda: productos, cantidades, valores

⚠️ **Nota:** No se pueden crear dos cierres para el mismo mes/bodega.

---

## Preguntas Frecuentes

**¿Qué pasa si intento sacar más stock del que hay?**
El sistema rechaza la salida y muestra un error con el stock disponible.

**¿Cómo sé qué productos necesitan reposición?**
Revise la página "Alertas" o vea el indicador "Stock Crítico" en el Dashboard.

**¿Puedo ver el historial de movimientos?**
Actualmente el historial está en la base de datos. En futuras versiones habrá una página dedicada.

**¿Qué es una transferencia?**
Es mover productos de una bodega a otra. El stock total no cambia, solo la ubicación.

**¿Para qué sirve el cierre mensual?**
Para tener un registro histórico del valor del inventario en un momento dado. Útil para contabilidad.
