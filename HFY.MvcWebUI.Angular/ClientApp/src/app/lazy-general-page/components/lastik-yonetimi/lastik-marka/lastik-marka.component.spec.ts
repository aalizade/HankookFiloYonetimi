import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikMarkaComponent } from './lastik-marka.component';

describe('LastikMarkaComponent', () => {
  let component: LastikMarkaComponent;
  let fixture: ComponentFixture<LastikMarkaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikMarkaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikMarkaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
