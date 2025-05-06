export class Profile {
  id!: number;
  user_id!: number;
  speciality_id!: number;
  nombre: string = "";
  username: string = "";
  surname: string = "";
  email: string = "";
  n_doc: number = 0;
  created_at: string = "";
  direccion: string = "";
  description: string = "";
  pais: string = "";
  lang: string = "";
  estado: string = "";
  ciudad: string = "";
  telhome: string = "";
  telmovil: string = "";
  avatar: string = "";
  status: number = 1;
  gender: number = 0 ;
  // status: string = "";
  rating: number = 0;
  speciality_title: string = "";
  redessociales: RedesSociales = new RedesSociales();
  precios: Precios = new Precios();

}

export class RedesSociales {
    id!: number;
    title: string = "";
    icono: string = "";
    url: string = "";
  
  }
export class Precios {
    id!: number;
    item_tarifa: string = "";
    precio: number = 0;
  
  }
