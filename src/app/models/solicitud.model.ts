export class Solicitud {
    _id!: string;
    nombre!: string;
    public status?: 'PENDING' | 'REVIEW' | 'VERIFIED' | 'FINISHED';
    createdAt!: Date;
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
  
  