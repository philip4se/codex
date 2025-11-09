export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  birthDate: string;
  role: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  memberId: string;
  countryId?: string;
  provinceId?: string;
  cityId?: string;
  districtId?: string;
  occupationId?: string;
  occupationDetail?: string;
  gender?: string;
}

export interface Region {
  id: string;
  code: string;
  name: string;
  level: number;
  parentId?: string;
}

export interface Occupation {
  id: string;
  code: string;
  name: string;
  category?: string;
}

export interface Survey {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  purpose?: string;
  status: string;
  startDate: string;
  endDate: string;
  targetResponseCount: number;
  currentResponseCount: number;
  estimatedDuration?: number;
  googleSheetUrl?: string;
  googleFormUrl?: string;
  questionnaire?: SurveyQuestionnaire;
  targetCondition?: SurveyTargetCondition;
  reward?: SurveyReward;
  createdAt: string;
}

export interface SurveyQuestionnaire {
  id: string;
  surveyId: string;
  questionsStructure: any;
  totalQuestions: number;
}

export interface SurveyTargetCondition {
  id: string;
  surveyId: string;
  minAge?: number;
  maxAge?: number;
  targetCountries?: string[];
  targetProvinces?: string[];
  targetCities?: string[];
  targetDistricts?: string[];
  targetOccupations?: string[];
  targetGenders?: string[];
}

export interface SurveyReward {
  id: string;
  surveyId: string;
  rewardType?: string;
  rewardName?: string;
  rewardAmount?: number;
  totalRecipients: number;
  distributedCount: number;
}

export interface SurveyParticipation {
  id: string;
  surveyId: string;
  participantId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  answers?: any;
  isEligibleForReward: boolean;
  rewardDistributed: boolean;
  survey?: Survey;
}
