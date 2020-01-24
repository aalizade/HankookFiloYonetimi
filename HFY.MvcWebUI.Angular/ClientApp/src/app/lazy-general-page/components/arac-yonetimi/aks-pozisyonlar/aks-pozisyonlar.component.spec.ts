import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AksPozisyonlarComponent } from './aks-pozisyonlar.component';

describe('AksPozisyonlarComponent', () => {
  let component: AksPozisyonlarComponent;
  let fixture: ComponentFixture<AksPozisyonlarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AksPozisyonlarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AksPozisyonlarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
