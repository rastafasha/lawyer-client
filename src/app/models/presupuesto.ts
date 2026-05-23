import { Usuario } from "./usuario.model";

export class Presupuesto {
    _id!: string;
    usuario?: Usuario;
    cliente?: Usuario;
    title!: string;
    description!: string;
    observaciones!: string;
    listItems!: Medical[];
    amount!: number;
    status?: 'PENDING' | 'APROVED' | 'REFUSED';
    createdAt!: Date;
    updatedAt!: Date;

}
export class Medical {
    _id!: number;
    name_medical!: string;
    precio!: number;
    cantidad!: number;


}