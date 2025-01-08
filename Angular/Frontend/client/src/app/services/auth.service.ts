import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

interface JwtPayload {
  userName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'http://localhost:4000'

  user = {userName: '',pass: ''}

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService) { }

  singin(user: any){
    return this.http.post(`${this.URL}/api/users/singin`,user)
  }

  isAuth():boolean{
   const token = localStorage.getItem('token')
   if(this.jwtHelper.isTokenExpired(token) || !localStorage.getItem('token')){
    return false;
   }
    return true
  }

  setUser(newUser: {userName: string, pass: string}){
    this.user = newUser
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  getUser(){
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  getUserRole(): string {
    const token:any = localStorage.getItem('token');
    const { role }: JwtPayload = jwtDecode(token);
    return role;
  }


}
