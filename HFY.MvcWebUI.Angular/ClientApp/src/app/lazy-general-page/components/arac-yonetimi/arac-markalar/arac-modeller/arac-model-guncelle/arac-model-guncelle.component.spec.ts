import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AracModelGuncelleComponent } from './arac-model-guncelle.component';

describe('AracModelGuncelleComponent', () => {
  let component: AracModelGuncelleComponent;
  let fixture: ComponentFixture<AracModelGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AracModelGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AracModelGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
