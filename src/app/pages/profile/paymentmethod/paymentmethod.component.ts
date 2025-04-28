import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../shared/menu-footer/menu-footer.component';
import { PaymentMethod } from '../../../models/paymentmethod.model';
import { Usuario } from '../../../models/usuario.model';
import { PaymentmethodService } from '../../../services/paymentmethod.service';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-paymentmethod',
  imports: [
    CommonModule,
    HeaderComponent,
    MenuFooterComponent,
    BackButtnComponent,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
    TranslateModule
  ],
  templateUrl: './paymentmethod.component.html',
  styleUrl: './paymentmethod.component.scss',
})
export class PaymentmethodComponent {
  pageTitle = 'Payment Methods';
  public tiposdepagos: PaymentMethod [] = [];
  public tiposdepagosuser: PaymentMethod [] = [];
  public user!: Usuario;
  isLoading:boolean = false;
  user_id!:number;
  tipoSeleccionado:any;
  pagoSeleccionado:any;

  public paymentMForm!: FormGroup;

  username!:PaymentMethod;
  bankAccountType!:string;
  bankName!:string;
  bankAccount!:string;
  ciorif!:string;
  phone!:string;
  email!:string;
  tipo!:string;
  id!:number;

  constructor(
    private authService: AuthService,
    private paymentMService: PaymentmethodService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.user = this.authService.getUser();
    this.user_id = this.user.id;
    this.getPaymentMethodByUserId();

  }


  getPaymentMethodByUserId() {
    this.isLoading = true;
    this.paymentMService.getPaymentMethodByUserId(this.user.id).subscribe(
      (resp: any) => {
        this.tiposdepagosuser = resp;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching payment methods:', error);
      }
    );
  }


  selectedTypeEdit(tipo:any){
    this.pagoSeleccionado = tipo.value;
    // console.log(this.pagoSeleccionado);
}

selectedType(tipodepago:any){
    this.tipoSeleccionado = tipodepago;
    // console.log(this.tipoSeleccionado);
}


cambiarStatus(tipodepago:any){
    let VALUE = tipodepago.status;
    // console.log(VALUE);
    
    this.paymentMService.updateStatus(tipodepago, tipodepago.id).subscribe(
      resp =>{
        // console.log(resp);
        Swal.fire('Actualizado', `actualizado correctamente`, 'success');
        // this.toaster.open({
        //   text:'Producto Actualizado!',
        //   caption:'Mensaje de Validación',
        //   type:'success',
        // })
        this.getPaymentMethodByUserId();
      }
    )
  }



save(){

    let data = {
      tipo: this.tipo,
      bankAccountType: this.bankAccountType,
      bankName: this.bankName,
      bankAccount: this.bankAccount,
      ciorif:this.ciorif,
      phone:this.phone,
      email: this.email,
      user_id: this.user.id
    }
    this.paymentMService.createPaymentmethod(data).subscribe((resp:any)=>{
      // console.log(resp);
      this.tipo = '';
      this.bankAccountType = '';
      this.bankName = '';
      this.bankAccount = '';
      this.ciorif = '';
      this.phone = '';
      this.email = '';
      this.ngOnInit();
    })
  }

deleteTipoPago(tiposdepago:any){

    this.paymentMService.deletePaymentmethod(tiposdepago.id).subscribe(
      (resp:any) =>{
        this.getPaymentMethodByUserId();
        
      });
    
  }

}
