import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikComponent } from './lastik.component';

describe('LastikComponent', () => {
  let component: LastikComponent;
  let fixture: ComponentFixture<LastikComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
