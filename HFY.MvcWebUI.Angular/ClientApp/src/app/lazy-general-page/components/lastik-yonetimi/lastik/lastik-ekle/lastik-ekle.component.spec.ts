import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikEkleComponent } from './lastik-ekle.component';

describe('LastikEkleComponent', () => {
  let component: LastikEkleComponent;
  let fixture: ComponentFixture<LastikEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
