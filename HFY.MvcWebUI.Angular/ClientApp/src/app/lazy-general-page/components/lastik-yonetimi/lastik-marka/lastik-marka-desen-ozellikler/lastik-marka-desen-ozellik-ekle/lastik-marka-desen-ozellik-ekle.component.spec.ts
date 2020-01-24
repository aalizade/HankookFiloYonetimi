import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastikMarkaDesenOzellikEkleComponent } from './lastik-marka-desen-ozellik-ekle.component';

describe('LastikMarkaDesenOzellikEkleComponent', () => {
  let component: LastikMarkaDesenOzellikEkleComponent;
  let fixture: ComponentFixture<LastikMarkaDesenOzellikEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastikMarkaDesenOzellikEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastikMarkaDesenOzellikEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
