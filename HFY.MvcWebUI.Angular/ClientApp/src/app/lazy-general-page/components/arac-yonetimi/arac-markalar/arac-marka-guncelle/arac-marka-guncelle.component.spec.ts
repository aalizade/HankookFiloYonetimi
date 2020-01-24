import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AracMarkaGuncelleComponent } from './arac-marka-guncelle.component';

describe('AracMarkaGuncelleComponent', () => {
  let component: AracMarkaGuncelleComponent;
  let fixture: ComponentFixture<AracMarkaGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AracMarkaGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AracMarkaGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
