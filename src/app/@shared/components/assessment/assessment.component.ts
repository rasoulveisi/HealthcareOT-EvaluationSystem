import { CommonModule } from '@angular/common';
import { Component, effect, input, output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { IAssessmentDTO, IAutoCompleteAssessmentOptions, ASSESSMENT_CATEGORIES, MOCK_ASSESSMENTS } from '@core/models/assessment.model';

export interface IAssessmentSearchOptions {
  page: number,
  pageSize: number,
  isLoading: boolean,
  scrollThreshold: number,
  keyword: string,
  category?: string
}

export interface IAssessmentListDTO {
  data: IAssessmentDTO[],
  totalCount: number,
  page: number,
  pageNumber: number
}

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, AccordionModule, AutoCompleteModule
  ],
  templateUrl: './assessment.component.html',
})
export class AssessmentComponent {
  assessmentFormArray = input.required<FormArray<FormGroup>>();
  assessments = input<IAssessmentListDTO>();
  assessmentChange = output<IAssessmentSearchOptions>();
  scrollHistory = { scrollTop: 0, scrollHeight: 0 };
  addAssessment = output<FormGroup>();
  removeAssessment = output<number>();
  notesCollapsed: number = -1;
  assessmentControls: FormGroup<any>[] = [];
  suggestions?: IAssessmentListDTO;
  assessmentCategories = ASSESSMENT_CATEGORIES;

  searchOptions: IAssessmentSearchOptions = {
    page: 1,
    pageSize: 10,
    isLoading: false,
    scrollThreshold: 85,
    keyword: '',
  }

  private assessmentFormEffect = effect(() => {
    this.assessmentControls = this.assessmentFormArray()?.controls;
  })

  private suggestionsEffect = effect(() => {
    if (this.assessments()?.page === 1) {
      this.suggestions = this.assessments();
    } else {
      this.suggestions?.data.push(...this.suggestions.data, ...this.assessments()!.data);
    }
  })

  addFormGroup() {
    if(this.assessmentFormArray()?.invalid) return;

    const formGroupItem = new FormGroup({
      name: new FormControl<string | null>({ value: '', disabled: false }, Validators.required),
      code: new FormControl<string | null>(null),
      category: new FormControl<string | null>(null),
      score: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required, Validators.min(0)]),
      maxScore: new FormControl<number | null>(null),
      minScore: new FormControl<number | null>(null),
      percentile: new FormControl<number | null>({ value: null, disabled: true }),
      interpretation: new FormControl<string | null>({ value: '', disabled: true }),
      notes: new FormControl<string | null>({ value: '', disabled: true }),
    });
    this.addAssessment.emit(formGroupItem);
  }

  removeFormGroup(index: number) {
    this.removeAssessment.emit(index);
  }

  toggleNotes(index: number) {
    if (this.notesCollapsed === index) {
      this.notesCollapsed = -1;
      return;
    }
    this.notesCollapsed = index;
  }

  search(event: AutoCompleteCompleteEvent) {
    this.searchOptions.page = 1;
    this.searchOptions.keyword = event.query;
    this.assessmentChange.emit(this.searchOptions);
  }

  onDropDownShow() {
    let panel: HTMLElement | undefined;
    setTimeout(() => {
      panel = document.body.querySelector('.p-autocomplete-panel') as HTMLElement;
      if (!panel) return;
      (panel as HTMLElement).addEventListener('scroll', () => this.onScroll(panel as HTMLElement));
    }, 50);
  }

  onScroll(element: HTMLElement) {
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    const maxScrollDistance = scrollHeight - clientHeight;
    const scrollPercentage = (scrollTop / maxScrollDistance) * 100;

    const isScrollDown = scrollTop > this.scrollHistory.scrollTop;
    this.scrollHistory.scrollTop = scrollTop;

    const isHeightChanged = this.scrollHistory.scrollHeight < scrollHeight;

    if (this.scrollHistory.scrollHeight > scrollHeight) {
      this.scrollHistory.scrollHeight = 0;
    }

    if (isScrollDown && isHeightChanged && scrollPercentage >= (this.searchOptions.scrollThreshold as number)) {
      this.scrollHistory.scrollHeight = scrollHeight;
      this.onPage();
    }
  }

  onPage() {
    const maxPage = Math.ceil(this.suggestions?.totalCount! / this.searchOptions.pageSize);
    if (this.searchOptions.page + 1 > maxPage || this.searchOptions.isLoading) return;

    this.searchOptions.page++;
    this.assessmentChange.emit(this.searchOptions);
  }

  onDeleteNotes(index: number) {
    this.notesCollapsed = -1;
    this.assessmentFormArray()?.at(index)?.patchValue({notes: ''});
  }

  onSelectAssessment(event: AutoCompleteSelectEvent, index: number) {
    const assessment = event.value as IAssessmentDTO;
    this.assessmentFormArray()?.at(index)?.patchValue({
      name: assessment.name,
      code: assessment.code,
      category: this.assessmentCategories[assessment.category].label,
      maxScore: assessment.maxScore,
      minScore: assessment.minScore
    });
    this.assessmentFormArray()?.at(index)?.enable();
  }

  onScoreChange(index: number) {
    const formGroup = this.assessmentFormArray()?.at(index);
    const score = formGroup?.get('score')?.value;
    const maxScore = formGroup?.get('maxScore')?.value;
    const minScore = formGroup?.get('minScore')?.value;

    if (score !== null && maxScore !== null && minScore !== null) {
      // Calculate percentile (simplified calculation)
      const percentile = Math.round(((score - minScore) / (maxScore - minScore)) * 100);
      formGroup?.patchValue({ percentile });

      // Generate basic interpretation
      let interpretation = '';
      if (percentile >= 85) {
        interpretation = 'Above Average';
      } else if (percentile >= 70) {
        interpretation = 'Average';
      } else if (percentile >= 50) {
        interpretation = 'Below Average';
      } else {
        interpretation = 'Significantly Below Average';
      }
      formGroup?.patchValue({ interpretation });
    }
  }

  // Mock data provider for development
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
} 