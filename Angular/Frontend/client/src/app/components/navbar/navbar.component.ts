import { Component, OnInit, Renderer2,NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  nombre = '';
  roles = '';
  rola='';
  listaUser = [] =[];
  user = {};
  username = '';

  isMenuOpen: boolean = false;
  menuActive = false;

  activeLink: number | null = null;

  constructor(private authservice: AuthService,
              private userservice: UserService,
              private router: Router,
              private renderer: Renderer2,
              private zone: NgZone) { }


  ngOnInit(): void {
    this.showName();
  }


  singout(){
    const user = this.authservice.getUser();
    this.authservice.singin(user).subscribe((res:any)=>{
      console.log(res);
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.router.navigate([''])
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.zone.run(() => {
            this.renderer.setProperty(document.location, 'href', document.location.href);
          });
        }, 1000);
      });
    })
  }

  showAdminLink(): boolean {
    const expectedRole = 'admin'; // o puedes obtener esto de alguna manera dinámica si es necesario
    const userRole = this.authservice.getUserRole();

    // Muestra el enlace solo si el rol del usuario coincide con el rol esperado
    return userRole === expectedRole;
  }

  showUserLink(): boolean{
    const expectedRole = 'user';
    const userRole = this.authservice.getUserRole();

    return userRole === expectedRole
  }

  showName() {
    const user = this.authservice.getUser();
    if (user && 'userName' in user) {
      this.username = user.userName;

      this.userservice.getUsers().subscribe((users: any[]) => {
        const matchedUser = users.find(u => u.userName === this.username);
        if (matchedUser) {
          this.nombre = matchedUser.name;
          this.roles = this.authservice.getUserRole();
          if(this.roles === 'admin'){
            this.rola = 'Administrador'
          }else if(this.roles === 'user'){
            this.rola = 'Empleado'
          }
        } else {
          console.log("No se encontró un usuario con ese nombre de usuario");
        }
      });
    } else {
      console.error('Error: Usuario no tiene la propiedad userName', user);
      this.user = { userName: '', pass: '' };
      this.username = '';
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuActive = !this.menuActive;
  }

  handleClick(linkNumber: number): void {
    // Desactiva el enlace actual si ya estaba activo
    if (this.activeLink === linkNumber) {
      this.activeLink = null;
    } else {
      // Establece el enlace activo al hacer clic
      this.activeLink = linkNumber;
    }
  }

}
