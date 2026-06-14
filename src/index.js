import "dotenv/config"; // 1. Carga las variables de entorno (como la URL de tu base de datos)
import express from "express"; // 2. Importamos Express: el framework para crear nuestro servidor web (el Mesero)
import cors from "cors"; // 3. Importamos CORS: Permite que tu Frontend (React) acceda a este servidor sin que el navegador lo bloquee por seguridad
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import {
  crearAlumno,
  obtenerAlumnos,
  actualizarAlumno,
  eliminarAlumnoPorId,
} from "./services/alumno.service.js";
import {
  crearCurso,
  obtenerCursos,
  actualizarCurso,
  eliminarCursoPorId,
} from "./services/curso.service.js";
import {
  inscribirAlumno,
  obtenerAlumnosPorCurso,
  desinscribirAlumno,
} from "./services/instituto.service.js";
import {
  crearProfesor,
  obtenerProfesores,
  actualizarProfesor,
  eliminarProfesorPorId,
} from "./services/profesor.service.js";
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// --- INICIALIZACIÓN DEL SERVIDOR EXPRESS ---
const app = express(); // 4. Instanciamos la aplicación servidora

// --- MIDDLEWARES (Intermediarios antes de procesar rutas) ---
app.use(cors()); // 5. Habilitamos los permisos para recibir peticiones de otros puertos (React)
app.use(express.json()); // 6. Le enseñamos a Express a entender datos en formato JSON que vengan en las peticiones

// --- RUTAS DE NUESTRA API REST (Las puertas de enlace) ---

// 7. Ruta GET: Se ejecuta cuando React pide la URL 'http://localhost:3000/api/alumnos' para "leer" la lista.
app.get("/api/alumnos", async (req, res) => {
  try {
    // 7.1 El "mesero" llama al "servicio de cocina" pasándole la conexión a la Base de Datos.
    const alumnos = await obtenerAlumnos(prisma);

    // 7.2 Respondemos ('res.json') mandándole al frontend la lista de alumnos en formato JSON.
    res.json(alumnos);
  } catch (error) {
    // 7.3 Si ocurre un error, le mandamos a React un código HTTP 500 (Error del servidor).
    res.status(500).json({ error: "Ocurrió un error al obtener los alumnos" });
  }
});

// 8. Ruta POST: Se ejecuta cuando React manda datos a 'http://localhost:3000/api/alumnos' para "crear" uno nuevo.
app.post("/api/alumnos", async (req, res) => {
  try {
    // 8.1 req.body contiene la información enviada por React (ej. nombre, apellido, email).
    const datosAlumno = req.body;

    // 8.2 Llamamos al servicio para guardar los datos en PostgreSQL.
    const nuevoAlumno = await crearAlumno(prisma, datosAlumno);

    // 8.3 Respondemos con estado HTTP 201 (Creado) y le enviamos al frontend el objeto del alumno recién creado.
    res.status(201).json(nuevoAlumno);
  } catch (error) {
    // 8.4 En vez de un mensaje genérico, le mandamos a React el mensaje exacto del error
    res.status(400).json({ error: error.message });
  }
});

// 9. Ruta PUT: Se ejecuta cuando React manda datos para "actualizar" un alumno existente.
app.put("/api/alumnos/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extraemos el ID de la URL
    const datosAlumno = req.body;
    const alumnoActualizado = await actualizarAlumno(prisma, id, datosAlumno);
    res.json(alumnoActualizado);
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al actualizar el alumno" });
  }
});

// 10. Ruta DELETE: Se ejecuta cuando React pide "eliminar" un alumno.
app.delete("/api/alumnos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarAlumnoPorId(prisma, id);
    res.status(204).send(); // 204 significa "No Content" (se borró con éxito y no hay nada que devolver)
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al eliminar el alumno" });
  }
});

// ==========================================
// --- RUTAS DE NUESTRA API REST (CURSOS) ---
// ==========================================

app.get("/api/cursos", async (req, res) => {
  try {
    const cursos = await obtenerCursos(prisma);
    res.json(cursos);
  } catch (error) {
    console.error("Error en GET /api/cursos:", error);
    res.status(500).json({ error: "Ocurrió un error al obtener los cursos" });
  }
});

