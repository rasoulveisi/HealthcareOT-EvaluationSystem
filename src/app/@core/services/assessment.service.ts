import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';

import { 
  IAssessmentDTO, 
  IAutoCompleteAssessmentOptions,
  MOCK_ASSESSMENTS,
  AssessmentCategoryEnum 
} from '../models/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private apiUrl = 'https://jsonplaceholder.typicode.com'; // Mock API for demo
  private assessments = MOCK_ASSESSMENTS;

  constructor(private http: HttpClient) {}

  /**
   * Get all available assessments
   * @returns Observable of assessment list
   */
  getAssessments(): Observable<IAssessmentDTO[]> {
    return of(this.assessments).pipe(delay(300));
  }

  /**
   * Search assessments by name or code (for autocomplete)
   * @param searchTerm - The search term
   * @returns Observable of filtered assessments
   */
  searchAssessments(searchTerm: string): Observable<IAutoCompleteAssessmentOptions[]> {
    const filtered = this.assessments
      .filter(assessment => 
        assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(assessment => ({
        id: assessment.id,
        name: assessment.name,
        code: assessment.code,
        category: this.getCategoryLabel(assessment.category),
        maxScore: assessment.maxScore,
        minScore: assessment.minScore
      }));

    return of(filtered).pipe(delay(200));
  }

  /**
   * Get assessment by ID
   * @param id - The assessment ID
   * @returns Observable of assessment details
   */
  getAssessmentById(id: number): Observable<IAssessmentDTO | undefined> {
    const assessment = this.assessments.find(a => a.id === id);
    return of(assessment).pipe(delay(100));
  }

  /**
   * Get assessments by category
   * @param category - The assessment category
   * @returns Observable of filtered assessments
   */
  getAssessmentsByCategory(category: AssessmentCategoryEnum): Observable<IAssessmentDTO[]> {
    const filtered = this.assessments.filter(a => a.category === category);
    return of(filtered).pipe(delay(200));
  }

  /**
   * Calculate assessment score interpretation
   * @param assessmentId - The assessment ID
   * @param score - The raw score
   * @param patientAge - Patient age for age-adjusted scoring
   * @returns Observable of score interpretation
   */
  interpretScore(assessmentId: number, score: number, patientAge?: number): Observable<any> {
    const assessment = this.assessments.find(a => a.id === assessmentId);
    if (!assessment) {
      return of({ error: 'Assessment not found' });
    }

    // Mock score interpretation logic
    const percentage = ((score - assessment.minScore) / (assessment.maxScore - assessment.minScore)) * 100;
    let interpretation = '';
    let severity = '';

    if (percentage >= 80) {
      interpretation = 'Within normal limits';
      severity = 'normal';
    } else if (percentage >= 60) {
      interpretation = 'Mild impairment';
      severity = 'mild';
    } else if (percentage >= 40) {
      interpretation = 'Moderate impairment';
      severity = 'moderate';
    } else {
      interpretation = 'Severe impairment';
      severity = 'severe';
    }

    const result = {
      assessmentName: assessment.name,
      rawScore: score,
      percentage: Math.round(percentage),
      interpretation,
      severity,
      recommendations: this.getRecommendations(assessment.category, severity),
      ageAdjusted: patientAge ? this.adjustForAge(score, patientAge, assessment) : null
    };

    return of(result).pipe(delay(200));
  }

  /**
   * Get normative data for an assessment
   * @param assessmentId - The assessment ID
   * @returns Observable of normative data
   */
  getNormativeData(assessmentId: number): Observable<any> {
    // Mock normative data
    const mockData = {
      ageGroups: [
        { range: '18-25', mean: 85, standardDeviation: 8 },
        { range: '26-35', mean: 82, standardDeviation: 9 },
        { range: '36-45', mean: 79, standardDeviation: 10 },
        { range: '46-55', mean: 76, standardDeviation: 11 },
        { range: '56-65', mean: 73, standardDeviation: 12 },
        { range: '66+', mean: 70, standardDeviation: 13 }
      ],
      percentiles: {
        '10th': 60,
        '25th': 70,
        '50th': 80,
        '75th': 90,
        '90th': 95
      }
    };

    return of(mockData).pipe(delay(300));
  }

  /**
   * Save assessment results (using JSONPlaceholder for demo)
   * @param assessmentResult - The assessment result to save
   * @returns Observable of save result
   */
  saveAssessmentResult(assessmentResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, {
      title: `Assessment Result: ${assessmentResult.assessmentName}`,
      body: JSON.stringify(assessmentResult),
      userId: 1
    }).pipe(
      map(response => ({
        success: true,
        message: 'Assessment result saved successfully',
        data: response
      }))
    );
  }

  private getCategoryLabel(category: AssessmentCategoryEnum): string {
    const categoryLabels = {
      [AssessmentCategoryEnum.ADL]: 'Activities of Daily Living',
      [AssessmentCategoryEnum.Cognitive]: 'Cognitive',
      [AssessmentCategoryEnum.Motor]: 'Motor Skills',
      [AssessmentCategoryEnum.Sensory]: 'Sensory Processing',
      [AssessmentCategoryEnum.Psychosocial]: 'Psychosocial',
      [AssessmentCategoryEnum.Vocational]: 'Vocational',
      [AssessmentCategoryEnum.Environmental]: 'Environmental'
    };
    return categoryLabels[category] || 'Unknown';
  }

  private getRecommendations(category: AssessmentCategoryEnum, severity: string): string[] {
    const recommendations: { [key: string]: { [key: string]: string[] } } = {
      [AssessmentCategoryEnum.ADL]: {
        mild: ['Practice with adaptive equipment', 'Home safety assessment'],
        moderate: ['Occupational therapy 2x/week', 'Caregiver training'],
        severe: ['Intensive OT program', 'Consider assistive technology']
      },
      [AssessmentCategoryEnum.Cognitive]: {
        mild: ['Cognitive exercises', 'Memory strategies'],
        moderate: ['Cognitive rehabilitation', 'Environmental modifications'],
        severe: ['Comprehensive cognitive program', 'Caregiver support']
      },
      [AssessmentCategoryEnum.Motor]: {
        mild: ['Strengthening exercises', 'Fine motor activities'],
        moderate: ['Physical/occupational therapy', 'Adaptive equipment'],
        severe: ['Intensive motor rehabilitation', 'Mobility assessment']
      }
    };

    return recommendations[category]?.[severity] || ['Consult with healthcare provider'];
  }

  private adjustForAge(score: number, age: number, assessment: IAssessmentDTO): any {
    // Simple age adjustment - in reality this would be more complex
    let adjustedScore = score;
    if (age > 65) {
      adjustedScore = score * 1.1; // Slight adjustment for older adults
    }
    
    return {
      adjustedScore: Math.min(adjustedScore, assessment.maxScore),
      ageGroup: age < 65 ? 'Adult' : 'Older Adult',
      adjustment: adjustedScore - score
    };
  }
} 