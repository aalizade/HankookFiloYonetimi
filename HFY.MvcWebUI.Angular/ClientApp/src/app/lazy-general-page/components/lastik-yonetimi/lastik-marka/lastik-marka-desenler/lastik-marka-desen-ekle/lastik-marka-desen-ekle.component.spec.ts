import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikMarkaDesenEkleComponent } from './lastik-marka-desen-ekle.component';

describe('LastikMarkaDesenEkleComponent', () => {
  let component: LastikMarkaDesenEkleComponent;
  let fixture: ComponentFixture<LastikMarkaDesenEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikMarkaDesenEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikMarkaDesenEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
