import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AracMarkaEkleComponent } from './arac-marka-ekle.component';

describe('AracMarkaEkleComponent', () => {
  let component: AracMarkaEkleComponent;
  let fixture: ComponentFixture<AracMarkaEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AracMarkaEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AracMarkaEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
