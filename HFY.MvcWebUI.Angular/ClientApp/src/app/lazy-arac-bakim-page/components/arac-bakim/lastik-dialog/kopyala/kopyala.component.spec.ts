import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KopyalaComponent } from './kopyala.component';

describe('KopyalaComponent', () => {
  let component: KopyalaComponent;
  let fixture: ComponentFixture<KopyalaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KopyalaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KopyalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
