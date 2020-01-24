import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AracModelEkleComponent } from './arac-model-ekle.component';

describe('AracModelEkleComponent', () => {
  let component: AracModelEkleComponent;
  let fixture: ComponentFixture<AracModelEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AracModelEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AracModelEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
