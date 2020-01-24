import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikDialogComponent } from './lastik-dialog.component';

describe('LastikDialogComponent', () => {
  let component: LastikDialogComponent;
  let fixture: ComponentFixture<LastikDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
