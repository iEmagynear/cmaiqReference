
import { Pipe, PipeTransform } from '@angular/core';

import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'convert'
})
export class ConvertPipe implements PipeTransform {
  transform(value: any, currency?: any, decimal?: any): any {
    let currencyPipe: CurrencyPipe = new CurrencyPipe('en-US');
    let usd:any = localStorage.getItem(currency);
    //console.log(value);
    if(!usd){
    usd = 1;
    }
    return currencyPipe.transform(value*usd, currency, 'symbol', decimal);
  }

}
