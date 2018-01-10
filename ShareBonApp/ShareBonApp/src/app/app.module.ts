import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';


//Boot
import { MyApp } from './app.component';

//Pages
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

//Partials
import { TabsPartialComponent } from '../components/tabs-partial/tabs-partial';
import { HeaderPartialComponent } from '../components/header-partial/header-partial';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    RegisterPage,
    HeaderPartialComponent
  ],
  imports: [
       IonicModule.forRoot(MyApp, {tabsHideOnSubPages: true })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    RegisterPage,
    HeaderPartialComponent
  ],
  providers: [
      { provide: ErrorHandler, useClass: IonicErrorHandler },
      StatusBar
  ]
})
export class AppModule {}
