import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class SessionGuard implements CanActivate{

  constructor(
    private authServices: AuthService,
    private router: Router
  ){}

  canActivate():boolean{
    if(this.authServices.isAuth()){
      console.log('Ya iniciaste session');
      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Ya iniciaste cesion",
        showConfirmButton: false,
        timer: 2000
      });
      this.router.navigate(['inicio'])
      return true;
    }
      return false;
    }
  }

