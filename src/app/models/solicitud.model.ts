import { Usuario } from "./usuario.model";

export class Solicitud {
  _id!: string;
  cliente!: Usuario;
  usuario!: Usuario;
  public status?: 'PENDING' | 'REVIEW' | 'VERIFIED' | 'FINISHED';
  pedido: Pedido = new Pedido();
  createdAt!: Date;
  updateddAt!: Date;

}

export class Pedido {
  _id!: string;
  item_tarifa: string = "";
  precio: number = 0;
}
export class SolicitudesUsers {
  id!: number;
  cliente_id!: number;
  solicitud_id!: number;
  user_id!: number;

}

