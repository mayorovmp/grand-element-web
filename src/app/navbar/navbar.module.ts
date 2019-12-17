import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [BrowserModule, FormsModule, RouterModule],
    declarations: [NavbarComponent],
    exports: [NavbarComponent]
})
export class NavbarModule { }
