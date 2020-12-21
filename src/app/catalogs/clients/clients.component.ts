import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Client } from '@models/Client';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from 'src/app/catalogs/clients/http.service';
import { ClientEditorComponent } from './editor/editor.component';
import { ClientsGoal } from './Goal';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['../catalogs.component.css', './clients.component.css'],
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  nameSorting = 'none';
  constructor(
    private httpClient: HttpService,
    public ngxSmartModalService: NgxSmartModalService,
    private title: Title
  ) {
    title.setTitle('Клиенты');
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.nameSorting = 'none';
    this.clients = await this.httpClient.getClients().toPromise();
  }

  addClient() {
    this.ngxSmartModalService.setModalData(
      { type: ClientsGoal.New },
      ClientEditorComponent.MODAL_NAME,
      true
    );
    this.ngxSmartModalService.toggle(ClientEditorComponent.MODAL_NAME);
  }

  edit(item: Client) {
    this.ngxSmartModalService.setModalData(
      { type: ClientsGoal.Edit, client: item },
      ClientEditorComponent.MODAL_NAME,
      true
    );
    this.ngxSmartModalService.toggle(ClientEditorComponent.MODAL_NAME);
  }

  confirm(item: Client) {
    this.ngxSmartModalService.setModalData(
      {
        title: 'Подтвердите действие',
        btnAction: () => this.delete(item),
        btnActionColor: 'red',
        btnActionName: 'Удалить клиента',
      },
      'confirmModal',
      true
    );
    this.ngxSmartModalService.toggle('confirmModal');
  }

  async delete(item: Client) {
    if (item.id) {
      await this.httpClient.deleteClient(item.id).toPromise();
    }
    this.getData();
  }

  sortedByName = () => {
    if (this.nameSorting === 'none' || this.nameSorting === 'reverse') {
      this.clients.sort((a, b) => {
        if (!a.name) {
          a.name = '';
        }
        if (!b.name) {
          b.name = '';
        }
        return a.name.localeCompare(b.name);
      });
      this.nameSorting = 'direct';
    } else if (this.nameSorting === 'direct') {
      this.clients.sort((a, b) => {
        if (!a.name) {
          a.name = '';
        }
        if (!b.name) {
          b.name = '';
        }
        return b.name.localeCompare(a.name);
      });
      this.nameSorting = 'reverse';
    }
  };
}
