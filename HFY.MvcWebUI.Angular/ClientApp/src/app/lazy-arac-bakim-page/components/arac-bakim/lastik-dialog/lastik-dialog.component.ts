import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { OlcumleComponent } from './olcumle/olcumle.component';
import { GozlemleComponent } from './gozlemle/gozlemle.component';
import { KopyalaComponent } from './kopyala/kopyala.component';
import { LastikBilgisiComponent } from './lastik-bilgisi/lastik-bilgisi.component';

@Component({
  selector: 'app-lastik-dialog',
  templateUrl: './lastik-dialog.component.html',
  styleUrls: ['./lastik-dialog.component.css']
})
export class LastikDialogComponent implements AfterViewInit {

  @Input() aracId: number;
  @Input() lastikId: number;
  @Input() aksNumarasi: number;
  @Input() lastikPozisyonId: number;
  @Input() aracKilometre: number;
  
  @ViewChild('OlcumleContainer', { read: ViewContainerRef, static: false }) olcumleContainer: ViewContainerRef;
  @ViewChild('GozlemleContainer', { read: ViewContainerRef, static: false }) gozlemleContainer: ViewContainerRef;
  @ViewChild('KopyalaContainer', { read: ViewContainerRef, static: false }) kopyalaContainer: ViewContainerRef;
  @ViewChild('LastikBilgisiContainer', { read: ViewContainerRef, static: false }) lastikBilgisiContainer: ViewContainerRef;

  constructor(public ngxSmartModalService: NgxSmartModalService,private componentFactoryResolver: ComponentFactoryResolver) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ngxSmartModalService.getModal('lastikIslemleri').open();
    });
  }

  olcumleOpen() {
    this.olcumleContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(OlcumleComponent);
    const componentRef = this.olcumleContainer.createComponent(componentFactory);
    componentRef.instance.aracId = this.aracId;
    componentRef.instance.lastikId = this.lastikId;
    componentRef.instance.aksNumarasi = this.aksNumarasi;
    componentRef.instance.lastikPozisyonId = this.lastikPozisyonId;
    componentRef.instance.aracKilometre = this.aracKilometre;
    componentRef.instance.gozlemleMenusuAcildi.subscribe(gozlemleMenusuAcildi=> {
      // Eğer gözlemle menüsü açıldığını bilirsek, lastikIslemleri modelini kapatıyoruz.
      if(gozlemleMenusuAcildi) this.ngxSmartModalService.getModal('lastikIslemleri').close();
    })
  }

  gozlemleOpen() {
    this.gozlemleContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(GozlemleComponent);
    const componentRef = this.gozlemleContainer.createComponent(componentFactory);
    componentRef.instance.aracId = this.aracId;
    componentRef.instance.lastikId = this.lastikId;
    componentRef.instance.lastikPozisyonId = this.lastikPozisyonId;
    componentRef.instance.aracKilometre = this.aracKilometre;
  }

  kopyalaOpen() {
    this.kopyalaContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(KopyalaComponent);
    const componentRef = this.kopyalaContainer.createComponent(componentFactory);
    componentRef.instance.lastikId = this.lastikId;
  }

  lastikBilgisiOpen() {
    this.ngxSmartModalService.getModal('lastikIslemleri').close();
    this.lastikBilgisiContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LastikBilgisiComponent);
    const componentRef = this.lastikBilgisiContainer.createComponent(componentFactory);
    componentRef.instance.lastikId = this.lastikId;
    componentRef.instance.aracId = this.aracId;
  }

}
