-- ============================================================================
-- Script de Esquema - Proyecto Multi-Bodega
-- PostgreSQL 15+
-- ============================================================================

-- Eliminar tablas en orden inverso de dependencias (si existen)
DROP TABLE IF EXISTS inventory_closures CASCADE;
DROP TABLE IF EXISTS physical_count_items CASCADE;
DROP TABLE IF EXISTS physical_counts CASCADE;
DROP TABLE IF EXISTS inventory_exit_items CASCADE;
DROP TABLE IF EXISTS inventory_exits CASCADE;
DROP TABLE IF EXISTS inventory_entry_items CASCADE;
DROP TABLE IF EXISTS inventory_entries CASCADE;
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS units_of_measure CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;

-- Eliminar tipos ENUM si existen (PostgreSQL no tiene DROP TYPE IF EXISTS CASCADE, manejaremos con CREATE TYPE)
-- No se eliminan, se crean si no existen.

-- ============================================================================
-- Crear tipos ENUM
-- ============================================================================

-- Tipo para movimiento de stock
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stockmovementtype') THEN
        CREATE TYPE stockmovementtype AS ENUM ('IN', 'OUT', 'TRANSFER');
    END IF;
END$$;

-- Tipo para estado de entradas/salidas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entry_exit_status') THEN
        CREATE TYPE entry_exit_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');
    END IF;
END$$;

-- Tipo para estado de conteo físico
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'count_status') THEN
        CREATE TYPE count_status AS ENUM ('IN_PROGRESS', 'COMPLETED', 'CANCELLED');
    END IF;
END$$;

-- Tipo para nombre de rol
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rolename') THEN
        CREATE TYPE rolename AS ENUM ('Admin', 'Warehouse_Manager', 'Viewer');
    END IF;
END$$;

-- ============================================================================
-- Crear tablas
-- ============================================================================

-- Tabla: roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name rolename NOT NULL DEFAULT 'Viewer',
    permissions TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- Tabla: categories (auto-referencial)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabla: units_of_measure
