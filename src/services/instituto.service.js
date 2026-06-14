// FUNCION PARA INSCRIBIR (ASIGNAR) UN ALUMNO A UN CURSO
export const inscribirAlumno = async (prisma, alumnoId, cursoId) => {
  const curso = await prisma.curso.findUnique({
    where: { id: parseInt(cursoId) },
  });
  const alumno = await prisma.alumno.findUnique({
    where: { id: parseInt(alumnoId) },
  });

  if (
    curso.nombre.trim().toLowerCase().includes("cocteleria avanzada") &&
    alumno.edad < 18
  ) {
    throw new Error(
      "Tienes que ser mayor de edad para inscribirte a este curso",
    );
  }

  const cursoActualizado = await prisma.curso.update({
    where: { id: parseInt(cursoId) },
    data: {
      alumnos: {
        connect: { id: parseInt(alumnoId) }, // Esta es la "magia" de Prisma para unir las tablas
      },
    },
  });
  return cursoActualizado;
};

// FUNCION PARA VER QUÉ ALUMNOS ESTÁN EN UN CURSO
export const obtenerAlumnosPorCurso = async (prisma, cursoId) => {
  const cursoConAlumnos = await prisma.curso.findUnique({
    where: { id: parseInt(cursoId) },
    include: {
      alumnos: true, // Le decimos a Prisma que resuelva la tabla intermedia y nos traiga los datos
    },
  });

  // Retornamos solo el arreglo de alumnos. Si el curso no existe, retornamos un arreglo vacío.
  return cursoConAlumnos ? cursoConAlumnos.alumnos : [];
};

// FUNCION PARA DESINSCRIBIR (QUITAR) UN ALUMNO DE UN CURSO
export const desinscribirAlumno = async (prisma, alumnoId, cursoId) => {
  const cursoActualizado = await prisma.curso.update({
    where: { id: parseInt(cursoId) },
    data: {
      alumnos: {
        disconnect: { id: parseInt(alumnoId) }, // "disconnect" rompe la relación en la tabla intermedia
      },
    },
  });
  return cursoActualizado;
};
