import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikMarkaDesenOzelliklerComponent } from './lastik-marka-desen-ozellikler.component';

describe('LastikMarkaDesenOzelliklerComponent', () => {
  let component: LastikMarkaDesenOzelliklerComponent;
  let fixture: ComponentFixture<LastikMarkaDesenOzelliklerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikMarkaDesenOzelliklerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikMarkaDesenOzelliklerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
