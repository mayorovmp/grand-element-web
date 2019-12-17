import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { NewsComponent } from "./news/news.component";
import { StatisticsComponent } from "./statistics/statistics.component";
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [WelcomeComponent, NewsComponent, StatisticsComponent],
  imports: [
    CommonModule,
    ChartsModule
  ],
  exports: []
})
export class WelcomeModule { }
