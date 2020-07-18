import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerGardenComponent } from './farmer-garden.component';

describe('FarmerGardenComponent', () => {
  let component: FarmerGardenComponent;
  let fixture: ComponentFixture<FarmerGardenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerGardenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerGardenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
