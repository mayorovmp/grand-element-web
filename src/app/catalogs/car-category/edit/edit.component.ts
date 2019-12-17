import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor() { }

  @Output() changed = new EventEmitter<any>();

  ngOnInit() {
  }

  onOpen(): void {
  }


}
