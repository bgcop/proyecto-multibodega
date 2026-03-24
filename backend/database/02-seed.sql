-- ============================================================================
-- MULTI-BODEGA - Datos de Ejemplo (Seed Data)
-- PostgreSQL 14+
-- ============================================================================
-- Ejecutar: psql -U postgres -d multibodega -f 02-seed.sql
-- ============================================================================

-- ============================================================================
-- ROLES Y USUARIOS
-- ============================================================================

-- Insertar roles
INSERT INTO roles (name, permissions) VALUES
    ('Admin', 'users:read,users:write,products:read,products:write,stock:read,stock:write,entries:read,entries:write,exits:read,exits:write,reports:read,reports:write'),
    ('Warehouse_Manager', 'products:read,products:write,stock:read,stock:write,entries:read,entries:write,exits:read,exits:write,reports:read'),
    ('Viewer', 'products:read,stock:read,entries:read,exits:read,reports:read');

-- Insertar usuario admin (password: Admin123! - hash bcrypt)
-- El hash fue generado con: bcrypt.hashSync('Admin123!', 10)
INSERT INTO users (email, password_hash, name, role_id) VALUES
    ('admin@sistema.local', '$2b$10$rQZ3kP9xV5Y2tH8mK7fL4OeN6sJ1dG0cIwB5aX3yZ8vW9uT2sR4q', 'Administrador del Sistema', 1);

-- Usuario adicional de prueba (password: Manager123!)
INSERT INTO users (email, password_hash, name, role_id) VALUES
    ('bodeguero@sistema.local', '$2b$10$xH8kP9xV5Y2tH8mK7fL4OeN6sJ1dG0cIwB5aX3yZ8vW9uT2sR4qP', 'Juan Bodeguero', 2);

-- ============================================================================
-- CATÁLOGO BASE
-- ============================================================================

-- Categorías principales
INSERT INTO categories (name, description) VALUES
    ('Electrónicos', 'Dispositivos electrónicos y accesorios'),
    ('Ropa y Accesorios', 'Vestimenta y accesorios de moda'),
    ('Alimentos y Bebidas', 'Productos comestibles y bebidas'),
    ('Hogar y Jardín', 'Artículos para el hogar y jardinería'),
    ('Oficina y Papelería', 'Material de oficina y papelería');

-- Subcategorías
INSERT INTO categories (name, description, parent_id) VALUES
    ('Smartphones', 'Teléfonos inteligentes', 1),
    ('Laptops', 'Computadoras portátiles', 1),
    ('Audio', 'Equipos de audio y audífonos', 1),
    ('Camisetas', 'Camisetas y polos', 2),
    ('Pantalones', 'Pantalones y jeans', 2),
    ('Calzado', 'Zapatos y zapatillas', 2),
    ('Bebidas', 'Refrescos y jugos', 3),
    ('Snacks', 'Aperitivos y bocadillos', 3),
    ('Muebles', 'Muebles para el hogar', 4),
    ('Herramientas', 'Herramientas de jardín', 4);

-- Unidades de medida
INSERT INTO units_of_measure (code, name, symbol) VALUES
    ('UN', 'Unidad', 'un'),
    ('KG', 'Kilogramo', 'kg'),
    ('LT', 'Litro', 'lt'),
    ('MT', 'Metro', 'mt'),
    ('CJ', 'Caja', 'cj'),
    ('PK', 'Pack', 'pk'),
    ('BL', 'Bolsa', 'bl'),
    ('PZA', 'Pieza', 'pza');

-- ============================================================================
-- BODEGAS
-- ============================================================================

INSERT INTO warehouses (code, name, address, is_active) VALUES
    ('BC', 'Bodega Central', 'Av. Principal 123, Zona Industrial, Ciudad Principal', TRUE),
    ('BN', 'Bodega Norte', 'Calle Norte 456, Parque Industrial Norte, Zona Norte', TRUE),
    ('BS', 'Bodega Sur', 'Av. Sur 789, Distrito Industrial Sur, Zona Sur', TRUE),
    ('BA', 'Bodega Auxiliar', 'Calle Auxiliar 321, Almacén Secundario', FALSE);

