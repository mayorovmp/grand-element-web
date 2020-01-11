import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Catalog } from '../catalogs/models/Catalog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  catalogs: Catalog[] = [
    new Catalog('Клиенты', ['clients']),
    new Catalog('Категории машин', ['car-category']),
    new Catalog('Перевозчики', ['car']),
    new Catalog('Товары', ['product']),
    new Catalog('Поставщики', ['suppliers'])
  ];

  constructor(public auth: AuthService, private router: Router, ) { }

  ngOnInit() {
  }

  public logout() {
    this.auth.logout();
  }
}
