import type { Curso } from "../types/Curso";

// Definimos qué datos y funciones necesita recibir esta tabla desde App.tsx (El Padre)
interface Props {
  cursos: Curso[];
  cargarDatosParaEdicion: (curso: Curso) => void;
  eliminarCurso: (id: number) => void;
  verAlumnosDelCurso: (curso: Curso) => void;
}

export function TablaCursos({ cursos, cargarDatosParaEdicion, eliminarCurso, verAlumnosDelCurso }: Props) {
  return (
    <div className="card shadow">
      <div className="card-body">
        <table className="table table-striped table-hover mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre del Curso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Iteramos sobre el arreglo de cursos para dibujar cada fila */}
            {cursos.map((curso) => (
              <tr key={curso.id}>
                <td>{curso.id}</td>
                <td>{curso.nombre}</td>
                <td>
                  <button className="btn btn-sm btn-info me-2 text-white" onClick={() => verAlumnosDelCurso(curso)}>
                    👥 Ver Alumnos
                  </button>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => cargarDatosParaEdicion(curso)}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => eliminarCurso(curso.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {cursos.length === 0 && (
          <div className="alert alert-warning text-center">
            No hay cursos registrados en la Base de Datos.
          </div>
        )}
      </div>
    </div>
  );
}