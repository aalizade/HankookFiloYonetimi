import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AksDuzenlerComponent } from './aks-duzenler.component';

describe('AksDuzenlerComponent', () => {
  let component: AksDuzenlerComponent;
  let fixture: ComponentFixture<AksDuzenlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AksDuzenlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AksDuzenlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
