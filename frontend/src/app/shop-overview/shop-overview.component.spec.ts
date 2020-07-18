import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopOverviewComponent } from './shop-overview.component';

describe('ShopOverviewComponent', () => {
  let component: ShopOverviewComponent;
  let fixture: ComponentFixture<ShopOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
