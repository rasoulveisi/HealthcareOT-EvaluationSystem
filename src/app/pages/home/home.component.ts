/**
 * HomeComponent - Main evaluation form component
 * 
 * This component handles the complete occupational therapy evaluation workflow:
 * - Patient and clinic information collection
 * - Assessment administration and scoring
 * - Real-time data processing and insight generation
 * - Form validation and submission
 * - Address lookup and validation
 * 
 * The component uses reactive forms for robust form management and provides
 * automated analysis of assessment data to generate clinical insights and
 * therapy recommendations.
 */

import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import {
  IEvaluationDetailDTO,
  IEvaluationForm,
  ISendEvaluation,
  ISendEvaluationBody,
  EvaluationTypeEnum,
  EVALUATION_FORM_CONST,
  EVALUATION_STATUS,
  THERAPIST_TYPES,
} from '@core/models/evaluation.model';
import { EvaluationService } from '@core/services/evaluation.service';
import { AssessmentService } from '@core/services/assessment.service';
import { HeaderComponent } from '@shared/components/header/header.component';
import { AssessmentComponent, IAssessmentSearchOptions, IAssessmentListDTO } from '@shared/components/assessment/assessment.component';

import { SelectModule, SelectChangeEvent } from 'primeng/select';
import { AddressService } from '@core/services/address.service';
import { DateMaskDirective } from '@shared/directives/date-mask.directive';
import { IAddressOptions, IAddressUID, IHouseNumber } from '@core/models/address.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { map } from 'rxjs';
import { IAutoCompleteAssessmentOptions, IAssessmentDTO, MOCK_ASSESSMENTS } from '@core/models/assessment.model';


@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    AssessmentComponent,
    ReactiveFormsModule,
    SelectModule,
    DateMaskDirective,
    ToastModule
  ],
  providers: [DatePipe, MessageService],
})
export class HomeComponent {
  @ViewChild('main') main!: ElementRef;
  private route = inject(ActivatedRoute);
  public fb = inject(FormBuilder);
  private evaluationService: EvaluationService = inject(EvaluationService);
  public assessmentService: AssessmentService = inject(AssessmentService);

  private addressService = inject(AddressService);
  private datePipe = inject(DatePipe);
  private el = inject(ElementRef);
  private messageService = inject(MessageService);

  evaluationDetail?: IEvaluationDetailDTO;
  evaluationFormBody?: Partial<ISendEvaluation>;
  evaluationForm!: FormGroup;
  assessmentFormArray!: FormArray<FormGroup>;
  evaluationId = '';
  token = '';
  status: string = '';
  evaluationStatus = EVALUATION_STATUS;
  evaluationFormConst = EVALUATION_FORM_CONST;
  therapistTypes = THERAPIST_TYPES;
  assessments?: IAssessmentDTO;
  assessmentSuggestions?: IAssessmentListDTO;
  addressOptions?: Partial<IAddressOptions>;
  isDiagnosisCodeShow: boolean = false;
  validControlsLength = 0;
  Validators = Validators;

  ngOnInit(): void {
    this.initRouterParams();
    this.initialForm();
    this.getEvaluation();
    this.onFormChange();
    this.onAssessmentFormChange();
  }

  initRouterParams() {
    this.route.queryParams.subscribe((params: Params) => {
      this.evaluationId = params['evaluationId'] || 'EVAL-001';
      this.token = params['token'] || 'demo-token';
    });
  }

  getEvaluation() {
    this.evaluationService.getEvaluationDetail(this.evaluationId, this.token).subscribe({
      next: (evaluationDetail: IEvaluationDetailDTO) => {
        this.evaluationDetail = evaluationDetail;
        this.initialFormData(evaluationDetail);
        this.generateAddress({
          street: evaluationDetail.defaultPatientAddress.street,
          city: evaluationDetail.defaultPatientAddress.city,
          houseNumber: evaluationDetail.defaultPatientAddress.houseNumber.toString(),
          houseNumberAddition: evaluationDetail.defaultPatientAddress.houseNumberAddition,
        });
        this.status = this.evaluationStatus[evaluationDetail.isComplete ? 'true' : 'false'];
        if (evaluationDetail.evaluationType === EvaluationTypeEnum.Initial){
          this.isDiagnosisCodeShow = true;
          this.evaluationForm.patchValue({diagnosisCode: ''});
        }
      },
      error: (error) => {
        this.messageService.clear();
        this.messageService.add({
          summary: 'Please try again',
          detail: 'Something went wrong!',
          severity: 'error',
          styleClass: 'custom-toast',
          data: { mode: 'light' },
        });
      },
    });
  }

