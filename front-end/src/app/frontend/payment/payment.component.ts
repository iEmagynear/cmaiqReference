import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  StripeService,
  Elements,
  Element as StripeElement,
  ElementsOptions,
} from "ngx-stripe";
import { PaymentService } from "../../services/payment.service";
import Swal from "sweetalert2";
import { DashboardService } from "src/app/services/dashboard.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ChartService } from "../../services/chart.service";
import { CreditCardValidator } from "angular-cc-library";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
  providers: [PaymentService, DashboardService],
})
export class PaymentComponent implements OnInit {
  carddetails;
  carderror;
  showUpdate = false;
  form: FormGroup;
  submitted: boolean = false;
  ccmask: any[] = [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  expmask: any[] = [/\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
  plan;
  elements: Elements;
  card: StripeElement;
  loader = false;
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: "en",
  };
  plantext;
  stripeTest: FormGroup;
  plans = [];
  cardVals = false;
  selectedPlan = false;
  cardValserror;
  selectplan;
  mls_array = [];
  nrSelect;
  mlsName;
  planName;
  subscription;
  planname: string;
  monthlyplan;
  yearlyplan;
  submit = false;
  CreditCardConfirmation;
  CreditCardConfirmationtext;
  PaymentSuccessful;
  Redirecting;
  CancelConfirmation;
  CancelConfirmationtext;
  CardDetailsupdatedsuccessfully;
  changeyourcarddetailsfor;
  per;
  for;

  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private paymentService: PaymentService,
    private dashboardapi: DashboardService,
    private router: Router,
    private chartService: ChartService
  ) {}

  ngOnInit() {
    console.log("This is the actual baseline");

    this.nrSelect = localStorage.getItem("f_mls");
    if (!this.nrSelect) {
      this.router.navigate(["/"]);
    }
    this.stripeTest = this.fb.group({
      name: [""],
      phone: [""],
      planname: ["", [Validators.required]],
    });

    this.stripeService.elements(this.elementsOptions).subscribe((elements) => {
      this.elements = elements;
      // Only mount the element the first time
      if (!this.card) {
        this.card = this.elements.create("card", {
          style: {
            base: {
              color: "#303238",
              fontSize: "16px",
              lineHeight: "24px",
              fontSmoothing: "antialiased",
              "::placeholder": {
                color: "#ccc",
              },
            },
            complete: {
              color: "#363",
            },
          },
        });
        this.card.mount("#card-element");
        let $this = this;
        this.card.on("change", function (event) {
          //console.log(event.error);
          //console.log(typeof(event.error))
          if (event.complete) {
            //console.log(event.error.code);
            $this.cardVals = true;
          } else {
            if (event.error) {
              $this.cardValserror = event.error.message;
            }
            $this.cardVals = false;
          }
        });
      }
    });

    this.loader = true;

    this.dashboardapi.get_mls_ids_member().subscribe(
      (dataResponse) => {
        this.mls_array = dataResponse.mls_id;
        this.mls_array.forEach((element) => {
          if (element.mls_id == this.nrSelect) {
            this.mlsName = element.mls_name;
            console.log(this.mlsName);
            this.loader = false;
          }
        });
      },
      (error) => {
        this.loader = false;
      }
    );

    this.create_customer();

    //this.getallplans('indiviual');

    this.form = this.fb.group({
      creditCard: ["", [<any>CreditCardValidator.validateCCNumber]],
      expirationDate: ["", [<any>CreditCardValidator.validateExpDate]],
      cvc: [
        "",
        [
          <any>Validators.required,
          <any>Validators.minLength(3),
          <any>Validators.maxLength(4),
        ],
      ],
    });
  }

