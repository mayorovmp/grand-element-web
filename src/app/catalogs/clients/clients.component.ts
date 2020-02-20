import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/Client';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ClientAddComponent } from './client-add/client-add.component';
import { HttpService } from 'src/app/catalogs/clients/http.service';
import { EditorComponent } from './editor/editor.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];

  constructor(private httpClient: HttpService, public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.clients = await this.httpClient.getClients().toPromise();
  }

  addClient() {
    this.ngxSmartModalService.toggle(EditorComponent.MODAL_NAME);
  }

  edit(item: Client) {
    this.ngxSmartModalService.setModalData(item, EditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.toggle(EditorComponent.MODAL_NAME);
  }

  async delete(item: Client) {
    if (item.id) {
      await this.httpClient.deleteClient(item.id).toPromise();
    }
    this.getData();
  }
}
