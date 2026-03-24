-- ============================================================================
-- Script de Datos Semilla - Proyecto Multi-Bodega
-- PostgreSQL 15+
-- ============================================================================

-- Desactivar temporalmente las restricciones de llave foránea para facilitar inserción
-- (No necesario en PostgreSQL si insertamos en orden correcto)

-- ============================================================================
-- 1. Roles del sistema
-- ============================================================================

INSERT INTO roles (name, permissions) VALUES
('Admin', ARRAY['all']),
('Warehouse_Manager', ARRAY['warehouse.read', 'warehouse.write', 'stock.read', 'stock.write']),
('Viewer', ARRAY['read']);

-- ============================================================================
-- 2. Usuario Administrador
-- ============================================================================

-- Password: Admin123! (hash bcrypt)
INSERT INTO users (email, password_hash, name, role_id) VALUES
('admin@sistema.local', '$2b$10$tPPmfEz9crmgAm5R20RKRuSeUKaCGmASAh4pH57ToIebRsjQsezyK', 'Administrador del Sistema', 1);

-- ============================================================================
-- 3. Categorías de productos
-- ============================================================================

INSERT INTO categories (name, description) VALUES
('Electrónicos', 'Dispositivos electrónicos y gadgets'),
('Ropa', 'Prendas de vestir y accesorios'),
('Alimentos', 'Productos alimenticios y bebidas'),
('Hogar', 'Artículos para el hogar'),
('Oficina', 'Material de oficina y papelería');

-- Subcategorías (opcional)
-- INSERT INTO categories (name, description, parent_id) VALUES
-- ('Computadoras', 'Laptops y PCs de escritorio', 1),
-- ('Smartphones', 'Teléfonos inteligentes', 1);

-- ============================================================================
-- 4. Unidades de medida
-- ============================================================================

INSERT INTO units_of_measure (code, name, symbol) VALUES
('UN', 'Unidad', 'un'),
('KG', 'Kilogramo', 'kg'),
('LT', 'Litro', 'L'),
('MT', 'Metro', 'm'),
('CJ', 'Caja', 'caja'),
('PK', 'Pack', 'pack');

-- ============================================================================
-- 5. Bodegas
-- ============================================================================

INSERT INTO warehouses (code, name, address) VALUES
('BC', 'Bodega Central', 'Av. Principal #123, Ciudad Central'),
('BN', 'Bodega Norte', 'Calle Norte #456, Zona Industrial Norte'),
('BS', 'Bodega Sur', 'Carrera Sur #789, Polígono Sur');

-- ============================================================================
-- 6. Productos
-- ============================================================================

INSERT INTO products (sku, name, description, price, min_stock, category_id) VALUES
('PROD-001', 'Laptop Dell XPS 15', 'Laptop de 15 pulgadas, 16GB RAM, 512GB SSD', 2499.99, 5, 1),
('PROD-002', 'Smartphone Samsung Galaxy S23', 'Teléfono Android, 256GB, 8GB RAM', 999.99, 10, 1),
('PROD-003', 'Camisa de Algodón', 'Camisa manga larga, color azul, talla M', 29.99, 50, 2),
('PROD-004', 'Arroz Integral 1kg', 'Arroz integral orgánico, paquete de 1kg', 4.99, 100, 3),
('PROD-005', 'Aceite de Oliva Extra Virgen 500ml', 'Aceite de oliva premium', 12.99, 30, 3),
('PROD-006', 'Juego de Sábanas King Size', 'Sábanas de algodón egipcio, 4 piezas', 89.99, 20, 4),
('PROD-007', 'Silla de Oficina Ergonómica', 'Silla ajustable con soporte lumbar', 199.99, 15, 5),
('PROD-008', 'Papel Bond A4 500 hojas', 'Resma de papel bond tamaño A4', 8.99, 200, 5),
('PROD-009', 'Audífonos Bluetooth Noise Cancelling', 'Audífonos inalámbricos con cancelación de ruido', 149.99, 25, 1),
('PROD-010', 'Mochila para Laptop', 'Mochila impermeable con compartimento para laptop de 15"', 49.99, 40, 4);

-- ============================================================================
-- 7. Clientes
-- ============================================================================

