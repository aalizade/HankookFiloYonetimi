import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikMarkaEkleComponent } from './lastik-marka-ekle.component';

describe('LastikMarkaEkleComponent', () => {
  let component: LastikMarkaEkleComponent;
  let fixture: ComponentFixture<LastikMarkaEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikMarkaEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikMarkaEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
