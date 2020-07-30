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
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {

  @ViewChild(MatTable, {static: true}) table: MatTable<any>

  displayedColumns: string[] = ['product_name', 'product_amount', 'product_quantity', 'order_totalamount', 'ordered_on']
  dataSource = new MatTableDataSource<OrderElement>(ORDER_DATA)

  constructor(private auth: AuthService,
    private router: Router) {
      this.dataSource = new MatTableDataSource<OrderElement>(ORDER_DATA)
      this.getOrders()
    }
  ngOnInit(): void {
  }

  getOrders() {
    let cuser = localStorage.getItem('currentUser')
    this.auth.getOrder(cuser).subscribe(
      res => {
        this.dataSource = res
      },
      err => {
        console.log(err)
      }
    )
  }
}
