import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerAddGardenComponent } from './farmer-add-garden.component';

describe('FarmerAddGardenComponent', () => {
  let component: FarmerAddGardenComponent;
  let fixture: ComponentFixture<FarmerAddGardenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerAddGardenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerAddGardenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