-- ============================================================================
-- PRODUCTOS
-- ============================================================================

INSERT INTO products (sku, name, description, price, min_stock, category_id, unit_id, is_active) VALUES
    -- Electrónicos
    ('ELEC-001', 'Smartphone Samsung Galaxy A54', 'Smartphone Samsung Galaxy A54 128GB Negro', 299.99, 10, 6, 1, TRUE),
    ('ELEC-002', 'iPhone 15 Pro Max', 'Apple iPhone 15 Pro Max 256GB Titanio Natural', 1199.99, 5, 6, 1, TRUE),
    ('ELEC-003', 'Laptop HP Pavilion 15', 'Laptop HP Pavilion 15.6" Intel i5 16GB RAM 512GB SSD', 699.99, 8, 7, 1, TRUE),
    ('ELEC-004', 'MacBook Air M2', 'Apple MacBook Air M2 13.6" 256GB SSD', 1099.99, 5, 7, 1, TRUE),
    ('ELEC-005', 'Audífonos Sony WH-1000XM5', 'Audífonos inalámbricos con cancelación de ruido', 349.99, 15, 8, 1, TRUE),
    ('ELEC-006', 'AirPods Pro 2', 'Apple AirPods Pro 2da generación con estuche MagSafe', 249.99, 20, 8, 1, TRUE),
    
    -- Ropa
    ('ROPA-001', 'Camiseta Básica Algodón', 'Camiseta básica de algodón unisex', 19.99, 50, 9, 1, TRUE),
    ('ROPA-002', 'Jeans Levi''s 501', 'Jeans clásicos Levi''s 501 Original Fit', 59.99, 30, 10, 1, TRUE),
    ('ROPA-003', 'Zapatillas Nike Air Max', 'Zapatillas Nike Air Max 270 para hombre', 129.99, 20, 11, 1, TRUE),
    
    -- Alimentos
    ('ALIM-001', 'Coca-Cola 600ml Pack 12', 'Pack 12 botellas Coca-Cola 600ml', 14.99, 100, 12, 6, TRUE),
    ('ALIM-002', 'Papas Lays Clásicas 150g', 'Papas fritas Lays clásicas bolsa 150g', 2.99, 200, 13, 7, TRUE),
    ('ALIM-003', 'Agua Mineral 500ml Pack 24', 'Pack 24 botellas agua mineral 500ml', 9.99, 150, 12, 6, TRUE),
    
    -- Hogar
    ('HOGAR-001', 'Mesa de Centro Madera', 'Mesa de centro de madera de roble 120x60cm', 149.99, 5, 14, 1, TRUE),
    ('HOGAR-002', 'Set Herramientas Jardín', 'Set de 5 herramientas de jardín con estuche', 39.99, 15, 15, 1, TRUE),
    
    -- Oficina
    ('OFIC-001', 'Resma Papel A4 500 hojas', 'Resma de papel bond A4 75g 500 hojas', 4.99, 100, 5, 1, TRUE),
    ('OFIC-002', 'Bolígrafos BIC Pack 50', 'Pack 50 bolígrafos BIC Cristal azules', 12.99, 50, 5, 6, TRUE),
    ('OFIC-003', 'Cuaderno Espiral A5', 'Cuaderno espiral A5 100 hojas cuadriculado', 2.49, 200, 5, 1, TRUE);

-- ============================================================================
-- CLIENTES
-- ============================================================================

