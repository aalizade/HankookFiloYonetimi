import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Kategori12treylerComponent } from './kategori12treyler.component';

describe('Kategori12treylerComponent', () => {
  let component: Kategori12treylerComponent;
  let fixture: ComponentFixture<Kategori12treylerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Kategori12treylerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Kategori12treylerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
