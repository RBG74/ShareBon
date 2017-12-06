import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native'; 

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;  

  constructor(public platform: Platform) {
      this.initializeApp();
    this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'About', component: AboutPage },
        { title: 'Contact', component: ContactPage }
    ];
    
  }
  initializeApp() {
      this.platform.ready().then(() => {
          StatusBar.hide();
          Splashscreen.hide();
      });
      // let status bar overlay webview
      
  }

  openPage(page) {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      this.nav.setRoot(page.component);
  }

}