CREATE TABLE units_of_measure (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: warehouses
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    image_url VARCHAR(500),
    min_stock INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabla: customers
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: suppliers
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50),
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: stock_movements
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    type stockmovementtype NOT NULL,
    quantity DECIMAL(10,3) NOT NULL CHECK (quantity > 0),
    reason TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_id INTEGER NOT NULL,
    source_warehouse_id INTEGER,
    target_warehouse_id INTEGER,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (source_warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL,
    FOREIGN KEY (target_warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- Tabla: inventory_entries
CREATE TABLE inventory_entries (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(100) UNIQUE NOT NULL,
    warehouse_id INTEGER NOT NULL,
    supplier_id INTEGER,
    entry_date DATE NOT NULL,
    notes TEXT,
    status entry_exit_status NOT NULL DEFAULT 'PENDING',
    total_value DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- Tabla: inventory_entry_items
CREATE TABLE inventory_entry_items (
    id SERIAL PRIMARY KEY,
    entry_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_cost DECIMAL(12,2) NOT NULL CHECK (unit_cost >= 0),
    subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (entry_id) REFERENCES inventory_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Tabla: inventory_exits
CREATE TABLE inventory_exits (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(100) UNIQUE NOT NULL,
    warehouse_id INTEGER NOT NULL,
    customer_id INTEGER,
    exit_date DATE NOT NULL,
    notes TEXT,
    status entry_exit_status NOT NULL DEFAULT 'PENDING',
    total_value DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Tabla: inventory_exit_items
CREATE TABLE inventory_exit_items (
    id SERIAL PRIMARY KEY,
    exit_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
    subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (exit_id) REFERENCES inventory_exits(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Tabla: physical_counts
CREATE TABLE physical_counts (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(100) UNIQUE NOT NULL,
    warehouse_id INTEGER NOT NULL,
    count_date DATE NOT NULL,
    status count_status NOT NULL DEFAULT 'IN_PROGRESS',
    notes TEXT,
    total_items INTEGER NOT NULL DEFAULT 0,
    matched_items INTEGER NOT NULL DEFAULT 0,
    mismatched_items INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- Tabla: physical_count_items
CREATE TABLE physical_count_items (
    id SERIAL PRIMARY KEY,
    count_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    system_stock INTEGER NOT NULL,
    physical_stock INTEGER NOT NULL,
    difference INTEGER NOT NULL,
    notes TEXT,
    FOREIGN KEY (count_id) REFERENCES physical_counts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Tabla: inventory_closures
CREATE TABLE inventory_closures (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(100) UNIQUE NOT NULL,
    warehouse_id INTEGER NOT NULL,
    closure_date DATE NOT NULL,
    period_month INTEGER NOT NULL CHECK (period_month BETWEEN 1 AND 12),
    period_year INTEGER NOT NULL CHECK (period_year >= 2020),
    total_value DECIMAL(15,2) NOT NULL,
    total_products INTEGER NOT NULL,
    notes TEXT,
    snapshot JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- ============================================================================
-- Índices para optimización
-- ============================================================================

-- Índices para stock_movements (según entidad TypeORM)
CREATE INDEX idx_stock_movements_product_date ON stock_movements(product_id, date);
CREATE INDEX idx_stock_movements_source_warehouse_date ON stock_movements(source_warehouse_id, date);
CREATE INDEX idx_stock_movements_target_warehouse_date ON stock_movements(target_warehouse_id, date);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_customers_code ON customers(code);
CREATE INDEX idx_suppliers_code ON suppliers(code);
CREATE INDEX idx_warehouses_code ON warehouses(code);
CREATE INDEX idx_inventory_entries_reference ON inventory_entries(reference);
CREATE INDEX idx_inventory_exits_reference ON inventory_exits(reference);
CREATE INDEX idx_physical_counts_reference ON physical_counts(reference);
CREATE INDEX idx_inventory_closures_reference ON inventory_closures(reference);

-- Índices para fechas
CREATE INDEX idx_inventory_entries_date ON inventory_entries(entry_date);
CREATE INDEX idx_inventory_exits_date ON inventory_exits(exit_date);
CREATE INDEX idx_physical_counts_date ON physical_counts(count_date);
CREATE INDEX idx_inventory_closures_date ON inventory_closures(closure_date);

-- ============================================================================
-- Triggers para actualizar timestamps updated_at
-- ============================================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para tablas con updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comentarios descriptivos
-- ============================================================================

COMMENT ON TABLE roles IS 'Roles de usuario del sistema';
COMMENT ON TABLE users IS 'Usuarios del sistema con autenticación';
COMMENT ON TABLE categories IS 'Categorías de productos con relación jerárquica';
COMMENT ON TABLE units_of_measure IS 'Unidades de medida para productos';
COMMENT ON TABLE warehouses IS 'Bodegas de almacenamiento';
COMMENT ON TABLE products IS 'Productos del inventario';
COMMENT ON TABLE customers IS 'Clientes para salidas de inventario';
COMMENT ON TABLE suppliers IS 'Proveedores para entradas de inventario';
COMMENT ON TABLE stock_movements IS 'Movimientos de stock (entradas, salidas, transferencias)';
COMMENT ON TABLE inventory_entries IS 'Entradas de inventario (compras, ajustes positivos)';
COMMENT ON TABLE inventory_entry_items IS 'Items de entrada de inventario';
COMMENT ON TABLE inventory_exits IS 'Salidas de inventario (ventas, ajustes negativos)';
COMMENT ON TABLE inventory_exit_items IS 'Items de salida de inventario';
COMMENT ON TABLE physical_counts IS 'Conteos físicos de inventario';
COMMENT ON TABLE physical_count_items IS 'Items de conteo físico';
COMMENT ON TABLE inventory_closures IS 'Cierres de inventario mensuales';

-- ============================================================================
-- Mensaje de éxito
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Esquema creado exitosamente. 16 tablas disponibles.';
END $$;