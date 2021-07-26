import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minus'
})
export class MinusPipe implements PipeTransform {

  transform(num: number, args?: any): any {
    //console.log(num);
    //console.log( Math.abs(num) );
    return Math.abs(num);
  }

}
