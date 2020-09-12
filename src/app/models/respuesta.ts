import { Alumno } from "./alumno";
import { Pregunta } from "./pregunta";

export class Respuesta {
    // La respuesta esta en mongo asi que es string, no es obligatorio tenerlo en el front
    id: string;
    texto: string;
    alumno: Alumno;
    pregunta: Pregunta;
}
