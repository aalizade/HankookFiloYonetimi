import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikTurGuncelleComponent } from './lastik-tur-guncelle.component';

describe('LastikTurGuncelleComponent', () => {
  let component: LastikTurGuncelleComponent;
  let fixture: ComponentFixture<LastikTurGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikTurGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikTurGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
