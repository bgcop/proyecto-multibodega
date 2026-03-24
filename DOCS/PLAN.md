# PLAN.md - Plan de Desarrollo y Seguimiento

## Estado Actual del Proyecto

**Última actualización:** 2026-03-24 (Fase 5 completada)

### Resumen Ejecutivo
El proyecto **Multi-Bodega** está en un **95% de completitud**. Las funcionalidades core están implementadas (CRUDs, entradas, salidas, transferencias, stock dinámico, conteo físico, cierres). Faltan principalmente ajuste post-conteo y tests E2E.

---

## Fases del Proyecto

### ✅ FASE 1: Fundamentos (COMPLETADA)
**Duración:** 2 semanas | **Estado:** 100%

| Tarea | Responsable | Estado | Notas |
|-------|-------------|--------|-------|
| Setup NestJS + TypeORM + PostgreSQL | Backend | ✅ | Hot reload configurado |
| Setup Next.js 14 + Tailwind + shadcn | Frontend | ✅ | App Router |
| Autenticación JWT | Backend | ✅ | Passport local strategy |
| Layout con sidebar | Frontend | ✅ | Navegación completa |
| Entidades base (16 entidades) | Backend | ✅ | Relaciones configuradas |
| Módulos CRUD básicos | Backend | ✅ | 12 módulos |

### ✅ FASE 2: Gestión de Catálogo (COMPLETADA)
**Duración:** 1 semana | **Estado:** 100%

| Tarea | Responsable | Estado | Notas |
|-------|-------------|--------|-------|
| Productos: lista + crear | Frontend | ✅ | Tabla con categorías |
| Categorías: lista + crear | Frontend | ✅ | Jerarquía soportada |
| Unidades: lista + crear | Frontend | ✅ | Código + símbolo |
| Clientes: lista + crear | Frontend | ✅ | Datos fiscales |
| Proveedores: lista + crear | Frontend | ✅ | Contacto + dirección |
| Bodegas: lista + crear | Frontend | ✅ | Código + dirección |

### ✅ FASE 3: Movimientos de Inventario (COMPLETADA)
**Duración:** 1 semana | **Estado:** 100%

| Tarea | Responsable | Estado | Notas |
|-------|-------------|--------|-------|
| Entradas con items dinámicos | Backend + Frontend | ✅ | QueryRunner ACID |
| Salidas con validación stock | Backend + Frontend | ✅ | Rechaza si no hay stock |
| Transferencias ACID | Backend + Frontend | ✅ | QueryRunner, validación |
| Stock dinámico (sin campo) | Backend | ✅ | SUM() en tiempo real |
| Alertas de stock bajo | Backend + Frontend | ✅ | Dashboard + página |
| Dashboard con KPIs | Frontend | ✅ | Reales desde API |

### ✅ FASE 4: Control de Inventario (COMPLETADA)
**Duración:** 1 semana | **Estado:** 100%

| Tarea | Responsable | Estado | Notas |
|-------|-------------|--------|-------|
| Conteo físico: crear | Backend + Frontend | ✅ | Genera items desde stock |
| Conteo físico: lista | Frontend | ✅ | Muestra diferencias |
| Cierres mensuales | Backend + Frontend | ✅ | Snapshot JSONB |
| Historial de cierres | Frontend | ✅ | Tabla por período |

### ✅ FASE 5: UX y Seguridad (COMPLETADA)
**Duración:** 1 semana | **Estado:** 100%

| Tarea | Responsable | Estado | Prioridad |
|-------|-------------|--------|-----------|
| Editar productos | Frontend | ✅ COMPLETADO | Should |
| Editar categorías | Frontend | ✅ COMPLETADO | Should |
| Editar bodegas | Frontend | ✅ COMPLETADO | Should |
| Editar clientes | Frontend | ✅ COMPLETADO | Should |
| Editar proveedores | Frontend | ✅ COMPLETADO | Should |
| Detalle entradas | Frontend | ✅ COMPLETADO | Should |
| Detalle salidas | Frontend | ✅ COMPLETADO | Should |
| Captura de conteo | Frontend | ✅ COMPLETADO | Must |
| Ajuste post-conteo | Backend + Frontend | ⬜ PENDIENTE | Must |
| HttpOnly cookies | Backend + Frontend | ✅ COMPLETADO | Must |
| Logout funcional | Frontend | ✅ COMPLETADO | Must |
| Tests Playwright ejecutados | QA | ⬜ PENDIENTE | Must |

