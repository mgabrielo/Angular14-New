import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signUpForm: any = FormGroup;
  responseMsg: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) {}
  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      contactNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(GlobalConstants.contactNumberRegex),
        ],
      ],
      password: [null, [Validators.required]],
    });
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.signUpForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
    };
    console.log(data);
    this.userService.signup(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        console.log(response);
        this.responseMsg = response?.message;
        this.snackbarService.openSnackbar(this.responseMsg, '');
        this.router.navigate(['/']);
      },
      (err: any) => {
        this.ngxService.stop();
        if (err.error?.message) {
          console.log(err);
          this.responseMsg = err.error?.message;
        } else {
          this.responseMsg = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackbar(
          this.responseMsg,
          GlobalConstants.error
        );
      }
    );
  }
}
