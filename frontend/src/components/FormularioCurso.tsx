import { FormEvent } from "react";

// Las props ("walkie-talkies") para comunicarnos con los estados de App.tsx
interface Props {
  nombre: string;
  setNombre: (valor: string) => void;
  editandoId: number | null;
  manejarEnvio: (e: FormEvent) => void;
  cancelarEdicion: () => void;
}

export function FormularioCurso({
  nombre, setNombre, editandoId, manejarEnvio, cancelarEdicion
}: Props) {
  return (
    <div className="card shadow mb-4">
      <div className={`card-header text-white ${editandoId ? 'bg-warning' : 'bg-primary'}`}>
        <h5 className="mb-0">{editandoId ? 'Editar Curso' : 'Agregar Nuevo Curso'}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={manejarEnvio}>
          <div className="row justify-content-center">
            <div className="col-md-6 mb-3">
              <input 
                type="text" 
                className="form-control text-center" 
                placeholder="Ej: Desarrollo Web con React" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="d-flex justify-content-center gap-2">
            <button type="submit" className={`btn ${editandoId ? 'btn-warning' : 'btn-primary'}`}>
              {editandoId ? 'Actualizar Curso' : 'Guardar Curso'}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-secondary" onClick={cancelarEdicion}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}