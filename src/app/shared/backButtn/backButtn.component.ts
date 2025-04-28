import { Component, Inject, Input } from '@angular/core';
import {  Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-backButtn',
    templateUrl: './backButtn.component.html',
    imports:[TranslateModule],
    styleUrls: ['./backButtn.component.css']
})
export class BackButtnComponent {
    // private _location = Inject(Location)
    @Input() pageTitle!:string;
    @Input() Title!:string;
    
    constructor(private _location: Location) {}

    goBack() {
        this._location.back();
      }
}