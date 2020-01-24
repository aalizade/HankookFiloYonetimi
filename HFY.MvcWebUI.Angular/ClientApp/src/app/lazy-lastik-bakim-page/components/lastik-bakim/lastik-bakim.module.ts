import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgxMaskModule } from 'ngx-mask';
import { LastikDialogComponent } from './lastik-dialog/lastik-dialog.component';
import { LBOlcumleComponent } from './lastik-dialog/l-b-olcumle/l-b-olcumle.component';

@NgModule({
  declarations: [HomeComponent, LastikDialogComponent, LBOlcumleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: "dialog", component: LastikDialogComponent },
    ]),
    NgxSmartModalModule.forChild(),
    NgxMaskModule.forChild()
  ]
})
export class LastikBakimModule { }
