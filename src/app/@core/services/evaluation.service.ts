import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';

import { 
  IEvaluationDetailDTO, 
  ISendEvaluation, 
  ISendEvaluationBody,
  EvaluationTypeEnum,
  TherapistTypeEnum 
} from '../models/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = 'https://jsonplaceholder.typicode.com'; // Mock API for demo

  constructor(private http: HttpClient) {}

  /**
   * Get evaluation details (simulated with mock data)
   * @param evaluationId - The evaluation ID
   * @param token - Authentication token
   * @returns Observable of evaluation details
   */
  getEvaluationDetail(evaluationId: string, token: string): Observable<IEvaluationDetailDTO> {
    // Simulate API call with mock data
    const mockEvaluation: IEvaluationDetailDTO = {
      evaluationId: evaluationId,
      patientId: 12345,
      patientClientId: 67890,
      clinicClientId: 11111,
      clinicId: 1,
      fullName: 'John Doe',
      initial: 'J',
      lastName: 'Doe',
      gender: 'Male',
      birthDate: '1980-05-15',
      evaluationDate: new Date(),
      therapistType: TherapistTypeEnum.OT,
      evaluationType: EvaluationTypeEnum.Initial,
      isComplete: false,
      clinicName: 'Springfield Rehabilitation Center',
      clinicLicense: 12345678,
      defaultPatientAddress: {
        addressId: 1,
        postalCode: '12345',
        houseNumber: 123,
        houseNumberAddition: 'A',
        fullAddress: '123A Main Street, Springfield, IL 12345',
        street: 'Main Street',
        city: 'Springfield',
        isDefault: true,
        type: 1,
        latitude: 39.7817,
        longitude: -89.6501
      }
    };

    return of(mockEvaluation).pipe(delay(500)); // Simulate network delay
  }

  /**
   * Submit evaluation data
   * @param evaluationData - The evaluation data to submit
   * @returns Observable of submission result
   */
  submitEvaluation(evaluationData: ISendEvaluationBody): Observable<any> {
    // Simulate API call to JSONPlaceholder
    return this.http.post(`${this.apiUrl}/posts`, {
      title: `OT Evaluation for ${evaluationData.evaluationRequest.patientName}`,
      body: JSON.stringify(evaluationData),
      userId: 1
    }).pipe(
      map(response => ({
        success: true,
        message: 'Evaluation submitted successfully',
        data: response
      }))
    );
  }

  /**
   * Get evaluation summary statistics
   * @param evaluationId - The evaluation ID
   * @returns Observable of evaluation statistics
   */
  getEvaluationStats(evaluationId: string): Observable<any> {
    // Mock evaluation statistics
    const mockStats = {
      totalAssessments: 5,
      completedAssessments: 3,
      averageScore: 75,
      recommendedGoals: [
        'Improve independence in dressing tasks',
        'Increase fine motor coordination',
        'Enhance cognitive processing speed'
      ],
      priorityAreas: [
        'Activities of Daily Living',
        'Motor Skills',
        'Cognitive Function'
      ]
    };

    return of(mockStats).pipe(delay(300));
  }

  /**
   * Generate evaluation report
   * @param evaluationId - The evaluation ID
   * @returns Observable of report data
   */
  generateReport(evaluationId: string): Observable<any> {
    // Mock report generation
    const mockReport = {
      reportId: `RPT-${evaluationId}-${Date.now()}`,
      generatedDate: new Date(),
      summary: 'Patient demonstrates moderate impairments in ADL tasks with good potential for improvement.',
      recommendations: [
        'Continue OT services 2x/week for 6 weeks',
        'Focus on adaptive equipment training',
        'Implement home exercise program'
      ],
      goals: [
        'Patient will demonstrate independence in dressing within 4 weeks',
        'Patient will improve fine motor skills by 25% within 6 weeks'
      ]
    };

    return of(mockReport).pipe(delay(1000));
  }

  /**
   * Get patient history (using JSONPlaceholder for demo)
   * @param patientId - The patient ID
   * @returns Observable of patient history
   */
  getPatientHistory(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${patientId}/posts`).pipe(
      map(posts => posts.map(post => ({
        date: new Date(Date.now() - Math.random() * 10000000000),
        type: 'Previous Evaluation',
        summary: post.title,
        details: post.body
      })))
    );
  }
} 