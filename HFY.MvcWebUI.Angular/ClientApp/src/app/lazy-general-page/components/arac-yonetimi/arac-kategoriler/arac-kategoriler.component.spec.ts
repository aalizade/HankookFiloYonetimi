import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AracKategorilerComponent } from './arac-kategoriler.component';

describe('AracKategorilerComponent', () => {
  let component: AracKategorilerComponent;
  let fixture: ComponentFixture<AracKategorilerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AracKategorilerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AracKategorilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
