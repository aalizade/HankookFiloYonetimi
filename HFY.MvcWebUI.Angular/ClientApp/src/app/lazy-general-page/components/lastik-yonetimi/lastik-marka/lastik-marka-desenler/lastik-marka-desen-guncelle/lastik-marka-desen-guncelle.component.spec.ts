import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikMarkaDesenGuncelleComponent } from './lastik-marka-desen-guncelle.component';

describe('LastikMarkaDesenGuncelleComponent', () => {
  let component: LastikMarkaDesenGuncelleComponent;
  let fixture: ComponentFixture<LastikMarkaDesenGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikMarkaDesenGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikMarkaDesenGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
