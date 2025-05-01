/**
 * 지도(Map) 관련 상수 데이터
 */
import { Location, MapEvent, LocationType, LocationActivity, MapEventType } from '@features/map/types/map_types';

/**
 * 게임 내 위치 데이터
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
    connections: ['market', 'library'],
    availableActivities: [LocationActivity.REPAIR]
  },
  {
    id: 'library',
    name: '고문서 도서관',
    description: '오래된 책과 문서들이 보관된 도서관입니다. 다양한 지식을 얻을 수 있습니다.',
    type: LocationType.LIBRARY,
    coordinates: { x: 30, y: 55 },
    isDiscovered: true,
    isAccessible: true,
    connections: ['shop', 'workshop'],
    availableActivities: [LocationActivity.RESEARCH, LocationActivity.TALK]
  },
  {
    id: 'collector',
    name: '수집가의 저택',
    description: '부유한 수집가가 살고 있는 저택입니다. 가끔 귀중한 물건을 구매하기도 합니다.',
    type: LocationType.COLLECTOR,
    coordinates: { x: 85, y: 25 },
    isDiscovered: false,
    isAccessible: false,
    connections: ['auction'],
    availableActivities: [LocationActivity.SELL, LocationActivity.TALK]
  },
  {
    id: 'guild',
    name: '수집가 길드',
    description: '수집가들의 모임이 있는 곳입니다. 길드 가입과 의뢰를 받을 수 있습니다.',
    type: LocationType.COLLECTOR,
    coordinates: { x: 40, y: 70 },
    isDiscovered: false,
    isAccessible: false,
    connections: ['market', 'workshop'],
    availableActivities: [LocationActivity.SELL, LocationActivity.TALK]
  },
  {
    id: 'tavern',
    name: '여행자의 쉼터',
    description: '여행자들이 모이는 곳으로, 다양한 정보와 소문을 들을 수 있습니다.',
    type: LocationType.SHOP,
    coordinates: { x: 55, y: 30 },
    isDiscovered: true,
    isAccessible: true,
    connections: ['shop', 'market'],
    availableActivities: [LocationActivity.TALK, LocationActivity.REST]
  },
  {
    id: 'ruins',
    name: '고대 유적지',
    description: '도시 외곽에 위치한 오래된 유적지입니다. 희귀한 유물이 발견될 수도 있습니다.',
    type: LocationType.COLLECTION_SITE,
    coordinates: { x: 15, y: 25 },
    isDiscovered: false,
    isAccessible: false,
    connections: ['library'],
    availableActivities: [LocationActivity.COLLECT],
  }
];

/**
 * 위치 유형별 아이콘 매핑
 */
export const locationTypeIcons: Record<LocationType, string> = {
  [LocationType.SHOP]: 'shop',
  [LocationType.MARKET]: 'market',
  [LocationType.AUCTION_HOUSE]: 'auction',
  [LocationType.WORKSHOP]: 'workshop',
  [LocationType.LIBRARY]: 'book',
  [LocationType.COLLECTOR]: 'collector',
  [LocationType.SPECIAL]: 'special',
  [LocationType.COLLECTION_SITE]: 'collection_site'  
};

/**
 * 활동 유형별 아이콘 매핑
 */
export const activityIcons: Record<LocationActivity, string> = {
  [LocationActivity.BUY]: 'buy',
  [LocationActivity.SELL]: 'sell',
  [LocationActivity.TALK]: 'talk',
  [LocationActivity.REPAIR]: 'repair',
  [LocationActivity.RESEARCH]: 'research',
  [LocationActivity.REST]: 'rest',
  [LocationActivity.COLLECT]: 'collect',
  [LocationActivity.APPRAISE]: 'appraise'
  // 추가적인 활동 유형이 필요할 경우 여기에 추가
}; 

/**
 * 게임 내 이벤트 데이터
 */
