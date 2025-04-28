import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'whatsappFilter'
})
export class WhatsappFilterPipe implements PipeTransform {

  transform(services: any[]): any[] {
    if (!services) {
      return services;
    }
    return services.filter(service => service.name.startsWith('whatsapp'));
  }

}


