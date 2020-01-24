import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AracEkleComponent } from './arac-ekle.component';

describe('AracEkleComponent', () => {
  let component: AracEkleComponent;
  let fixture: ComponentFixture<AracEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AracEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AracEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
