import type { Alumno } from "../types/Alumno";

// Definimos qué datos y funciones necesita recibir esta tabla para funcionar
interface Props {
  alumnos: Alumno[];
  cargarDatosParaEdicion: (alumno: Alumno) => void;
  eliminarAlumno: (id: number) => void;
}

export function TablaAlumnos({ alumnos, cargarDatosParaEdicion, eliminarAlumno }: Props) {
  return (
    <div className="card shadow">
      <div className="card-body">
        <table className="table table-striped table-hover mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Edad</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.id}>
                <td>{alumno.id}</td>
                <td>{alumno.nombre}</td>
                <td>{alumno.apellido}</td>
                <td>{alumno.email}</td>
                <td>{alumno.edad ? alumno.edad : "No registrado"}</td>
                <td>{alumno.telefono ? alumno.telefono : "No registrado"}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => cargarDatosParaEdicion(alumno)}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => eliminarAlumno(alumno.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {alumnos.length === 0 && (
          <div className="alert alert-warning text-center">
            No hay alumnos registrados o el servidor está apagado.
          </div>
        )}
      </div>
    </div>
  );
}