import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikHareketlerComponent } from './lastik-hareketler.component';

describe('LastikHareketlerComponent', () => {
  let component: LastikHareketlerComponent;
  let fixture: ComponentFixture<LastikHareketlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikHareketlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikHareketlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
