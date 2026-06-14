import { FormEvent } from "react";

/* Esta es tu lista de exigencias. Es como si el formulario dijera: "Para que yo pueda dibujar los inputs en pantalla y funcionen, necesito que me manden esta lista exacta de cosas:" */
interface Props {
 /* Son los datos reales. El formulario no guarda la memoria de lo que el usuario escribe, el que recuerda todo es App.tsx (con sus useState). El formulario recibe estos textos y los usa para rellenar las cajitas vacías en la pantalla */
  nombre: string;
  apellido: string;
  email: string;

  /* Estas son las funciones que cambian la memoria de App.tsx.
(valor: string) significa que esta función exige que le pases un texto (la nueva tecla que presionó el usuario).
=> void ("devuelve vacío") significa que la función hace su trabajo de actualizar y no te devuelve ningún resultado de vuelta.
¿Para qué sirven? Cuando el usuario escribe una letra en el input del nombre, el formulario usa este walkie-talkie (setNombre) para avisarle al Cerebro: "¡Oye, el usuario acaba de escribir esto, actualiza tu memoria!". */
  setNombre: (valor: string) => void;
  setApellido: (valor: string) => void;
  setEmail: (valor: string) => void;

  /* Esto es crucial. Significa que esta variable puede tener dos opciones:
Un número (ej. 5): Significa que estamos editando al alumno con el ID 5. (El formulario se pondrá amarillo y dirá "Actualizar").
O null (nada/vacío): Significa que estamos creando un alumno completamente nuevo. (El formulario se pondrá verde y dirá "Guardar"). */
  editandoId: number | null;

  /* Estas son las funciones que se ejecutan al presionar los botones.
Fíjate que cancelarEdicion tiene paréntesis vacíos (). Eso significa que cuando haces clic en "Cancelar", no necesita enviar ninguna información extra, simplemente hace la acción de limpiar el formulario. */
  cancelarEdicion: () => void;
  manejarEnvio: (e: FormEvent) => void;
}

export function FormularioProfesor({
    /* Aquí estás definiendo tu componente. En vez de recibir la caja entera de Props, usas unas llaves {} para "desempacar" o "desestructurar" la caja inmediatamente. Esto te permite usar palabras cortas como nombre en tu código en lugar de tener que escribir props.nombre todo el tiempo. */
  nombre, setNombre,
  apellido, setApellido,
  email, setEmail,
  editandoId, manejarEnvio, cancelarEdicion
}: Props) {
  return (
    <div className="card shadow mb-4">
      <div className={`card-header text-white ${editandoId ? 'bg-warning' : 'bg-success'}`}>
        <h5 className="mb-0">{editandoId ? 'Editar Profesor' : 'Agregar Nuevo Profesor'}</h5>
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

/*
<div className={`card-header text-white ${editandoId ? 'bg-warning' : 'bg-success'}`}>
  <h5 className="mb-0">{editandoId ? 'Editar Alumno' : 'Agregar Nuevo Alumno'}</h5>
</div>

el símbolo de interrogación ? y los dos puntos :. Eso se llama "Operador Ternario" y es un mini if/else incrustado en el HTML. Le está diciendo a React:

"¿editandoId tiene un número? Si es así, pinta la tarjeta de amarillo (bg-warning) y pon el título 'Editar Alumno'."
"¿editandoId está vacío (null)? Entonces pinta la tarjeta de verde (bg-success) y pon el título 'Agregar Nuevo Alumno'." */


/* 
<input 
  type="text" 
  className="form-control" 
  placeholder="Nombre" 
  value={nombre} 
  onChange={(e) => setNombre(e.target.value)} 
  required 
/>

Este es el concepto más importante de los formularios en React ("Componentes Controlados").

value={nombre}: El input siempre muestra lo que hay en la memoria del Cerebro (App.tsx).
onChange={(e) => setNombre(e.target.value)}: Cada vez que el usuario teclea una letra, se dispara este evento.
La e significa "evento".
e.target.value significa "el valor exacto que el usuario acaba de escribir en esta cajita".
Por lo tanto, al teclear, usas tu walkie-talkie (setNombre) para decirle a App.tsx: "¡Actualiza la memoria con esta nueva letra!".
*/

/* 
{editandoId && (
  <button type="button" className="btn btn-secondary w-100" onClick={cancelarEdicion}>
    Cancelar Edición
  </button>
)}

Aquí usamos otro truco de React: el && (Y lógico). Sirve para ocultar o mostrar cosas de la pantalla. Se lee así: "SI estamos editando un alumno (editandoId es verdadero) ENTONCES (&&) dibuja en la pantalla este botón gris de 'Cancelar Edición'. Si estamos creando uno nuevo, no dibujes absolutamente nada".
*/

/* 
En resumen: Este archivo es un componente "tonto" pero muy obediente. Solo sabe hacer dos cosas: dibujar en la pantalla la información que recibe de App.tsx (value), y avisarle a App.tsx a través de funciones (onChange, onClick, onSubmit) cuando el usuario interactúa con la página.
*/