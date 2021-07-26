import { Component, OnInit } from '@angular/core';
import { TestimonailService } from '../../services/testimonial.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent implements OnInit {

  public clientTestimonials = [];

  constructor(public translate: TranslateService,private testimonial: TestimonailService) { 

  }

  ngOnInit() {
    this.getTestimonal();
  }

  getTestimonal(){
    let _this = this;
    this.testimonial.displayTestimonal().subscribe((res:any)=>{     
      this.clientTestimonials = [];
      console.log(res.testimonials);
      /* this.clientTestimonials.push() */
      res.testimonials.forEach(function (element, index) {
        
        //console.log(element);
        //console.log('Testimonials.Testimonials'+element.id);
        
        var body = {
          'id':element.id,
          'clientName':element.clientName,
          'clientDesignation':element.clientDesignation,
          'description':element.description,
          'icon':element.icon
        }

        _this.translate.get('Testimonials.Testimonials'+element.id).subscribe( (text: string) => {
          //console.log(text);
          body.description = text;
         
        });
        
        console.log(body);
        _this.clientTestimonials.push(body);
      });

      console.log(this.clientTestimonials);
    });
  }
  
  showMessageFromChild(message: any) {
    console.log(message);
    this.getTestimonal();
    /* this.translate.get('Sign Out.Credit Card Confirmation').subscribe( (text: string) => {
      //console.log(text);
      this.CreditCardConfirmation = text;
      //console.log(text);
    }); */
  }

}
