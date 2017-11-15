import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

//Boot
import { MyApp } from './app.component';

//Pages
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';

//Partials
import { TabsPartialComponent } from '../components/tabs-partial/tabs-partial';
import { HeaderPartialComponent } from '../components/header-partial/header-partial';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
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
    HeaderPartialComponent
  ],
  providers: [
      { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
