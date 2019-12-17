import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer.component';

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [FooterComponent],
    exports: [FooterComponent]
})
export class FooterModule { }
