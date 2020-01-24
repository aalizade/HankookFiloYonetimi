import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YukIndeksComponent } from './yuk-indeks.component';

describe('YukIndeksComponent', () => {
  let component: YukIndeksComponent;
  let fixture: ComponentFixture<YukIndeksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YukIndeksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YukIndeksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
