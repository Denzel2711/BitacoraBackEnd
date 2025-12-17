import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

// Importar rutas
import estudiantesRoutes from './routes/estudiantes.routes.js';
import actividadesRoutes from './routes/actividades.routes.js';
import evidenciasRoutes from './routes/evidencias.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'API Bitácora TCU - Universidad Técnica Nacional',
    version: '1.0.0',
    endpoints: {
      estudiantes: '/api/estudiantes',
      actividades: '/api/actividades',
      evidencias: '/api/evidencias'
    }
  });
});

app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/evidencias', evidenciasRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📝 Documentación disponible en http://localhost:${PORT}`);
      console.log(`⏰ Iniciado: ${new Date().toLocaleString('es-CR')}\n`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;
