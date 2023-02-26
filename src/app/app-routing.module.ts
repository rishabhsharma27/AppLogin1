import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


const routes: Routes = [
  {path: '/user/login', component:LoginComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'forgot-password', component:ForgotPasswordComponent},
  {path: '', redirectTo:'/login', pathMatch: 'full'},
  {path: '**', component:NotFoundComponent},
  {path: '/user/dashboard', component:DashboardComponent},

];

@NgModule({
  imports: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
