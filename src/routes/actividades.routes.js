import express from 'express';
import ActividadController from '../controllers/actividad.controller.js';
import { uploadMiddleware } from '../middlewares/upload.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/actividades
 * @desc    Obtener todas las actividades con filtros opcionales
 * @query   estudiante_id, cedula, estado, fecha_inicio, fecha_fin, limit
 * @access  Public
 */
router.get('/', ActividadController.getAll);

/**
 * @route   GET /api/actividades/estadisticas
 * @desc    Obtener estadísticas de actividades
 * @query   estudianteId (opcional)
 * @access  Public
 */
router.get('/estadisticas', ActividadController.getEstadisticas);

/**
 * @route   GET /api/actividades/estudiante/:estudianteId
 * @desc    Obtener actividades por estudiante
 * @access  Public
 */
router.get('/estudiante/:estudianteId', ActividadController.getByEstudiante);

/**
 * @route   GET /api/actividades/:id
 * @desc    Obtener actividad por ID con evidencias
 * @access  Public
 */
router.get('/:id', ActividadController.getById);

/**
 * @route   POST /api/actividades
 * @desc    Crear nueva actividad con evidencias
 * @access  Public
 */
router.post('/', uploadMiddleware, ActividadController.create);

/**
 * @route   PUT /api/actividades/:id
 * @desc    Actualizar actividad
 * @access  Public
 */
router.put('/:id', ActividadController.update);

/**
 * @route   PATCH /api/actividades/:id/aprobar
 * @desc    Aprobar actividad
 * @access  Private (Académico/Admin)
 */
router.patch('/:id/aprobar', ActividadController.aprobar);

/**
 * @route   PATCH /api/actividades/:id/rechazar
 * @desc    Rechazar actividad
 * @access  Private (Académico/Admin)
 */
router.patch('/:id/rechazar', ActividadController.rechazar);

/**
 * @route   DELETE /api/actividades/:id
 * @desc    Eliminar actividad
 * @access  Private
 */
router.delete('/:id', ActividadController.delete);

export default router;
