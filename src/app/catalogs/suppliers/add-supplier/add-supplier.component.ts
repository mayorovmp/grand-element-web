import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent implements OnInit {
  static MODAL_NAME = 'addSupplierModal';

  @Output() changed = new EventEmitter<any>();

  constructor(private toastr: ToastrService, public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  onOpen() {

  }

}
