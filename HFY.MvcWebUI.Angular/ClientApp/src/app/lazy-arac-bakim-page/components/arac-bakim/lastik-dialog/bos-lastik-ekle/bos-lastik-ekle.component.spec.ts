import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BosLastikEkleComponent } from './bos-lastik-ekle.component';

describe('BosLastikEkleComponent', () => {
  let component: BosLastikEkleComponent;
  let fixture: ComponentFixture<BosLastikEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BosLastikEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BosLastikEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
