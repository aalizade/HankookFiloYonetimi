import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikMarkaDesenOzellikGuncelleComponent } from './lastik-marka-desen-ozellik-guncelle.component';

describe('LastikMarkaDesenOzellikGuncelleComponent', () => {
  let component: LastikMarkaDesenOzellikGuncelleComponent;
  let fixture: ComponentFixture<LastikMarkaDesenOzellikGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikMarkaDesenOzellikGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikMarkaDesenOzellikGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
