import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/catalogs/models/Client';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ClientAddComponent } from './client-add/client-add.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [
    {
      name: 'ИП Батрутдинов',
      addresses: [
        {
          place: 'горького 121', contacts: [
            { name: 'Петрович', way: 'тел: 89013123232' },
            { name: 'Якубович', way: 'тел: 89013123232' }]
        },
        { place: 'василевского 321', contacts: [{ name: 'Иваныч', way: 'тел: 89013123232' }] },
        { place: 'ленина 51', contacts: [{ name: 'Сидорович', way: 'тел: 89013123232' }] }
      ]
    },
    {
      name: 'ИП Харламов',
      addresses: [
        {
          place: 'копейское шоссе 121', contacts: [
            { name: 'Сидорович', way: 'тел: 89013123232' },
            { name: 'Порошков', way: 'тел: 89013123232' }]
        },
        { place: 'Тверская 321', contacts: [{ name: 'Дорожников', way: 'тел: 89013123232' }] },
        { place: 'Цвилинга 51', contacts: [{ name: 'Сидорович', way: 'тел: 89013123232' }] }
      ]
    },
  ];
  newClient: Client;

  constructor(public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  addClient(client: Client) {
    this.ngxSmartModalService.toggle(ClientAddComponent.MODAL_NAME);
  }

}
