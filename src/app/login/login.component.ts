import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public username: string;
    public password: string;
    public errorMessage?: string;


    constructor(private auth: AuthService, private router: Router, private ngxLoader: NgxUiLoaderService, private toastr: ToastrService) { }

    ngOnInit() {
        if (this.auth.authenticated) {
            this.router.navigate(['/']);
        }
    }

    authenticate(form: NgForm) {
        if (form.valid) {
            this.auth.authenticate(this.username, this.password)
                .subscribe(response => {
                    if (response.success) {
                        this.auth.setUser(response.result);
                        this.auth.moveToNextUrl();
                    } else {
                        this.toastr.error(response.message);
                    }
                },
                    err => {
                        console.log(err);
                        this.toastr.error('Ошибка сервера');
                    });
        } else {
            this.toastr.error('Заполните все необходимые поля.');
        }
    }

}