INSERT INTO customers (code, name, tax_id, email, phone, address, notes) VALUES
    ('CLI-001', 'Comercializadora del Norte S.A.', 'NIT-123456789-1', 'contacto@comnorte.com', '+57 1 234 5678', 'Calle Norte 100, Bogotá', 'Cliente preferencial'),
    ('CLI-002', 'Tiendas Express Central', 'NIT-987654321-0', 'pedidos@tiendasexpress.com', '+57 1 876 5432', 'Av. Central 500, Medellín', 'Credito 30 días'),
    ('CLI-003', 'Distribuidora del Valle', 'NIT-456789123-4', 'ventas@distvalle.com', '+57 2 345 6789', 'Carrera 50 #30-20, Cali', 'Cliente frecuente'),
    ('CLI-004', 'Supermercados Económicos', 'NIT-789123456-7', 'compras@supecon.com', '+57 1 234 5679', 'Descuento volumen'),
    ('CLI-004', 'Supermercados Económicos', 'NIT-321654987-5', 'compras@supeco.com', '+57 1 234 5680', 'Carrera 50 #30-20, Cali', 'Cliente nuevo'),
    ('CLI-005', 'Ferretería El Tornillo', 'NIT-789123456-7', 'info@tornillo.com', '+57 4 123 4567', 'Calle Hardware 123, Barranquilla', 'Pagos contado');

-- ============================================================================
-- PROVEEDORES
-- ============================================================================

INSERT INTO suppliers (code, name, tax_id, contact_name, email, phone, address, notes) VALUES
    ('PROV-001', 'ElectroMundo Distribuidores', 'NIT-111222333-1', 'Carlos Mendoza', 'cmendoza@electromundo.com', '+57 1 111 2222', 'Zona Industrial Norte, Bogotá', 'Electrónicos principal'),
    ('PROV-002', 'Textiles del Sur', 'NIT-444555666-2', 'María García', 'mgarcia@textilesur.com', '+57 2 444 5555', 'Parque Industrial Sur, Cali', 'Ropa y accesorios'),
    ('PROV-003', 'Alimentos Premium', 'NIT-777888999-3', 'Pedro Sánchez', 'psanchez@alimentospremium.com', '+57 4 777 8888', 'Centro de Distribución, Medellín', 'Alimentos y bebidas'),
    ('PROV-004', 'Importadora Global', 'NIT-222333444-4', 'Ana Rodríguez', 'arodriguez@importglobal.com', '+57 1 222 3333', 'Puerto Libre, Barranquilla', 'Importaciones varias'),
    ('PROV-005', 'OfiSuministros', 'NIT-555666777-5', 'Luis Fernández', 'lfernandez@ofisum.com', '+57 1 555 6666', 'Centro Comercial Norte, Bogotá', 'Papelería y oficina');

-- ============================================================================
-- STOCK INICIAL (Movimientos de entrada)
-- ============================================================================

-- Insertar movimientos de stock inicial (solo entradas para poblar inventario)
-- Estos representan el stock inicial en cada bodega

-- Bodega Central - Electrónicos
INSERT INTO stock_movements (type, quantity, reason, date, reference, product_id, target_warehouse_id, user_id) VALUES
    ('IN', 50, 'Stock inicial', '2026-01-01', 'INI-BC-001', 1, 1, 1),
    ('IN', 25, 'Stock inicial', '2026-01-01', 'INI-BC-002', 2, 1, 1),
    ('IN', 30, 'Stock inicial', '2026-01-01', 'INI-BC-003', 3, 1, 1),
    ('IN', 20, 'Stock inicial', '2026-01-01', 'INI-BC-004', 4, 1, 1),
    ('IN', 75, 'Stock inicial', '2026-01-01', 'INI-BC-005', 5, 1, 1),
    ('IN', 100, 'Stock inicial', '2026-01-01', 'INI-BC-006', 6, 1, 1);

-- Bodega Central - Ropa
INSERT INTO stock_movements (type, quantity, reason, date, reference, product_id, target_warehouse_id, user_id) VALUES
    ('IN', 200, 'Stock inicial', '2026-01-01', 'INI-BC-007', 7, 1, 1),
    ('IN', 150, 'Stock inicial', '2026-01-01', 'INI-BC-008', 8, 1, 1),
    ('IN', 80, 'Stock inicial', '2026-01-01', 'INI-BC-009', 9, 1, 1);

