import pool from '../config/database.js';

/**
 * Modelo para manejar operaciones de evidencias
 */
class EvidenciaModel {
  /**
   * Obtener evidencias por actividad
   */
  static async findByActividad(actividadId) {
    const [rows] = await pool.query(
      'SELECT * FROM evidencias WHERE actividad_id = ?',
      [actividadId]
    );
    return rows;
  }

  /**
   * Buscar evidencia por ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM evidencias WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  /**
   * Crear nueva evidencia
   */
  static async create(data) {
    const [result] = await pool.query(
      `INSERT INTO evidencias (actividad_id, tipo_evidencia, contenido_texto, ruta_archivo, nombre_archivo, tamano_archivo, tipo_mime)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.actividadId,
        data.tipoEvidencia,
        data.contenidoTexto || null,
        data.rutaArchivo || null,
        data.nombreArchivo || null,
        data.tamanoArchivo || null,
        data.tipoMime || null
      ]
    );
    return this.findById(result.insertId);
  }

  /**
   * Crear evidencia de texto
   */
  static async createTexto(actividadId, contenidoTexto) {
    return this.create({
      actividadId,
      tipoEvidencia: 'Texto',
      contenidoTexto
    });
  }

  /**
   * Crear evidencia de archivo (foto o documento)
   */
  static async createArchivo(actividadId, tipoEvidencia, fileInfo) {
    return this.create({
      actividadId,
      tipoEvidencia,
      rutaArchivo: fileInfo.path,
      nombreArchivo: fileInfo.filename,
      tamanoArchivo: fileInfo.size,
      tipoMime: fileInfo.mimetype
    });
  }

  /**
   * Eliminar evidencia
   */
  static async delete(id) {
    await pool.query('DELETE FROM evidencias WHERE id = ?', [id]);
    return true;
  }

  /**
   * Eliminar todas las evidencias de una actividad
   */
  static async deleteByActividad(actividadId) {
    await pool.query('DELETE FROM evidencias WHERE actividad_id = ?', [actividadId]);
    return true;
  }
}

export default EvidenciaModel;
