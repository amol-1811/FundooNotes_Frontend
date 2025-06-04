import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelNotesComponent } from './label-notes.component';

describe('LabelNotesComponent', () => {
  let component: LabelNotesComponent;
  let fixture: ComponentFixture<LabelNotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelNotesComponent]
    });
    fixture = TestBed.createComponent(LabelNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
