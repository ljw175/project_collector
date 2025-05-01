/**
 * 인벤토리 관리 서비스
 * 인벤토리 아이템 관리, 필터링, 정렬 등의 기능을 제공합니다.
 */
import { Item, ItemCategory, isAppraised } from '@models/item';
import { InventoryFilter, InventorySortOption } from '@features/inventory/types/inventory_types';
import { 
  sortOptions,
  categoryLabels,
  valueRangeOptions,
  inventoryCapacityLimits
} from '@data/constants/inventory-constants';

/**
 * 인벤토리 서비스 클래스
 */
export class InventoryService {
  /**
   * 인벤토리 정렬 옵션 조회
   */
  getSortOptions(): Record<InventorySortOption, string> {
    return sortOptions;
  }
  
  /**
   * 카테고리 레이블 조회
   */
  getCategoryLabels(): Record<ItemCategory, string> {
    return categoryLabels;
  }
  
  /**
   * 가치 범위 옵션 조회
   */
  getValueRangeOptions() {
    return valueRangeOptions;
  }
  
  /**
   * 인벤토리 용량 제한 조회
   */
  getInventoryCapacityLimit(tier: 'basic' | 'expanded' | 'premium' = 'basic'): number {
    return inventoryCapacityLimits[tier];
  }
  
  /**
   * 아이템 필터링
   */
  filterItems(items: Item[], filter: InventoryFilter): Item[] {
    let result = [...items];

    // 텍스트 검색
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchLower) || 
        item.description.toLowerCase().includes(searchLower)
      );
    }

    // 카테고리 필터
    if (filter.categories && filter.categories.length > 0) {
      result = result.filter(item => 
        filter.categories?.includes(item.category)
      );
    }

    // 감정 상태 필터
    if (filter.isAppraised !== undefined) {
      result = result.filter(item => 
        item.isAppraised === filter.isAppraised
      );
    }

    // 가치 범위 필터
    if (filter.minValue !== undefined || filter.maxValue !== undefined) {
      result = result.filter(item => {
        const value = isAppraised(item) ? item.actualValue : item.baseValue;
        
        if (filter.minValue !== undefined && value < filter.minValue) {
          return false;
        }
        
        if (filter.maxValue !== undefined && value > filter.maxValue) {
          return false;
        }
        
        return true;
      });
    }

    // 태그 필터
    if (filter.tags && filter.tags.length > 0) {
      result = result.filter(item => 
        item.tags.some(tag => filter.tags?.includes(tag.id))
      );
    }

    return result;
  }

  /**
   * 아이템 정렬
   */
  sortItems(items: Item[], sortOption: InventorySortOption): Item[] {
    const sorted = [...items];

    switch (sortOption) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      
      case 'value-asc':
        return sorted.sort((a, b) => {
          const valueA = isAppraised(a) ? a.actualValue : a.baseValue;
          const valueB = isAppraised(b) ? b.actualValue : b.baseValue;
          return valueA - valueB;
        });
      
      case 'value-desc':
        return sorted.sort((a, b) => {
          const valueA = isAppraised(a) ? a.actualValue : a.baseValue;
          const valueB = isAppraised(b) ? b.actualValue : b.baseValue;
          return valueB - valueA;
        });
      
      case 'category':
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      
      case 'quantity':
        return sorted.sort((a, b) => b.quantity - a.quantity);
      
      case 'appraised':
        return sorted.sort((a, b) => {
          if (a.isAppraised === b.isAppraised) return 0;
          return a.isAppraised ? -1 : 1;
        });
      
      case 'recent':
      default:
        // 여기서는 ID로 정렬 (실제로는 획득 시간 필드가 있을 수 있음)
        return sorted.sort((a, b) => b.id.localeCompare(a.id));
    }
  }

  /**
   * 인벤토리 아이템 총 가치 계산
   */
  calculateTotalValue(items: Item[]): number {
    return items.reduce((total, item) => {
      const value = isAppraised(item) ? item.actualValue : item.baseValue;
      return total + (value * item.quantity);
    }, 0);
  }

  /**
   * 인벤토리 아이템 카테고리별 통계
   */
  getCategoryStats(items: Item[]): Record<ItemCategory, number> {
    const stats: Record<ItemCategory, number> = {
      [ItemCategory.WEAPON]: 0,
      [ItemCategory.JEWELRY]: 0,
      [ItemCategory.ART]: 0,
      [ItemCategory.BOOK]: 0,
      [ItemCategory.HOUSEHOLD]: 0,
      [ItemCategory.MATERIAL]: 0
    };

    items.forEach(item => {
      stats[item.category] += item.quantity;
    });

    return stats;
  }

  /**
   * 인벤토리에 동일한 아이템이 있는지 확인
   */
  hasSimilarItem(inventory: Item[], newItem: Item): Item | null {
    // 실제 구현에서는 더 복잡한 비교 로직이 필요할 수 있음
    return inventory.find(item => 
      item.name === newItem.name && 
      item.category === newItem.category &&
      item.isAppraised === newItem.isAppraised
    ) || null;
  }
  
  /**
   * 인벤토리 용량 확인
   */
  isInventoryFull(inventory: Item[], capacityTier: 'basic' | 'expanded' | 'premium' = 'basic'): boolean {
    const totalItems = inventory.reduce((count, item) => count + item.quantity, 0);
    return totalItems >= this.getInventoryCapacityLimit(capacityTier);
  }
}

// 싱글톤 인스턴스 생성
export const inventoryService = new InventoryService();