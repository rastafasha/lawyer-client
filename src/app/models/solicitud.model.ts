export class Solicitud {
    id!: number;
    user_id!: number;
    status!: number;
    created_at!: Date;
    pedido: Pedido = new Pedido();
  
  }
  
  export class Pedido {
    id!: number;
    item_tarifa: string = "";
    precio: number = 0;
    
    }
  export class SolicitudesUsers {
    id!: number;
    cliente_id!: number;
    solicitud_id!: number;
    user_id!: number;
    
    }
  
  