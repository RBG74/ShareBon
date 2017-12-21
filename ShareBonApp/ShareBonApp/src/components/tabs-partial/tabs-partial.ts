import { Component } from '@angular/core';

//pages
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';


@Component({
  selector: 'tabs-partial',
  templateUrl: 'tabs-partial.html'
})
export class TabsPartialComponent {

    tab1Root: any = HomePage;
    tab2Root: any = AboutPage;
    tab3Root: any = ContactPage

    constructor() {

  }

}
