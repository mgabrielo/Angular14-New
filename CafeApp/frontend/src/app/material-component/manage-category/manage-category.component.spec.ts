import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCategoryComponent } from './manage-category.component';

describe('ManageCategoryComponent', () => {
  let component: ManageCategoryComponent;
  let fixture: ComponentFixture<ManageCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageCategoryComponent]
    });
    fixture = TestBed.createComponent(ManageCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
