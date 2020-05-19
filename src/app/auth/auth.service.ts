import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './User';
import { Token } from './Token';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private baseUrl = environment.baseUrl;
    private loginUrl = `${this.baseUrl}/user/login`;
    private nextUrlAfterLogin = '';

    constructor(private http: HttpClient, private router: Router, ) { }

    authenticate(login: string, password: string): Observable<any> {
        const token = new Token(login, password);
        const observable = this.http.post<any>(this.loginUrl, token);
        return observable;
    }

    setUser(user: User): void {
        localStorage.token = user.token;
        localStorage.username = user.name;
        localStorage.userId = user.userId;
    }

    get nextUrl(): string {
        return this.nextUrlAfterLogin;
    }

    moveToNextUrl(): void {
        const nextUrl = this.nextUrlAfterLogin;
        this.nextUrlAfterLogin = '';
        this.router.navigateByUrl(nextUrl);
    }

    get token(): string {
        if (localStorage.token) {
            return localStorage.token;
        } else {
            return '';
        }
    }

    get username(): string {
        return localStorage.username;
    }

    get authenticated(): boolean {
        if (this.token) {
            return true;
        } else {
            return false;
        }
    }

    async refreshToken() {
        this.nextUrlAfterLogin = this.router.url;
        await this.logout();
    }

    logout(): Promise<boolean> {
        localStorage.clear();
        return this.router.navigate(['/login']);
    }
}
