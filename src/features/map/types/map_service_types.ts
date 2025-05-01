/**
 * 지도(Map) 관련 인터페이스
 */
import { Player } from '@models/player';

// 여행자 상태 인터페이스 (MapService 전용)
export interface Traveler {
  money: number;
  fatigue: number;  // Player의 fatigue와 매핑됨
  locationId: string;
}

// 여행자 업데이트 인터페이스
export interface TravelerUpdate {
  money?: number;
  fatigue?: number;
  locationId?: string;
  health?: number;
  mental?: number;
}