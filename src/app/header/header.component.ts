import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Catalog } from '../models/Catalog';

@Component({
  selector: 'app-navbar',
  templateUrl: './header.html',
  styleUrls: ['./styles.css']
})
export class NavbarComponent implements OnInit {

  logoSrc = require('./logo.svg');

  catalogs: Catalog[] = [
    new Catalog('Клиенты', ['catalog/clients']),
    new Catalog('Категории машин', ['catalog/car-category']),
    new Catalog('Перевозчики', ['catalog/car']),
    new Catalog('Товары', ['catalog/product']),
    new Catalog('Поставщики', ['catalog/suppliers'])
  ];

  constructor(public auth: AuthService, private router: Router, ) { }

  ngOnInit() {
  }

  public logout() {
    this.auth.logout();
  }
}