-- Bodega Central - Alimentos
INSERT INTO stock_movements (type, quantity, reason, date, reference, product_id, target_warehouse_id, user_id) VALUES
    ('IN', 500, 'Stock inicial', '2026-01-01', 'INI-BC-010', 10, 1, 1),
    ('IN', 800, 'Stock inicial', '2026-01-01', 'INI-BC-011', 11, 1, 1),
    ('IN', 600, 'Stock inicial', '2026-01-01', 'INI-BC-012', 12, 1, 1);

-- Bodega Central - Hogar y Oficina
INSERT INTO stock_movements (type, quantity, reason, date, reference, product_id, target_warehouse_id, user_id) VALUES
    ('IN', 25, 'Stock inicial', '2026-01-01', 'INI-BC-013', 13, 1, 1),
    ('IN', 60, 'Stock inicial', '2026-01-01', 'INI-BC-014', 14, 1, 1),
    ('IN', 400, 'Stock inicial', '2026-01-01', 'INI-BC-015', 15, 1, 1),
    ('IN', 250, 'Stock inicial', '2026-01-01', 'INI-BC-016', 16, 1, 1),
    ('IN', 1000, 'Stock inicial', '2026-01-01', 'INI-BC-017', 17, 1, 1);

-- Bodega Norte - Stock distribuido
INSERT INTO stock_movements (type, quantity, reason, date, reference, product_id, target_warehouse_id, user_id) VALUES
    ('IN', 30, 'Stock inicial', '2026-01-01', 'INI-BN-001', 1, 2, 1),
    ('IN', 15, 'Stock inicial', '2026-01-01', 'INI-BN-002', 3, 2, 1),
    ('IN', 40, 'Stock inicial', '2026-01-01', 'INI-BN-003', 5, 2, 1),
    ('IN', 100, 'Stock inicial', '2026-01-01', 'INI-BN-004', 7, 2, 1),
    ('IN', 200, 'Stock inicial', '2026-01-01', 'INI-BN-005', 10, 2, 1),
    ('IN', 150, 'Stock inicial', '2026-01-01', 'INI-BN-006', 15, 2, 1);

-- Bodega Sur - Stock distribuido
INSERT INTO stock_movements (type, quantity, reason, date, reference, product_id, target_warehouse_id, user_id) VALUES
    ('IN', 20, 'Stock inicial', '2026-01-01', 'INI-BS-001', 2, 3, 1),
    ('IN', 25, 'Stock inicial', '2026-01-01', 'INI-BS-002', 4, 3, 1),
    ('IN', 50, 'Stock inicial', '2026-01-01', 'INI-BS-003', 6, 3, 1),
    ('IN', 80, 'Stock inicial', '2026-01-01', 'INI-BS-004', 8, 3, 1),
    ('IN', 300, 'Stock inicial', '2026-01-01', 'INI-BS-005', 11, 3, 1),
    ('IN', 200, 'Stock inicial', '2026-01-01', 'INI-BS-006', 16, 3, 1);

-- ============================================================================
-- ENTRADAS DE EJEMPLO
-- ============================================================================

-- Entrada 1: Electrónicos de ElectroMundo
INSERT INTO inventory_entries (reference, warehouse_id, supplier_id, entry_date, total_value, notes, status, user_id) VALUES
    ('REC-2026-0001', 1, 1, '2026-01-15', 18500.00, 'Compra de electrónicos para reponer stock', 'completed', 1);

INSERT INTO inventory_entry_items (entry_id, product_id, quantity, unit_cost, subtotal) VALUES
    (1, 1, 20, 220.00, 4400.00),
    (1, 3, 15, 520.00, 7800.00),
    (1, 5, 30, 210.00, 6300.00);

