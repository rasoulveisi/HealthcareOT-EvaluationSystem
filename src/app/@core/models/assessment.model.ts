export interface IAssessmentDTO {
  id: number;
  name: string;
  code: string;
  category: AssessmentCategoryEnum;
  description: string;
  maxScore: number;
  minScore: number;
  scoringType: ScoringTypeEnum;
  isStandardized: boolean;
  ageRange: {
    min: number;
    max: number;
  };
  administrationTime: number; // in minutes
  instructions: string;
}

export interface IAutoCompleteAssessmentOptions {
  id: number;
  name: string;
  code: string;
  category: string;
  maxScore: number;
  minScore: number;
}

export enum AssessmentCategoryEnum {
  ADL = 1,
  Cognitive,
  Motor,
  Sensory,
  Psychosocial,
  Vocational,
  Environmental,
}

export enum ScoringTypeEnum {
  Numeric = 1,
  Percentage,
  Ordinal,
  Binary,
}

export const ASSESSMENT_CATEGORIES: Record<AssessmentCategoryEnum, { label: string, value: AssessmentCategoryEnum }> = {
  [AssessmentCategoryEnum.ADL]: { label: 'Activities of Daily Living', value: AssessmentCategoryEnum.ADL },
  [AssessmentCategoryEnum.Cognitive]: { label: 'Cognitive', value: AssessmentCategoryEnum.Cognitive },
  [AssessmentCategoryEnum.Motor]: { label: 'Motor Skills', value: AssessmentCategoryEnum.Motor },
  [AssessmentCategoryEnum.Sensory]: { label: 'Sensory Processing', value: AssessmentCategoryEnum.Sensory },
  [AssessmentCategoryEnum.Psychosocial]: { label: 'Psychosocial', value: AssessmentCategoryEnum.Psychosocial },
  [AssessmentCategoryEnum.Vocational]: { label: 'Vocational', value: AssessmentCategoryEnum.Vocational },
  [AssessmentCategoryEnum.Environmental]: { label: 'Environmental', value: AssessmentCategoryEnum.Environmental },
};

export const SCORING_TYPES: Record<ScoringTypeEnum, { label: string, value: ScoringTypeEnum }> = {
  [ScoringTypeEnum.Numeric]: { label: 'Numeric Score', value: ScoringTypeEnum.Numeric },
  [ScoringTypeEnum.Percentage]: { label: 'Percentage', value: ScoringTypeEnum.Percentage },
  [ScoringTypeEnum.Ordinal]: { label: 'Ordinal Scale', value: ScoringTypeEnum.Ordinal },
  [ScoringTypeEnum.Binary]: { label: 'Pass/Fail', value: ScoringTypeEnum.Binary },
};

// Mock assessment data for initial implementation
export const MOCK_ASSESSMENTS: IAssessmentDTO[] = [
  {
    id: 1,
    name: 'Canadian Occupational Performance Measure',
    code: 'COPM',
    category: AssessmentCategoryEnum.ADL,
    description: 'Client-centered outcome measure for occupational performance',
    maxScore: 10,
    minScore: 1,
    scoringType: ScoringTypeEnum.Numeric,
    isStandardized: true,
    ageRange: { min: 8, max: 99 },
    administrationTime: 30,
    instructions: 'Client identifies occupational performance problems and rates performance and satisfaction'
  },
  {
    id: 2,
    name: 'Functional Independence Measure',
    code: 'FIM',
    category: AssessmentCategoryEnum.ADL,
    description: 'Measures functional independence in activities of daily living',
    maxScore: 126,
    minScore: 18,
    scoringType: ScoringTypeEnum.Numeric,
    isStandardized: true,
    ageRange: { min: 18, max: 99 },
    administrationTime: 45,
    instructions: 'Rate each item from 1 (total assistance) to 7 (complete independence)'
  },
  {
    id: 3,
    name: 'Montreal Cognitive Assessment',
    code: 'MoCA',
    category: AssessmentCategoryEnum.Cognitive,
    description: 'Cognitive screening tool for mild cognitive impairment',
    maxScore: 30,
    minScore: 0,
    scoringType: ScoringTypeEnum.Numeric,
    isStandardized: true,
    ageRange: { min: 18, max: 99 },
    administrationTime: 15,
    instructions: 'Administer all items and sum total score'
  },
  {
    id: 4,
    name: 'Nine-Hole Peg Test',
    code: 'NHPT',
    category: AssessmentCategoryEnum.Motor,
    description: 'Measures finger dexterity and hand function',
    maxScore: 300,
    minScore: 10,
    scoringType: ScoringTypeEnum.Numeric,
    isStandardized: true,
    ageRange: { min: 4, max: 99 },
    administrationTime: 10,
    instructions: 'Time patient placing and removing pegs from holes'
  },
  {
    id: 5,
    name: 'Sensory Profile',
    code: 'SP',
    category: AssessmentCategoryEnum.Sensory,
    description: 'Measures sensory processing patterns',
    maxScore: 200,
    minScore: 40,
    scoringType: ScoringTypeEnum.Numeric,
    isStandardized: true,
    ageRange: { min: 3, max: 14 },
    administrationTime: 20,
    instructions: 'Caregiver completes questionnaire about sensory behaviors'
  }
]; 