import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { ArchiveComponent } from './components/archive/archive.component';
import { NotesComponent } from './components/notes/notes/notes.component';
import { TrashComponent } from './components/trash/trash.component';
import { ReminderComponent } from './components/reminder/reminder.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    //canActivate: [AuthGuardService],
    children: [
      { path: 'archive', pathMatch: 'full', component: ArchiveComponent },
      { path: '', pathMatch: 'full', component: NotesComponent },
      { path: 'trash', pathMatch: 'full', component: TrashComponent },
      { path: 'reminders', pathMatch: 'full', component: ReminderComponent },
    ],
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [
  RegisterComponent,
  LoginComponent,
  DashboardComponent,
];
