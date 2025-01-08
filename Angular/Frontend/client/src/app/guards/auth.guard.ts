import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate{

  constructor(
    private authServices: AuthService,
    private router: Router
  ){}

  canActivate():boolean{
    if(!this.authServices.isAuth()){
      console.log('Token no es valido o ya expiro');
      this.router.navigate(['session'])
      return false;
    }
      return true;

  }
}
