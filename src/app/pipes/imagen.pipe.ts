import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../environments/environment';

const base_url = environment.mediaUrlRemoto;
const base_urlpdf = environment.mediaUrlRemotoPdf;

@Pipe({
  name: 'imagenPipe'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: 'users' | 'pagos' | 'posts' | 'profiles' | 'banners' | 'documents'): string {
    
    // 1. Prioridad Máxima: Si no hay archivo o viene vacío
    if (!img || img.trim() === '') {
      if (tipo === 'documents') {
        return 'assets/images/no-doc.jpg'; 
      }
      return 'assets/images/no-image.jpg'; 
    }

    // 2. Si YA ES UNA URL COMPLETA (Caso actual de tu BD con Cloudinary)
    if (img.includes('https://') || img.includes('http://')) {
      
      if (tipo === 'documents') {

        // Truco técnico: Cloudinary Raw requiere terminar con una extensión para renderizar en iframes
        return img.endsWith('.pdf') ? img : `${img}.pdf`;
       
      }

      return img; // Si es una imagen común con https, la retorna directa
    }

    // 3. Si NO ES UNA URL COMPLETA (Caso de desarrollo local con nombres de archivos sueltos)
    if (tipo === 'documents') {
      return `${base_urlpdf}/${tipo}/${img}.pdf`;
    }

    // 4. Archivos locales de imágenes
    return `${base_url}/${tipo}/${img}`;
  }
}
