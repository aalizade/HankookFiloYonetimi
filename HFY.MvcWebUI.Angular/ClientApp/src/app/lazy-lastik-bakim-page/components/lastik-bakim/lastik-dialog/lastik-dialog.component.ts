import { Component, ViewEncapsulation, Input, AfterViewInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { KopyalaComponent } from 'src/app/lazy-arac-bakim-page/components/arac-bakim/lastik-dialog/kopyala/kopyala.component';
import { LastikBilgisiComponent } from 'src/app/lazy-arac-bakim-page/components/arac-bakim/lastik-dialog/lastik-bilgisi/lastik-bilgisi.component';
import { LBOlcumleComponent } from './l-b-olcumle/l-b-olcumle.component';

declare var Swal:any;

@Component({
  selector: 'app-lastik-dialog',
  templateUrl: './lastik-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./lastik-dialog.component.css']
})
export class LastikDialogComponent implements AfterViewInit {

  @Input() lastikId: number;

  @ViewChild('OlcumleContainer', { read: ViewContainerRef, static: false }) olcumleContainer: ViewContainerRef;
  @ViewChild('GozlemleContainer', { read: ViewContainerRef, static: false }) gozlemleContainer: ViewContainerRef;
  @ViewChild('KopyalaContainer', { read: ViewContainerRef, static: false }) kopyalaContainer: ViewContainerRef;
  @ViewChild('LastikBilgisiContainer', { read: ViewContainerRef, static: false }) lastikBilgisiContainer: ViewContainerRef;
  
  constructor(public ngxSmartModalService: NgxSmartModalService,private componentFactoryResolver: ComponentFactoryResolver) { }

  ngAfterViewInit(){
    setTimeout(() => {
      this.ngxSmartModalService.getModal('lastikIslemleri').open();
    });
  }

  olcumleOpen(gelenTip:string){
    this.olcumleContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LBOlcumleComponent);
    const componentRef = this.olcumleContainer.createComponent(componentFactory);
    componentRef.instance.lastikId = this.lastikId;
    //
    componentRef.instance.gelenTip = gelenTip;
  }

  hurdayaGonderOpen(gelenTip:string){
    Swal.fire({
      title: 'Lastiği hurdaya göndermek istiyor musunuz?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet',
      cancelButtonText: "Hayır",
      preConfirm: (onay) => {
        if (onay) {
          this.olcumleOpen(gelenTip);
        }
      }
    })
  }

  kopyalaOpen(){
    this.kopyalaContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(KopyalaComponent);
    const componentRef = this.kopyalaContainer.createComponent(componentFactory);
    componentRef.instance.lastikId = this.lastikId;
  }

  lastikBilgisiOpen(){
    this.lastikBilgisiContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LastikBilgisiComponent);
    const componentRef = this.lastikBilgisiContainer.createComponent(componentFactory);
    componentRef.instance.lastikId = this.lastikId;
    componentRef.instance.aracId = 0;
  }

}
