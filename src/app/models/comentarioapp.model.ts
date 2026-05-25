
import { Solicitud } from "./solicitud.model";
import { Usuario } from "./usuario.model";

export class ComentarioApp{
    constructor(
        public _id: string,
        public comentario: string,
        public pros: string,
        public cons: number,
        public estrellas: string,
        public usuario: Usuario,
        public cliente: Usuario,
        public solicitud: Solicitud,
        public createdAt: Date,
        public updatedAt: Date,
    ){
    }
}