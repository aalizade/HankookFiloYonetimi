import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Kategori4x2Component } from './kategori4x2.component';

describe('Kategori4x2Component', () => {
  let component: Kategori4x2Component;
  let fixture: ComponentFixture<Kategori4x2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Kategori4x2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Kategori4x2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
