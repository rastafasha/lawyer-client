import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BackButtnComponent } from '../../../../shared/backButtn/backButtn.component';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../../shared/menu-footer/menu-footer.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DocumentService } from '../../../../services/document.service';
import { Document } from '../../../../models/document.model';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingComponent } from '../../../../shared/loading/loading.component';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-files',
  imports: [
    CommonModule,
    HeaderComponent,
    MenuFooterComponent,
    BackButtnComponent,
    LoadingComponent,
    TranslateModule
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss',
})
export class FilesComponent {
  pageTitle= 'File Documents';
  FILE!: Document;
  type!: string;
  isLoading:boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private documentService: DocumentService,
    private _sanitizer: DomSanitizer,

  ){

  }
  ngOnInit(){
    this.activatedRoute.params.subscribe( ({id}) => this.iniciarFile(id));
  }

  iniciarFile(id:number){
    this.isLoading = true;
    this.documentService.getDocument(id).subscribe((resp:any)=>{
      this.FILE = resp;
      // console.log(this.FILE);
      this.type = this.FILE.type;
      this.isLoading = false;
    })
  }

  getPDFIframe(url:any) {
    var file, results;
  
    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    file   = (results === null) ? url : results[1];
  
    // return this._sanitizer.bypassSecurityTrustResourceUrl(baseUrl + file);
    return this._sanitizer.bypassSecurityTrustResourceUrl(file);
  }
}