  initialForm() {
    this.assessmentFormArray = this.fb.array([new FormGroup({
      name: new FormControl<string | null>({ value: '', disabled: false }, Validators.required),
      code: new FormControl<string | null>(null),
      category: new FormControl<string | null>(null),
      score: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required, Validators.min(0)]),
      maxScore: new FormControl<number | null>(null),
      minScore: new FormControl<number | null>(null),
      percentile: new FormControl<number | null>({ value: null, disabled: true }),
      interpretation: new FormControl<string | null>({ value: '', disabled: true }),
      notes: new FormControl<string | null>({ value: '', disabled: true }),
    })]);

    // Initialize assessment suggestions with mock data
    this.assessmentSuggestions = {
      data: MOCK_ASSESSMENTS,
      totalCount: MOCK_ASSESSMENTS.length,
      page: 1,
      pageNumber: 1
    };

    this.evaluationForm = new FormGroup({
      clinicName: new FormControl<string | null>(null, Validators.required),
      clinicLicense: new FormControl<number | null>(null, Validators.required),
      therapistName: new FormControl<string | null>(null, Validators.required),
      patientName: new FormControl<string | null>(null, Validators.required),
      patientId: new FormControl<number | null>(null, Validators.required),
      clientId: new FormControl<number | null>(null, Validators.required),
      birthDate: new FormControl<string | null>(null, Validators.required),
      postalCode: new FormControl<string | null>(null, Validators.required),
      houseNumber: new FormControl<number | null>(null, Validators.required),
      addition: new FormControl<string | null>(null),
      address: new FormControl<string | null>(null, Validators.required),
      referringPhysician: new FormControl<string | null>(null, Validators.required),
      diagnosisCode: new FormControl<string | null>(null),
      referralSource: new FormControl<string | null>(null, [Validators.required]),
      assessments: this.assessmentFormArray,
    });
  }

  initialFormData(evaluationDetail: IEvaluationDetailDTO) {
    this.evaluationFormBody = {
      clinicName: evaluationDetail.clinicName,
      clinicLicense: evaluationDetail.clinicLicense.toString(),
      patientGender: evaluationDetail.gender,
      patientInitials: evaluationDetail.initial,
      clientId: evaluationDetail.patientClientId.toString(),
      patientId: evaluationDetail.patientId.toString(),
      city: evaluationDetail.defaultPatientAddress.city,
      street: evaluationDetail.defaultPatientAddress.street,
      patientName: evaluationDetail.fullName,
      birthDate: this.datePipe.transform(evaluationDetail.birthDate, 'dd-MM-yyyy')!,
      postalCode: evaluationDetail.defaultPatientAddress.postalCode,
      houseNumber: evaluationDetail.defaultPatientAddress.houseNumber.toString(),
      addition: evaluationDetail.defaultPatientAddress.houseNumberAddition,
      address: evaluationDetail.defaultPatientAddress.fullAddress,
      therapistName: '',
      referralSource: null,
      referringPhysician: '',
      diagnosisCode: null,
      assessments: []
    };

    this.evaluationForm?.patchValue(
      {
        clientId: evaluationDetail.clinicClientId,
        ...this.evaluationFormBody
      }
    );
  }

  onFormChange() {
    this.evaluationForm.valueChanges.subscribe((form: IEvaluationForm) => {
      this.evaluationFormBody = {
        ...this.evaluationFormBody,
        ...form,
      };
    });

    this.enableForm();
  }

  postalCodeChange() {
    this.evaluationForm.patchValue({ houseNumber: null, addition: null });

    this.addressOptions = {};
    const postCode = this.evaluationForm.get('postalCode')?.value;
    if (postCode && postCode.length === 5) {
              this.addressService.getHouseNumberByPostCode(postCode.toUpperCase()).subscribe(
        (postalCodeDetails: IHouseNumber) => {
          this.generateAddress({ houseNumbers: postalCodeDetails?.houseNumbers?.map(h => h.toString()) ?? [], street: postalCodeDetails?.street, city: postalCodeDetails?.city });
        });
    }
  }

  houseNumberChange(event?:SelectChangeEvent) {
    event ? this.evaluationForm.patchValue({ houseNumber: event.value.toString() ,addition: null }) : this.evaluationForm.patchValue({ addition: null });

    const houseNumber = this.evaluationForm.get('houseNumber')?.value;
    const postCode = this.evaluationForm.get('postalCode')?.value;
    if (houseNumber && postCode) {
              this.addressService
        .getAddressUids(postCode, houseNumber).pipe(
          map((addressUIDs: IAddressUID[]) => addressUIDs.filter(x => x.houseNumberAdd !== null).map(y => y.houseNumberAdd!))
        )
        .subscribe((houseNumbers) => {
          this.generateAddress({ ...this.addressOptions, houseNumber: houseNumber, houseNumberAdditions: houseNumbers ?? [] });
        });
    }
  }

  onAdditionChange() {
    const houseNumberAddition = this.evaluationForm.get('addition')?.value;
    this.generateAddress({ ...this.addressOptions, houseNumberAddition: houseNumberAddition });
  }

  generateAddress(addressOption: Partial<IAddressOptions>) {
    this.addressOptions = addressOption;

    const _address = {
      street: addressOption?.street ?? null,
      houseNumber: addressOption?.houseNumber ?? null,
      houseNumberAddition: addressOption?.houseNumberAddition ?? null,
      postalCode: this.evaluationForm.get('postalCode')?.value ?? null,
    };
    let address: string[] = [];
    Object.values(_address).map((value: string | number) => {
      if (value) address.push(value.toString());
    });

    this.addressOptions.address = address.join(', ');
    this.evaluationForm.patchValue({ address: this.addressOptions.address });
    this.evaluationFormBody = { ...this.evaluationFormBody, address: this.addressOptions.address ?? '', city: this.addressOptions.city ?? '', street: this.addressOptions.street ?? '', houseNumber: this.addressOptions.houseNumber ?? '', addition: this.addressOptions.houseNumberAddition ?? '', postalCode: this.evaluationForm.get('postalCode')?.value };
  }

  onEditPostCodeClicked() {
    this.handleEdit('postalCode');
  }

  onEditHouseNumberClicked() {
    this.handleEdit('houseNumber');
  }

  handleEdit(name: string) {
    const control = this.evaluationForm.get(name);
    if (control) {
      control.enable();
      const element = this.el.nativeElement.querySelector(`#${name}`);
      if (element) {
        element.focus();
      }
    }
  }

  closeToast() {
    this.messageService.clear();
  }

  addAssessmentForm(form: FormGroup) {
    this.assessmentFormArray.push(form);
    this.onAssessmentFormChange();
  }

  removeAssessmentForm(index: number) {
    this.assessmentFormArray.removeAt(index);
  }

  onAssessmentChange(event: IAssessmentSearchOptions) {
    // Mock implementation - in real app this would call a service
    const mockData = this.getMockAssessments(event);
    this.assessmentSuggestions = mockData;
  }

  getMockAssessments(searchOptions: IAssessmentSearchOptions): IAssessmentListDTO {
    const filtered = MOCK_ASSESSMENTS.filter(assessment => 
      assessment.name.toLowerCase().includes(searchOptions.keyword.toLowerCase()) ||
      assessment.code.toLowerCase().includes(searchOptions.keyword.toLowerCase())
    );

    const startIndex = (searchOptions.page - 1) * searchOptions.pageSize;
    const endIndex = startIndex + searchOptions.pageSize;
    const pageData = filtered.slice(startIndex, endIndex);

    return {
      data: pageData,
      totalCount: filtered.length,
      page: searchOptions.page,
      pageNumber: searchOptions.page
    };
  }

  submitEvaluation() {
    if (this.evaluationForm.valid) {
      const evaluationData: ISendEvaluationBody = {
        evaluationRequest: {
          ...this.evaluationFormBody,
          assessments: this.assessmentFormArray.value.map((assessment: any) => ({
            assessmentName: assessment.name,
            assessmentCode: assessment.code,
            score: assessment.score,
            notes: assessment.notes,
          }))
        } as ISendEvaluation,
        evaluationId: this.evaluationId,
      };

      this.evaluationService.submitEvaluation(evaluationData).subscribe({
        next: (response) => {
          this.messageService.clear();
          this.messageService.add({
            summary: 'Success',
            detail: 'Evaluation submitted successfully!',
            severity: 'success',
            styleClass: 'custom-toast',
            data: { mode: 'light' },
          });
          this.getEvaluation(); // Refresh the evaluation
        },
        error: (error) => {
          this.messageService.clear();
          this.messageService.add({
            summary: 'Error',
            detail: 'Failed to submit evaluation. Please try again.',
            severity: 'error',
            styleClass: 'custom-toast',
            data: { mode: 'light' },
          });
        },
      });
    }
  }

  enableForm() {
    this.validControlsLength = Object.keys(this.evaluationForm.controls).filter(
      (key) => this.evaluationForm.get(key)?.valid
    ).length;
  }

  onAssessmentFormChange() {
    this.assessmentFormArray.valueChanges.subscribe(() => {
      this.enableForm();
      this.processAssessmentData();
    });
  }

  /**
   * Process assessment data and generate insights
   */
  processAssessmentData() {
    const assessments = this.assessmentFormArray.value;
    const validAssessments = assessments.filter((a: any) => a.score !== null && a.score !== undefined);
    
    if (validAssessments.length === 0) return;

    // Calculate average score
    const totalScore = validAssessments.reduce((sum: number, assessment: any) => sum + assessment.score, 0);
    const averageScore = totalScore / validAssessments.length;

    // Generate insights based on scores
    const insights = this.generateAssessmentInsights(validAssessments, averageScore);
    
    // Store insights for potential display or reporting
    this.evaluationFormBody = {
      ...this.evaluationFormBody,
      insights: insights
    };
  }

  /**
   * Generate insights based on assessment data
   */
  generateAssessmentInsights(assessments: any[], averageScore: number): any {
    const insights = {
      averageScore: Math.round(averageScore * 100) / 100,
      totalAssessments: assessments.length,
      strengths: [] as string[],
      concerns: [] as string[],
      recommendations: [] as string[],
      priorityAreas: [] as string[],
      functionalLevel: '',
      prognosis: ''
    };

    // Determine functional level based on average score
    if (averageScore >= 80) {
      insights.functionalLevel = 'Independent';
      insights.prognosis = 'Excellent';
      insights.strengths.push('Demonstrates high level of independence');
      insights.recommendations.push('Maintenance program recommended');
    } else if (averageScore >= 60) {
      insights.functionalLevel = 'Modified Independent';
      insights.prognosis = 'Good';
      insights.strengths.push('Shows good potential for improvement');
      insights.recommendations.push('Continue therapy 2x/week for 4-6 weeks');
    } else if (averageScore >= 40) {
      insights.functionalLevel = 'Moderate Assistance';
      insights.prognosis = 'Fair';
      insights.concerns.push('Requires moderate assistance with daily tasks');
      insights.recommendations.push('Intensive therapy 3x/week for 6-8 weeks');
      insights.priorityAreas.push('Activities of Daily Living');
    } else {
      insights.functionalLevel = 'Maximum Assistance';
      insights.prognosis = 'Guarded';
      insights.concerns.push('Requires maximum assistance with most tasks');
      insights.recommendations.push('Comprehensive rehabilitation program');
      insights.priorityAreas.push('Basic self-care skills', 'Safety awareness');
    }

    // Analyze individual assessments for specific insights
    assessments.forEach((assessment: any) => {
      if (assessment.name && assessment.score !== null) {
        const scorePercentage = this.calculateScorePercentage(assessment.score, assessment.name);
        
        if (scorePercentage < 50) {
          insights.concerns.push(`${assessment.name}: Below expected level`);
          insights.priorityAreas.push(this.getAssessmentCategory(assessment.name));
        } else if (scorePercentage > 80) {
          insights.strengths.push(`${assessment.name}: Above expected level`);
        }
      }
    });

    // Remove duplicates from arrays
    insights.priorityAreas = [...new Set(insights.priorityAreas)];
    insights.strengths = [...new Set(insights.strengths)];
    insights.concerns = [...new Set(insights.concerns)];
    insights.recommendations = [...new Set(insights.recommendations)];

    return insights;
  }

  /**
   * Calculate score percentage based on assessment type
   */
  calculateScorePercentage(score: number, assessmentName: string): number {
    // This would typically use the assessment's min/max scores from the database
    // For now, using common assessment ranges
    const assessmentRanges: { [key: string]: { min: number, max: number } } = {
      'COPM': { min: 1, max: 10 },
      'FIM': { min: 18, max: 126 },
      'MoCA': { min: 0, max: 30 },
      'NHPT': { min: 10, max: 300 },
      'SP': { min: 40, max: 200 }
    };

    const range = assessmentRanges[assessmentName] || { min: 0, max: 100 };
    return ((score - range.min) / (range.max - range.min)) * 100;
  }

  /**
   * Get assessment category for priority area classification
   */
  getAssessmentCategory(assessmentName: string): string {
    const categoryMap: { [key: string]: string } = {
      'COPM': 'Occupational Performance',
      'FIM': 'Activities of Daily Living',
      'MoCA': 'Cognitive Function',
      'NHPT': 'Motor Skills',
      'SP': 'Sensory Processing'
    };

    return categoryMap[assessmentName] || 'General Function';
  }

  /**
   * Generate evaluation summary report
   */
  generateEvaluationSummary(): any {
    const formValue = this.evaluationForm.value;
    const assessments = this.assessmentFormArray.value;
    const insights = this.evaluationFormBody?.insights;

    return {
      patientInfo: {
        name: formValue.patientName,
        id: formValue.patientId,
        birthDate: formValue.birthDate,
        address: formValue.address
      },
      clinicInfo: {
        name: formValue.clinicName,
        therapist: formValue.therapistName,
        evaluationDate: new Date().toISOString().split('T')[0]
      },
      referralInfo: {
        physician: formValue.referringPhysician,
        source: formValue.referralSource,
        diagnosis: formValue.diagnosisCode
      },
      assessmentResults: assessments.filter((a: any) => a.score !== null),
      insights: insights,
      recommendations: insights?.recommendations || [],
      goals: this.generateTherapyGoals(insights)
    };
  }

  /**
   * Generate therapy goals based on assessment insights
   */
  generateTherapyGoals(insights: any): string[] {
    const goals: string[] = [];

    if (insights?.priorityAreas.includes('Activities of Daily Living')) {
      goals.push('Patient will demonstrate independence in dressing tasks within 4 weeks');
      goals.push('Patient will safely perform kitchen tasks with minimal assistance within 6 weeks');
    }

    if (insights?.priorityAreas.includes('Motor Skills')) {
      goals.push('Patient will improve fine motor coordination by 25% within 6 weeks');
      goals.push('Patient will demonstrate improved grip strength within 4 weeks');
    }

    if (insights?.priorityAreas.includes('Cognitive Function')) {
      goals.push('Patient will improve attention span for functional tasks within 4 weeks');
      goals.push('Patient will demonstrate improved memory strategies within 6 weeks');
    }

    if (insights?.priorityAreas.includes('Sensory Processing')) {
      goals.push('Patient will demonstrate improved sensory tolerance within 4 weeks');
      goals.push('Patient will use sensory strategies independently within 6 weeks');
    }

    // Default goals if no specific areas identified
    if (goals.length === 0) {
      goals.push('Patient will improve overall functional independence within 6 weeks');
      goals.push('Patient will demonstrate improved quality of life measures within 8 weeks');
    }

    return goals;
  }

  /**
   * Export evaluation data for reporting
   */
  exportEvaluationData(): void {
    const summary = this.generateEvaluationSummary();
    const dataStr = JSON.stringify(summary, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `OT_Evaluation_${summary.patientInfo.name}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
}