  getallplans(plan) {
    //monthly_group_new
    //yearly_group_new

    this.plans = [];
    var monthlyyplan;
    var yearlyplan;
    if (plan == "group") {
      monthlyyplan = "monthly_group_new";
      yearlyplan = "yearly_group_new";
    } else {
      monthlyyplan = "monthly_new";
      yearlyplan = "yearly_new";
    }

    this.paymentService.retrievePlan(monthlyyplan).subscribe(
      (response) => {
        //this.Subs = response;
        //this.loader = false;
        this.monthlyplan = response;
        console.log(response);
        this.plans.push(response);

        this.paymentService.retrievePlan(yearlyplan).subscribe(
          (res) => {
            //this.Subs = response;
            console.log(res);
            this.yearlyplan = res;
            this.plans.push(res);
            this.loader = false;

            this.paymentService
              .create_customer({ f_mls: localStorage.getItem("f_mls") })
              .subscribe(
                (res) => {
                  this.chartService
                    .get_user_subscriptions({
                      f_mls: localStorage.getItem("f_mls"),
                    })
                    .subscribe(
                      (dataResponsesub) => {
                        console.log(dataResponsesub);
                        if (dataResponsesub.payments) {
                          this.subscription = dataResponsesub.payments;
                          this.getsubpayment();
                          let plan = dataResponsesub.payments.subscription_plan;
                          if (plan === "admin") {
                            this.planname = "Handled by Office";
                          } else if (
                            plan === "monthly_new" ||
                            plan === "monthly_group_new"
                          ) {
                            this.planname = "$" + this.monthlyplan.amount / 100;
                            //console.log(this.monthlyplan.amount);
                            //this.planname = "$29.95";
                          } else if (
                            plan === "yearly_new" ||
                            plan === "yearly_group_new"
                          ) {
                            //console.log(this.yearlyplan);
                            this.planname = "$" + this.yearlyplan.amount / 100;
                            //this.planname = "$339.45";
                          }

                          let plann =
                            dataResponsesub.payments.subscription_plan;

                          if (plann === "admin") {
                            this.planName = "cmaIQ Office Subscription";
                          } else if (
                            plann === "monthly_new" ||
                            plann === "monthly_group_new"
                          ) {
                            this.planName = "cmaIQ Monthly Subscription";
                          } else if (
                            plann === "yearly_new" ||
                            plann === "yearly_group_new"
                          ) {
                            this.planName = "cmaIQ Yearly Subscription";
                          } else if (plann === "free") {
                            this.planName = "cmaIQ Trial Subscription";
                          } else {
                            this.planName = "No Plan Active";
                          }

                          //this.planName = dataResponsesub.payments.subscription_plan;
                        } else {
                          this.planName = "No Plan Active";
                          //this.router.navigate(['/payment']);
                        }
                      },
                      (error) => {
                        console.log(error);
                      }
                    );

                  this.loader = false;
                },
                (error) => {
                  this.loader = false;
                  console.log(error);
                }
              );

            this.get_user_info();
            //console.log('Payment Done')
          },
          (err) => {
            this.loader = false;
            console.log(err);
          }
        );
        //console.log('Payment Done')
      },
      (error) => {
        this.loader = false;
        console.log(error);
      }
    );
  }

  get f() {
    return this.form.controls;
  }

