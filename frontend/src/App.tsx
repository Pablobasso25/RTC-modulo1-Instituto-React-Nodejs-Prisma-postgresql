import { useEffect, useState, FormEvent } from "react";
import axios from "axios"; // <-- Importamos Axios
import type { Alumno } from "./types/Alumno";
import { FormularioAlumno } from "./components/FormularioAlumno";
import { TablaAlumnos } from "./components/TablaAlumnos";
import type { Curso } from "./types/Curso";
import { FormularioCurso } from "./components/FormularioCurso";
import { TablaCursos } from "./components/TablaCursos";
import type { Profesor } from "./types/Profesor";
import { FormularioProfesor } from "./components/FormularioProfesor";
import { TablaProfesores } from "./components/TablaProfesores";

function App() {
  // --- ESTADO PARA LA NAVEGACIÓN (TABS) ---
  const [pestañaActiva, setPestañaActiva] = useState<
    "alumnos" | "cursos" | "profesores"
  >("alumnos");

  // ==========================================
  // 2. Estado para guardar la lista de alumnos
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);

  // --- ESTADOS PARA EL FORMULARIO ---
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [edad, setEdad] = useState("");

  // Estado para saber si estamos editando (guardará el ID del alumno a editar)
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // 3. Función que se comunica con tu Backend (Express en el puerto 3000)
  //react manda una peticion (req) al backend, el backend responde con una respuesta (res) y esa respuesta la guardamos en el estado de React para mostrarla en pantalla
  const cargarAlumnos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/alumnos");
      const datosConsultados = await respuesta.json(); // esta es la respuesta que el backend nos envía (res.json() en Express) y la guardamos en una variable

      // Guardamos los datos recibidos en el estado de React
      setAlumnos(datosConsultados);
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    }
  };

  // --- FUNCIÓN PARA CREAR UN ALUMNO (POST) ---
  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al hacer clic en "Guardar"

    // Preparamos los datos que vamos a enviar (el pedido para Express)
    const datosNuevoAlumno = {
      nombre,
      apellido,
      edad: edad ? parseInt(edad) : null,
      email,
      // Si el teléfono está vacío, lo enviamos como null (tal como lo acepta Prisma)
      telefono: telefono ? telefono : null,
    };

    try {
      // Dependiendo de si 'editandoId' tiene un valor o no, decidimos si es POST (crear) o PUT (actualizar)
      const url = editandoId
        ? `http://localhost:3000/api/alumnos/${editandoId}`
        : "http://localhost:3000/api/alumnos";

      const method = editandoId ? "PUT" : "POST";

      const respuesta = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosNuevoAlumno),
      });

      if (respuesta.ok) {
        // Refrescamos toda la lista de alumnos desde el backend
        cargarAlumnos();

        cancelarEdicion(); // Limpiamos el formulario y el estado
      } else {
        const dataError = await respuesta.json(); // Leemos el JSON del error que mandó Express
        alert(`Alerta del Servidor: ${dataError.error}`); // Mostramos el mensaje exacto
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  // --- FUNCIÓN PARA ELIMINAR UN ALUMNO (DELETE) ---
  const eliminarAlumno = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este alumno?")) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/alumnos/${id}`, {
        method: "DELETE",
      });

      if (respuesta.ok) {
        // Filtramos el estado local para quitar el alumno borrado sin tener que recargar de la BD
        setAlumnos(alumnos.filter((alumno) => alumno.id !== id));
      } else {
        alert("Error al eliminar el alumno");
      }
    } catch (error) {
      console.error("Error en la petición DELETE:", error);
    }
  };

  // --- FUNCIONES PARA MANEJAR LA EDICIÓN ---
  const cargarDatosParaEdicion = (alumno: Alumno) => {
    setEditandoId(alumno.id);
    setNombre(alumno.nombre);
    setApellido(alumno.apellido);
    setEmail(alumno.email);
    setTelefono(alumno.telefono || "");
    setEdad(alumno.edad?.toString() || "");
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombre("");
    setApellido("");
    setEdad("");
    setEmail("");
    setTelefono("");
  };

  // ==========================================
  // --- ESTADOS PARA LOS CURSOS ---
  // ==========================================
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [nombreCurso, setNombreCurso] = useState("");
  const [editandoIdCurso, setEditandoIdCurso] = useState<number | null>(null);

  const cargarCursos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/cursos");
      const datosConsultados = await respuesta.json();
      setCursos(datosConsultados);
    } catch (error) {
      console.error("Error al conectar con el backend (Cursos):", error);
    }
  };

  const manejarEnvioCurso = async (e: FormEvent) => {
    e.preventDefault();
    const datosNuevoCurso = { nombre: nombreCurso };

    try {
      const url = editandoIdCurso
        ? `http://localhost:3000/api/cursos/${editandoIdCurso}`
        : "http://localhost:3000/api/cursos";
      const method = editandoIdCurso ? "PUT" : "POST";

      const respuesta = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosNuevoCurso),
      });

      if (respuesta.ok) {
        cargarCursos(); // Refrescamos
        cancelarEdicionCurso(); // Limpiamos formulario
      } else {
        alert("Error al guardar el curso.");
      }
    } catch (error) {
      console.error("Error en la petición de Cursos:", error);
    }
  };

  const eliminarCurso = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este curso?")) return;
    try {
      const respuesta = await fetch(`http://localhost:3000/api/cursos/${id}`, {
        method: "DELETE",
      });
      if (respuesta.ok) {
        setCursos(cursos.filter((curso) => curso.id !== id));
      } else {
        alert("Error al eliminar el curso");
      }
    } catch (error) {
      console.error("Error en la petición DELETE de Cursos:", error);
    }
  };

  const cargarDatosParaEdicionCurso = (curso: Curso) => {
    setEditandoIdCurso(curso.id);
    setNombreCurso(curso.nombre);
  };

  const cancelarEdicionCurso = () => {
    setEditandoIdCurso(null);
    setNombreCurso("");
  };

  // ==========================================
  // --- ESTADOS PARA LOS PROFESORES ---
  // ==========================================
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [nombreProfesor, setNombreProfesor] = useState("");
  const [apellidoProfesor, setApellidoProfesor] = useState("");
  const [emailProfesor, setEmailProfesor] = useState("");
  const [editandoIdProfesor, setEditandoIdProfesor] = useState<number | null>(
    null,
  );

  const cargarProfesores = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/profesores");
      setProfesores(res.data);
    } catch (error) {
      console.error("Error al cargar profesores:", error);
    }
  };

  const manejarEnvioProfesor = async (e: FormEvent) => {
    e.preventDefault();
    const datosNuevoProfesor = {
      nombre: nombreProfesor,
      apellido: apellidoProfesor,
      email: emailProfesor,
    };

    try {
      if (editandoIdProfesor) {
        await axios.put(
          `http://localhost:3000/api/profesores/${editandoIdProfesor}`,
          datosNuevoProfesor,
        );
      } else {
        await axios.post(
          "http://localhost:3000/api/profesores",
          datosNuevoProfesor,
        );
      }
      cargarProfesores();
      cancelarEdicionProfesor();
    } catch (error: any) {
      console.error("Error al guardar profesor:", error);
      if (error.response?.data?.error) {
        alert(`Alerta del Servidor: ${error.response.data.error}`);
      } else {
        alert("Error al guardar el profesor.");
      }
    }
  };

  const eliminarProfesor = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este profesor?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/profesores/${id}`);
      setProfesores(profesores.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error en la petición DELETE de Profesores:", error);
    }
  };

  const cargarDatosParaEdicionProfesor = (profesor: Profesor) => {
    setEditandoIdProfesor(profesor.id);
    setNombreProfesor(profesor.nombre);
    setApellidoProfesor(profesor.apellido);
    setEmailProfesor(profesor.email);
  };

  const cancelarEdicionProfesor = () => {
    setEditandoIdProfesor(null);
    setNombreProfesor("");
    setApellidoProfesor("");
    setEmailProfesor("");
  };

  // ==========================================
  // --- ESTADOS PARA GESTIONAR INSCRIPCIONES ---
  // ==========================================
  const [cursoViendoAlumnos, setCursoViendoAlumnos] = useState<Curso | null>(
    null,
  );
  const [alumnosDelCurso, setAlumnosDelCurso] = useState<Alumno[]>([]);
  const [alumnoAInscribir, setAlumnoAInscribir] = useState<string>("");

  const verAlumnosDelCurso = async (curso: Curso) => {
    try {
      // Petición GET usando Axios (nota que ya no necesitamos usar await res.json())
      const res = await axios.get(
        `http://localhost:3000/api/cursos/${curso.id}/alumnos`,
      );

      setAlumnosDelCurso(res.data); // Axios guarda los datos automáticamente en "res.data"
      setCursoViendoAlumnos(curso); // Cambiamos la vista
    } catch (error) {
      console.error("Error al obtener alumnos del curso:", error);
    }
  };

  const manejarInscripcion = async (e: FormEvent) => {
    e.preventDefault();
    if (!cursoViendoAlumnos || !alumnoAInscribir) return;

    try {
      // Petición POST usando Axios (pasamos el body directamente como un objeto JavaScript)
      await axios.post(
        `http://localhost:3000/api/cursos/${cursoViendoAlumnos.id}/alumnos`,
        {
          alumnoId: alumnoAInscribir,
        },
      );

      verAlumnosDelCurso(cursoViendoAlumnos); // Volvemos a consultar para actualizar la lista
      setAlumnoAInscribir(""); // Limpiamos el selector
    } catch (error: any) {
      console.error("Error en inscripción:", error);
      // Extraemos el error que nos manda Express a través de Axios
      if (error.response?.data?.error) {
        alert(`Alerta del Servidor: ${error.response.data.error}`);
      } else {
        alert("Error al inscribir alumno (quizás ya está inscripto).");
      }
    }
  };

  const desinscribirDelCurso = async (alumnoId: number) => {
    if (!cursoViendoAlumnos) return;
    if (!window.confirm("¿Estás seguro de quitar a este alumno del curso?"))
      return;
    try {
      await axios.delete(
        `http://localhost:3000/api/cursos/${cursoViendoAlumnos.id}/alumnos/${alumnoId}`,
      );
      verAlumnosDelCurso(cursoViendoAlumnos); // Refrescamos la lista
    } catch (error) {
      console.error("Error al desinscribir:", error);
      alert("Error al quitar al alumno.");
    }
  };

  // ==========================================
  // 4. useEffect: Carga ambos recursos al iniciar la aplicación
  // ==========================================
  useEffect(() => {
    cargarAlumnos();
    cargarCursos();
    cargarProfesores();
  }, []);

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-center text-primary">Gestión del Instituto</h1>
          <p className="text-center text-muted">
            Panel de Administración con PostgreSQL
          </p>
        </div>
      </div>

      {/* --- PESTAÑAS (TABS) DE NAVEGACIÓN --- */}
      <ul className="nav nav-pills nav-fill mb-4 justify-content-center border-bottom pb-3">
        <li className="nav-item mx-2">
          <button
            className={`nav-link ${pestañaActiva === "alumnos" ? "active" : "bg-light text-dark"}`}
            onClick={() => setPestañaActiva("alumnos")}
          >
            👨‍🎓 Gestión de Alumnos
          </button>
        </li>
        <li className="nav-item mx-2">
          <button
            className={`nav-link ${pestañaActiva === "cursos" ? "active" : "bg-light text-dark"}`}
            onClick={() => setPestañaActiva("cursos")}
          >
            📚 Gestión de Cursos
          </button>
        </li>
        <li className="nav-item mx-2">
          <button
            className={`nav-link ${pestañaActiva === "profesores" ? "active" : "bg-light text-dark"}`}
            onClick={() => setPestañaActiva("profesores")}
          >
            👨‍🏫 Gestión de Profesores
          </button>
        </li>
      </ul>

      {/* --- RENDERIZADO CONDICIONAL: Solo mostramos los componentes de la pestaña activa --- */}

      {pestañaActiva === "alumnos" && (
        <div className="fade-in">
          {" "}
          {/* Contenedor opcional para animaciones */}
          <FormularioAlumno
            nombre={nombre}
            setNombre={setNombre}
            apellido={apellido}
            setApellido={setApellido}
            email={email}
            setEmail={setEmail}
            edad={edad}
            setEdad={setEdad}
            telefono={telefono}
            setTelefono={setTelefono}
            editandoId={editandoId}
            manejarEnvio={manejarEnvio}
            cancelarEdicion={cancelarEdicion}
          />
          <TablaAlumnos
            alumnos={alumnos}
            cargarDatosParaEdicion={cargarDatosParaEdicion}
            eliminarAlumno={eliminarAlumno}
          />
        </div>
      )}

      {/* Vista principal de Cursos (Solo se muestra si NO estamos viendo los alumnos de uno específico) */}
      {pestañaActiva === "cursos" && !cursoViendoAlumnos && (
        <div className="fade-in">
          <FormularioCurso
            nombre={nombreCurso}
            setNombre={setNombreCurso}
            editandoId={editandoIdCurso}
            manejarEnvio={manejarEnvioCurso}
            cancelarEdicion={cancelarEdicionCurso}
          />
          <TablaCursos
            cursos={cursos}
            cargarDatosParaEdicion={cargarDatosParaEdicionCurso}
            eliminarCurso={eliminarCurso}
            verAlumnosDelCurso={verAlumnosDelCurso}
          />
        </div>
      )}

      {/* Vista principal de Profesores */}
      {pestañaActiva === "profesores" && (
        <div className="fade-in">
          <FormularioProfesor
            nombre={nombreProfesor}
            setNombre={setNombreProfesor}
            apellido={apellidoProfesor}
            setApellido={setApellidoProfesor}
            email={emailProfesor}
            setEmail={setEmailProfesor}
            editandoId={editandoIdProfesor}
            manejarEnvio={manejarEnvioProfesor}
            cancelarEdicion={cancelarEdicionProfesor}
          />
          <TablaProfesores
            profesores={profesores}
            cargarDatosParaEdicion={cargarDatosParaEdicionProfesor}
            eliminarProfesor={eliminarProfesor}
          />
        </div>
      )}

      {/* Panel de Inscripciones de un Curso Específico */}
      {pestañaActiva === "cursos" && cursoViendoAlumnos && (
        <div className="fade-in card shadow border-info">
          <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Alumnos en: {cursoViendoAlumnos.nombre}</h5>
            <button
              className="btn btn-sm btn-light"
              onClick={() => setCursoViendoAlumnos(null)}
            >
              Volver a Cursos
            </button>
          </div>
          <div className="card-body">
            {/* Formulario para inscribir usando un menú desplegable */}
            <form onSubmit={manejarInscripcion} className="mb-4 d-flex gap-2">
              <select
                className="form-select"
                value={alumnoAInscribir}
                onChange={(e) => setAlumnoAInscribir(e.target.value)}
                required
              >
                <option value="">
                  -- Selecciona un alumno para inscribir --
                </option>
                {alumnos.map((alumno) => (
                  <option key={alumno.id} value={alumno.id}>
                    {alumno.nombre} {alumno.apellido} ({alumno.email})
                  </option>
                ))}
              </select>
              <button type="submit" className="btn btn-success text-nowrap">
                ➕ Inscribir
              </button>
            </form>

            {/* Lista de inscriptos */}
            <h6>Lista de Inscriptos:</h6>
            {alumnosDelCurso.length === 0 ? (
              <p className="text-muted">
                No hay alumnos inscritos en este curso aún.
              </p>
            ) : (
              <ul className="list-group">
                {alumnosDelCurso.map((alumno) => (
                  <li
                    key={alumno.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <span>
                        👨‍🎓 {alumno.nombre} {alumno.apellido}
                      </span>
                      <span className="text-muted small ms-2 d-none d-md-inline">
                        ({alumno.email})
                      </span>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => desinscribirDelCurso(alumno.id)}
                    >
                      ❌ Quitar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
