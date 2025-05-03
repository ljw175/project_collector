/**
 * 게임 액션 타입 통합 파일
 */
import { GameSettings, GameState } from '@models/game';

// 기능별 액션 타입 import
import { ExpertiseAction } from '@features/expertise/types/expertise_actions';
import { InventoryAction } from '@features/inventory/types/inventory_actions';
import { AppraisalAction } from '@features/appraisal/types/appraisal_actions';
import { MapAction } from '@features/map/types/map_actions';
import { PlayerAction } from '@features/player/types/player_actions';
import { CalendarAction } from '@features/calendar/types/calendar_actions';
import { Value } from '@/models';

// 기본 게임 액션
export type CoreGameAction =
  | { type: 'SET_PLAYER_NAME'; payload: string }
  | { type: 'UPDATE_MONEY'; payload: Value[] }
  | { type: 'UPDATE_CONVERTED_MONEY'; payload: number }
  | { type: 'CHANGE_LOCATION'; payload: string }
  | { type: 'ADVANCE_DAY'; payload?: number }
  | { type: 'START_AUCTION'; payload: string }
  | { type: 'END_AUCTION' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'LOAD_GAME'; payload: GameState }
  | { type: 'RESET_GAME' };

// 모든 게임 액션 통합 타입
export type GameAction = 
  | CoreGameAction
  | ExpertiseAction
  | InventoryAction
  | AppraisalAction
  | MapAction
  | PlayerAction
  | CalendarAction;