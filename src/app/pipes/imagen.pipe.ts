import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.mediaUrlRemoto;

@Pipe({
  name: 'imagenPipe'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: 'users' | 'pagos' | 'posts' | 'profiles' | 'banners' | 'documents'): string {

    // 1. Prioridad Máxima: Si no hay archivo o viene vacío
    if (!img || img.trim() === '') {
      if (tipo === 'documents') {
        return 'assets/svg/no-doc.svg';
      }
      return 'assets/images/no-image.jpg';
    }

    // 2. Si YA ES UNA URL COMPLETA (Caso actual de tu BD con Cloudinary)
    if (img.includes('https://') || img.includes('http://')) {
      if (tipo === 'documents') {
        // Cambiamos /raw/ por /image/ para permitir la previsualización en la nube
        let urlCorregida = img.replace('/raw/upload/', '/image/upload/');

        // Forzamos a que conserve su extensión .pdf original
        return urlCorregida.endsWith('.pdf') ? urlCorregida : `${urlCorregida}.pdf`;
      }
      return img;
    }

    // 3. Si NO ES UNA URL COMPLETA (Caso de desarrollo local con nombres de archivos sueltos)
    if (tipo === 'documents') {
      return `${base_url}/${tipo}/${img}.pdf`;
    }

    // 4. Archivos locales de imágenes
    return `${base_url}/${tipo}/${img}`;
  }
}
