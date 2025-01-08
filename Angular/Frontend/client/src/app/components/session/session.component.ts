import { Component, OnInit, Renderer2, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {



  user = {userName: '',pass: ''}


  constructor(private authService: AuthService,
              private router: Router,
              private renderer: Renderer2,
              private zone: NgZone) { }

  ngOnInit(): void {
  }

  logIn(){
    this.authService.setUser(this.user);
    this.authService.singin(this.user).subscribe((res:any)=>{
      console.log(res);
      localStorage.setItem('token',res.token)
      this.router.navigate(['inicio'])
    },(error) =>{
      console.error(error)
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Usuario o Clave Incorrectos",
        showConfirmButton: false,
        timer: 1500
      });
    })
  }
}
