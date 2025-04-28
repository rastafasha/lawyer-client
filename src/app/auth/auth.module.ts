import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login/login.component';
import { IconosService } from '../services/iconos.service'; // Adjusted import path

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, // Added HttpClientModule here
    LoginComponent
  ],
  providers: [IconosService] // Correctly added IconosService here
})
export class AuthModule { }
