import { environment } from "../../environments/environment";

const base_url = environment.mediaUrlRemoto;

export class Banner {
   constructor(
    public url: string,
    public target: string,
    public validacion: string,
    public createdAt: Date,
    public updatedAt: Date,
    public status?: 'PENDING' | 'PUBLISHED' ,
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
