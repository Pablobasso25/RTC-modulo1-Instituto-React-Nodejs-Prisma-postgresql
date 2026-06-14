export const crearCurso = async (prisma, datosCurso) => {
  const nuevoCurso = await prisma.curso.create({
    data: datosCurso,
  });
  return nuevoCurso;
};

export const obtenerCursos = async (prisma) => {
  const cursos = await prisma.curso.findMany();
  return cursos;
};

export const actualizarCurso = async (prisma, id, datos) => {
  const cursoActualizado = await prisma.curso.update({
    where: { id: parseInt(id) },
    data: datos,
  });
  return cursoActualizado;
};

export const eliminarCursoPorId = async (prisma, id) => {
  const cursoEliminado = await prisma.curso.delete({
    where: { id: parseInt(id) },
  });
  return cursoEliminado;
};
