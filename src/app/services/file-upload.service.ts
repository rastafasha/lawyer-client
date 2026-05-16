import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

const base_url = environment.url_servicios;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto( 
  archivo: File, 
  tipo: 'profiles'|'pagos'|'documents', 
  id: string,
  name_category?: string // 1. Agregamos el parámetro opcional para la categoría
){
  try {
    const url = `${base_url}/uploads/${tipo}/${id}`;
    const formData = new FormData();

    formData.append('imagen', archivo);

    // 2. Si se pasa una categoría (caso de 'documents'), la adjuntamos al FormData
    if (name_category) {
      formData.append('name_category', name_category);
    }

    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        'x-token': localStorage.getItem('token') || ''
      },
      body: formData
    });

    const data = await resp.json();

    if (data.ok) {
      // 3. Modificación: Si es un documento, devolvemos todo el objeto guardado de la BD
      // Si es una imagen normal, devolvemos solo la URL string
      return tipo === 'documents' ? data.documento : data.nombreArchivo;
    } else {
      console.error('Error devuelto por el servidor:', data.msg);
      return false;
    }

  } catch (error) {
    console.error('Error de red al subir archivo:', error);
    return false;
  }
}


}
