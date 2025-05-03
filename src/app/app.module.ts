import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinner, MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateNoteComponent } from './components/notes/create-note/create-note.component';
import { DisplayNoteComponent } from './components/notes/display-note/display-note.component';
import { IconsComponent } from './components/notes/icons/icons.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { NotesComponent } from './components/notes/notes/notes.component';
import { HeaderComponent } from './components/header/header.component';
import { TrashComponent } from './components/trash/trash.component';
import { EditComponent } from './components/notes/edit/edit.component';
import { OverlayRef } from '@angular/cdk/overlay';
import { ReminderComponent } from './components/reminder/reminder.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    DashboardComponent,
    CreateNoteComponent,
    DisplayNoteComponent,
    IconsComponent,
    ArchiveComponent,
    NotesComponent,
    HeaderComponent,
    TrashComponent,
    EditComponent,
    ReminderComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    MatProgressSpinner,
    { provide: MatDialogRef, useValue: {} },
    { provide: MatDialogConfig, useValue: {} },
    { provide: MatDialog, useValue: {} },
  ],
  exports: [EditComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
