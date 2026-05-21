import { Usuario } from "./usuario.model";

export class Message {
   _id!: string;
   de!: Usuario;
   para!: Usuario;
   message!: string;
   createdAt!: Date;
}