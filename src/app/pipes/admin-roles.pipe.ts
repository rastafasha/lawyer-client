import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Pipe({ name: 'adminRolesPipe', standalone: true })

export class AdminRolesPipe implements PipeTransform {
        transform(users: Usuario[] | null): Usuario[] {
            if (!users) return [];
            return users.filter(user => user.role === 'MEMBER');
        }
}
