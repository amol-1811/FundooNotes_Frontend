import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  selectedLanguage = 'en-US';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private userSer: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: [
          '',
          [Validators.required, Validators.pattern('^[A-Za-z]{2,25}$')],
        ],
        lastName: [''],
        dob: ['', Validators.required],
        gender: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      // localStorage.setItem('registeredUser', JSON.stringify(formData))
      // console.log('Registration successful:', formData);
      // } else {
      // console.warn('Form not valid:', this.registerForm.errors);

      const payload = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        dob: this.registerForm.value.dob,
        gender: this.registerForm.value.gender,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };

      this.userSer.register(payload).subscribe({
        next: (result) => {
          console.log(result);
          this.router.navigateByUrl('dashboard/login');

          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
        error: (err) => {
          console.log(err);
          this.snackBar.open('registration failed!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
      });
      this.registerForm.reset();
    } else {
      this.snackBar.open('Please correct the errors in the form', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
}
