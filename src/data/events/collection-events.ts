/**
 * 수집(Collection) 이벤트 데이터
 */
import { CollectionEvent } from '@features/collection/types/collection_types';

/**
 * 수집 이벤트 데이터
 */
export const collectionEvents: CollectionEvent[] = [
  {
    id: 'event1',
    name: '시내 골동품 시장',
    description: '도시 중심가에서 매주 열리는 골동품 시장입니다. 다양한 물건을 저렴하게 찾을 수 있습니다.',
    siteType: 'market',
    locationId: 'city-center',
    availableItems: [],
    rarity: 'common',
    durationDays: 2
  },
  {
    id: 'event2',
    name: '귀족 저택 유산 경매',
    description: '오래된 귀족 가문의 저택에서 유산 정리를 위한 경매가 열립니다. 귀중한 물건이 나올 수 있습니다.',
    siteType: 'estate',
    locationId: 'noble-district',
    availableItems: [],
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
    availableItems: [],
    rarity: 'common',
    durationDays: 7
  },
  {
    id: 'event4',
    name: '마을 벼룩시장',
    description: '지역 주민들이 모여 저렴한 물건을 판매하는 벼룩시장입니다. 간혹 숨겨진 보물을 발견할 수 있습니다.',
    siteType: 'market',
    locationId: 'village-square',
    availableItems: [],
    rarity: 'uncommon',
    durationDays: 3
  },
  {
    id: 'event5',
    name: '폐가 탐색',
    description: '오래된 폐가를 탐색하여 버려진 물건들을 찾습니다. 위험할 수 있지만 보상이 클 수 있습니다.',
    siteType: 'excavation',
    locationId: 'abandoned-house',
    availableItems: [],
    rarity: 'rare',
    durationDays: 1,
    minimumReputation: 10
  },
  {
    id: 'event6',
    name: '귀족 저택 초대',
    description: '지역 귀족이 주최하는 소규모 모임에 초대받았습니다. 고급 물건들을 볼 수 있습니다.',
    siteType: 'estate',
    locationId: 'noble-mansion',
    availableItems: [],
    rarity: 'epic',
    durationDays: 1,
    minimumReputation: 50
  },
  {
    id: 'event7',
    name: '유물 발굴 현장',
    description: '고고학자들이 발굴 중인 현장을 방문합니다. 역사적 가치가 있는 물건을 발견할 수 있습니다.',
    siteType: 'excavation',
    locationId: 'archaeology-site',
    availableItems: [],
    rarity: 'rare',
    durationDays: 2,
    costToEnter: 150,
    minimumReputation: 30
  }
];

/**
 * 활성 이벤트 가져오기
 */
export function getActiveEvents(): CollectionEvent[] {
  // 실제 구현에서는 게임 상태에 따라 활성화된 이벤트만 필터링
  return collectionEvents;
}

/**
 * ID로 이벤트 조회
 */
export function getEventById(eventId: string): CollectionEvent | undefined {
  return collectionEvents.find(event => event.id === eventId);
}

/**
 * 특정 위치의 이벤트 조회
 */
export function getEventsByLocation(locationId: string): CollectionEvent[] {
  return collectionEvents.filter(event => event.locationId === locationId);
}

/**
 * 특정 유형의 이벤트 조회
 */
export function getEventsBySiteType(siteType: string): CollectionEvent[] {
  return collectionEvents.filter(event => event.siteType === siteType);
}

/**
 * 특정 희귀도의 이벤트 조회
 */
export function getEventsByRarity(rarity: 'common' | 'uncommon' | 'rare' | 'epic'): CollectionEvent[] {
  return collectionEvents.filter(event => event.rarity === rarity);
}

/**
 * 이벤트 희귀도 승수 계산
 */
export function getRarityMultiplier(rarity: 'common' | 'uncommon' | 'rare' | 'epic'): number {
  switch (rarity) {
    case 'common': return 1.0;
    case 'uncommon': return 1.2;
    case 'rare': return 1.5;
    case 'epic': return 2.0;
    default: return 1.0;
  }
}