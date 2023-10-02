import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss'],
})
export class ManageCategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'edit'];
  dataSource: any;
  responseMessage: any;

  constructor(
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private router: Router,
    private snacbarService: SnackbarService
  ) {}
  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.categoryService.getCategory().subscribe(
      (response: any) => {
        console.log('response:', response);
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
      },
      (err) => {
        this.ngxService.stop();
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
          this.snacbarService.openSnackbar(
            this.responseMessage,
            GlobalConstants.error
          );
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    (dialogConfig.data = {
      action: 'Add',
    }),
      (dialogConfig.width = '550px');
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe(
      (response) => {
        this.tableData();
      }
    );
  }

  handleEditAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    (dialogConfig.data = {
      action: 'Edit',
      data: value,
    }),
      (dialogConfig.width = '550px');
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategory.subscribe(
      (response) => {
        this.tableData();
      }
    );
  }
}
