import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikTurComponent } from './lastik-tur.component';

describe('LastikTurComponent', () => {
  let component: LastikTurComponent;
  let fixture: ComponentFixture<LastikTurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikTurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikTurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
