import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Kategori8x2Component } from './kategori8x2.component';

describe('Kategori8x2Component', () => {
  let component: Kategori8x2Component;
  let fixture: ComponentFixture<Kategori8x2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Kategori8x2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Kategori8x2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
