import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikBilgisiComponent } from './lastik-bilgisi.component';

describe('LastikBilgisiComponent', () => {
  let component: LastikBilgisiComponent;
  let fixture: ComponentFixture<LastikBilgisiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikBilgisiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikBilgisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
