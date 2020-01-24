import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Kategori6x2Component } from './kategori6x2.component';

describe('Kategori6x2Component', () => {
  let component: Kategori6x2Component;
  let fixture: ComponentFixture<Kategori6x2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Kategori6x2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Kategori6x2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
