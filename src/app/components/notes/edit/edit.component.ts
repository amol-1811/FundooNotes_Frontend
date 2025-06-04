import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LabelService } from 'src/app/services/label/label.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent implements OnInit {

  labels: any[] = [];
  labelText: string = "";

  constructor(private labelService: LabelService){
  }

  ngOnInit(): void {
    this.getAllLabels()
  }

  getAllLabels() {
    this.labelService.getAllLabels()
      .subscribe({
        next: (val) => {
          this.labels = val.data;
        },

        error: (err) => {
          console.log(err);
        }
      })
  }

  addLabel() {
    console.log("labelText", this.labelText);
    if(this.labelText === null || this.labelText === undefined || this.labelText === ''){
      return;
    }

    this.labelService.addLabel(this.labelText)
    .subscribe({
      next: (val) => {
        this.labelText = "";
        this.getAllLabels();
      },
      error: (err) => {
        this.labelText="";
        console.log(err);
      }
    })
  }

}
