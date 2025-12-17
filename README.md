# API Bitácora TCU - Universidad Técnica Nacional

Backend API para el sistema de registro y seguimiento de actividades de Trabajo Comunal Universitario (TCU).

## 🚀 Tecnologías

- Node.js
- Express.js
- MySQL 8.0+
- Multer (carga de archivos)
- Joi (validación)

## 📋 Requisitos Previos

- Node.js 16+ 
- MySQL 8.0+
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
cd BitacoraBackEnd
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de MySQL:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=bitacora_tcu
DB_PORT=3306
PORT=3000
```

4. **Crear la base de datos**
```bash
mysql -u root -p < database/schema.sql
```

5. **Iniciar el servidor**

Modo desarrollo (con nodemon):
```bash
npm run dev
```

Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
BitacoraBackEnd/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de MySQL
│   ├── controllers/
│   │   ├── estudiante.controller.js
│   │   ├── actividad.controller.js
│   │   └── evidencia.controller.js
│   ├── models/
│   │   ├── estudiante.model.js
│   │   ├── actividad.model.js
│   │   └── evidencia.model.js
│   ├── routes/
│   │   ├── estudiantes.routes.js
│   │   ├── actividades.routes.js
│   │   └── evidencias.routes.js
│   ├── middlewares/
│   │   └── upload.middleware.js  # Carga de archivos
│   └── index.js                  # Punto de entrada
├── database/
│   └── schema.sql                # Script de base de datos
├── uploads/                      # Archivos subidos
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔌 Endpoints de la API

### Estudiantes

- `GET /api/estudiantes` - Listar todos los estudiantes
- `GET /api/estudiantes/search?q=texto` - Buscar estudiantes
- `GET /api/estudiantes/cedula/:cedula` - Obtener por cédula
- `GET /api/estudiantes/:id` - Obtener por ID
- `GET /api/estudiantes/:id/resumen` - Resumen del estudiante
- `POST /api/estudiantes` - Crear estudiante
- `PUT /api/estudiantes/:id` - Actualizar estudiante

### Actividades

- `GET /api/actividades` - Listar actividades (con filtros)
- `GET /api/actividades/:id` - Obtener actividad por ID
- `GET /api/actividades/estudiante/:estudianteId` - Actividades por estudiante
- `GET /api/actividades/estadisticas` - Estadísticas
- `POST /api/actividades` - Crear actividad (con archivo)
- `PUT /api/actividades/:id` - Actualizar actividad
- `PATCH /api/actividades/:id/aprobar` - Aprobar actividad
- `PATCH /api/actividades/:id/rechazar` - Rechazar actividad
- `DELETE /api/actividades/:id` - Eliminar actividad

### Evidencias

- `GET /api/evidencias/actividad/:actividadId` - Obtener evidencias
- `POST /api/evidencias` - Crear evidencia (con archivo)
- `DELETE /api/evidencias/:id` - Eliminar evidencia

## 📝 Ejemplos de Uso

### Crear una actividad con evidencia de texto

```bash
POST /api/actividades
Content-Type: application/json

{
  "estudianteId": 1,
  "fechaActividad": "2025-12-10",
  "tipoActividad": "Planificación",
  "subtipoActividad": "Elaboración del plan de trabajo",
  "descripcionActividad": "Se elaboró el plan de trabajo...",
  "horaInicio": "08:00",
  "horaFinal": "12:00",
  "tipoEvidencia": "Texto",
  "evidenciaTexto": "Documento disponible en...",
  "ubicacionLat": 9.7489,
  "ubicacionLng": -83.7534
}
```

### Crear actividad con archivo

```bash
POST /api/actividades
Content-Type: multipart/form-data

estudianteId=1
fechaActividad=2025-12-10
tipoActividad=Ejecución del proyecto
subtipoActividad=Desarrollo de actividades
descripcionActividad=Actividad realizada...
horaInicio=08:00
horaFinal=12:00
tipoEvidencia=Foto
archivo=[archivo binario]
```

### Buscar estudiante

```bash
GET /api/estudiantes/search?q=123456789
GET /api/estudiantes/search?q=Juan
```

## 🗄️ Base de Datos

### Tablas Principales

- **estudiantes**: Información de estudiantes
- **actividades**: Registro de actividades TCU
- **evidencias**: Evidencias de las actividades
- **usuarios**: Usuarios del sistema (admin/académicos)

### Procedimientos Almacenados

- `sp_registrar_actividad`: Registra actividad con cálculo de horas
- `sp_aprobar_actividad`: Aprueba y actualiza horas acumuladas
- `sp_rechazar_actividad`: Rechaza actividad con observaciones

### Vistas

- `vista_resumen_estudiantes`: Resumen de estudiantes con estadísticas
- `vista_actividades_completas`: Actividades con datos del estudiante

## 🔒 Seguridad

- Validación de tipos de archivo
- Límite de tamaño de archivos (5MB)
- Sanitización de datos de entrada
- Manejo de errores centralizado

## 🧪 Testing

```bash
npm test
```

## 📄 Licencia

ISC

## 👥 Autor

Universidad Técnica Nacional - Sistema TCU
