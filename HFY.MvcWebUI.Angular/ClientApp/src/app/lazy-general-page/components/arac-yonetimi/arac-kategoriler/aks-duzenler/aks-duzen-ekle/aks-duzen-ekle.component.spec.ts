import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AksDuzenEkleComponent } from './aks-duzen-ekle.component';

describe('AksDuzenEkleComponent', () => {
  let component: AksDuzenEkleComponent;
  let fixture: ComponentFixture<AksDuzenEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AksDuzenEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AksDuzenEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
