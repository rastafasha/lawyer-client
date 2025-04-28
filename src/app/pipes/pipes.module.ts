import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';
// import { EscapeHtmlPipe } from './keep-html.pipe';
// import {SafePipe} from './safe.pipe';


@NgModule({
 
  imports: [
    CommonModule,
    ImagenPipe
  ]
})
export class PipesModule { }
