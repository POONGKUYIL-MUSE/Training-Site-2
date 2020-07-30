import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatTable } from '@angular/material/table';

export interface OrderElement {
  id: number;
  product_name: string;
  product_amount: string;
  product_quantity: string;
  order_totalamount: number;
  ordered_on: string;
  useremail: string;
}

const ORDER_DATA: OrderElement[] = []

@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperadminComponent implements OnInit {
  @ViewChild(MatTable, {static: true}) table: MatTable<any>

  displayedColumns: string[] = ['useremail','product_name', 'product_amount', 'product_quantity', 'order_totalamount', 'ordered_on']
  dataSource = new MatTableDataSource<OrderElement>(ORDER_DATA)

  constructor(private auth: AuthService,
    private router: Router) {
      this.dataSource = new MatTableDataSource<OrderElement>(ORDER_DATA)
      this.getAllOrders()
    }
  ngOnInit(): void {
  }

  getAllOrders() {
    let cuser = localStorage.getItem('currentUser')
    this.auth.getAllOrders().subscribe(
      res => {
        this.dataSource = res
      },
      err => {
        if(err instanceof HttpErrorResponse) {
          if(err.status === 401) {
            this.router.navigate(['login'])
          }
        }
      }
    )
  }

}
