import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DisplayNoteComponent } from './components/notes/display-note/display-note.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { CreateNoteComponent } from './components/notes/create-note/create-note.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService],
  children: [{path: 'notes', component: DisplayNoteComponent}, {path: 'createNote', component: CreateNoteComponent}]
  },
  {path: '', redirectTo: '/login', pathMatch:'full'},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [RegisterComponent, LoginComponent, DashboardComponent]
