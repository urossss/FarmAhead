import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAddProductComponent } from './company-add-product.component';

describe('CompanyAddProductComponent', () => {
  let component: CompanyAddProductComponent;
  let fixture: ComponentFixture<CompanyAddProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAddProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
