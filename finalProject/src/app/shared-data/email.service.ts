import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  sendEmail(header: string, send_to: string, message: string, from: string): void {
    
    emailjs.init('mjEPWXWEBCOevc-1e');
    
    var templateParams = {
      hello: header,
      from_name: from,
      notes: message,
      destination: send_to
    };
  
    emailjs.send('service_d07jmnw', 'template_jwn8dbv', templateParams)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
      }, function(error) {
        console.log('FAILED...', error);
      });
  }

  sendLongEmail(header: string, send_to: string, l1: string, l2: string, l3: string,
                l4: string, l5: string, l6: string, l7: string, l8: string, l9: string, from: string): void {
    
    emailjs.init('mjEPWXWEBCOevc-1e');
    
    var templateParams = {
      hello: header,
      from_name: from,
      line1: l1,
      line2: l2,
      line3: l3,
      line4: l4,
      line5: l5,
      line6: l6,
      line7: l7,
      line8: l8,
      line9: l9,
      destination: send_to
    };
  
    emailjs.send('service_d07jmnw', 'template_wl67d5b', templateParams)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
      }, function(error) {
        console.log('FAILED...', error);
      });
  }

}
