/**
 * 인벤토리 관련 상수 데이터
 */
import { InventorySortOption, InventoryFilter } from '@features/inventory/types/inventory_types';
import { ItemCategory } from '@models/item';

/**
 * 인벤토리 정렬 옵션
 */
export const sortOptions: Record<InventorySortOption, string> = {
  'recent': '최근 획득순',
  'name-asc': '이름 (오름차순)',
  'name-desc': '이름 (내림차순)',
  'value-asc': '가치 (오름차순)',
  'value-desc': '가치 (내림차순)',
  'category': '카테고리',
  'quantity': '수량',
  'appraised': '감정 상태'
};

/**
 * 카테고리별 표시 레이블
 */
export const categoryLabels: Record<ItemCategory, string> = {
  [ItemCategory.WEAPON]: '무기',
  [ItemCategory.JEWELRY]: '보석/장신구',
  [ItemCategory.ART]: '예술품',
  [ItemCategory.BOOK]: '서적',
  [ItemCategory.HOUSEHOLD]: '생활용품',
  [ItemCategory.MATERIAL]: '재료'
};

/**
 * 필터 유형별 레이블
 */
export const filterLabels: Record<keyof InventoryFilter, string> = {
  searchText: '검색어',
  categories: '카테고리',
  isAppraised: '감정 상태',
  minValue: '최소 가치',
  maxValue: '최대 가치',
  tags: '태그' // 태그 ID 목록
};

/**
 * 필터 값 레이블
 */
export const filterValueLabels: Record<string, { [key: string]: string }> = {
  appraised: {
    true: '감정된 아이템',
    false: '감정되지 않은 아이템'
  }
};

/**
 * 가치 범위 옵션
 */
export const valueRangeOptions = [
  { label: '모든 가치', min: undefined, max: undefined },
  { label: '100 미만', min: undefined, max: 100 },
  { label: '100-500', min: 100, max: 500 },
  { label: '500-1000', min: 500, max: 1000 },
  { label: '1000 이상', min: 1000, max: undefined }
];

/**
 * 인벤토리 용량 제한
 */
export const inventoryCapacityLimits = {
  basic: 30,
  expanded: 50,
  premium: 100
};