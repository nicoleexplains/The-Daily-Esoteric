export interface EsotericWisdom {
  quote: string;
  source: string;
  topic: string;
  briefInterpretation: string;
}

export interface DailyContent {
  date: string; // ISO Date string YYYY-MM-DD
  wisdom: EsotericWisdom;
  imageUrl?: string;
  fullExplanation?: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface AppError {
  message: string;
  code?: string;
}