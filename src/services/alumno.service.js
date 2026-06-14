// FUNCIONES PARA CREAR (CREATE)

export const crearAlumno = async (prisma, datosAlumno) => {
  // --- REGLA DE NEGOCIO ---
  // Validamos que el nombre y el apellido no sean exactamente iguales
  if (
    datosAlumno.nombre.trim().toLowerCase() ===
    datosAlumno.apellido.trim().toLowerCase()
  ) {
    throw new Error(
      "Regla de Negocio: El nombre y el apellido del alumno no pueden ser idénticos.",
    );
  }

  // 1. Recibimos 'datosAlumno' (los datos que el usuario escribió en el formulario de React)
  const nuevoAlumno = await prisma.alumno.create({
    data: datosAlumno, // 2. Le pasamos esos datos dinámicos a Prisma para que los guarde
  });

  // 3. RETORNAMOS el alumno recién creado para que el backend se lo envíe de vuelta a React
  return nuevoAlumno;
};

// FUNCIONES PARA OBTENER/LEER (READ)
export const obtenerAlumnos = async (prisma) => {
  const alumnosConsultados = await prisma.alumno.findMany(); // findMany() trae todos los alumnos

  return alumnosConsultados;
};

// FUNCIONES PARA ACUALIZAR/MODIFICAR (UPDATE)
export const actualizarAlumno = async (prisma, id, datos) => {
  const alumnoActualizado = await prisma.alumno.update({
    where: { id: parseInt(id) },
    data: datos,
  });
  return alumnoActualizado;
};

// FUNCIONES PARA ELIMINAR (DELETE)
export const eliminarAlumnoPorId = async (prisma, id) => {
  const alumnoEliminado = await prisma.alumno.delete({
    where: { id: parseInt(id) },
  });
  return alumnoEliminado;
};
