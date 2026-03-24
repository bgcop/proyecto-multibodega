# 📚 Documentación - Multi-Bodega

Bienvenido a la documentación del Sistema de Gestión de Inventario Multi-Bodega.

## 📖 Índice de Documentos

### Para Desarrolladores

| Documento | Descripción |
|-----------|-------------|
| [SPEC.md](./SPEC.md) | Especificación técnica completa del sistema |
| [PLAN.md](./PLAN.md) | Plan de desarrollo y seguimiento de tareas |
| [quickstart.md](./quickstart.md) | Guía rápida de instalación y configuración |
| [architecture.md](./architecture.md) | Arquitectura del sistema y patrones utilizados |
| [api-guide.md](./api-guide.md) | Documentación completa de la API REST |

### Para Usuarios

| Documento | Descripción |
|-----------|-------------|
| [user-guide.md](./user-guide.md) | Manual de usuario del sistema |

---

## 🚀 Inicio Rápido

### Instalación Completa

```bash
# 1. Clonar y entrar al proyecto
git clone https://github.com/bgcop/proyecto-multibodega.git
cd proyecto-multibodega

# 2. Instalar y configurar backend
cd backend
npm install
cd database && ./init-db.sh --drop-first && cd ..
npm run start:dev

# 3. En otra terminal, instalar y ejecutar frontend
cd frontend
npm install
npm run dev
```

### Acceso

- **URL**: http://localhost:3000
- **Usuario**: admin@sistema.local
- **Password**: Admin123!

---

## 📊 Estado del Proyecto

**Versión**: 0.8.0 (80% completado)

### Fases Completadas ✅
- Fase 1: Fundamentos (NestJS + Next.js + PostgreSQL)
- Fase 2: Gestión de Catálogo
- Fase 3: Movimientos de Inventario
- Fase 4: Control de Inventario

### En Progreso 🔄
- Fase 5: UX y Seguridad (30%)
  - Páginas de edición
  - HttpOnly cookies
  - Logout funcional

### Pendiente ⬜
- Fase 6: Reportes y Mejoras

---

## 🔗 Enlaces Útiles

- **Repositorio**: https://github.com/bgcop/proyecto-multibodega
- **Issues**: https://github.com/bgcop/proyecto-multibodega/issues
- **Local Backend**: http://localhost:3000/api
- **Local Frontend**: http://localhost:3000

---

## 📝 Convenciones

### Commits
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Formato (no afecta código)
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Tareas de mantenimiento

### Ramas
- `main` - Producción
- `develop` - Desarrollo
- `feature/*` - Nuevas funcionalidades
- `fix/*` - Correcciones
- `release/*` - Preparación de releases

---

## ❓ FAQ

**¿Cómo resetear la base de datos?**
```bash
cd backend/database
./init-db.sh --drop-first
```

**¿Cómo crear un nuevo usuario?**
Actualmente solo a través del endpoint seed-admin o insertando directamente en BD.

**¿Cómo ejecutar los tests?**
```bash
# Backend
cd backend && npm run test:e2e

# Frontend
cd frontend && npx playwright test
```

---

*Última actualización: Marzo 2026*
