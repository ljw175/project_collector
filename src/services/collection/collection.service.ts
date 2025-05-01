/**
 * 수집(Collection) 관련 서비스
 * 데이터 액세스와 비즈니스 로직을 관리합니다.
 */
import { 
  collectionEvents, 
  getActiveEvents, 
  getEventById,
  getRarityMultiplier
} from '@data/events/collection-events';
import { generateRandomItem } from '@data/items/common-items';
import { Item, ItemCategory } from '@models/item';
import { 
  CollectionEvent, 
  CollectionOptions, 
  ItemDiscoveryResult 
} from '@features/collection/types/collection_types';

/**
 * 수집 서비스 클래스
 */
export class CollectionService {
  /**
   * 모든 수집 이벤트 가져오기
   */
  getAllEvents(): CollectionEvent[] {
    return collectionEvents;
  }
  
  /**
   * 현재 활성화된 이벤트 가져오기
   */
  getActiveEvents(): CollectionEvent[] {
    return getActiveEvents();
  }
  
  /**
   * ID로 이벤트 조회
   */
  getEventById(eventId: string): CollectionEvent | undefined {
    return getEventById(eventId);
  }
  
  /**
   * 이벤트에서 아이템 생성
   */
  generateItems(event: CollectionEvent, options: CollectionOptions): ItemDiscoveryResult[] {
    const results: ItemDiscoveryResult[] = [];
    
    // 발견할 아이템 수 결정
    let itemCount = this.determineItemCount(options.thoroughness);
    
    // 카테고리 가중치 설정
    const categoryWeights = this.getCategoryWeights(options.focusCategory);
    
    // 이벤트 희귀도에 따른 품질 조정
    const rarityMultiplier = getRarityMultiplier(event.rarity);
    
    // 아이템 생성
    for (let i = 0; i < itemCount; i++) {
      // 랜덤 카테고리 선택 (가중치 적용)
      const category = this.selectWeightedCategory(categoryWeights);
      
      // 품질 결정 (이벤트 희귀도, 카테고리 집중, 훈련도에 따라 결정)
      const quality = this.calculateItemQuality(rarityMultiplier, options, category);
      
      // 아이템 생성 (중앙화된 generateRandomItem 함수 사용)
      const item = generateRandomItem(category);
      
      // 품질에 따른 가치 조정
      item.baseValue = Math.floor(item.baseValue * quality);
      
      // 발견 결과 생성
      const discoveryResult: ItemDiscoveryResult = {
        item,
        quantity: 1,
        isRare: quality > 1.5,
        discoveryText: this.generateDiscoveryText(item, quality),
        cost: event.siteType === 'shop' ? Math.floor(item.baseValue * 0.8) : undefined
      };
      
      results.push(discoveryResult);
    }
    
    return results;
  }
  
  /**
   * 탐색 방식에 따른 아이템 발견 수량 결정
   */
  private determineItemCount(thoroughness: 'casual' | 'focused' | 'meticulous'): number {
    switch (thoroughness) {
      case 'casual':
        return 1 + Math.floor(Math.random() * 2); // 1-2개
      case 'focused':
        return 2 + Math.floor(Math.random() * 2); // 2-3개
      case 'meticulous':
        return 3 + Math.floor(Math.random() * 3); // 3-5개
    }
  }
  
  /**
   * 카테고리 가중치 설정
   */
  private getCategoryWeights(focusCategory?: ItemCategory): Record<ItemCategory, number> {
    const weights: Record<ItemCategory, number> = {
      [ItemCategory.WEAPON]: 1,
      [ItemCategory.JEWELRY]: 1,
      [ItemCategory.ART]: 1,
      [ItemCategory.BOOK]: 1,
      [ItemCategory.HOUSEHOLD]: 1,
      [ItemCategory.MATERIAL]: 1
    };
    
    // 특정 카테고리에 집중하는 경우
    if (focusCategory) {
      weights[focusCategory] = 3; // 해당 카테고리 확률 증가
    }
    
    return weights;
  }
  
  /**
   * 가중치에 따른 카테고리 선택
   */
  private selectWeightedCategory(weights: Record<ItemCategory, number>): ItemCategory {
    const categories = Object.keys(weights) as ItemCategory[];
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    
    let random = Math.random() * totalWeight;
    
    for (const category of categories) {
      random -= weights[category];
      if (random <= 0) {
        return category;
      }
    }
    
    return categories[0]; // 기본값
  }
  
  /**
   * 아이템 품질 계산
   */
  private calculateItemQuality(
    rarityMultiplier: number, 
    options: CollectionOptions, 
    category: ItemCategory
  ): number {
    let quality = rarityMultiplier;
    
    // 해당 카테고리에 집중하는 경우 품질 향상
    if (options.focusCategory === category) {
      quality *= 1.2;
    }
    
    // 훈련도에 따른 품질 조정
    switch (options.thoroughness) {
      case 'casual':
        quality *= 0.9;
        break;
      case 'focused':
        quality *= 1.0;
        break;
      case 'meticulous':
        quality *= 1.2;
        break;
    }
    
    // 약간의 랜덤성 추가
    quality *= 0.8 + Math.random() * 0.4; // ±20% 랜덤 변동
    
    return quality;
  }
  
  /**
   * 발견 텍스트 생성
   */
  private generateDiscoveryText(item: Item, quality: number): string {
    if (quality > 1.5) {
      return `당신은 눈에 띄는 ${item.name}을(를) 발견했습니다! 가치가 높아 보입니다.`;
    } else if (quality > 1.0) {
      return `당신은 꽤 괜찮아 보이는 ${item.name}을(를) 발견했습니다.`;
    } else {
      return `당신은 ${item.name}을(를) 발견했습니다.`;
    }
  }
  
  /**
   * 사용자의 특정 이벤트 참여 가능 여부 체크
   */
  canParticipateEvent(event: CollectionEvent, playerMoney: number, playerReputation: number): boolean {
    // 비용 확인
    if (event.costToEnter && event.costToEnter > playerMoney) {
      return false;
    }
    
    // 평판 확인
    if (event.minimumReputation && event.minimumReputation > playerReputation) {
      return false;
    }
    
    return true;
  }
}

// 싱글톤 인스턴스 생성
export const collectionService = new CollectionService();