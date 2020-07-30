import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  @ViewChild(MatTable, {static: true}) table: MatTable<any>

  constructor(
    private router: Router,
    private auth: AuthService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllProducts()
  }

  getAllProducts() {
    this.auth.getAllProducts().subscribe(
      res => {
        this.dataSource = res
      },
      err => {
        if(err instanceof HttpErrorResponse) {
          if(err.status === 401) {
            this.router.navigate(['/login'])
          }
        }
    })
  }

  displayedColumns: string[] = ['id', 'name', 'amount', 'description', 'added_by', 'action']
  dataSource = []

  openDialog(action, obj) {
    obj.action = action
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: obj
    })

    dialogRef.afterClosed().subscribe(result=>{
      if(result.event == 'AddProduct') {
        this.addRowData(result.data)
      }
      if(result.event == 'UpdateProduct') {
        this.updateRowData(result.data)
      }
      if(result.event == 'DeleteProduct') {
        this.deleteRowData(result.data)
      }
    })
  }

  addRowData(row_obj) {
    this.auth.addProduct(row_obj.value, row_obj.value.added_by).subscribe(
      res=>{
        this.getAllProducts()
      },
      err => {
        console.log(err)
      }
    )
  }

  updateRowData(row_obj) {
    this.auth.editProduct(row_obj.value, row_obj.value.id).subscribe(
      res => {
        this.getAllProducts()
      },
      err => {
        console.log(err)
      }
    )
  }

  deleteRowData(row_obj) {
    this.auth.delProduct(row_obj.value.id).subscribe(
      res => {
        this.getAllProducts()
      },
      err => {
        console.log(err)
      }
    )
  }
}
