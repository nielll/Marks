import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSemesterModalComponent } from './addSemester-modal.component';

describe('MarkModalComponent', () => {
  let component: AddSemesterModalComponent;
  let fixture: ComponentFixture<AddSemesterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSemesterModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSemesterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
