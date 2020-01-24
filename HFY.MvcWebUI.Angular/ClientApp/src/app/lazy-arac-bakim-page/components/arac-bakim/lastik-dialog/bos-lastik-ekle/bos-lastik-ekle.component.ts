import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { AracBakimlar } from 'src/app/lazy-general-page/classes/arac-bakimlar/arac-bakimlar';

@Component({
  selector: 'app-bos-lastik-ekle',
  templateUrl: './bos-lastik-ekle.component.html',
  styleUrls: ['./bos-lastik-ekle.component.css']
})
export class BosLastikEkleComponent implements AfterViewInit {
  
  @Input() aracBakimlar: AracBakimlar;
  @Output() sonuc: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngAfterViewInit() {
    
  }

}
