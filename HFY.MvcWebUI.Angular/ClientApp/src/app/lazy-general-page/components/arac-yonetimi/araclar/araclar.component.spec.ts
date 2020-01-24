import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AraclarComponent } from './araclar.component';

describe('AraclarComponent', () => {
  let component: AraclarComponent;
  let fixture: ComponentFixture<AraclarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AraclarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AraclarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