app.post("/api/cursos", async (req, res) => {
  try {
    const nuevoCurso = await crearCurso(prisma, req.body);
    res.status(201).json(nuevoCurso);
  } catch (error) {
    console.error("Error en POST /api/cursos:", error);
    res.status(500).json({ error: "Ocurrió un error al crear el curso" });
  }
});

app.put("/api/cursos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cursoActualizado = await actualizarCurso(prisma, id, req.body);
    res.json(cursoActualizado);
  } catch (error) {
    console.error("Error en PUT /api/cursos:", error);
    res.status(500).json({ error: "Ocurrió un error al actualizar el curso" });
  }
});

app.delete("/api/cursos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarCursoPorId(prisma, id);
    res.status(204).send();
  } catch (error) {
    console.error("Error en DELETE /api/cursos:", error);
    res.status(500).json({ error: "Ocurrió un error al eliminar el curso" });
  }
});

// ==========================================
// --- RUTAS DE INSCRIPCIONES (INSTITUTO) ---
// ==========================================

// 15. Ruta GET: Ver todos los alumnos inscritos en un curso específico
app.get("/api/cursos/:id/alumnos", async (req, res) => {
  try {
    const { id } = req.params;
    const alumnosDelCurso = await obtenerAlumnosPorCurso(prisma, id);
    res.json(alumnosDelCurso);
  } catch (error) {
    console.error("Error en GET /api/cursos/:id/alumnos:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener los alumnos del curso" });
  }
});

// 16. Ruta POST: Inscribir un alumno existente a un curso existente
app.post("/api/cursos/:id/alumnos", async (req, res) => {
  try {
    const cursoId = req.params.id; // Extraemos el ID del curso de la URL
    const { alumnoId } = req.body; // El frontend nos enviará el ID del alumno en el body
    const inscripcion = await inscribirAlumno(prisma, alumnoId, cursoId);
    res.status(201).json(inscripcion);
  } catch (error) {
    console.error("Error en POST /api/cursos/:id/alumnos:", error);

    // Si el error es nuestra regla de negocio, mandamos un 400 con nuestro mensaje
    if (
      error.message ===
      "Tienes que ser mayor de edad para inscribirte a este curso"
    ) {
      res.status(400).json({ error: error.message });
    } else {
      // Si es un error de Prisma o cualquier otra cosa, mandamos el 500 genérico
      res
        .status(500)
        .json({ error: "Ocurrió un error interno al inscribir al alumno" });
    }
  }
});

// 17. Ruta DELETE: Desinscribir un alumno de un curso
app.delete("/api/cursos/:id/alumnos/:alumnoId", async (req, res) => {
  try {
    const cursoId = req.params.id; //trae el ID desde react
    const alumnoId = req.params.alumnoId;
    await desinscribirAlumno(prisma, alumnoId, cursoId);
    res.status(204).send(); // 204 significa "No Content" (Éxito sin datos que devolver)
  } catch (error) {
    console.error("Error en DELETE /api/cursos/:id/alumnos/:alumnoId:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al desinscribir al alumno" });
  }
});

// 18. Ruta GET: traer todos los profesores
app.get("/api/profesores", async (req, res) => {
  try {
    const profesores = await obtenerProfesores(prisma);
    res.json(profesores);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los profesores" });
  }
});

// 19. Ruta POST: crear un nuevo profesor
app.post("/api/profesores", async (req, res) => {
  try {
    const datosProfesor = req.body;
    const nuevoProfesor = await crearProfesor(prisma, datosProfesor);
    res.status(201).json(nuevoProfesor);
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al crear el profesor" });
  }
});

// 20. Ruta PUT: actualizar un profesor
app.put("/api/profesores/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const datosProfesor = req.body;
    const profesorActualizado = await actualizarProfesor(
      prisma,
      id,
      datosProfesor,
    );
    res.json(profesorActualizado);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ocurrió un error al actualizar el profesor" });
  }
});

// 21. Ruta DELETE: eliminar un profesor
app.delete("/api/profesores/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarProfesorPorId(prisma, id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al eliminar el profesor" });
  }
});

// --- ARRANQUE DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // 10. Levantamos el servidor. A partir de esta línea, Express se queda "vivo" esperando peticiones de React.
  console.log(
    `🚀 Servidor Backend escuchando peticiones en http://localhost:${PORT}`,
  );
});
