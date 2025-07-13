import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WarningSvg } from '../icons/warning.component';
import { IEvaluationDetailDTO, EVALUATION_TYPES, EVALUATION_STATUS, THERAPIST_TYPES } from '@core/models/evaluation.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    WarningSvg,

  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input({ required: true }) set info(val: IEvaluationDetailDTO | undefined) {
    if(val){
      this.evaluation = val
    }
  };

  @Output() updateEvaluation = new EventEmitter()
  therapistTypes = THERAPIST_TYPES;
  evaluationTypes = EVALUATION_TYPES;
  evaluationStatus = EVALUATION_STATUS;
  evaluation: IEvaluationDetailDTO | undefined;

  getUpdateEvaluation(){
    this.updateEvaluation.emit();
  }
}
