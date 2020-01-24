import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Kategori6x4Component } from './kategori6x4.component';

describe('Kategori6x4Component', () => {
  let component: Kategori6x4Component;
  let fixture: ComponentFixture<Kategori6x4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Kategori6x4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Kategori6x4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
