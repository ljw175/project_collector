/**
 * 맵(Map) 모듈 액션 타입
 */

// 맵 액션 타입 정의
export type MapAction = 
  | { type: 'SET_CURRENT_LOCATION'; payload: string }
  | { type: 'DISCOVER_LOCATION'; payload: string }
  | { type: 'SET_LOCATION_ACCESSIBLE'; payload: { locationId: string; isAccessible: boolean } }
  | { type: 'MARK_LOCATION'; payload: string | null };