INSERT INTO customers (code, name, tax_id, email, phone, address) VALUES
('CLI-001', 'Distribuidora Comercial S.A.', '123456789-0', 'ventas@distribuidora.com', '+57 1 2345678', 'Carrera 10 #25-30, Bogotá'),
('CLI-002', 'Supermercado El Ahorro', '987654321-0', 'compras@elahorro.com', '+57 1 8765432', 'Av. Siempre Viva #742, Medellín'),
('CLI-003', 'Tienda Online TechWorld', '456789123-0', 'pedidos@techworld.com', '+57 1 5551234', 'Calle 80 #12-45, Cali'),
('CLI-004', 'Restaurante La Parrilla', '789123456-0', 'proveedores@laparrilla.com', '+57 1 3334444', 'Av. Gourmet #55-22, Barranquilla'),
('CLI-005', 'Corporación Industrial Andina', '321654987-0', 'compras@andina.com', '+57 1 2223333', 'Zona Industrial, Pereira');

-- ============================================================================
-- 8. Proveedores
-- ============================================================================

INSERT INTO suppliers (code, name, tax_id, contact_name, email, phone, address) VALUES
('PROV-001', 'Importadora Tecnológica Ltda.', '111222333-0', 'Juan Pérez', 'compras@importtec.com', '+57 1 4445555', 'Polígono Industrial, Bogotá'),
('PROV-002', 'Alimentos Naturales S.A.', '444555666-0', 'María González', 'ventas@alimentosnat.com', '+57 1 6667777', 'Carretera Central Km 5, Cundinamarca'),
('PROV-003', 'Textiles del Valle', '777888999-0', 'Carlos Rodríguez', 'info@textilesvalle.com', '+57 1 8889999', 'Zona Franca, Cartagena');

-- ============================================================================
-- 9. Movimientos de stock iniciales (opcional - demostración)
-- ============================================================================

-- Insertar algunos movimientos de stock IN para tener inventario inicial
-- Nota: Necesita user_id (admin) y product_id existentes
INSERT INTO stock_movements (type, quantity, reason, product_id, source_warehouse_id, target_warehouse_id, user_id) VALUES
('IN', 50, 'Inventario inicial', 1, NULL, 1, 1),
('IN', 100, 'Inventario inicial', 2, NULL, 1, 1),
('IN', 200, 'Inventario inicial', 3, NULL, 2, 1),
('IN', 500, 'Inventario inicial', 4, NULL, 2, 1),
('IN', 150, 'Inventario inicial', 5, NULL, 3, 1);

-- ============================================================================
-- 10. Entradas de inventario (opcional)
-- ============================================================================

-- Primero crear una entrada
INSERT INTO inventory_entries (reference, warehouse_id, supplier_id, entry_date, status, total_value) VALUES
('REC-2024-001', 1, 1, '2024-03-01', 'COMPLETED', 5499.95);

-- Items de la entrada
INSERT INTO inventory_entry_items (entry_id, product_id, quantity, unit_cost, subtotal) VALUES
(1, 1, 2, 2200.00, 4400.00),
(1, 2, 1, 1099.95, 1099.95);

-- ============================================================================
-- Mensaje de éxito
-- ============================================================================

DO $$
DECLARE
    role_count INTEGER;
    user_count INTEGER;
    cat_count INTEGER;
    prod_count INTEGER;
    wh_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO role_count FROM roles;
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO cat_count FROM categories;
    SELECT COUNT(*) INTO prod_count FROM products;
    SELECT COUNT(*) INTO wh_count FROM warehouses;
    
    RAISE NOTICE 'Datos semilla insertados exitosamente:';
    RAISE NOTICE '- % roles', role_count;
    RAISE NOTICE '- % usuarios', user_count;
    RAISE NOTICE '- % categorías', cat_count;
    RAISE NOTICE '- % unidades de medida', (SELECT COUNT(*) FROM units_of_measure);
    RAISE NOTICE '- % bodegas', wh_count;
    RAISE NOTICE '- % productos', prod_count;
    RAISE NOTICE '- % clientes', (SELECT COUNT(*) FROM customers);
    RAISE NOTICE '- % proveedores', (SELECT COUNT(*) FROM suppliers);
    RAISE NOTICE '';
    RAISE NOTICE 'Credenciales de acceso:';
    RAISE NOTICE 'Email: admin@sistema.local';
    RAISE NOTICE 'Password: Admin123!';
    RAISE NOTICE '';
    RAISE NOTICE 'Base de datos lista para uso.';
END $$;