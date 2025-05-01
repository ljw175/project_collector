/**
 * 인벤토리 관련 타입 정의
 */
import { Item, ItemCategory } from '@models/item';

// 인벤토리 필터 옵션
export interface InventoryFilter {
  searchText: string;
  categories: ItemCategory[];
  isAppraised: boolean;
  minValue: number;
  maxValue: number;
  tags: string[]; // 태그 ID 목록
}

// 인벤토리 정렬 옵션
export type InventorySortOption = 
  | 'name-asc'       // 이름 오름차순
  | 'name-desc'      // 이름 내림차순
  | 'value-asc'      // 가치 오름차순
  | 'value-desc'     // 가치 내림차순
  | 'category'       // 카테고리별
  | 'recent'         // 최근 획득순
  | 'quantity'       // 수량 많은순
  | 'appraised';     // 감정 상태별

// 사용자 정의 폴더/카테고리
export interface CustomFolder {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  itemIds: string[]; // 폴더에 포함된 아이템 ID 목록
}

// 인벤토리 상태
export interface InventoryState {
  items: Item[];
  selectedItemIds: string[];
  activeFilters: InventoryFilter;
  sortOption: InventorySortOption;
  customFolders: CustomFolder[];
  capacity: number; // 최대 소지 가능 아이템 수
}