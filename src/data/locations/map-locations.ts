/**
 * 게임 지도 위치 데이터
 */
import { Location, MapEvent, MapEventType, LocationType, LocationActivity } from '@features/map/types/map_types';

/**
 * 기본 게임 위치 데이터
 */
export const gameLocations: Location[] = [
  {
    id: 'shop',
    name: '골동품 상점',
    description: '오래된 물건들을 파는 상점입니다. 은퇴한 수집가가 운영하며, 종종 희귀한 물건들이 등장합니다.',
    type: LocationType.SHOP,
    coordinates: { x: 45, y: 35 },
    isDiscovered: true,
    isAccessible: true,
    connections: ['market', 'library'],
    availableActivities: [LocationActivity.BUY, LocationActivity.SELL, LocationActivity.TALK],
  },
  {
    id: 'market',
    name: '중앙 시장',
    description: '도시의 중심부에 위치한 번화한 시장입니다. 다양한 상인들이 모여 거래를 합니다.',
    type: LocationType.MARKET,
    coordinates: { x: 60, y: 50 },
    isDiscovered: true,
    isAccessible: true,
    connections: ['shop', 'auction', 'workshop'],
    availableActivities: [LocationActivity.BUY, LocationActivity.SELL, LocationActivity.TALK]
  },
  {
    id: 'auction',
    name: '경매장',
    description: '고급 물품들이 거래되는 경매장입니다. 정기적으로 경매가 열립니다.',
    type: LocationType.AUCTION_HOUSE,
    coordinates: { x: 75, y: 40 },
    isDiscovered: true,
    isAccessible: true,
    connections: ['market', 'collector'],
    availableActivities: [LocationActivity.SELL]
  },
  {
    id: 'workshop',
    name: '장인의 공방',
    description: '노련한 장인이 운영하는 공방입니다. 물건을 수리하거나 개조할 수 있습니다.',
    type: LocationType.WORKSHOP,
    coordinates: { x: 65, y: 65 },
    isDiscovered: true,
    isAccessible: true,
    connections: ['market'],
    availableActivities: [LocationActivity.REPAIR]  
  },
  {
    id: 'library',
    name: '고문서 도서관',
    description: '역사와 골동품에 관한 방대한 자료를 보유한 도서관입니다.',
    type: LocationType.LIBRARY,
    coordinates: { x: 30, y: 45 },
    isDiscovered: true,
    isAccessible: true,
    connections: ['shop'],
    availableActivities: [LocationActivity.RESEARCH]  
  },
  {
    id: 'collector',
    name: '부유한 수집가의 저택',
    description: '희귀 물품을 수집하는 부유한 귀족의 저택입니다. 방문하려면 초대장이 필요합니다.',
    type: LocationType.COLLECTOR,
    coordinates: { x: 85, y: 25 },
    isDiscovered: true,
    isAccessible: false,
    connections: ['auction'],
    availableActivities: [LocationActivity.SELL, LocationActivity.TALK],
    requiredReputation: 30
  },
  {
    id: 'hideout',
    name: '골동품 수집가의 은신처',
    description: '은퇴한 모험가가 운영하는 비밀 은신처입니다. 희귀한 물건을 구할 수 있습니다.',
    type: LocationType.SHOP,
    coordinates: { x: 20, y: 70 },
    isDiscovered: false,
    isAccessible: false,
    connections: ['market'],
    availableActivities: [LocationActivity.BUY, LocationActivity.SELL],
    requiredItemIds: ['special-map-1']
  },
  {
    id: 'landfill',
    name: '도시 외곽 쓰레기장',
    description: '도시의 버려진 물건들이 모이는 곳입니다. 간혹 가치 있는 물건이 숨겨져 있습니다.',
    type: LocationType.COLLECTION_SITE,
    coordinates: { x: 15, y: 85 },
    isDiscovered: true,
    isAccessible: true,
    connections: ['market'],
    availableActivities: [LocationActivity.COLLECT]
  }
];

/**
 * 기본 위치 이벤트 데이터
 */
export const locationEvents: MapEvent[] = [
  {
    id: 'market-festival',
    locationId: 'market',
    title: '봄맞이 시장 축제',
    description: '봄을 맞아 시장에서 특별 축제가 열립니다. 다양한 상인들이 모여 평소보다 저렴한 가격에 물건을 판매합니다.',
    type: MapEventType.FESTIVAL,
    duration: 5,
    startDay: 10,
    isActive: true,
    rewards: {
      money: 500,
      items: ['special-item-1', 'special-item-2'],
      reputation: 10
    },
    requirements: {
      money: 1000,
      reputation: 50,
      itemIds: ['festival-ticket'],
      itemTags: ['festival']
    }
  },
  {
    id: 'auction-special',
    locationId: 'auction',
    title: '특별 경매',
    description: '희귀 유물 컬렉션에 대한 특별 경매가 예정되어 있습니다. 참가하면 평소보다 좋은 물건을 얻을 기회가 있습니다.',
    type: MapEventType.SPECIAL_ITEM,
    duration: 1,
    startDay: 13,
    isActive: false,
    rewards: {
        money: 0,
        items: ['rare-collector-item'],
        reputation: 20
        },
    requirements: {
        money: 2000,
        reputation: 100,
        itemIds: ['auction-invitation'],
        itemTags: ['rare']
    }
  },
  {
    id: 'landfill-find',
    locationId: 'landfill',
    title: '특별 발견 기회',
    description: '최근 매립지에 대규모 폐기물이 들어왔습니다. 좋은 물건을 찾을 확률이 평소보다 높아졌습니다.',
    type: MapEventType.SPECIAL_ITEM,
    duration: 3,
    startDay: 9,
    isActive: true,
    rewards: {
      money: 0,
      items: [],
      reputation: 0
    },
    requirements: {
      money: 0,
      reputation: 0,
      itemIds: [],
      itemTags: []
    }
  }
];

/**
 * ID로 위치 검색
 */
export function getLocationById(id: string): Location | undefined {
  return gameLocations.find(location => location.id === id);
}

/**
 * 이름으로 위치 검색
 */
export function getLocationByName(name: string): Location | undefined {
  return gameLocations.find(location => location.name === name);
}

/**
 * 특정 위치의 이벤트 목록 조회
 */
export function getEventsByLocationId(locationId: string): MapEvent[] {
  return locationEvents.filter(event => event.locationId === locationId);
}

/**
 * 현재 활성화된 이벤트 목록 조회
 */
export function getActiveEvents(currentDay: number): MapEvent[] {
  return locationEvents.filter(event => 
    event.isActive && 
    (event.startDay <= currentDay) && 
    (event.startDay + event.duration >= currentDay)
  );
}