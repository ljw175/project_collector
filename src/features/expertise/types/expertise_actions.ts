/**
 * 전문성(Expertise) 모듈 액션 타입
 */

// 전문성 액션 타입 정의
export type ExpertiseAction = 
  | { type: 'UPDATE_EXPERIENCE'; payload: { amount: number; category: string; source: string } }
  | { type: 'UPDATE_REPUTATION'; payload: { contactId: string; amount: number } }
  | { type: 'LEVEL_UP_EXPERTISE'; payload: { category: string } }
  | { type: 'UNLOCK_SKILL'; payload: string }
  | { type: 'ACTIVATE_SKILL'; payload: string };