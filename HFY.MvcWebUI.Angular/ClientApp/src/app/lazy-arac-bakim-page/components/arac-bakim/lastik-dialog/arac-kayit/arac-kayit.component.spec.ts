import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AracKayitComponent } from './arac-kayit.component';

describe('AracKayitComponent', () => {
  let component: AracKayitComponent;
  let fixture: ComponentFixture<AracKayitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AracKayitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AracKayitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
