import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LastikDialogComponent } from '../lazy-lastik-bakim-page/components/lastik-bakim/lastik-dialog/lastik-dialog.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { KopyalaComponent } from '../lazy-arac-bakim-page/components/arac-bakim/lastik-dialog/kopyala/kopyala.component';
import { LastikBilgisiComponent } from '../lazy-arac-bakim-page/components/arac-bakim/lastik-dialog/lastik-bilgisi/lastik-bilgisi.component';
import { NgxMaskModule } from 'ngx-mask';
import { LBOlcumleComponent } from '../lazy-lastik-bakim-page/components/lastik-bakim/lastik-dialog/l-b-olcumle/l-b-olcumle.component';
import { GozlemleComponent } from '../lazy-arac-bakim-page/components/arac-bakim/lastik-dialog/gozlemle/gozlemle.component';

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: HomePageComponent },
    ]),
    NgxSmartModalModule.forRoot(),
    NgxMaskModule.forRoot()
  ],
  entryComponents: [LastikDialogComponent,LBOlcumleComponent,GozlemleComponent,KopyalaComponent,LastikBilgisiComponent]
})
export class LazyHomePageModule { }
