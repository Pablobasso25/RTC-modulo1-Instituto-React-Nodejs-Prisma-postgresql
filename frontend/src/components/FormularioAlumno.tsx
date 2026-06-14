import { FormEvent } from "react";

// Definimos las props que necesita el formulario (estados y funciones)
interface Props {
  nombre: string;
  setNombre: (valor: string) => void;
  apellido: string;
  setApellido: (valor: string) => void;
  email: string;
  setEmail: (valor: string) => void;
  edad: string;
  setEdad: (valor: string) => void;
  telefono: string;
  setTelefono: (valor: string) => void;
  editandoId: number | null;
  manejarEnvio: (e: FormEvent) => void;
  cancelarEdicion: () => void;
}

export function FormularioAlumno({
  nombre, setNombre,
  apellido, setApellido,
  edad, setEdad,
  email, setEmail,
  telefono, setTelefono,
  editandoId, manejarEnvio, cancelarEdicion
}: Props) {
  return (
    <div className="card shadow mb-4">
      <div className={`card-header text-white ${editandoId ? 'bg-warning' : 'bg-success'}`}>
        <h5 className="mb-0">{editandoId ? 'Editar Alumno' : 'Agregar Nuevo Alumno'}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={manejarEnvio}>
          <div className="row">
            <div className="col-md-3 mb-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nombre" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                required 
              />
            </div>
            <div className="col-md-3 mb-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Apellido" 
                value={apellido} 
                onChange={(e) => setApellido(e.target.value)} 
                required 
              />
            </div>
            <div className="col-md-3 mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="col-md-3 mb-3">
              <input 
                type="number" 
                className="form-control" 
                placeholder="Edad" 
                value={edad} 
                onChange={(e) => setEdad(e.target.value)} 
                required 
              />
            </div>
            <div className="col-md-3 mb-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Teléfono (Opcional)" 
                value={telefono} 
                onChange={(e) => setTelefono(e.target.value)} 
              />
            </div>
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className={`btn w-100 ${editandoId ? 'btn-warning' : 'btn-success'}`}>
              {editandoId ? 'Actualizar Alumno' : 'Guardar Alumno'}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-secondary w-100" onClick={cancelarEdicion}>
                Cancelar Edición
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}