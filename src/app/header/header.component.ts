import { 
  Component, 
  OnInit,
} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Catalog } from '../models/Catalog';

@Component({
  selector: 'app-navbar',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class NavbarComponent implements OnInit{ 

  logoSrc = 'assets/img/logo.svg';

  mobileNavActive:boolean = false;
  mobileBtnActive:boolean = false;

  catalogs: Catalog[] = [
    new Catalog('Клиенты', ['catalog/clients']),
    new Catalog('Категории машин', ['catalog/car-category']),
    new Catalog('Перевозчики', ['catalog/car']),
    new Catalog('Товары', ['catalog/product']),
    new Catalog('Поставщики', ['catalog/suppliers'])
  ];

  constructor(public auth: AuthService, private router: Router, ) { 
    this.router.events.subscribe(route => {
      this.mobileNavActive = false;
      this.mobileBtnActive = false;
  });
  }
   
  ngOnInit() { }

  public toggleMenu = () => {
    this.mobileNavActive = !this.mobileNavActive;
    this.mobileBtnActive = !this.mobileBtnActive;
  }

  public logout() {
    this.auth.logout();
  }
}