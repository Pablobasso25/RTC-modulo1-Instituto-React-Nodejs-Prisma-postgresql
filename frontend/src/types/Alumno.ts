export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  edad?: number | null;
  email: string;
  telefono: string | null;
}