export const mapEvents: MapEvent[] = [
  {
    id: 'market_sale',
    title: '시장 할인 행사',
    description: '시장에서 대규모 할인 행사가 진행 중입니다.',
    locationId: 'market',
    type: MapEventType.SPECIAL_SALE,
    duration: 3,
    startDay: 1,
    isActive: true,
    rewards: {                  // 이벤트 보상 (옵션)
      money: 0,
      reputation: 5,
      items: ['discount_coupon']
    },
    requirements: {             // 이벤트 참가 요구사항 (옵션)
      money: 0,
      reputation: 0,
      itemIds: [],
      itemTags: []
    }
  },
  {
    id: 'auction_special',
    title: '특별 경매',
    description: '오늘은 특별한 물건들이 경매에 올라옵니다.',
    locationId: 'auction',
    type: MapEventType.SPECIAL_ITEM,
    duration: 1,
    startDay: 4,
    isActive: false,
    rewards: {
      money: 0,
      reputation: 10,
      items: ['rare_item']
    },
    requirements: {
      money: 0,
      reputation: 0,
      itemIds: [],
      itemTags: []
    }
  },
  {
    id: 'library_research',
    title: '고문서 연구회',
    description: '고문서 연구회가 도서관에서 열리고 있습니다. 많은 학자들이 모였습니다.',
    locationId: 'library',
    type: MapEventType.RESEARCH_EVENT,
    duration: 3,
    startDay: 2,
    isActive: true,
    rewards: {
      money: 0,
      reputation: 10,
      items: ['research_notes']
    },
    requirements: {
      money: 0,
      reputation: 0,
      itemIds: [],
      itemTags: []
    }

  },
  {
    id: 'collector_sale',
    title: '수집가의 은밀한 거래',
    description: '부유한 수집가가 비밀리에 자신의 컬렉션 일부를 판매합니다.',
    locationId: 'collector',
    type: MapEventType.SPECIAL_SALE,
    duration: 2,
    startDay: 7,
    isActive: false,
    rewards: {
        money: 0,
        reputation: 15,
        items: ['collector_item']
        },
    requirements: {
        money: 0,
        reputation: 0,
        itemIds: [],
        itemTags: []
    }
  },
  {
    id: 'guild_recruitment',
    title: '길드 신입 모집',
    description: '수집가 길드에서 새로운 회원을 모집하고 있습니다.',
    locationId: 'guild',
    type: MapEventType.AUCTION,
    duration: 5,
    startDay: 5,
    isActive: false,
    rewards: {
      money: 0,
      reputation: 20,
      items: ['guild_badge']
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
 * 이벤트 타입별 효과
 */
export const eventTypeEffects: Record<MapEventType, { 
  description: string;
  effect: string;
}> = {
  [MapEventType.SPECIAL_SALE]: {
    description: '판매 가격이 낮아집니다.',
    effect: 'price_reduction'
  },
  [MapEventType.SPECIAL_ITEM]: {
    description: '특별한 아이템이 경매에 올라옵니다.',
    effect: 'auction_items'
  },
  [MapEventType.RESEARCH_EVENT]: {
    description: '연구 효율이 증가합니다.',
    effect: 'research_boost'
  },
  [MapEventType.AUCTION]: {
    description: '희귀한 아이템을 구매할 수 있습니다.',
    effect: 'rare_items'
  },
  [MapEventType.FESTIVAL]: {
    description: '특별한 축제가 열립니다.',
    effect: 'festival_bonus'
  },
  [MapEventType.COMPETITION]: {
    description: '경쟁이 열립니다.',
    effect: 'competition_reward'
  },
  [MapEventType.DISASTER]: {
    description: '재해가 발생합니다.',
    effect: 'disaster_penalty'
  },
  [MapEventType.MARKET]: {
    description: '시장이 열립니다.',
    effect: 'market_special'
  },
};

/**
 * 위치 간 이동 비용 (시간)
 */
export const travelTimeCosts: Record<string, Record<string, number>> = {
  'market': {
    'shop': 1,
    'auction': 1,
    'workshop': 1,
    'library': 2,
    'collector': 3,
    'guild': 2,
    'tavern': 1
  },
  'shop': {
    'market': 1,
    'library': 2,
    'tavern': 1
  },
  'auction': {
    'market': 1,
    'collector': 2
  },
  'workshop': {
    'market': 1,
    'library': 2,
    'guild': 1
  },
  'library': {
    'shop': 2,
    'workshop': 2,
    'ruins': 3
  },
  'collector': {
    'auction': 2
  },
  'guild': {
    'market': 2,
    'workshop': 1
  },
  'tavern': {
    'shop': 1,
    'market': 1
  },
  'ruins': {
    'library': 3
  }
};

/**
 * 위치 간 이동 금전적 비용
 */
export const travelMoneyCosts: Record<string, Record<string, number>> = {
  'market': {
    'shop': 5,
    'auction': 5,
    'workshop': 5,
    'library': 10,
    'collector': 20,
    'guild': 10,
    'tavern': 5
  },
  'shop': {
    'market': 5,
    'library': 10,
    'tavern': 5
  },
  'auction': {
    'market': 5,
    'collector': 15
  },
  'workshop': {
    'market': 5,
    'library': 10,
    'guild': 5
  },
  'library': {
    'shop': 10,
    'workshop': 10,
    'ruins': 25
  },
  'collector': {
    'auction': 15
  },
  'guild': {
    'market': 10,
    'workshop': 5
  },
  'tavern': {
    'shop': 5,
    'market': 5
  },
  'ruins': {
    'library': 25
  }
};

/**
 * 위치 ID로 위치 객체 찾기
 */
export function getLocationById(locationId: string): Location | undefined {
  return gameLocations.find(location => location.id === locationId);
}

/**
 * 활동 유형별 위치 찾기
 */
export function getLocationsByActivity(activity: LocationActivity): Location[] {
  return gameLocations.filter(
    location => location.isDiscovered && location.availableActivities.includes(activity)
  );
}

/**
 * 두 위치 간 이동 비용 계산
 */
export function calculateTravelCost(fromId: string, toId: string): { time: number; money: number } {
  const defaultTimeCost = 2;
  const defaultMoneyCost = 10;
  
  const timeCost = travelTimeCosts[fromId]?.[toId] || defaultTimeCost;
  const moneyCost = travelMoneyCosts[fromId]?.[toId] || defaultMoneyCost;
  
  return { time: timeCost, money: moneyCost };
}