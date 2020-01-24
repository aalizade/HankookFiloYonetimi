import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikMarkaDesenlerComponent } from './lastik-marka-desenler.component';

describe('LastikMarkaDesenlerComponent', () => {
  let component: LastikMarkaDesenlerComponent;
  let fixture: ComponentFixture<LastikMarkaDesenlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikMarkaDesenlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikMarkaDesenlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
