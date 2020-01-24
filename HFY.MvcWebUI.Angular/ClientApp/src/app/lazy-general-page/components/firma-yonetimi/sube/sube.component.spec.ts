import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubeComponent } from './sube.component';

describe('SubeComponent', () => {
  let component: SubeComponent;
  let fixture: ComponentFixture<SubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
