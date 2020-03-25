import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Client } from 'src/app/models/Client';
import { ToastrService } from 'ngx-toastr';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from '../http.service';
import { Address } from 'src/app/models/Address';
import { Contact } from 'src/app/models/Contact';

@Component({
  selector: 'app-client-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class ClientEditorComponent implements OnInit {
  static MODAL_NAME = 'editClientModal';

  @Output() changed = new EventEmitter<any>();

  client: Client = new Client();

  constructor(
    private httpSrv: HttpService, private toastr: ToastrService,
    private ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  async onOpen() {
    const transferredClient = this.ngxSmartModalService.getModalData(ClientEditorComponent.MODAL_NAME);
    this.ngxSmartModalService.resetModalData(ClientEditorComponent.MODAL_NAME);
    if (transferredClient) {
      this.client = transferredClient;
    } else {
      this.client = new Client();
    }
  }

  onClose() {
    this.changed.emit();
  }

  addContact(addr: Address) {
    addr.contacts.push(new Contact());
  }

  addAddress(client: Client) {
    client.addresses.push(new Address());
  }

  delContact(addr: Address, contact: Contact) {
    const delId = addr.contacts.findIndex(x => x.id === contact.id);
    addr.contacts.splice(delId, 1);
  }

  delAddr(client: Client, addr: Address) {
    const delId = client.addresses.findIndex(x => x.id === addr.id);
    client.addresses.splice(delId, 1);
  }

  async createOrUpdate(item: Client) {
    if (item.id) {
      await this.httpSrv.edit(item).toPromise();
      this.toastr.info('Изменено');
    } else {
      await this.httpSrv.add(item).toPromise();
      this.toastr.info('Создано');
    }
    this.changed.emit();
    this.ngxSmartModalService.toggle(ClientEditorComponent.MODAL_NAME);
  }
}
