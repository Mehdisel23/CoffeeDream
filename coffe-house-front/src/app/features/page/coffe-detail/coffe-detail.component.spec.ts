import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffeDetailComponent } from './coffe-detail.component';

describe('CoffeDetailComponent', () => {
  let component: CoffeDetailComponent;
  let fixture: ComponentFixture<CoffeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoffeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoffeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
