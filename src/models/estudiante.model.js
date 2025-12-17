import pool from '../config/database.js';

/**
 * Modelo para manejar operaciones de estudiantes
 */
class EstudianteModel {
  /**
   * Obtener todos los estudiantes
   */
  static async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM estudiantes WHERE activo = TRUE ORDER BY nombre, primer_apellido'
    );
    return rows;
  }

  /**
   * Buscar estudiante por cédula
   */
  static async findByCedula(cedula) {
    const [rows] = await pool.query(
      'SELECT * FROM estudiantes WHERE cedula = ? AND activo = TRUE',
      [cedula]
    );
    return rows[0];
  }

  /**
   * Buscar estudiante por ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM estudiantes WHERE id = ? AND activo = TRUE',
      [id]
    );
    return rows[0];
  }

  /**
   * Buscar estudiantes por filtro (nombre, apellido, cédula)
   */
  static async search(query) {
    const searchTerm = `%${query}%`;
    const [rows] = await pool.query(
      `SELECT * FROM estudiantes 
       WHERE activo = TRUE 
       AND (cedula LIKE ? OR nombre LIKE ? OR primer_apellido LIKE ? OR segundo_apellido LIKE ?)
       ORDER BY nombre, primer_apellido
       LIMIT 20`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );
    return rows;
  }

  /**
   * Crear nuevo estudiante
   */
  static async create(data) {
    const [result] = await pool.query(
      `INSERT INTO estudiantes (cedula, nombre, primer_apellido, segundo_apellido, carrera, academico_a_cargo, sede)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.cedula,
        data.nombre,
        data.primerApellido,
        data.segundoApellido,
        data.carrera,
        data.academicoACargo,
        data.sede
      ]
    );
    return this.findById(result.insertId);
  }

  /**
   * Actualizar estudiante
   */
  static async update(id, data) {
    await pool.query(
      `UPDATE estudiantes 
       SET nombre = ?, primer_apellido = ?, segundo_apellido = ?, carrera = ?, academico_a_cargo = ?, sede = ?
       WHERE id = ?`,
      [
        data.nombre,
        data.primerApellido,
        data.segundoApellido,
        data.carrera,
        data.academicoACargo,
        data.sede,
        id
      ]
    );
    return this.findById(id);
  }

  /**
   * Obtener resumen del estudiante (horas, actividades)
   */
  static async getResumen(estudianteId) {
    const [rows] = await pool.query(
      'SELECT * FROM vista_resumen_estudiantes WHERE id = ?',
      [estudianteId]
    );
    return rows[0];
  }

  /**
   * Actualizar horas acumuladas
   */
  static async updateHoras(estudianteId, horas) {
    await pool.query(
      'UPDATE estudiantes SET horas_acumuladas = horas_acumuladas + ? WHERE id = ?',
      [horas, estudianteId]
    );
    return this.findById(estudianteId);
  }
}

export default EstudianteModel;
