import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AracBilgiComponent } from './arac-bilgi.component';

describe('AracBilgiComponent', () => {
  let component: AracBilgiComponent;
  let fixture: ComponentFixture<AracBilgiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AracBilgiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AracBilgiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
