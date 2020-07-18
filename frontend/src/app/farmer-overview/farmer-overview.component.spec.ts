import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerOverviewComponent } from './farmer-overview.component';

describe('FarmerOverviewComponent', () => {
  let component: FarmerOverviewComponent;
  let fixture: ComponentFixture<FarmerOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
