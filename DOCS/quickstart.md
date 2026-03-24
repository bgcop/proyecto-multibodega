# Guía de Inicio Rápido

## Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

## Instalación

### 1. Clonar el repositorio
\`\`\`bash
git clone https://github.com/bgcop/proyecto-multibodega.git
cd proyecto-multibodega
\`\`\`

### 2. Configurar Backend
\`\`\`bash
cd backend
npm install

# Crear base de datos
createdb multibodega

# Configurar variables de entorno (opcional)
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar en desarrollo
npm run start:dev
\`\`\`

### 3. Configurar Frontend
\`\`\`bash
cd ../frontend
npm install

# Iniciar en desarrollo
npm run dev
\`\`\`

### 4. Crear usuario admin
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/seed-admin
\`\`\`

### 5. Acceder al sistema
- Abrir http://localhost:3000
- Usuario: admin@sistema.local
- Contraseña: admin123

## Puertos por Defecto

| Servicio | Puerto |
|----------|--------|
| Backend API | 3000 |
| Frontend | 3000 (o 3001 si backend ocupa 3000) |
| PostgreSQL | 5432 |

## Comandos Útiles

### Backend
\`\`\`bash
npm run start:dev    # Desarrollo con hot reload
npm run test         # Tests unitarios
npm run test:e2e     # Tests E2E
npm run build        # Build producción
\`\`\`

### Frontend
\`\`\`bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Servir build
npx playwright test  # Tests E2E
\`\`\`
