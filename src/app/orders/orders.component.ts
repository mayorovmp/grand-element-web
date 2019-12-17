import { Component, OnInit } from '@angular/core';
import { Order } from './models/Order';
import { Client } from './models/Client';
import { Req } from './models/Request';
import { Car } from './models/Car';
import { OrderAddComponent } from './order-add/order-add.component';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  today = Date.now();

  orders: Order[] = [new Order(new Client('УРАЛ СтройСервис', 'ЦПК №10', '10км', true),
    [
      new Req('Щебень', '10т', '01.01.2020', '01.01.2020', 'выполнен', 'утро', [
        new Car('6т', 1, 'а654он174', ' 8974743012', false),
        new Car('12т', 2, 'а748он174', ' 895149743012', false),
        new Car('23т', 3, 'а332он174', ' 89329743012', false),
        new Car('5т', 1, 'а148он174', ' 89089743012', false)], false),
      new Req('Песок', '15т', '01.01.2020', '01.01.2020', 'не назначен', 'утро', [new Car('5т', 2, '', '', false)], false),
      new Req('Грунт', '12т', '01.01.2020', '01.01.2020', 'не назначен', 'утро', [new Car('5т', 5, '', '', false)], false),
      new Req('Кирпичи', '20т', '01.01.2020', '01.01.2020', 'назначен', 'утро', [new Car('5т', 5, 'а148он174', ' 89049743012', false)], false)
    ], true
  )
    , new Order(new Client('ИП Батрутдинов', 'Энергетиков 50', '34км', true),
      [
        new Req('Щебень', '10т', '01.01.2020', '01.01.2020', 'назначен', 'утро', [
          new Car('6т', 1, 'а654он174', ' 8974743012', false),
          new Car('12т', 2, 'а748он174', ' 895149743012', false),
          new Car('23т', 3, 'а332он174', ' 89329743012', false),
          new Car('5т', 1, 'а148он174', ' 89089743012', false)], false),
        new Req('Песок', '15т', '01.01.2020', '01.01.2020', 'не назначен', 'утро', [new Car('5т', 2, '', '', false)], false),
        new Req('Грунт', '12т', '01.01.2020', '01.01.2020', 'не назначен', 'утро', [new Car('5т', 5, '', '', false)], false),
        new Req('Кирпичи', '20т', '01.01.2020', '01.01.2020', 'назначен', 'утро', [new Car('5т', 5, 'а148он174', ' 89049743012', false)], false)
      ], true
    )
  ];

  longOrder: Order[] = [new Order(new Client('Север Строй', 'ЦПК №10', '10км', true),
    [
      new Req('Щебень', '1000т', '01.01.2020', '03.04.2021', 'не выполнен', 'утро', [
        new Car('6т', 100, '', '', false),
        new Car('12т', 200, '', ' ', false),
        new Car('23т', 300, '', '', false),
        new Car('5т', 100, '', '', false)], false),
      new Req('Песок', '1500т', '01.01.2020', '01.04.2021', 'не выполнен', 'утро', [new Car('5т', 200, '', '', false)], false),
      new Req('Грунт', '1200т', '01.01.2020', '01.02.2021', 'не выполнен', 'утро', [new Car('5т', 500, '', '', false)], false),
      new Req('Кирпичи', '2000т', '01.01.2020', '01.12.2021', 'не выполнен', 'утро', [new Car('5т', 500, 'а148он174', ' 89049743012', false)], false)
    ], true
  )];

  cars: {} = [{
    owner: 'Иванов',

    cat: '15т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'
  },
  {
    owner: 'Петров',
    cat: '65т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'

  },
  {
    owner: 'Сидоров',
    cat: '65т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'

  },
  {
    owner: 'Пронов',
    cat: '25т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'

  },
  {
    owner: 'Путов',
    cat: '15т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'

  },
  {
    owner: 'Делов',
    cat: '15т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'

  },
  {
    owner: 'Иванов',
    cat: '24т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'

  },
  {
    owner: 'Иванов',
    cat: '32т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'

  },
  {
    owner: 'Иванов',
    cat: '25т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'

  },
  {
    owner: 'Иванов',
    cat: '15т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'

  },
  {
    owner: 'Иванов',
    cat: '15т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'

  },
  {
    owner: 'Петров',
    cat: '65т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'

  },
  {
    owner: 'Сидоров',
    cat: '65т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'

  },
  {
    owner: 'Пронов',
    cat: '25т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'

  },
  {
    owner: 'Путов',
    cat: '15т',
    num: 'a124yy174',
    workTime: '24/7',
    contact: '89049743012'
  },
  ];
  openReq(order: Order) {
    order.expanded = !order.expanded;
  }
  openCar(req: Req) {
    req.expanded = !req.expanded;
  }

  getRand(): number {
    return Math.floor((Math.random() * 3)) + 0;
  }
  constructor(public ngxSmartModalService: NgxSmartModalService) { }

  add() {
    this.ngxSmartModalService.getModal(OrderAddComponent.MODAL_NAME).open();
  }

  ngOnInit() {
  }

}
