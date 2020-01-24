import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikTurEkleComponent } from './lastik-tur-ekle.component';

describe('LastikTurEkleComponent', () => {
  let component: LastikTurEkleComponent;
  let fixture: ComponentFixture<LastikTurEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikTurEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikTurEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
