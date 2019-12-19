import { Component, OnInit } from '@angular/core';
import { Catalog } from './models/Catalog';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.css']
})
export class CatalogsComponent implements OnInit {
  catalogs: Catalog[] = [
    new Catalog('Клиенты', ['clients']),
    new Catalog('Категории машин', ['car-category']),
    new Catalog('Автомобили', ['car']),
    new Catalog('Поставщики', ['suppliers'])
  ];
  constructor() { }

  ngOnInit() {
  }

}
