// Función para crear un profesor

export const crearProfesor = async (prisma, datosProfesor) => {
  const nuevoProfesor = await prisma.profesor.create({
    data: datosProfesor,
  });
  return nuevoProfesor;
};

// Función para obtener profesores

export const obtenerProfesores = async (prisma) => {
  const profesoresConsultados = await prisma.profesor.findMany();
  return profesoresConsultados;
};

//Función para actualizar / modificar un profesor

export const actualizarProfesor = async (prisma, id, datosProfesor) => {
  const profesorActualizado = await prisma.profesor.update({
    where: { id: parseInt(id) },
    data: datosProfesor,
  });
  return profesorActualizado;
};

//Función para eliminar un profesor

export const eliminarProfesorPorId = async (prisma, id) => {
  const profesorEliminado = await prisma.profesor.delete({
    where: { id: parseInt(id) },
  });
  return profesorEliminado;
};