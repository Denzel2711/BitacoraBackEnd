import express from 'express';
import EstudianteController from '../controllers/estudiante.controller.js';

const router = express.Router();

/**
 * @route   GET /api/estudiantes
 * @desc    Obtener todos los estudiantes
 * @access  Public
 */
router.get('/', EstudianteController.getAll);

/**
 * @route   GET /api/estudiantes/search
 * @desc    Buscar estudiantes por nombre, apellido o cédula
 * @access  Public
 */
router.get('/search', EstudianteController.search);

/**
 * @route   GET /api/estudiantes/cedula/:cedula
 * @desc    Obtener estudiante por cédula
 * @access  Public
 */
router.get('/cedula/:cedula', EstudianteController.getByCedula);

/**
 * @route   GET /api/estudiantes/:id
 * @desc    Obtener estudiante por ID
 * @access  Public
 */
router.get('/:id', EstudianteController.getById);

/**
 * @route   GET /api/estudiantes/:id/resumen
 * @desc    Obtener resumen del estudiante (horas, actividades)
 * @access  Public
 */
router.get('/:id/resumen', EstudianteController.getResumen);

/**
 * @route   POST /api/estudiantes
 * @desc    Crear nuevo estudiante
 * @access  Public
 */
router.post('/', EstudianteController.create);

/**
 * @route   PUT /api/estudiantes/:id
 * @desc    Actualizar estudiante
 * @access  Public
 */
router.put('/:id', EstudianteController.update);

export default router;
