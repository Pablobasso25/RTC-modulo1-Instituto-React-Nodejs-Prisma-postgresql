# Proyecto Instituto (React + Node.js + Prisma)

> **Aviso:** Este repositorio fue creado para realizar pruebas y aprender sobre el desarrollo Full Stack usando Node.js/Express en el backend, React en el frontend, PostgreSQL y Prisma ORM. No está pensado para entornos de producción.

## Tecnologías utilizadas

- **Frontend:** React, TypeScript, Bootstrap
- **Backend:** Node.js, Express.js
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma

## Cómo ejecutar en local

Este proyecto está dividido en dos partes: el backend (raíz) y el frontend (carpeta `frontend`). Deberás levantar ambos para que la aplicación funcione por completo.

### 1. Configuración del Backend

1. Abre una terminal en la raíz del proyecto.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz del proyecto y configura tu conexión a PostgreSQL:
   ```env
   DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/instituto?schema=public"
   ```
4. Sincroniza el esquema de la base de datos y genera el cliente de Prisma:
   ```bash
   npx prisma db push
   ```
5. Inicia el servidor backend:
   ```bash
   npm run dev
   ```

### 2. Configuración del Frontend

1. Abre una nueva terminal (paralela a la del backend) y entra a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias de React:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo de React:
   ```bash
   npm run dev
   ```
