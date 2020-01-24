import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikMarkaGuncelleComponent } from './lastik-marka-guncelle.component';

describe('LastikMarkaGuncelleComponent', () => {
  let component: LastikMarkaGuncelleComponent;
  let fixture: ComponentFixture<LastikMarkaGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikMarkaGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikMarkaGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
