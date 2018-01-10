import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

    constructor(public navCtrl: NavController, public viewCtrl: ViewController) { }

  dismiss() {
      this.viewCtrl.dismiss();
  }

  navigateToRegister(){
  	this.navCtrl.push(RegisterPage);
  }
}
