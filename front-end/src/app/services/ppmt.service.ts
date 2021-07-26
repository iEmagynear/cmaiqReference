import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PpmtService {

  constructor() { }

  PPMT(rate, per, nper, pv, fv, type) {
    if (per < 1 || (per >= nper + 1)) return null;
    var pmt = this.PMT(rate, nper, pv, fv, type);
    var ipmt = this.IPMT(rate, per, nper, pv, 0, 0);
    return pmt - ipmt;
  }

  PMT(ir, np, pv, fv, type) {
    /*
     * ir   - interest rate per month
     * np   - number of periods (months)
     * pv   - present value
     * fv   - future value
     * type - when the payments are due:
     *        0: end of the period, e.g. end of month (default)
     *        1: beginning of period
     */
    var pmt, pvif;

    fv || (fv = 0);
    type || (type = 0);

    if (ir === 0)
      return -(pv + fv) / np;

    pvif = Math.pow(1 + ir, np);
    pmt = - ir * pv * (pvif + fv) / (pvif - 1);

    if (type === 1)
      pmt /= (1 + ir);

    return pmt;
  }

  FV(rate, nper, pmt, pv, type) {
    var pow = Math.pow(1 + rate, nper),
      fv;
    if (rate) {
      fv = (pmt * (1 + rate * type) * (1 - pow) / rate) - pv * pow;
    } else {
      fv = -1 * (pv + pmt * nper);
    }
    return fv.toFixed(2);
  }

  IPMT(rate, period, periods, present, future, type) {
    // Credits: algorithm inspired by Apache OpenOffice

    // Initialize type
    var type = (typeof type === 'undefined') ? 0 : type;

    // Evaluate rate and periods (TODO: replace with secure expression evaluator)
    rate = eval(rate);
    periods = eval(periods);

    // Compute payment
    var payment = this.PMT(rate, periods, present, future, type);

    // Compute interest
    var interest;
    if (period === 1) {
      if (type === 1) {
        interest = 0;
      } else {
        interest = -present;
      }
    } else {
      if (type === 1) {
        interest = this.FV(rate, period - 2, payment, present, 1) - payment;
      } else {
        interest = this.FV(rate, period - 1, payment, present, 0);
      }
    }

    // Return interest
    return interest * rate;
  }

}
