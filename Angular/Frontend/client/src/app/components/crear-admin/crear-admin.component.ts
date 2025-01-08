import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-admin',
  templateUrl: './crear-admin.component.html',
  styleUrl: './crear-admin.component.css'
})
export class CrearAdminComponent implements OnInit {

  UserForm: FormGroup;
  titulo = 'Crear Usuarios';

  id: string | null;


  constructor(private fb: FormBuilder,
              private _userService: UserService,
              private router: Router,
              private aRoute: ActivatedRoute) {
        this.UserForm = this.fb.group({
          name: ['', Validators.required],
          userName: ['', Validators.required],
          pass: ['', Validators.required],
          role: ['', Validators.required],
        })
      this.id = this.aRoute.snapshot.paramMap.get('id')
  }

  ngOnInit(): void {
    this.isEdit();
  }

  agregarUser(){
    console.log(this.UserForm);

    if(this.UserForm.invalid){
      return Object.values(this.UserForm.controls).forEach(control=>{
        control.markAllAsTouched();
      })
    }
    const USER: User ={
      name: this.UserForm.get('name')?.value,
      userName: this.UserForm.get('userName')?.value,
      pass: this.UserForm.get('pass')?.value,
      role: this.UserForm.get('role')?.value
    }

    if(this.id !==null){
      //Edit
      this._userService.editUser(this.id, USER).subscribe(data=>{
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se ha Editado Correctamente',
          showConfirmButton: false,
          timer: 1100
        })
        this.router.navigate(['/admin'])
      })
    }else{
      //Create
      console.log(USER);
      this._userService.createUser(USER).subscribe(data=>{
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se ha Guardado Correctamente',
          showConfirmButton: false,
          timer: 1100
        })
        this.router.navigate(['/admin'])
      },error=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo Salio Mal, Revisa el error',
          footer: 'No se guardaron los datos'
        })
        this.UserForm.reset();
      })
    }
  }

  isEdit(){
    if(this.id !==null){
      this.titulo = 'Editar Usuario'
      this._userService.getUser(this.id).subscribe(data=>{
        this.UserForm.setValue({
          name: data.name,
          userName: data.userName,
          pass: data.pass,
          role: data.role,
        })
      })
    }
  }

  //validaciones
  get nameN(){
    return this.UserForm.get('name')?.invalid && this.UserForm.get('name')?.touched
  }
  get userNameN(){
    return this.UserForm.get('userName')?.invalid && this.UserForm.get('userName')?.touched
  }
  get passN(){
    return this.UserForm.get('pass')?.invalid && this.UserForm.get('pass')?.touched
  }
  get roleN(){
    return this.UserForm.get('role')?.invalid && this.UserForm.get('role')?.touched
  }

}
