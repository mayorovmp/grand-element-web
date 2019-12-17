import { Component, OnInit } from '@angular/core';
import { News } from './news'
import { NEWS } from './mock-news'

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  news: News[];
  constructor() { }

  ngOnInit() {
    this.news = NEWS; 
  }

}
