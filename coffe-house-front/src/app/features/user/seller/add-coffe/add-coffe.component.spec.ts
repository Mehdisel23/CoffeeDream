import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCoffeComponent } from './add-coffe.component';

describe('AddCoffeComponent', () => {
  let component: AddCoffeComponent;
  let fixture: ComponentFixture<AddCoffeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCoffeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCoffeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
