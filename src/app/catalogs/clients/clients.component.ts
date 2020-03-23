import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/Client';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from 'src/app/catalogs/clients/http.service';
import { ClientEditorComponent } from './editor/editor.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['../catalogs.component.css', './clients.component.css']
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
    this.ngxSmartModalService.toggle(ClientEditorComponent.MODAL_NAME);
  }

  edit(item: Client) {
    this.ngxSmartModalService.setModalData(item, ClientEditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.toggle(ClientEditorComponent.MODAL_NAME);
  }

  async delete(item: Client) {
    if (item.id) {
      await this.httpClient.deleteClient(item.id).toPromise();
    }
    this.getData();
  }
}
