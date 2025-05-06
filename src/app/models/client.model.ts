export class Client {
    id!: number;
    username: string = "";
    email: string = "";
    password?: string = "";
    first_name: string = "";
    last_name: string = "";
    token: string = "";
    is_active: number = 0;
    n_doc: number = 0;
    created_at: string = "";
    image: string = "";
    roles?: any;
  }

  export class ClientsUser {
    id!: number;
    cliente_id!: number;
    user_id!: number;
    
}
