/**
 * 감정(Appraisal) 모듈 액션 타입
 */

// 감정 액션 타입 정의
export type AppraisalAction = 
  | { type: 'APPRAISE_ITEM'; payload: string }
  | { type: 'COMPLETE_APPRAISAL'; payload: { itemId: string; actualValue: number; condition: number } };