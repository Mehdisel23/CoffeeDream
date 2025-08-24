import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCoffeeComponent } from './buy-coffee.component';

describe('BuyCoffeeComponent', () => {
  let component: BuyCoffeeComponent;
  let fixture: ComponentFixture<BuyCoffeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyCoffeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyCoffeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
