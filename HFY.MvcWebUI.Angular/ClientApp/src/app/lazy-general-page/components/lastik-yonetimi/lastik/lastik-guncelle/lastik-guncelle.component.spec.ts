import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikGuncelleComponent } from './lastik-guncelle.component';

describe('LastikGuncelleComponent', () => {
  let component: LastikGuncelleComponent;
  let fixture: ComponentFixture<LastikGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
