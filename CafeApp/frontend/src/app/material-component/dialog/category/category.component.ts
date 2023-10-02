import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryComponent>,
    private snackBarService: SnackbarService
  ) {}
  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]],
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name,
    };
    this.categoryService.add(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onAddCategory.emit();
        this.responseMessage = response?.message;
        this.snackBarService.openSnackbar(this.responseMessage, 'success');
      },
      (err) => {
        this.dialogRef.close();
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }

        this.snackBarService.openSnackbar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }

  edit() {
    var formData = this.categoryForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
    };
    this.categoryService.update(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onEditCategory.emit();
        this.responseMessage = response?.message;
        this.snackBarService.openSnackbar(this.responseMessage, 'success');
      },
      (err) => {
        this.dialogRef.close();
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }

        this.snackBarService.openSnackbar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }
}
