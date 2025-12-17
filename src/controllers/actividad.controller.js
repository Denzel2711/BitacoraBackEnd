import ActividadModel from '../models/actividad.model.js';
import EvidenciaModel from '../models/evidencia.model.js';

/**
 * Controlador para operaciones de actividades
 */
class ActividadController {
  /**
   * Obtener todas las actividades con filtros
   */
  static async getAll(req, res, next) {
    try {
      const filters = {
        estudianteId: req.query.estudiante_id,
        cedula: req.query.cedula,
        estado: req.query.estado,
        fechaInicio: req.query.fecha_inicio,
        fechaFin: req.query.fecha_fin,
        limit: req.query.limit
      };

      const actividades = await ActividadModel.findAll(filters);
      
      res.json({
        success: true,
        data: actividades,
        total: actividades.length,
        filters: filters
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener actividad por ID con sus evidencias
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const actividad = await ActividadModel.findById(id);

      if (!actividad) {
        return res.status(404).json({
          success: false,
          error: 'Actividad no encontrada'
        });
      }

      // Obtener evidencias de la actividad
      const evidencias = await EvidenciaModel.findByActividad(id);

      res.json({
        success: true,
        data: {
          ...actividad,
          evidencias
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear nueva actividad con evidencias
   */
  static async create(req, res, next) {
    try {
      const {
        estudianteId,
        fechaActividad,
        tipoActividad,
        subtipoActividad,
        tipoCapacitacion,
        experienciasAprendizajes,
        descripcionActividad,
        horaInicio,
        horaFinal,
        ubicacionLat,
        ubicacionLng,
        descripcionUbicacion,
        tipoEvidencia,
        evidenciaTexto
      } = req.body;

      // Validaciones básicas
      if (!estudianteId || !fechaActividad || !tipoActividad || !descripcionActividad) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos'
        });
      }

      // Crear actividad
      const actividad = await ActividadModel.create({
        estudianteId,
        fechaActividad,
        tipoActividad,
        subtipoActividad,
        tipoCapacitacion,
        experienciasAprendizajes,
        descripcionActividad,
        horaInicio,
        horaFinal,
        ubicacionLat,
        ubicacionLng,
        descripcionUbicacion
      });

      // Crear evidencia según el tipo
      let evidencia = null;
      if (tipoEvidencia) {
        if (tipoEvidencia === 'Texto' && evidenciaTexto) {
          evidencia = await EvidenciaModel.createTexto(actividad.id, evidenciaTexto);
        } else if (req.file) {
          evidencia = await EvidenciaModel.createArchivo(actividad.id, tipoEvidencia, req.file);
        }
      }

      res.status(201).json({
        success: true,
        data: {
          ...actividad,
          evidencia
        },
        message: 'Actividad registrada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar actividad
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const actividad = await ActividadModel.update(id, req.body);

      if (!actividad) {
        return res.status(404).json({
          success: false,
          error: 'Actividad no encontrada'
        });
      }

      res.json({
        success: true,
        data: actividad,
        message: 'Actividad actualizada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Aprobar actividad
   */
  static async aprobar(req, res, next) {
    try {
      const { id } = req.params;
      const { observaciones } = req.body;

      const actividad = await ActividadModel.aprobar(id, observaciones);

      res.json({
        success: true,
        data: actividad,
        message: 'Actividad aprobada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rechazar actividad
   */
  static async rechazar(req, res, next) {
    try {
      const { id } = req.params;
      const { observaciones } = req.body;

      if (!observaciones) {
        return res.status(400).json({
          success: false,
          error: 'Las observaciones son requeridas para rechazar una actividad'
        });
      }

      const actividad = await ActividadModel.rechazar(id, observaciones);

      res.json({
        success: true,
        data: actividad,
        message: 'Actividad rechazada'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar actividad
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await ActividadModel.delete(id);

      res.json({
        success: true,
        message: 'Actividad eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener actividades por estudiante
   */
  static async getByEstudiante(req, res, next) {
    try {
      const { estudianteId } = req.params;
      const actividades = await ActividadModel.findByEstudiante(estudianteId);

      res.json({
        success: true,
        data: actividades,
        total: actividades.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener estadísticas de actividades
   */
  static async getEstadisticas(req, res, next) {
    try {
      const { estudianteId } = req.query;
      const estadisticas = await ActividadModel.getEstadisticas(estudianteId);

      res.json({
        success: true,
        data: estadisticas
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ActividadController;
