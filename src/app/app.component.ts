import { Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

export interface UserData {
  cap24hrChange: number;
  long: string;
  mktcap: number;
  perc: number;
  price: number;
  shapeshift: number;
  short: number;
  supply: number;
  usdVolume: number;
  volume: number;
  vwapData: number;
  vwapDataBTC: number;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit {
  displayedColumns: string[] = ['long', 'mktcap', 'price', 'vwapData', 'supply', 'volume', 'perc', 'shapeshift'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private socket: Socket, private http: HttpClient) { }
  ngOnInit() {
    this.http.get('https://coincap.io/front').subscribe((res) => {
      console.log(res);
      this.dataSource = new MatTableDataSource(Object.values(res));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    });
    this.socket.on('trades', (update) => {
      // console.log(update['msg']);
      this.updates(update['msg']['long'], update['msg']);
    });

  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  trades(value) {
    if (value) {
      return 'Buy/Sell';
    } else {
      return '-';
    }
  }
  updates(name, data) {
    if (name) {
      for (let i = 0; i < Object.keys(this.dataSource['data']).length; i++) {
        if (name === this.dataSource.data[i]['long']) {
          this.dataSource['data'][i]['cap24hrChange'] = data.cap24hrChange;
          this.dataSource['data'][i]['long'] = data.long;
          this.dataSource['data'][i]['mktcap'] = data.mktcap;
          this.dataSource['data'][i]['perc'] = data.perc;
          this.dataSource['data'][i]['price'] = data.price;
          this.dataSource['data'][i]['shapeshift'] = data.shapeshift;
          this.dataSource['data'][i]['short'] = data.short;
          this.dataSource['data'][i]['supply'] = data.supply;
          this.dataSource['data'][i]['usdVolume'] = data.usdVolume;
          this.dataSource['data'][i]['volume'] = data.volume;
          this.dataSource['data'][i]['vwapData'] = data.vwapData;
          this.dataSource['data'][i]['vwapDataBTC'] = data.vwapDataBTC;
          console.log('Update in' , name );
        }
      }
    }
  }
}
