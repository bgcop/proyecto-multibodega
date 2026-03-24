-- ============================================================================
-- MULTI-BODEGA - Script de Inicialización de Base de Datos
-- PostgreSQL 14+
-- ============================================================================
-- Ejecutar: psql -U postgres -d multibodega -f 01-schema.sql
-- ============================================================================

-- Limpiar tablas existentes (¡CUIDADO EN PRODUCCIÓN!)
DROP TABLE IF EXISTS inventory_closure_items CASCADE;
DROP TABLE IF EXISTS inventory_closures CASCADE;
DROP TABLE IF EXISTS physical_count_items CASCADE;
DROP TABLE IF EXISTS physical_counts CASCADE;
DROP TABLE IF EXISTS inventory_exit_items CASCADE;
DROP TABLE IF EXISTS inventory_exits CASCADE;
DROP TABLE IF EXISTS inventory_entry_items CASCADE;
DROP TABLE IF EXISTS inventory_entries CASCADE;
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS units_of_measure CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ============================================================================
-- TIPOS ENUM
-- ============================================================================

-- Tipo de movimiento de stock
DO $$ BEGIN
    CREATE TYPE stock_movement_type AS ENUM ('IN', 'OUT', 'TRANSFER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tipo de role
DO $$ BEGIN
    CREATE TYPE role_name AS ENUM ('Admin', 'Warehouse_Manager', 'Viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- TABLAS BASE
-- ============================================================================

-- Roles de usuario
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name role_name NOT NULL DEFAULT 'Viewer',
    permissions TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuarios del sistema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categorías de productos (jerárquicas)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unidades de medida
CREATE TABLE units_of_measure (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bodegas/Almacenes
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    min_stock INTEGER DEFAULT 0,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    unit_id INTEGER REFERENCES units_of_measure(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clientes
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proveedores
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(20),
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MOVIMIENTOS DE STOCK
-- ============================================================================

-- Movimientos de stock (tabla central para cálculo dinámico)
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    type stock_movement_type NOT NULL,
    quantity DECIMAL(10, 3) NOT NULL,
    reason TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference VARCHAR(50),
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    source_warehouse_id INTEGER REFERENCES warehouses(id) ON DELETE SET NULL,
    target_warehouse_id INTEGER REFERENCES warehouses(id) ON DELETE SET NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ENTRADAS DE INVENTARIO
-- ============================================================================

-- Entradas de inventario
CREATE TABLE inventory_entries (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(50) NOT NULL UNIQUE,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    supplier_id INTEGER REFERENCES suppliers(id),
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_value DECIMAL(12, 2) DEFAULT 0,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'completed',
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items de entrada
CREATE TABLE inventory_entry_items (
    id SERIAL PRIMARY KEY,
    entry_id INTEGER NOT NULL REFERENCES inventory_entries(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity DECIMAL(10, 3) NOT NULL,
    unit_cost DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SALIDAS DE INVENTARIO
-- ============================================================================

-- Salidas de inventario
CREATE TABLE inventory_exits (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(50) NOT NULL UNIQUE,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    customer_id INTEGER REFERENCES customers(id),
    exit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_value DECIMAL(12, 2) DEFAULT 0,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'completed',
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items de salida
CREATE TABLE inventory_exit_items (
    id SERIAL PRIMARY KEY,
    exit_id INTEGER NOT NULL REFERENCES inventory_exits(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity DECIMAL(10, 3) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CONTEO FÍSICO
-- ============================================================================

-- Conteos físicos de inventario
CREATE TABLE physical_counts (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(50) NOT NULL UNIQUE,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    count_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    matched_items INTEGER DEFAULT 0,
    mismatched_items INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items de conteo físico
CREATE TABLE physical_count_items (
    id SERIAL PRIMARY KEY,
    physical_count_id INTEGER NOT NULL REFERENCES physical_counts(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    system_stock DECIMAL(10, 3) NOT NULL,
    physical_stock DECIMAL(10, 3),
    difference DECIMAL(10, 3),
    notes TEXT,
    counted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CIERRES DE INVENTARIO
-- ============================================================================

-- Cierres mensuales de inventario
CREATE TABLE inventory_closures (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(50) NOT NULL UNIQUE,
    warehouse_id INTEGER REFERENCES warehouses(id),
    period_month INTEGER NOT NULL,
    period_year INTEGER NOT NULL,
    total_value DECIMAL(14, 2) DEFAULT 0,
    total_products INTEGER DEFAULT 0,
    snapshot JSONB,
    notes TEXT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_id, period_month, period_year)
);

-- ============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

-- Stock movements
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_source ON stock_movements(source_warehouse_id);
CREATE INDEX idx_stock_movements_target ON stock_movements(target_warehouse_id);
CREATE INDEX idx_stock_movements_date ON stock_movements(date);
CREATE INDEX idx_stock_movements_product_date ON stock_movements(product_id, date);
CREATE INDEX idx_stock_movements_source_date ON stock_movements(source_warehouse_id, date);
CREATE INDEX idx_stock_movements_target_date ON stock_movements(target_warehouse_id, date);

-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(is_active);

-- Entries
CREATE INDEX idx_entries_warehouse ON inventory_entries(warehouse_id);
CREATE INDEX idx_entries_supplier ON inventory_entries(supplier_id);
CREATE INDEX idx_entries_date ON inventory_entries(entry_date);
CREATE INDEX idx_entry_items_product ON inventory_entry_items(product_id);

-- Exits
CREATE INDEX idx_exits_warehouse ON inventory_exits(warehouse_id);
CREATE INDEX idx_exits_customer ON inventory_exits(customer_id);
CREATE INDEX idx_exits_date ON inventory_exits(exit_date);
CREATE INDEX idx_exit_items_product ON inventory_exit_items(product_id);

-- Physical counts
CREATE INDEX idx_physical_counts_warehouse ON physical_counts(warehouse_id);
CREATE INDEX idx_physical_counts_date ON physical_counts(count_date);
CREATE INDEX idx_physical_count_items_count ON physical_count_items(physical_count_id);

-- Closures
CREATE INDEX idx_closures_warehouse ON inventory_closures(warehouse_id);
CREATE INDEX idx_closures_period ON inventory_closures(period_year, period_month);

-- ============================================================================
-- FUNCIONES ÚTILES
-- ============================================================================

-- Función para calcular stock actual
CREATE OR REPLACE FUNCTION calculate_stock(
    p_product_id INTEGER,
    p_warehouse_id INTEGER DEFAULT NULL
) RETURNS DECIMAL(10, 3) AS $$
DECLARE
    total_stock DECIMAL(10, 3);
BEGIN
    SELECT COALESCE(SUM(
        CASE 
            WHEN p_warehouse_id IS NULL THEN
                CASE 
                    WHEN type = 'IN' THEN quantity
                    WHEN type = 'OUT' THEN -quantity
                    ELSE 0
                END
            ELSE
                CASE 
                    WHEN type = 'IN' AND target_warehouse_id = p_warehouse_id THEN quantity
                    WHEN type = 'OUT' AND source_warehouse_id = p_warehouse_id THEN -quantity
                    WHEN type = 'TRANSFER' AND target_warehouse_id = p_warehouse_id THEN quantity
                    WHEN type = 'TRANSFER' AND source_warehouse_id = p_warehouse_id THEN -quantity
                    ELSE 0
                END
        END
    ), 0) INTO total_stock
    FROM stock_movements
    WHERE product_id = p_product_id
    AND (p_warehouse_id IS NULL OR source_warehouse_id = p_warehouse_id OR target_warehouse_id = p_warehouse_id);
    
    RETURN total_stock;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stock_movements_updated_at BEFORE UPDATE ON stock_movements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_entries_updated_at BEFORE UPDATE ON inventory_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exits_updated_at BEFORE UPDATE ON inventory_exits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_physical_counts_updated_at BEFORE UPDATE ON physical_counts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_closures_updated_at BEFORE UPDATE ON inventory_closures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FINALIZACIÓN
-- ============================================================================

-- Confirmar creación
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT count(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Schema creado exitosamente';
    RAISE NOTICE 'Tablas creadas: %', table_count;
    RAISE NOTICE '================================================';
END $$;
