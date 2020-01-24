import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GozlemleComponent } from './gozlemle.component';

describe('GozlemleComponent', () => {
  let component: GozlemleComponent;
  let fixture: ComponentFixture<GozlemleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GozlemleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GozlemleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
