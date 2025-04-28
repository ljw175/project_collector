/**
 * 수집(Collection) 관련 타입 정의
 */
import { Item, ItemCategory } from '@models/item';

// 수집 장소 타입
export type CollectionSiteType = 
  | 'shop'       // 상점
  | 'market'     // 시장
  | 'auction'    // 경매장
  | 'estate'     // 유산/부동산
  | 'excavation' // 발굴지
  | 'donation';  // 기부/선물

// 수집 이벤트
export interface CollectionEvent {
  id: string;
  name: string;
  description: string;
  siteType: CollectionSiteType;
  locationId: string;
  availableItems: Item[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  durationDays: number;
  costToEnter?: number;
  requiresExpertise?: ItemCategory[];
  minimumReputation?: number;
}

// 수집 상태
export interface CollectionState {
  activeEvents: CollectionEvent[];
  selectedEventId: string | null;
  discoveredItems: Item[];
  selectedItemIds: string[];
}

// 아이템 발견 결과
export interface ItemDiscoveryResult {
  item: Item;
  quantity: number;
  isRare: boolean;
  discoveryText: string;
  cost?: number;
}

// 수집 옵션
export interface CollectionOptions {
  focusCategory?: ItemCategory;
  budget?: number;
  thoroughness: 'casual' | 'focused' | 'meticulous';
  timeLimit?: number; // 분 단위
}