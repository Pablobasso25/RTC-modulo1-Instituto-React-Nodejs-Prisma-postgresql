import type { Profesor } from "../types/Profesor";

/* Aquí la tabla le dice a App.tsx (El Cerebro): "Para poder dibujar, necesito que me des 3 cosas: la lista completa de alumnos (alumnos: Alumno[]), un walkie-talkie para avisarte si quieren editar a alguien (cargarDatosParaEdicion), y otro walkie-talkie para avisarte si quieren borrar a alguien (eliminarAlumno)". */
interface Props {
  profesores: Profesor[];
  cargarDatosParaEdicion: (profesor: Profesor) => void;
  eliminarProfesor: (id: number) => void;
}

export function TablaProfesores({ profesores, cargarDatosParaEdicion, eliminarProfesor }: Props) {
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
            {/* Esta es la forma oficial en que React dibuja listas. La función .map() es como una fábrica. Toma tu arreglo de alumnos, lo recorre uno por uno, y por cada alumno que encuentra, "fabrica" o dibuja una fila HTML (<tr>).
            El atributo key={alumno.id}: Es súper importante. React necesita que cada fila tenga un identificador único (como el DNI del alumno). Si no le pones la key, React se confunde y no sabe qué fila borrar o actualizar cuando cambian los datos. */}
            {profesores.map((profesor) => (
              <tr key={profesor.id}>
                <td>{profesor.id}</td>
                <td>{profesor.nombre}</td>
                <td>{profesor.apellido}</td>
                <td>{profesor.email}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => cargarDatosParaEdicion(profesor)}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => eliminarProfesor(profesor.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        

        {/* Aquí volvemos a usar el truco del && (Y lógico). Le decimos a React: "Revisa cuántos alumnos hay en la lista (alumnos.length). SI la cantidad es cero (=== 0) ENTONCES (&&) dibuja esta alerta amarilla en la pantalla". Si hay al menos un alumno, esta parte se ignora y no se dibuja. */}
        {profesores.length === 0 && (
          <div className="alert alert-warning text-center">
            No hay profesores registrados o el servidor está apagado.
          </div>
        )}
      </div>
    </div>
  );
}

/* 
<button onClick={() => cargarDatosParaEdicion(alumno)}>Editar</button>
<button onClick={() => eliminarAlumno(alumno.id)}>Eliminar</button>

¡Ojo aquí! Fíjate que en el onClick no ponemos directamente el nombre de la función, sino que usamos una función de flecha anónima () => ....

¿Por qué? Porque estas funciones exigen que les pases un dato (el alumno entero o su id). Si escribiéramos directamente onClick={eliminarAlumno(alumno.id)}, JavaScript ejecutaría la función inmediatamente al cargar la página, ¡y borraría a todos tus alumnos sin que nadie presione el botón! Al poner () =>, le decimos: "Espera, no te ejecutes todavía. Hazlo SOLO cuando el usuario haga clic".
*/

/* 
Resumen: La tabla recibe la lista del Cerebro (App.tsx). Usa .map para dibujar una fila HTML por cada alumno. Si el usuario hace clic en los botones de Editar o Eliminar, la tabla no hace el trabajo por sí sola, simplemente usa los "walkie-talkies" (Props) para avisarle al Cerebro qué botón se presionó y en qué alumno específico.
*/