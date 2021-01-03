import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterModalComponent } from './semester-modal.component';

describe('ModuleModalComponent', () => {
  let component: SemesterModalComponent;
  let fixture: ComponentFixture<SemesterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SemesterModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemesterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
