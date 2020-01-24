import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Kategori6treylerComponent } from './kategori6treyler.component';

describe('Kategori6treylerComponent', () => {
  let component: Kategori6treylerComponent;
  let fixture: ComponentFixture<Kategori6treylerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Kategori6treylerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Kategori6treylerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
