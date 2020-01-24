import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Kategori4x2Component } from './kategori4x2/kategori4x2.component';
import { Kategori6x2Component } from './kategori6x2/kategori6x2.component';
import { Kategori6x4Component } from './kategori6x4/kategori6x4.component';
import { Kategori8x2Component } from './kategori8x2/kategori8x2.component';
import { Kategori8x4Component } from './kategori8x4/kategori8x4.component';
import { Kategori6treylerComponent } from './kategori6treyler/kategori6treyler.component';
import { Kategori12treylerComponent } from './kategori12treyler/kategori12treyler.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { LastikDialogComponent } from './lastik-dialog/lastik-dialog.component';
import { OlcumleComponent } from './lastik-dialog/olcumle/olcumle.component';
import { GozlemleComponent } from './lastik-dialog/gozlemle/gozlemle.component';
import { KopyalaComponent } from './lastik-dialog/kopyala/kopyala.component';
import { LastikBilgisiComponent } from './lastik-dialog/lastik-bilgisi/lastik-bilgisi.component';
import { NgxMaskModule } from 'ngx-mask';
import { AracKayitComponent } from './lastik-dialog/arac-kayit/arac-kayit.component';
import { AKOlcumleComponent } from './lastik-dialog/arac-kayit/a-k-olcumle/a-k-olcumle.component';
import { AracBilgiComponent } from './arac-dialog/arac-bilgi/arac-bilgi.component';
import { NgSelect2Module } from 'ng-select2';
import { BosLastikEkleComponent } from './lastik-dialog/bos-lastik-ekle/bos-lastik-ekle.component';

@NgModule({
  declarations: [LastikDialogComponent, OlcumleComponent, GozlemleComponent, KopyalaComponent, LastikBilgisiComponent, AracKayitComponent, AKOlcumleComponent, AracBilgiComponent, BosLastikEkleComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    NgSelect2Module,
    RouterModule.forChild([
      { path: "arac/:aracId", loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
      { path: "arac/4x2/:aracId", loadChildren: () => import('./kategori4x2/kategori4x2.module').then(m => m.Kategori4x2Module) },
      { path: "arac/6x2/:aracId", loadChildren: () => import('./kategori6x2/kategori6x2.module').then(m => m.Kategori6x2Module) },
      { path: "arac/6x4/:aracId", loadChildren: () => import('./kategori6x4/kategori6x4.module').then(m => m.Kategori6x4Module) },
      { path: "arac/8x2/:aracId", loadChildren: () => import('./kategori8x2/kategori8x2.module').then(m => m.Kategori8x2Module) },
      { path: "arac/8x4/:aracId", loadChildren: () => import('./kategori8x4/kategori8x4.module').then(m => m.Kategori8x4Module) },
      { path: "arac/6Treyler/:aracId", loadChildren: () => import('./kategori6treyler/kategori6treyler.module').then(m => m.Kategori6TreylerModule) },
      { path: "arac/12Treyler/:aracId", loadChildren: () => import('./kategori12treyler/kategori12treyler.module').then(m => m.Kategori12TreylerModule) }
    ]),
    NgxSmartModalModule.forChild(),
    NgxMaskModule.forChild()
  ],
  entryComponents: [LastikDialogComponent, OlcumleComponent, GozlemleComponent, KopyalaComponent, LastikBilgisiComponent, AracKayitComponent, AKOlcumleComponent,
    AracBilgiComponent,
    // boş lastiğe çift tıklanıldığında çalışır. Event içermez!
    BosLastikEkleComponent
    //
  ]
})
export class AracBakimModule { }
