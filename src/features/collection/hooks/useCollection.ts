/**
 * 수집(Collection) 기능을 위한 커스텀 훅
 */
import { useState, useCallback, useMemo } from 'react';
import { useGameState } from '@store/gameContext';
import { Item, ItemCategory } from '@models/item';
import { 
  CollectionEvent, 
  CollectionOptions, 
  ItemDiscoveryResult 
} from '../types/collection_types';

export function useCollection() {
  const { state, dispatch } = useGameState();
  const [activeEvents, setActiveEvents] = useState<CollectionEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CollectionEvent | null>(null);
  const [discoveredItems, setDiscoveredItems] = useState<Item[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [collectionOptions, setCollectionOptions] = useState<CollectionOptions>({
    thoroughness: 'casual'
  });
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectionResults, setCollectionResults] = useState<ItemDiscoveryResult[]>([]);

  // 사용 가능한 수집 이벤트 로드
  const loadEvents = useCallback(() => {
    // 실제 구현에서는 서버나 게임 상태에서 이벤트를 가져옴
    // 지금은 예시 더미 데이터 생성
    
    const mockEvents: CollectionEvent[] = [
      {
        id: 'event1',
        name: '시내 골동품 시장',
        description: '도시 중심가에서 매주 열리는 골동품 시장입니다. 다양한 물건을 저렴하게 찾을 수 있습니다.',
        siteType: 'market',
        locationId: 'city-center',
        availableItems: [], // 실제로는 아이템 목록이 필요
        rarity: 'common',
        durationDays: 2
      },
      {
        id: 'event2',
        name: '귀족 저택 유산 경매',
        description: '오래된 귀족 가문의 저택에서 유산 정리를 위한 경매가 열립니다. 귀중한 물건이 나올 수 있습니다.',
        siteType: 'estate',
        locationId: 'noble-district',
        availableItems: [], // 실제로는 아이템 목록이 필요
        rarity: 'rare',
        durationDays: 1,
        costToEnter: 200,
        minimumReputation: 20
      },
      {
        id: 'event3',
        name: '골동품 상점 방문',
        description: '기본적인 골동품 상점입니다. 항상 방문 가능하지만 특별한 물건은 적습니다.',
        siteType: 'shop',
        locationId: 'antique-shop',
        availableItems: [], // 실제로는 아이템 목록이 필요
        rarity: 'common',
        durationDays: 7
      }
    ];
    
    setActiveEvents(mockEvents);
    return mockEvents;
  }, []);

  // 이벤트 선택
  const selectEvent = useCallback((eventId: string) => {
    const event = activeEvents.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setDiscoveredItems([]);
      setSelectedItemIds([]);
      setCollectionResults([]);
    }
  }, [activeEvents]);

  // 수집 옵션 변경
  const updateOptions = useCallback((newOptions: Partial<CollectionOptions>) => {
    setCollectionOptions(prev => ({
      ...prev,
      ...newOptions
    }));
  }, []);

  // 수집 시작
  const startCollection = useCallback(() => {
    if (!selectedEvent || isCollecting) return;
    
    // 비용 지불이 필요한 이벤트인 경우 확인
    if (selectedEvent.costToEnter && selectedEvent.costToEnter > state.player.money) {
      // 돈이 부족함
      return false;
    }
    
    // 평판 요구사항이 있는 경우 확인
    if (selectedEvent.minimumReputation && 
        selectedEvent.minimumReputation > state.player.reputation) {
      // 평판이 부족함
      return false;
    }
    
    // 진입 비용 지불
    if (selectedEvent.costToEnter) {
      dispatch({ type: 'UPDATE_MONEY', payload: -selectedEvent.costToEnter });
    }
    
    setIsCollecting(true);
    
    // 현실적으로는 여기서 타이머나 애니메이션을 시작하고
    // 완료되면 completeCollection 호출
    
    // 예시에서는 즉시 아이템 생성
    const discoveryResults = generateItems(selectedEvent, collectionOptions);
    
    // 수집 완료 처리
    setTimeout(() => {
      completeCollection(discoveryResults);
    }, 1000); // 1초 후 완료 (실제로는 더 오래 걸리거나 UI 이벤트에 따라 달라짐)
    
    return true;
  }, [selectedEvent, isCollecting, state.player, collectionOptions, dispatch]);

  // 수집 완료
  const completeCollection = useCallback((results: ItemDiscoveryResult[]) => {
    setIsCollecting(false);
    setCollectionResults(results);
    
    // 발견한 아이템 추가
    const newItems = results.map(result => result.item);
    setDiscoveredItems(newItems);
    
    // 인벤토리에 아이템 추가 
    // (실제로는 여기서 바로 추가하지 않고, 사용자가 선택한 아이템만 추가할 수도 있음)
    // newItems.forEach(item => {
    //   dispatch({ type: 'ADD_ITEM', payload: item });
    // });
    
  }, []);

  // 아이템 선택 토글
  const toggleSelectItem = useCallback((itemId: string) => {
    setSelectedItemIds(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);

  // 선택한 아이템 획득
  const acquireSelectedItems = useCallback(() => {
    if (selectedItemIds.length === 0) return;
    
    // 선택한 아이템 수집
    const itemsToAcquire = discoveredItems.filter(item => 
      selectedItemIds.includes(item.id)
    );
    
    // 인벤토리에 추가
    itemsToAcquire.forEach(item => {
      dispatch({ type: 'ADD_ITEM', payload: item });
    });
    
    // 비용 지불 (필요한 경우)
    const totalCost = collectionResults
      .filter(result => selectedItemIds.includes(result.item.id) && result.cost)
      .reduce((sum, result) => sum + (result.cost || 0), 0);
    
    if (totalCost > 0) {
      dispatch({ type: 'UPDATE_MONEY', payload: -totalCost });
    }
    
    // 결과 재설정
    setDiscoveredItems([]);
    setSelectedItemIds([]);
    setCollectionResults([]);
    
    return true;
  }, [selectedItemIds, discoveredItems, collectionResults, dispatch]);

  // 수집 가능한지 확인
  const canStartCollection = useMemo(() => {
    if (!selectedEvent || isCollecting) return false;
    
    // 비용 확인
    if (selectedEvent.costToEnter && 
        selectedEvent.costToEnter > state.player.money) {
      return false;
    }
    
    // 평판 확인
    if (selectedEvent.minimumReputation && 
        selectedEvent.minimumReputation > state.player.reputation) {
      return false;
    }
    
    return true;
  }, [selectedEvent, isCollecting, state.player]);

  // 내부 헬퍼 함수: 아이템 생성
  const generateItems = (event: CollectionEvent, options: CollectionOptions): ItemDiscoveryResult[] => {
    // 실제 구현에서는 더 복잡한 알고리즘으로 아이템 생성
    // 지금은 간단한 예시 구현
    
    const results: ItemDiscoveryResult[] = [];
    
    // 발견할 아이템 수 결정
    let itemCount = 0;
    switch (options.thoroughness) {
      case 'casual':
        itemCount = 1 + Math.floor(Math.random() * 2); // 1-2개
        break;
      case 'focused':
        itemCount = 2 + Math.floor(Math.random() * 2); // 2-3개
        break;
      case 'meticulous':
        itemCount = 3 + Math.floor(Math.random() * 3); // 3-5개
        break;
    }
    
    // 카테고리 가중치 설정
    let categoryWeights: Record<ItemCategory, number> = {
      [ItemCategory.WEAPON]: 1,
      [ItemCategory.JEWELRY]: 1,
      [ItemCategory.ART]: 1,
      [ItemCategory.BOOK]: 1,
      [ItemCategory.HOUSEHOLD]: 1,
      [ItemCategory.MATERIAL]: 1
    };
    
    // 특정 카테고리에 집중하는 경우
    if (options.focusCategory) {
      categoryWeights[options.focusCategory] = 3; // 해당 카테고리 확률 증가
    }
    
    // 이벤트 희귀도에 따른 품질 조정
    const rarityMultiplier = getRarityMultiplier(event.rarity);
    
    // 아이템 생성
    for (let i = 0; i < itemCount; i++) {
      // 랜덤 카테고리 선택 (가중치 적용)
      const category = selectWeightedCategory(categoryWeights);
      
      // 아이템 ID 생성
      const itemId = `item-${Date.now()}-${i}`;
      
      // 품질 결정 (이벤트 희귀도, 카테고리 집중, 훈련도에 따라 결정)
      const quality = calculateItemQuality(rarityMultiplier, options, category);
      
      // 가격 결정
      const baseValue = 50 + Math.floor(Math.random() * 50 * quality);
      
      // 아이템 생성
      const item: Item = {
        id: itemId,
        name: generateItemName(category, quality),
        description: generateItemDescription(category, quality),
        baseValue,
        category,
        isAppraised: false,
        quantity: 1,
        tags: [],
        hiddenTags: [] // 실제로는 여기에 감정되지 않은 태그들이 들어감
      };
      
      // 발견 결과 생성
      const discoveryResult: ItemDiscoveryResult = {
        item,
        quantity: 1,
        isRare: quality > 1.5,
        discoveryText: generateDiscoveryText(item, quality),
        cost: event.siteType === 'shop' ? Math.floor(baseValue * 0.8) : undefined
      };
      
      results.push(discoveryResult);
    }
    
    return results;
  };

  // 아이템 이름 생성 (내부 헬퍼 함수)
  const generateItemName = (category: ItemCategory, quality: number): string => {
    // 실제 구현에서는 더 복잡한 이름 생성 로직 필요
    const qualityPrefix = quality > 1.5 ? '희귀한 ' : 
                           quality > 1.0 ? '좋은 ' : '';
    
    switch (category) {
      case ItemCategory.WEAPON:
        return `${qualityPrefix}고대 검`;
      case ItemCategory.JEWELRY:
        return `${qualityPrefix}은 목걸이`;
      case ItemCategory.ART:
        return `${qualityPrefix}풍경화`;
      case ItemCategory.BOOK:
        return `${qualityPrefix}오래된 서적`;
      case ItemCategory.HOUSEHOLD:
        return `${qualityPrefix}도자기 그릇`;
      case ItemCategory.MATERIAL:
        return `${qualityPrefix}희귀한 광석`;
      default:
        return `${qualityPrefix}알 수 없는 물건`;
    }
  };

  // 아이템 설명 생성 (내부 헬퍼 함수)
  const generateItemDescription = (category: ItemCategory, quality: number): string => {
    // 실제 구현에서는 더 복잡한 설명 생성 로직 필요
    const qualityDesc = quality > 1.5 ? '뛰어난 품질의 ' : 
                         quality > 1.0 ? '괜찮은 상태의 ' : '평범한 ';
    
    switch (category) {
      case ItemCategory.WEAPON:
        return `${qualityDesc}오래된 전투용 검입니다. 몇 세기 전에 만들어진 것으로 보입니다.`;
      case ItemCategory.JEWELRY:
        return `${qualityDesc}은으로 만들어진 목걸이입니다. 정교한 세공이 돋보입니다.`;
      case ItemCategory.ART:
        return `${qualityDesc}풍경화입니다. 아름다운 자연 풍경이 묘사되어 있습니다.`;
      case ItemCategory.BOOK:
        return `${qualityDesc}오래된 서적입니다. 시간의 흔적이 남아있습니다.`;
      case ItemCategory.HOUSEHOLD:
        return `${qualityDesc}도자기로 만든 그릇입니다. 생활용품으로 사용되었던 것 같습니다.`;
      case ItemCategory.MATERIAL:
        return `${qualityDesc}희귀한 광석입니다. 빛에 따라 색상이 변합니다.`;
      default:
        return `${qualityDesc}용도를 알 수 없는 물건입니다.`;
    }
  };

  // 발견 텍스트 생성 (내부 헬퍼 함수)
  const generateDiscoveryText = (item: Item, quality: number): string => {
    if (quality > 1.5) {
      return `당신은 눈에 띄는 ${item.name}을(를) 발견했습니다! 가치가 높아 보입니다.`;
    } else if (quality > 1.0) {
      return `당신은 꽤 괜찮아 보이는 ${item.name}을(를) 발견했습니다.`;
    } else {
      return `당신은 ${item.name}을(를) 발견했습니다.`;
    }
  };

  // 희귀도 승수 계산 (내부 헬퍼 함수)
  const getRarityMultiplier = (rarity: 'common' | 'uncommon' | 'rare' | 'epic'): number => {
    switch (rarity) {
      case 'common': return 1.0;
      case 'uncommon': return 1.2;
      case 'rare': return 1.5;
      case 'epic': return 2.0;
      default: return 1.0;
    }
  };

  // 가중치에 따른 카테고리 선택 (내부 헬퍼 함수)
  const selectWeightedCategory = (weights: Record<ItemCategory, number>): ItemCategory => {
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
  };

  // 아이템 품질 계산 (내부 헬퍼 함수)
  const calculateItemQuality = (
    rarityMultiplier: number, 
    options: CollectionOptions, 
    category: ItemCategory
  ): number => {
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
  };

  // 초기 데이터 로드
  // useEffect(() => {
  //   loadEvents();
  // }, [loadEvents]);

  return {
    activeEvents,
    selectedEvent,
    discoveredItems,
    selectedItemIds,
    collectionOptions,
    isCollecting,
    collectionResults,
    canStartCollection,
    
    loadEvents,
    selectEvent,
    updateOptions,
    startCollection,
    toggleSelectItem,
    acquireSelectedItems
  };
}