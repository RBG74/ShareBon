import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController, ModalController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;  

  constructor(public platform: Platform, private modalCtrl: ModalController) {
      this.initializeApp();
    //  this.showLoginModal();
    this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'About', component: AboutPage },
        { title: 'Contact', component: ContactPage },
    ];
  }
  initializeApp() {
      this.platform.ready().then(() => {
          StatusBar.hide();
          Splashscreen.hide();
      });
      
  }

  showLoginModal() {
      let modal = this.modalCtrl.create(LoginPage);
      modal.present();
  }



  openPage(page) {
      this.nav.setRoot(page.component);
  }

  navigateToHome() {
      this.nav.setRoot(HomePage);
  }

}