  create_customer() {
    this.chartService.get_user_info().subscribe(
      (dataResponse) => {
        //console.log(dataResponse);

        for (let index = 0; index < dataResponse.data.roles.length; index++) {
          const item = dataResponse.data.roles[index];

          if (item.role == "member") {
            for (let index = 0; index < item.association.length; index++) {
              const item1 = item.association[index];

              if (item1.mls_id == localStorage.getItem("f_mls")) {
                //console.log(item1);

                if (item1.payer_type_online != null) {
                  if (
                    item1.payer_type_online != "" &&
                    item1.payer_type_online.toLowerCase() != "offline" &&
                    item1.payer_type_online.toLowerCase() != "false"
                  ) {
                    if (item1.payer_type_online.toLowerCase() == "group") {
                      this.getallplans("group");
                    } else {
                      this.getallplans("indiviual");
                    }
                  } else {
                    this.planname = "Handled by Office";
                    this.planName = "cmaIQ Office Subscription";
                    //console.log(this.planName);
                    //this.router.navigate(['/new-chart']);
                  }
                } else {
                  this.planname = "Handled by Office";
                  this.planName = "cmaIQ Office Subscription";
                  //console.log(this.planName);
                  //this.router.navigate(['/new-chart']);
                }
              }
            }
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  changePlan(plan) {
    console.log(plan);
    this.selectplan = plan;
    this.selectedPlan = true;
    this.plantext = "$" + plan.amount / 100 + " / " + plan.interval;
    this.translate
      .get("Sign Out." + this.selectplan.interval)
      .subscribe((text: string) => {
        //console.log(text);
        this.plan = text;
        //console.log(text);
      });
  }

  showMessageFromChild(message: any) {
    //console.log(message);

    this.translate
      .get("Sign Out.Credit Card Confirmation")
      .subscribe((text: string) => {
        //console.log(text);
        this.CreditCardConfirmation = text;
        //console.log(text);
      });

    this.translate
      .get("Sign Out.Credit Card Confirmationtext")
      .subscribe((text: string) => {
        //console.log(text);
        this.CreditCardConfirmationtext = text;
        //console.log(text);
      });

    this.translate
      .get("Sign Out.Payment Successful")
      .subscribe((text: string) => {
        //console.log(text);
        this.PaymentSuccessful = text;
        //console.log(text);
      });

    this.translate.get("Sign Out.Redirecting").subscribe((text: string) => {
      //console.log(text);
      this.Redirecting = text;
      //console.log(text);
    });

    this.translate
      .get("Sign Out.Cancel Confirmation")
      .subscribe((text: string) => {
        //console.log(text);
        this.CancelConfirmation = text;
        //console.log(text);
      });

    this.translate
      .get("Sign Out.Cancel Confirmationtext")
      .subscribe((text: string) => {
        //console.log(text);
        this.CancelConfirmationtext = text;
        //console.log(text);
      });

    this.translate
      .get("Sign Out.Card Details updated successfully")
      .subscribe((text: string) => {
        //console.log(text);
        this.CardDetailsupdatedsuccessfully = text;
        //console.log(text);
      });

    this.translate
      .get("Sign Out.change your card details for")
      .subscribe((text: string) => {
        //console.log(text);
        this.changeyourcarddetailsfor = text;
        //console.log(text);
      });

    this.translate.get("Sign Out.per").subscribe((text: string) => {
      //console.log(text);
      this.per = text;
      //console.log(text);
    });

    this.translate.get("Sign Out.for").subscribe((text: string) => {
      //console.log(text);
      this.for = text;
      //console.log(text);
    });

    if (this.selectplan) {
      this.translate
        .get("Sign Out." + this.selectplan.interval)
        .subscribe((text: string) => {
          //console.log(text);
          this.plan = text;
          //console.log(text);
        });
    }
  }

  paymanetFormSub() {
    const name = this.stripeTest.get("name").value;
    //console.log(name);
    //this.cardVals = true;
    this.loader = true;
    this.stripeService.createToken(this.card, { name }).subscribe((obj) => {
      //console.log(obj);
      if (!obj.error) {
        this.loader = false;
        //console.log("Token is --> ",obj.token.id);
        this.cardVals = true;

        Swal.fire({
          title: this.CreditCardConfirmation,
          html:
            "<h6>" +
            this.CreditCardConfirmationtext +
            " $" +
            this.selectplan.amount / 100 +
            " " +
            this.per +
            " " +
            this.plan +
            " " +
            this.for +
            " " +
            this.mlsName +
            "?</h6>",
          //type: 'info',
          width: "42em",
          showCancelButton: true,
          cancelButtonText: "CANCEL",
          confirmButtonText: "CONFIRM",
        }).then((result) => {
          //console.log(result);
          if (result.value) {
            this.loader = true;
            var subParams = {
              selected_mls: localStorage.getItem("f_mls"),
              source: obj.token.id,
              plan: this.selectplan.id,
            };

            this.paymentService.charge(subParams).subscribe(
              (response) => {
                //this.Subs = response;

                Swal.fire({
                  title: this.PaymentSuccessful,
                  type: "success",
                  html: this.Redirecting + ".....",
                  timer: 3000,
                }).then((result) => {
                  //console.log(result);
                  if (result) {
                    //console.log('I was closed by the timer');
                    this.router.navigate(["/new-chart"]);
                  }
                });

                //console.log("The response from server is ",response);
                //console.log('Payment Done');
                this.loader = false;
              },
              (error) => {
                this.loader = false;
                this.cardVals = false;
                console.log("The error is ", error);
              }
            );
          }
        });
      } else {
        this.loader = false;
        console.log(obj.error);
        this.cardVals = false;
        this.cardValserror = obj.error.message;
        // Error creating the token
        console.log("Error comes ");
      }
    });
  }

  get_user_info() {
    this.chartService
      .get_user_subscriptions({ f_mls: localStorage.getItem("f_mls") })
      .subscribe(
        (dataResponsesub) => {
          console.log(dataResponsesub);
          if (dataResponsesub.payments) {
            this.subscription = dataResponsesub.payments;

            let plan = dataResponsesub.payments.subscription_plan;

            if (plan === "admin") {
              this.planname = "Handled by Office";
            } else if (plan === "monthly_new" || plan === "monthly_group_new") {
              this.planname = "$" + this.monthlyplan.amount / 100;
              //console.log(this.monthlyplan.amount);
              //this.planname = "$29.95";
            } else if (plan === "yearly_new" || plan === "yearly_group_new") {
              //console.log(this.yearlyplan);
              this.planname = "$" + this.yearlyplan.amount / 100;
              //this.planname = "$339.45";
            }

            let plann = dataResponsesub.payments.subscription_plan;
            if (plann === "admin") {
              this.planName = "cmaIQ Office Subscription";
            } else if (
              plann === "monthly_new" ||
              plann === "monthly_group_new"
            ) {
              this.planName = "cmaIQ Monthly Subscription";
            } else if (plann === "yearly_new" || plann === "yearly_group_new") {
              this.planName = "cmaIQ Yearly Subscription";
            } else if (plann === "free") {
              this.planName = "cmaIQ Trial Subscription";
            } else {
              this.planName = "No Plan Active";
            }

            //this.planName = dataResponsesub.payments.subscription_plan;
          } else {
            //this.planName = "No Plan Active";
            //this.router.navigate(['/payment']);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  openConfirmCancelModalOffline() {
    Swal.fire({
      title: this.CancelConfirmation,
      html:
        "<h6>" + this.CancelConfirmationtext + " " + this.mlsName + "?</h6>",
      //type: 'info',
      width: "42em",
      showCancelButton: true,
      cancelButtonText: "GO BACK",
      confirmButtonText: "CONFIRM",
    }).then((result) => {
      //console.log(result);
      if (result.value) {
        //console.log(this.subscription.subscription_id);
        //un_subscribe

        this.paymentService
          .cancel_subscription_offlne(localStorage.getItem("f_mls"))
          .subscribe(
            (dataResponsesub) => {
              //console.log(dataResponsesub);
              this.router.navigate(["/new-chart"]);
            },
            (error) => {
              console.log(error);
            }
          );
      }
    });
  }

  openConfirmCancelModal() {
    Swal.fire({
      title: this.CancelConfirmation,
      html:
        "<h6>" + this.CancelConfirmationtext + " " + this.mlsName + "?</h6>",
      //type: 'info',
      width: "42em",
      showCancelButton: true,
      cancelButtonText: "GO BACK",
      confirmButtonText: "CONFIRM",
    }).then((result) => {
      //console.log(result);
      if (result.value) {
        //console.log(this.subscription.subscription_id);
        //un_subscribe
        this.paymentService
          .cancel_subscription(this.subscription.subscription_id)
          .subscribe(
            (dataResponsesub) => {
              //console.log(dataResponsesub);
              this.router.navigate(["/new-chart"]);
            },
            (error) => {
              console.log(error);
            }
          );
      }
    });
  }

  changePaymentDetails() {
    this.showUpdate = true;
  }

  onSubmit() {
    this.submit = true;
    //console.log(this.addProperty.controls.square_footage.errors);
    if (this.form.invalid) {
      return;
    }

    this.carderror = "";
    Swal.fire({
      title: this.CancelConfirmation,
      html:
        "<h6>" + this.changeyourcarddetailsfor + " " + this.mlsName + "?</h6>",
      //type: 'info',
      width: "42em",
      showCancelButton: true,
      cancelButtonText: "GO BACK",
      confirmButtonText: "CONFIRM",
    }).then((result) => {
      //console.log(result);
      if (result.value) {
        this.loader = true;
        this.submitted = true;
        //console.log(this.subscription.subscription_id);

        let body = {
          creditCard: this.form.controls.creditCard.value.replace(/\s+/g, ""),
          expirationDate: this.form.controls.expirationDate.value,
          cvc: this.form.controls.cvc.value,
          subscription_id: this.subscription.subscription_id,
        };
        //console.log(body);
        //return false;
        this.paymentService.update_payment_details(body).subscribe(
          (dataResponsesub) => {
            this.loader = false;
            //console.log(dataResponsesub);
            Swal.fire({
              title: this.CardDetailsupdatedsuccessfully,
              type: "success",
              html: this.Redirecting + ".....",
              timer: 3000,
            }).then((result) => {
              //console.log(result);
              if (result) {
                //console.log('I was closed by the timer');
                this.router.navigate(["/new-chart"]);
              }
            });
            //this.router.navigate(['/new-chart']);
          },
          (error) => {
            this.loader = false;
            console.log(error);
            this.carderror = error;
          }
        );
      }
    });
  }

  getsubpayment() {
    this.loader = true;
    this.paymentService
      .get_sub_payment(this.subscription.subscription_id)
      .subscribe(
        (dataResponsesub) => {
          if (dataResponsesub.last4) {
            this.carddetails = dataResponsesub;
            //console.log(this.carddetails);
          }
          this.loader = false;
        },
        (error) => {
          this.loader = false;
          console.log(error);
          this.carderror = error;
        }
      );
  }

  revertBack() {
    this.showUpdate = false;
  }
}
