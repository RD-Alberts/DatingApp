import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  //input property is for parent to child
  //output property is for child to parent
 @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup({});
  errorText: string | undefined;
  errorState: boolean | undefined;
  counter: number =0;

  constructor(private accountService: AccountService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    this.counter = 1500;
  }

  initializeForm() {
    this.registerForm =  this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatchiing: true}
    }
  }

  register(){
    this.accountService.register(this.registerForm.value).subscribe({
      next: _response =>{
        this.router.navigateByUrl('/members');
      },
      error: error => {
        let interval = setInterval(() => {
          this.counter = this.counter - 1;
          this.errorState = true;
          this.errorText = error.error;
          console.log(this.counter)
          if(this.counter == 0){
            this.errorState = false;
            this.errorText = "";
            clearInterval(interval);
            this.counter = 1500;
          };
        });
      }
    });
  }
}