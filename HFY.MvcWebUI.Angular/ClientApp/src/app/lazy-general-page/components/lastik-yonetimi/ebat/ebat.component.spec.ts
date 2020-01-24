import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbatComponent } from './ebat.component';

describe('EbatComponent', () => {
  let component: EbatComponent;
  let fixture: ComponentFixture<EbatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
