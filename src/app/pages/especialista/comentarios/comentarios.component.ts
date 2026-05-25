import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ComentarioappService } from '../../../services/comentarioapp.service';
import { CommonModule } from '@angular/common';
import { RatingStarComponent } from '../../../components/ratingStar/ratingStar.component';

@Component({
  selector: 'app-comentarios',
  imports: [
    CommonModule,
  ],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.scss'
})
export class ComentariosComponent implements OnInit {
  @Input() user_id: any;
  comentarios = signal<any[]>([]);
  loading = signal<boolean>(false);
  hasMore = signal<boolean>(true);
  isFiltering = signal(false);
  page = 1;
  status!: string;

  private comentarioService = inject(ComentarioappService);

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getComentariosMember();
  }
  // getComentariosMember(){
  //   this.comentarioService.getByMember(this.user_id).subscribe((resp:any)=>{
  //     this.comentarios = resp;
  //     console.log(this.comentarios)
  //   })
  // }

  getComentariosMember() {
    if (!this.hasMore()) return; // Si ya sabemos que no hay más en el servidor, paramos.
    this.loading.set(true);

    this.comentarioService.getByMember(this.user_id, this.page).subscribe({
      next: (newData: any[]) => {
        if (newData.length === 0) {
          this.hasMore.set(false);
          this.loading.set(false);
        } else {
          // 1. Filtrado local por estatus
          let filteredData = newData;
          if (this.status) {
            filteredData = newData.filter(p => p.status === this.status);
          }


          // 2. Agregamos los únicos a la lista visible
          this.comentarios.update(current => {
            const ids = new Set(current.map(p => p._id));
            const unique = filteredData.filter(p => !ids.has(p._id));
            return [...current, ...unique];
          });

          // 3. LA CLAVE: Si estamos filtrando y trajo muy pocos (ej. menos de 5) 
          // o ninguno, pero el API dice que hay más páginas, pedimos la siguiente YA.
          if (this.status && filteredData.length < 5 && newData.length > 0) {
            this.page++;
            this.getComentariosMember(); // Llamada recursiva controlada
          } else {
            this.loading.set(false);
          }
        }
      },
      error: () => this.loading.set(false)
    });
  }

}
