/**
 * 플레이어(Player) 모듈 액션 타입
 */

// 플레이어 액션 타입 정의
export type PlayerAction = 
  | { type: 'SET_PLAYER_NAME'; payload: string }
  | { type: 'SET_HEALTH'; payload: number }
  | { type: 'SET_MENTAL'; payload: number }
  | { type: 'SET_FATIGUE'; payload: number }
  | { type: 'SET_MONEY'; payload: number }
  | { type: 'UPDATE_REPUTATION'; payload: { contactId: string; amount: number } };