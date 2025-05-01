/**
 * 달력(Calendar) 모듈 액션 타입
 */

// 달력 액션 타입 정의
export type CalendarAction = 
  | { type: 'SET_CURRENT_DAY'; payload: number }
  | { type: 'SET_CURRENT_MONTH'; payload: number }
  | { type: 'SET_CURRENT_YEAR'; payload: number }
  | { type: 'ADVANCE_DAY'; payload?: number }
  | { type: 'ADD_EVENT'; payload: { id: string; title: string; description: string; type: string; day: number; month: number; year: number; isClosed: boolean; importance: string; locationId?: string } }
  | { type: 'UPDATE_EVENT'; payload: { id: string; isClosed: boolean } }
  | { type: 'REMOVE_EVENT'; payload: string };