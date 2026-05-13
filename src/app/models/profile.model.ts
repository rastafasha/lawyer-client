import { environment } from "../environments/environment";
import { Favorite } from "./favorite.model";
import { Payment } from "./payment";
import { Speciality } from "./speciality.model";
import { Usuario } from "./usuario.model";

const base_url = environment.mediaUrlRemoto;
export class Profile {


  constructor(

    public first_name: string,
    public last_name: string,
    public n_doc: string,
    public gender: number,
    public pais: string,
    public ciudad: string,
    public lang: string,
    public telhome: string,
    public telmovil: string,
    public direccion: string,
    public shortdescription: string,
    public redssociales: string,
    public plan: string,
    public fechaReinicio: Date,
    public paypalSubscriptionId: string,
    // public subcription: subcriptionPaypal[] = [],
    public createdAt: Date,
    public updatedAt: Date,
    public rating?:number,
    public status?: 'PENDING' | 'REVIEW' | 'VERIFIED',
    public articulosVistos?: number,
    public usuario?: Usuario,
    // public blog?: Post,
    public especialidad?: Speciality,
    public pagos?: Payment,
    public favoritos?: Favorite,
    public img?: string,
    public _id?: string

){}



  get imagenUrl(){

    if(!this.img){
      return `assets/img/no-image.jpg`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${base_url}/profiles/${this.img}`;
    }else {
      return `${base_url}/no-image.jpg`;
      // return `./assets/img/no-image.jpg`;
    }

  }
}

export class RedesSociales{
  constructor(
    public index?: string,
    public name_red?: string,
    public icono?: string,
    public usuario_red?: string,
  ){}
}
export class Precios{
  constructor(
    public index?: string,
    public item_tarifa?: string,
    public precio?: number, 
  ){}
}
