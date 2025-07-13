export interface IEvaluationDetailDTO {
  evaluationId: string;
  patientId: number;
  patientClientId: number;
  clinicClientId: number;
  clinicId: number;
  fullName: string;
  initial: string;
  lastName: string;
  gender: string;
  birthDate: string;
  evaluationDate: Date;
  therapistType: TherapistTypeEnum;
  evaluationType: EvaluationTypeEnum;
  isComplete: boolean;
  clinicName: string;
  clinicLicense: number;
  defaultPatientAddress: {
    addressId: number,
    postalCode: string,
    houseNumber: number,
    houseNumberAddition: string,
    fullAddress: string,
    street: string,
    city: string,
    isDefault: boolean,
    type: number,
    latitude: number,
    longitude: number
  }
}

export interface ISendEvaluation {
  clinicName: string,
  clinicLicense: string,
  therapistName: string,
  patientName: string,
  patientGender: string,
  patientInitials: string,
  patientId: string,
  clientId: string,
  birthDate: string,
  address: string,
  houseNumber: string,
  city: string,
  street: string,
  postalCode: string,
  addition: string,
  referralSource: string | null,
  referringPhysician: string,
  diagnosisCode: string | null,
  assessments: IAssessmentSend[],
  insights?: any,
}

export interface ISendEvaluationBody {
  evaluationRequest: ISendEvaluation,
  evaluationId: string,
}

export interface IAssessmentSend {
  assessmentName: string,
  assessmentCode: number,
  score: number,
  notes: string,
}

export enum EvaluationTypeEnum {
  Initial = 1,
  Reassessment,
  Discharge,
  Progress,
  Screening,
}

export enum TherapistTypeEnum {
  OT = 1,
  PT = 2,
  ST = 3,
}

export const EVALUATION_TYPES: Record<EvaluationTypeEnum, { label: string, value: EvaluationTypeEnum }> = {
  [EvaluationTypeEnum.Initial]: { label: 'Initial Evaluation', value: EvaluationTypeEnum.Initial },
  [EvaluationTypeEnum.Reassessment]: { label: 'Reassessment', value: EvaluationTypeEnum.Reassessment },
  [EvaluationTypeEnum.Discharge]: { label: 'Discharge Evaluation', value: EvaluationTypeEnum.Discharge },
  [EvaluationTypeEnum.Progress]: { label: 'Progress Note', value: EvaluationTypeEnum.Progress },
  [EvaluationTypeEnum.Screening]: { label: 'Screening', value: EvaluationTypeEnum.Screening }
};

export const THERAPIST_TYPES: Record<TherapistTypeEnum, { label: string, value: TherapistTypeEnum }> = {
  [TherapistTypeEnum.OT]: { label: 'Occupational Therapist', value: TherapistTypeEnum.OT },
  [TherapistTypeEnum.PT]: { label: 'Physical Therapist', value: TherapistTypeEnum.PT },
  [TherapistTypeEnum.ST]: { label: 'Speech Therapist', value: TherapistTypeEnum.ST },
};

export const EVALUATION_STATUS = {
  true: "Completed",
  false: "In Progress",
}

export const EVALUATION_FORM_CONST: { [key: string]: EvaluationFormField } = {
  clinicName: { label: 'Clinic Name', id: 'clinicName', isEditable: false, initiallyDisabled: true },
  clinicLicense: { label: 'License Number', id: 'clinicLicense', isEditable: false, initiallyDisabled: true },
  therapistName: { label: 'Therapist Name', id: 'therapistName', isEditable: true, initiallyDisabled: false, validationText: 'Field is required!' },
  patientName: { label: 'Patient Name', id: 'patientName', isEditable: true, initiallyDisabled: true, validationText: 'Field is required!' },
  patientId: { label: 'Patient ID', id: 'patientId', isEditable: false, initiallyDisabled: true },
  clientId: { label: 'Client ID', id: 'clientId', isEditable: false, initiallyDisabled: true },
  birthDate: { label: 'Date of Birth', id: 'birthDate', isEditable: true, initiallyDisabled: true, validationText: 'Field is required!' },
  postalCode: { label: 'Postal Code', id: 'postalCode', isEditable: true, initiallyDisabled: true, validationText: 'Field is required!' },
  houseNumber: { label: 'House Number', id: 'houseNumber', isEditable: true, initiallyDisabled: true, validationText: 'Field is required!' },
  addition: { label: 'Addition', id: 'addition', isEditable: true, initiallyDisabled: true },
  address: { label: 'Address', id: 'address', isEditable: false, initiallyDisabled: true },
  referringPhysician: { label: 'Referring Physician', id: 'referringPhysician', isEditable: true, initiallyDisabled: false, validationText: 'Field is required!' },
  referralSource: { label: 'Referral Source', id: 'referralSource', isEditable: true, initiallyDisabled: false, validationText: 'Field is required!' },
  diagnosisCode: { label: 'Primary Diagnosis', id: 'diagnosisCode', isEditable: true, initiallyDisabled: false },
  assessments: { label: 'Assessments', id: 'assessments', isEditable: true, initiallyDisabled: false },
}

export interface IEvaluationForm {
  clinicName: string,
  clinicLicense: string,
  therapistName: string,
  patientName: string,
  patientId: string,
  clientId: string,
  birthDate: string,
  postalCode: string,
  houseNumber: string,
  addition: string,
  address: string,
  referringPhysician: string,
  referralSource: string
}

interface EvaluationFormField {
  label: string;
  id: string;
  isEditable: boolean;
  initiallyDisabled: boolean;
  validationText?: string;
} 