-- Actualizar stock por esta entrada
INSERT INTO stock_movements (type, quantity, reason, date, reference, product_id, target_warehouse_id, user_id) VALUES
    ('IN', 20, 'Entrada REC-2026-0001', '2026-01-15', 'REC-2026-0001', 1, 1, 1),
    ('IN', 15, 'Entrada REC-2026-0001', '2026-01-15', 'REC-2026-0001', 3, 1, 1),
    ('IN', 30, 'Entrada REC-2026-0001', '2026-01-15', 'REC-2026-0001', 5, 1, 1);

-- Entrada 2: Ropa de Textiles del Sur
INSERT INTO inventory_entries (reference, warehouse_id, supplier_id, entry_date, total_value, notes, status, user_id) VALUES
    ('REC-2026-0002', 1, 2, '2026-01-20', 5200.00, 'Nueva colección primavera', 'completed', 1);

INSERT INTO inventory_entry_items (entry_id, product_id, quantity, unit_cost, subtotal) VALUES
    (2, 7, 100, 12.00, 1200.00),
    (2, 8, 50, 40.00, 2000.00),
    (2, 9, 20, 100.00, 2000.00);

INSERT INTO stock_movements (type, quantity, reason, date, reference, product_id, target_warehouse_id, user_id) VALUES
    ('IN', 100, 'Entrada REC-2026-0002', '2026-01-20', 'REC-2026-0002', 7, 1, 1),
    ('IN', 50, 'Entrada REC-2026-0002', '2026-01-20', 'REC-2026-0002', 8, 1, 1),
    ('IN', 20, 'Entrada REC-2026-0002', '2026-01-20', 'REC-2026-0002', 9, 1, 1);

-- ============================================================================
-- SALIDAS DE EJEMPLO
-- ============================================================================

-- Salida 1: Venta a Comercializadora del Norte
INSERT INTO inventory_exits (reference, warehouse_id, customer_id, exit_date, total_value, notes, status, user_id) VALUES
    ('SAL-2026-0001', 1, 1, '2026-02-01', 8995.00, 'Pedido mensual cliente preferencial', 'completed', 1);

INSERT INTO inventory_exit_items (exit_id, product_id, quantity, unit_price, subtotal) VALUES
    (1, 1, 10, 299.99, 2999.90),
    (1, 3, 5, 699.99, 3499.95),
    (1, 5, 10, 249.99, 2499.90);

INSERT INTO stock_movements (type, quantity, reason, date, reference, product_id, source_warehouse_id, user_id) VALUES
    ('OUT', 10, 'Salida SAL-2026-0001', '2026-02-01', 'SAL-2026-0001', 1, 1, 1),
    ('OUT', 5, 'Salida SAL-2026-0001', '2026-02-01', 'SAL-2026-0001', 3, 1, 1),
    ('OUT', 10, 'Salida SAL-2026-0001', '2026-02-01', 'SAL-2026-0001', 5, 1, 1);

-- Salida 2: Venta a Tiendas Express
INSERT INTO inventory_exits (reference, warehouse_id, customer_id, exit_date, total_value, notes, status, user_id) VALUES
    ('SAL-2026-0002', 1, 2, '2026-02-05', 4598.50, 'Pedido Express', 'completed', 1);

INSERT INTO inventory_exit_items (exit_id, product_id, quantity, unit_price, subtotal) VALUES
    (2, 10, 50, 14.99, 749.50),
    (2, 11, 100, 2.99, 299.00),
    (2, 7, 150, 19.99, 2998.50),
    (2, 15, 100, 4.99, 499.00);

INSERT INTO stock_movements (type, quantity, reason, date, reference, product_id, source_warehouse_id, user_id) VALUES
    ('OUT', 50, 'Salida SAL-2026-0002', '2026-02-05', 'SAL-2026-0002', 10, 1, 1),
    ('OUT', 100, 'Salida SAL-2026-0002', '2026-02-05', 'SAL-2026-0002', 11, 1, 1),
    ('OUT', 150, 'Salida SAL-2026-0002', '2026-02-05', 'SAL-2026-0002', 7, 1, 1),
    ('OUT', 100, 'Salida SAL-2026-0002', '2026-02-05', 'SAL-2026-0002', 15, 1, 1);

