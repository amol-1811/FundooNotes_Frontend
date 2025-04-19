import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  hidePassword = true;
  selectedLanguage = 'en-US';

  constructor(private fb:  FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  onLogin(): void {
    if(this.loginForm.valid) {
      const loginData = this.loginForm.value;
      console.log('Login Data:', loginData);
    }
  }
}
