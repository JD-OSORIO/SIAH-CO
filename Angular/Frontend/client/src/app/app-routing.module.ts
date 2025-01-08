import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProductoComponent } from './components/lista-producto/lista-producto.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CrearProductoComponent } from './components/crear-producto/crear-producto.component';
import { CrearAlquilerComponent } from './components/crear-alquiler/crear-alquiler.component';
import { SessionComponent } from './components/session/session.component';
import { ListaAlquilerComponent } from './components/lista-alquiler/lista-alquiler.component';
import { CrearFacturaComponent } from './components/crear-factura/crear-factura.component';
import { ListaFacturaComponent } from './components/lista-factura/lista-factura.component';
import { AuthGuard } from './guards/auth.guard';
import { SessionGuard } from './guards/session.guard';
import { AdminComponent } from './components/admin/admin.component';
import { RoleGuard } from './guards/role.guard';
import { CrearAdminComponent } from './components/crear-admin/crear-admin.component';
import { ListaReportesComponent } from './components/lista-reportes/lista-reportes.component';
import { CrearReportesComponent } from './components/crear-reportes/crear-reportes.component';
import { CrearCategoriaComponent } from './components/crear-categoria/crear-categoria.component';
import { CategoriaService } from './services/categoria.service';

const routes: Routes = [{ path:'', component: SessionComponent},{path:'crear-categoria', component: CrearCategoriaComponent, canActivate: [RoleGuard], data: {expectedRole: 'admin'}},{ path:'inicio', component: InicioComponent, canActivate: [AuthGuard]},{ path:'session', component: SessionComponent, canActivate: [SessionGuard]},{ path:'lista-producto', component: ListaProductoComponent, canActivate: [AuthGuard]},{ path:'crear-producto', component: CrearProductoComponent, canActivate: [AuthGuard]},{ path:'editar-producto/:id', component: CrearProductoComponent, canActivate: [AuthGuard]},{ path:'lista-alquiler', component: ListaAlquilerComponent, canActivate: [AuthGuard]},{ path:'crear-alquiler',component: CrearAlquilerComponent, canActivate:[AuthGuard]},{ path:'editar-alquiler/:id', component: CrearAlquilerComponent, canActivate: [AuthGuard]},{ path:'crear-factura', component: CrearFacturaComponent, canActivate: [AuthGuard]},{ path:'editar-factura/:id', component: CrearFacturaComponent, canActivate: [AuthGuard]},{ path:'lista-factura',component: ListaFacturaComponent, canActivate: [AuthGuard]},{path:'admin', component: AdminComponent,canActivate: [RoleGuard], data: {expectedRole: 'admin'}},{path:'crear-admin', component: CrearAdminComponent,canActivate: [RoleGuard], data: {expectedRole: 'admin'}},{path:'lista-reporte',component: ListaReportesComponent, canActivate: [RoleGuard], data: {expectedRole: 'admin'}}, {path: 'crear-reporte', component: CrearReportesComponent, canActivate: [AuthGuard]},{path:'editar-admin/:id', component: CrearAdminComponent,canActivate: [RoleGuard], data: {expectedRole: 'admin'}},{ path:'**', pathMatch:'full', redirectTo:''}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
