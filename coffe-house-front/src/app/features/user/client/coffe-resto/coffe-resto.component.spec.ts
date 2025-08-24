import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffeRestoComponent } from './coffe-resto.component';

describe('CoffeRestoComponent', () => {
  let component: CoffeRestoComponent;
  let fixture: ComponentFixture<CoffeRestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoffeRestoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoffeRestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
