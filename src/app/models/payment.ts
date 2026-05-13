import { environment } from "../environments/environment";
import { Usuario } from "./usuario.model";


const base_url = environment.mediaUrlRemoto;

export class Payment {
   constructor(

    public usuario: Usuario,
    // public blog: Post[],
    public monto: string,
    public referencia: string,
    public validacion: string,
    public status: string,
    public createdAt: Date,
    public updatedAt: Date,
    public img?: string,
    public _id?: string

){}

   get imagenUrl(){

      if(!this.img){
        return `assets/img/no-image.jpg`;
      } else if(this.img.includes('https')){
        return this.img;
      } else if(this.img){
        return `${base_url}/pagos/${this.img}`;
      }else {
        return `${base_url}/pagos/no-image.jpg`;
      }

    }

}
