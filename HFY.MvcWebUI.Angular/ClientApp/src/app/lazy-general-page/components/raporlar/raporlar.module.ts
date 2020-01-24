import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HurdaLastiklerComponent } from './hurda-lastikler/hurda-lastikler.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [HurdaLastiklerComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forChild(),
    RouterModule.forChild([
      { path: "hurda-lastikler", component: HurdaLastiklerComponent },
    ])
  ]
})
export class RaporlarModule { }
