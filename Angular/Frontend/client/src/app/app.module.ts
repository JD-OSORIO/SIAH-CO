import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CrearProductoComponent } from './components/crear-producto/crear-producto.component';
import { ListaProductoComponent } from './components/lista-producto/lista-producto.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CrearAlquilerComponent } from './components/crear-alquiler/crear-alquiler.component';
import { SessionComponent } from './components/session/session.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ListaAlquilerComponent } from './components/lista-alquiler/lista-alquiler.component';
import { CrearFacturaComponent } from './components/crear-factura/crear-factura.component';
import { ListaFacturaComponent } from './components/lista-factura/lista-factura.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { AdminComponent } from './components/admin/admin.component';
import { TokenInterService } from './services/token-inter.service';
import { AuthService } from './services/auth.service';
import { CrearAdminComponent } from './components/crear-admin/crear-admin.component';
import { ListaReportesComponent } from './components/lista-reportes/lista-reportes.component';
import { CrearReportesComponent } from './components/crear-reportes/crear-reportes.component';
import { CrearCategoriaComponent } from './components/crear-categoria/crear-categoria.component';
@NgModule({
  declarations: [AppComponent,CrearProductoComponent,ListaProductoComponent,InicioComponent,CrearAlquilerComponent,SessionComponent,ListaAlquilerComponent,CrearFacturaComponent,ListaFacturaComponent,NavbarComponent, AdminComponent, CrearAdminComponent, ListaReportesComponent, CrearReportesComponent, CrearCategoriaComponent],
  imports: [BrowserModule,AppRoutingModule,ReactiveFormsModule,HttpClientModule, FormsModule],
  providers: [
    //JWT
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    JwtHelperService,
    //TOKEN
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterService, multi: true},
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
