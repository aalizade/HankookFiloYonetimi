import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HurdaLastiklerComponent } from './hurda-lastikler.component';

describe('HurdaLastiklerComponent', () => {
  let component: HurdaLastiklerComponent;
  let fixture: ComponentFixture<HurdaLastiklerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HurdaLastiklerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HurdaLastiklerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