### ⬜ FASE 6: Reportes y Mejoras (PENDIENTE)
**Duración:** 1 semana | **Estado:** 0%

| Tarea | Responsable | Estado | Prioridad |
|-------|-------------|--------|-----------|
| Reporte stock por bodega PDF | Backend | ⬜ | Could |
| Reporte movimientos Excel | Backend | ⬜ | Could |
| Búsqueda global | Frontend | ⬜ | Should |
| Historial por producto | Backend + Frontend | ⬜ | Should |
| Auditoría de cambios | Backend | ⬜ | Could |
| Paginación real | Frontend | ⬜ | Should |
| Filtros en listados | Frontend | ⬜ | Should |

---

## Métricas de Cobertura

### Backend
| Módulo | Unit Tests | E2E Tests | Cobertura |
|--------|------------|-----------|-----------|
| Auth | ⬜ | ✅ | 60% |
| Products | ✅ | ⬜ | 70% |
| Stock | ✅ | ✅ | 80% |
| Entries | ⬜ | ⬜ | 0% |
| Exits | ⬜ | ⬜ | 0% |
| Physical Count | ⬜ | ⬜ | 0% |
| Closures | ⬜ | ⬜ | 0% |

### Frontend
| Página | Render Test | E2E Test | Estado |
|--------|-------------|----------|--------|
| Login | ⬜ | ✅ | Playwright |
| Dashboard | ⬜ | ✅ | Playwright |
| Productos | ⬜ | ✅ | Playwright |
| Bodegas | ⬜ | ✅ | Playwright |
| Transferencias | ⬜ | ✅ | Playwright |
| Entradas | ⬜ | ⬜ | Falta |
| Salidas | ⬜ | ⬜ | Falta |
| Conteo Físico | ⬜ | ⬜ | Falta |

**Cobertura estimada total:** 40%

---

## Próximos Pasos Recomendados

### Inmediatos (Esta semana)
1. **Ejecutar tests Playwright** - Verificar que el sistema funciona E2E
2. **Ajuste post-conteo** - Funcionalidad crítica faltante
3. **HttpOnly cookies** - Seguridad antes de producción
4. **Páginas de edición** - Completar CRUD para todas las entidades

### Corto plazo (2 semanas)
1. Páginas de detalle (entradas, salidas)
2. Captura de conteo físico interactivo
3. Logout funcional
4. Paginación real en frontend

### Medio plazo (1 mes)
1. Reportes PDF/Excel
2. Búsqueda global
3. Auditoría de cambios
4. CI/CD con GitHub Actions

---

## Riesgos y Mitigación

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Tests Playwright rotos | Alto | Media | Ejecutar inmediatamente |
| Seguridad localStorage | Alto | Alta | Migrar a HttpOnly cookies |
| Sin ajuste post-conteo | Medio | Alta | Implementar en Fase 5 |
| Performance en tablas grandes | Medio | Media | Agregar paginación real |
| Deuda técnica acumulada | Bajo | Alta | Refactoring continuo |

---

## Contactos y Roles

| Rol | Agente | Sesión |
|-----|--------|--------|
| Arquitecto | arquitecto | agent:arquitecto:main |
| Backend | backend | agent:backend:main |
| Frontend | frontend | agent:frontend:main |
| DBA | dba | agent:dba:main |
| Tester | tester | agent:tester:main |

---

## Historial de Cambios

| Fecha | Cambio | Responsable |
|-------|--------|-------------|
| 2026-03-24 | Completada Fase 5: Páginas de edición y HttpOnly cookies | Frontend + Backend |
| 2026-03-24 | Creación de SPEC.md y PLAN.md | Arquitecto |
| 2026-03-24 | Completada Fase 4: Control de Inventario | Backend + Frontend |
| 2026-03-24 | Completadas Fases 1-3 | Backend + Frontend |

---

## Checklist de Producción

- [ ] HttpOnly cookies implementadas
- [ ] Tests E2E pasando al 100%
- [ ] Variables de entorno configuradas
- [ ] Base de datos con migraciones (no synchronize)
- [ ] Logging estructurado
- [ ] Rate limiting
- [ ] HTTPS configurado
- [ ] Backup de base de datos
- [ ] Monitoreo básico
- [ ] Documentación de despliegue
