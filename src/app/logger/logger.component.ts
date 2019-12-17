import { Component, OnInit } from '@angular/core';
import { LoggerHttpService } from './logger-http.service';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit {

  constructor(private httpService: LoggerHttpService) { }
  files: string[] = [];
  text = 'Выбери файл';

  async ngOnInit() {
    const env = await this.httpService.getListOfNames().toPromise();
    this.files = env;
  }

  async getText(name: string) {
    this.text = 'asdasd';
    const env = await this.httpService.getFile(name).toPromise();
    this.text = env;
  }
}
