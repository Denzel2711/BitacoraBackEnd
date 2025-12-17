import EstudianteModel from '../models/estudiante.model.js';

/**
 * Controlador para operaciones de estudiantes
 */
class EstudianteController {
  /**
   * Obtener todos los estudiantes
   */
  static async getAll(req, res, next) {
    try {
      const estudiantes = await EstudianteModel.findAll();
      res.json({
        success: true,
        data: estudiantes,
        total: estudiantes.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Buscar estudiantes
   */
  static async search(req, res, next) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'El parámetro de búsqueda "q" es requerido'
        });
      }

      const estudiantes = await EstudianteModel.search(q);
      res.json({
        success: true,
        data: estudiantes,
        total: estudiantes.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener estudiante por cédula
   */
  static async getByCedula(req, res, next) {
    try {
      const { cedula } = req.params;
      const estudiante = await EstudianteModel.findByCedula(cedula);

      if (!estudiante) {
        return res.status(404).json({
          success: false,
          error: 'Estudiante no encontrado'
        });
      }

      res.json({
        success: true,
        data: estudiante
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener estudiante por ID
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const estudiante = await EstudianteModel.findById(id);

      if (!estudiante) {
        return res.status(404).json({
          success: false,
          error: 'Estudiante no encontrado'
        });
      }

      res.json({
        success: true,
        data: estudiante
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear nuevo estudiante
   */
  static async create(req, res, next) {
    try {
      const estudiante = await EstudianteModel.create(req.body);
      res.status(201).json({
        success: true,
        data: estudiante,
        message: 'Estudiante creado exitosamente'
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          error: 'Ya existe un estudiante con esa cédula'
        });
      }
      next(error);
    }
  }

  /**
   * Actualizar estudiante
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const estudiante = await EstudianteModel.update(id, req.body);

      if (!estudiante) {
        return res.status(404).json({
          success: false,
          error: 'Estudiante no encontrado'
        });
      }

      res.json({
        success: true,
        data: estudiante,
        message: 'Estudiante actualizado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener resumen del estudiante
   */
  static async getResumen(req, res, next) {
    try {
      const { id } = req.params;
      const resumen = await EstudianteModel.getResumen(id);

      if (!resumen) {
        return res.status(404).json({
          success: false,
          error: 'Estudiante no encontrado'
        });
      }

      res.json({
        success: true,
        data: resumen
      });
    } catch (error) {
      next(error);
    }
  }
}

export default EstudianteController;