-- ============================================================================
-- TRANSFERENCIAS DE EJEMPLO
-- ============================================================================

-- Transferencia 1: De Bodega Central a Bodega Norte
INSERT INTO stock_movements (type, quantity, reason, date, reference, product_id, source_warehouse_id, target_warehouse_id, user_id) VALUES
    ('TRANSFER', 30, 'Reposición Bodega Norte', '2026-02-10', 'TRF-2026-0001', 1, 1, 2, 1),
    ('TRANSFER', 20, 'Reposición Bodega Norte', '2026-02-10', 'TRF-2026-0001', 3, 1, 2, 1),
    ('TRANSFER', 50, 'Reposición Bodega Norte', '2026-02-10', 'TRF-2026-0001', 10, 1, 2, 1);

-- Transferencia 2: De Bodega Central a Bodega Sur
INSERT INTO stock_movements (type, quantity, reason, date, reference, product_id, source_warehouse_id, target_warehouse_id, user_id) VALUES
    ('TRANSFER', 25, 'Reposición Bodega Sur', '2026-02-15', 'TRF-2026-0002', 5, 1, 3, 1),
    ('TRANSFER', 40, 'Reposición Bodega Sur', '2026-02-15', 'TRF-2026-0002', 7, 1, 3, 1),
    ('TRANSFER', 100, 'Reposición Bodega Sur', '2026-02-15', 'TRF-2026-0002', 11, 1, 3, 1);

-- ============================================================================
-- CIERRE MENSUAL DE EJEMPLO (Enero 2026)
-- ============================================================================

-- Cierre Bodega Central - Enero 2026
INSERT INTO inventory_closures (reference, warehouse_id, period_month, period_year, total_value, total_products, notes, user_id, snapshot) VALUES
    ('CIE-BC-2026-01', 1, 1, 2026, 125450.75, 17, 'Cierre mensual enero 2026', 1, 
    '{"products": [{"id": 1, "sku": "ELEC-001", "name": "Smartphone Samsung Galaxy A54", "stock": 90, "value": 26999.10}, {"id": 2, "sku": "ELEC-002", "name": "iPhone 15 Pro Max", "stock": 25, "value": 29999.75}], "generated_at": "2026-01-31T23:59:59Z"}'::jsonb);

-- ============================================================================
-- VERIFICACIÓN DE DATOS
-- ============================================================================

DO $$
DECLARE
    v_users INTEGER;
    v_roles INTEGER;
    v_products INTEGER;
    v_warehouses INTEGER;
    v_customers INTEGER;
    v_suppliers INTEGER;
    v_movements INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_users FROM users;
    SELECT COUNT(*) INTO v_roles FROM roles;
    SELECT COUNT(*) INTO v_products FROM products;
    SELECT COUNT(*) INTO v_warehouses FROM warehouses;
    SELECT COUNT(*) INTO v_customers FROM customers;
    SELECT COUNT(*) INTO v_suppliers FROM suppliers;
    SELECT COUNT(*) INTO v_movements FROM stock_movements;
    
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Datos semilla insertados exitosamente';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Roles: %', v_roles;
    RAISE NOTICE 'Usuarios: %', v_users;
    RAISE NOTICE 'Productos: %', v_products;
    RAISE NOTICE 'Bodegas: %', v_warehouses;
    RAISE NOTICE 'Clientes: %', v_customers;
    RAISE NOTICE 'Proveedores: %', v_suppliers;
    RAISE NOTICE 'Movimientos de stock: %', v_movements;
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Usuario admin: admin@sistema.local';
    RAISE NOTICE 'Password: Admin123!';
    RAISE NOTICE '================================================';
END $$;
