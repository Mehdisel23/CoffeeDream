import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerBaseComponent } from './seller-base.component';

describe('SellerBaseComponent', () => {
  let component: SellerBaseComponent;
  let fixture: ComponentFixture<SellerBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
