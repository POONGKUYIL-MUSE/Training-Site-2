import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  @ViewChild(MatTable, {static: true}) table: MatTable<any>

  constructor(
    private router: Router,
    private auth: AuthService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllCustomers()
  }

  getAllCustomers() {
    this.auth.getAllCustomers().subscribe(
      res => {
        this.dataSource = res
      },
      err => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 401) {
            this.router.navigate(['/login'])
          }
        }
      }
    )
  }

  displayedColumns: string[] = ['id', 'name', 'email', 'mobile', 'added_on', 'action']
  dataSource = []

  openDialog(action, obj) {
    obj.action = action
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: obj
    })

    dialogRef.afterClosed().subscribe(result=>{
      if(result.event == 'Update'){
        this.updateRowData(result.data)
      }
      else if(result.event == 'Delete'){
        this.deleteRowData(result.data)
      }
      else if(result.event == 'Add') {
        this.addRowData(result.data)
      }
    })
  }

  addRowData(row_obj) {
    this.auth.addUser(row_obj.value).subscribe(
      res=>{
        this.getAllCustomers()
      },
      err => {
        console.log(err)
      }
    )
  }

  updateRowData(row_obj) {
    console.log(row_obj.value)
    console.log(row_obj.value.id)
    this.auth.editUser(row_obj.value, row_obj.value.id).subscribe(
      res => {
        this.getAllCustomers()
      },
      err => {
        console.log(err)
      }
    )
  }

  deleteRowData(row_obj) {
    this.auth.delUser(row_obj.value.id).subscribe(
      res => {
        this.getAllCustomers()
      },
      err => {
        console.log(err)
      }
    )
  }
  
}