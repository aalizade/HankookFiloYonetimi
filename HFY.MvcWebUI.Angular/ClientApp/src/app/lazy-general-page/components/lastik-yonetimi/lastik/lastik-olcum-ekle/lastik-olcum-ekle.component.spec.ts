import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikOlcumEkleComponent } from './lastik-olcum-ekle.component';

describe('LastikOlcumEkleComponent', () => {
  let component: LastikOlcumEkleComponent;
  let fixture: ComponentFixture<LastikOlcumEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikOlcumEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikOlcumEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
