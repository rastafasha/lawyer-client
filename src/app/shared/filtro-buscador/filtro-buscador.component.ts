import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DocumentService } from '../../services/document.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-filtro-buscador',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './filtro-buscador.component.html',
  styleUrl: './filtro-buscador.component.scss'
})
export class FiltroBuscadorComponent {
  searchForm!: FormGroup;
  user!: any;
  isLoading: boolean = false;
  currentPage = 1;
  public name_category: string = '';
  public name_file: string = '';
  public created_at!: string;
  user_id!: string;
  FILES: any = [];
  isSearching = false;
  user_files:any

  constructor(
    private authService: AuthService,
    public documentService: DocumentService,
    public fb: FormBuilder,

  ) {
    this.user = this.authService.getLocalStorage();

  }

  ngOnInit(): void {
    this.searchForm.reset();
    this.validarFormularioPerfil();
  }

  validarFormularioPerfil() {
    if (!this.searchForm) {
      this.searchForm = this.fb.group({
        name_category: [''],
        created_at: [''],
        name_file: [''],
        user_id: [this.user.id],
      });
    }
  }

  getdocumentsbyUserFilter() {
    this.isLoading = true;
    this.currentPage;
    this.name_category = this.searchForm.value.name_category;
    this.created_at = this.searchForm.value.created_at;
    this.name_file = this.searchForm.value.name_file;
    this.documentService.getAllClientReportByPatient(
      this.user_id,
      this.currentPage,
      this.created_at,
      this.name_category,
      this.name_file,
    ).subscribe((resp: any) => {
      this.FILES = resp.data;
      this.isLoading = false;

    })
  }


  searchData() {
    const formValue = this.searchForm.value;
    this.isSearching = true;
    this.name_file = this.name_file.toLowerCase();
    // this.characters = this.characters.filter((character: any) => {
    //   return character.name.toLowerCase().includes(this.search);
    //   });
    this.getdocumentsbyUserFilter();
  }
  resetSearch(): void {
    this.isSearching = false;
    this.searchForm.reset();
    this.ngOnInit();
  }



}
