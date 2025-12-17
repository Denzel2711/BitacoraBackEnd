import express from 'express';
import EvidenciaController from '../controllers/evidencia.controller.js';
import { uploadMiddleware } from '../middlewares/upload.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/evidencias/actividad/:actividadId
 * @desc    Obtener evidencias por actividad
 * @access  Public
 */
router.get('/actividad/:actividadId', EvidenciaController.getByActividad);

/**
 * @route   POST /api/evidencias
 * @desc    Crear nueva evidencia
 * @access  Public
 */
router.post('/', uploadMiddleware, EvidenciaController.create);

/**
 * @route   DELETE /api/evidencias/:id
 * @desc    Eliminar evidencia
 * @access  Private
 */
router.delete('/:id', EvidenciaController.delete);

export default router;
