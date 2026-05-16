import { environment } from "../environments/environment";
import { Usuario } from "./usuario.model";
const base_url = environment.mediaUrlRemotoPdf;
export class Document {
    _id?: string;
      name_file!: string;
      name_category!: string;
      size!: string;
      resolution!: string;
      file!: string;
      type!: string;
      usuario!: Usuario;
      sharedWith!: Usuario;
      isPublic!: boolean;
      createdAt!: Date;
      updatedAt!: Date;
  
    get imagenUrl(){

    if(!this.file){
      return `assets/images/no-image.jpg`;
    } else if(this.file.includes('https')){
      return this.file;
    } else if(this.file){
      return `${base_url}/profiles/${this.file}`;
    }else {
      return `${base_url}/no-image.jpg`;
      // return `./assets/img/no-image.jpg`;
    }

  }
  
  }
  
  