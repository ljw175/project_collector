/**
 * 아이템 관련 타입 정의
 */

// 아이템 태그 유형
export type ItemTag = {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  valueMultiplier: number;  // 가치에 영향을 미치는 승수
  icon: string;            // 태그 아이콘 경로
  color: string;           // 태그 색상 
  isHidden: boolean;       // 감정되지 않은 태그인지 여부
};

// 아이템 기본 타입
export interface BaseItem {
  id: string;
  name: string;
  description: string;
  baseValue: number;      // 기본 가치
  category: ItemCategory; // 카테고리
  isAppraised: boolean;   // 감정 여부
  quantity: number;       // 수량 (스택)
  tags: ItemTag[];        // 아이템 태그 목록
  image?: string;         // 아이템 이미지 경로
}

// 아이템 카테고리 (6대 카테고리)
export enum ItemCategory {
  WEAPON = 'weapon',           // 무기
  JEWELRY = 'jewelry',         // 보석/귀금속
  ART = 'art',                 // 예술/골동품
  BOOK = 'book',               // 서적
  HOUSEHOLD = 'household',     // 생활용품
  MATERIAL = 'material'        // 희귀 재료
}

// 감정된 아이템
export interface AppraisedItem extends BaseItem {
  isAppraised: true;
  actualValue: number;    // 실제 가치 (감정 후)
  condition: number;      // 상태 (0-100)
  history?: string;       // 아이템 이력
}

// 감정되지 않은 아이템
export interface UnappraisedItem extends BaseItem {
  isAppraised: false;
  hiddenTags: ItemTag[];  // 감정되지 않은 숨겨진 태그들
}

// 아이템의 타입 가드 함수
export function isAppraised(item: BaseItem): item is AppraisedItem {
  return item.isAppraised;
}

// 완전한 아이템 타입 (감정 or 미감정)
export type Item = AppraisedItem | UnappraisedItem;

// 아이템 스택 (동일 아이템의 모음)
export interface ItemStack {
  baseItem: UnappraisedItem;
  quantity: number;
}