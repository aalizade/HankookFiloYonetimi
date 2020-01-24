import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbatGuncelleComponent } from './ebat-guncelle.component';

describe('EbatGuncelleComponent', () => {
  let component: EbatGuncelleComponent;
  let fixture: ComponentFixture<EbatGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbatGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbatGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
