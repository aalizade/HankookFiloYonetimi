import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Kategori8x4Component } from './kategori8x4.component';

describe('Kategori8x4Component', () => {
  let component: Kategori8x4Component;
  let fixture: ComponentFixture<Kategori8x4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Kategori8x4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Kategori8x4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
