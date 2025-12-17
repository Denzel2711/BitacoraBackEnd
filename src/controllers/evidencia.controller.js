import EvidenciaModel from '../models/evidencia.model.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Controlador para operaciones de evidencias
 */
class EvidenciaController {
  /**
   * Obtener evidencias por actividad
   */
  static async getByActividad(req, res, next) {
    try {
      const { actividadId } = req.params;
      const evidencias = await EvidenciaModel.findByActividad(actividadId);

      res.json({
        success: true,
        data: evidencias,
        total: evidencias.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear nueva evidencia
   */
  static async create(req, res, next) {
    try {
      const { actividadId, tipoEvidencia, contenidoTexto } = req.body;

      if (!actividadId || !tipoEvidencia) {
        return res.status(400).json({
          success: false,
          error: 'actividadId y tipoEvidencia son requeridos'
        });
      }

      let evidencia;

      if (tipoEvidencia === 'Texto') {
        if (!contenidoTexto) {
          return res.status(400).json({
            success: false,
            error: 'El contenido de texto es requerido'
          });
        }
        evidencia = await EvidenciaModel.createTexto(actividadId, contenidoTexto);
      } else if (req.file) {
        evidencia = await EvidenciaModel.createArchivo(actividadId, tipoEvidencia, req.file);
      } else {
        return res.status(400).json({
          success: false,
          error: 'Archivo requerido para evidencias de tipo Foto o Documentos'
        });
      }

      res.status(201).json({
        success: true,
        data: evidencia,
        message: 'Evidencia creada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar evidencia
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const evidencia = await EvidenciaModel.findById(id);

      if (!evidencia) {
        return res.status(404).json({
          success: false,
          error: 'Evidencia no encontrada'
        });
      }

      // Eliminar archivo físico si existe
      if (evidencia.ruta_archivo) {
        try {
          await fs.unlink(evidencia.ruta_archivo);
        } catch (error) {
          console.error('Error al eliminar archivo:', error);
        }
      }

      await EvidenciaModel.delete(id);

      res.json({
        success: true,
        message: 'Evidencia eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default EvidenciaController;
