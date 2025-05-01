/**
 * 경매(Auction) 관련 상수 데이터
 */
import { ItemCategory } from '@models/item';
import { AuctionParticipant, BidStrategy } from '@features/auction/types/auction_types';

/**
 * 입찰 전략별 행동 계수
 */
export const bidStrategyModifiers: Record<string, BidStrategy> = {
    'aggressive': {
      minIncrementMultiplier: 0.1,  // 최소 10% 증가
      maxIncrementMultiplier: 0.2,  // 최대 20% 증가
      bidProbability: 0.7           // 70% 확률로 입찰 시도
    },
    'cautious': {
      minIncrementMultiplier: 0.05, // 최소 5% 증가
      maxIncrementMultiplier: 0.1,  // 최대 10% 증가
      bidProbability: 0.4           // 40% 확률로 입찰 시도
    },
    'unpredictable': {
      minIncrementMultiplier: 0.05, // 최소 5% 증가
      maxIncrementMultiplier: 0.3,  // 최대 30% 증가
      bidProbability: 0.5           // 50% 확률로 입찰 시도
    },
    'balanced': {
      minIncrementMultiplier: 0.08, // 최소 8% 증가
      maxIncrementMultiplier: 0.15, // 최대 15% 증가
      bidProbability: 0.6           // 60% 확률로 입찰 시도
    }
  };
  
  /**
   * 경매 라운드 시간 설정 (초 단위)
   */
  export const bidTimerSettings = {
    default: 30,   // 기본 시간
    relaxed: 45,   // 여유 모드
    challenging: 20 // 도전 모드
  };
  
  /**
   * 경매장 위치 데이터
   */
  export const auctionLocations = [
    {
      id: 'noble-estate',
      name: '귀족 저택',
      description: '도시의 부유한 지역에 위치한 웅장한 저택입니다. 고급 물품이 주로 거래됩니다.',
      minReputationRequired: 20,
      premiumItems: true,
      entryFee: 200
    },
    {
      id: 'merchant-guild',
      name: '상인 길드',
      description: '정기적으로 열리는 상인 길드의 경매입니다. 다양한 물품을 합리적인 가격에 만날 수 있습니다.',
      minReputationRequired: 0,
      premiumItems: false,
      entryFee: 50
    },
    {
      id: 'black-market',
      name: '암시장',
      description: '도시의 그림자 속에 숨겨진 비밀 거래 장소입니다. 희귀한 물건들이 거래되지만 위험할 수 있습니다.',
      minReputationRequired: 10,
      premiumItems: true,
      entryFee: 100,
      illegalChance: 0.3 // 불법 물품 거래 확률
    }
  ];
  
/**
 * 경매 NPC 참가자 데이터
 */
export const auctionNpcs: AuctionParticipant[] = [
  { 
    id: 'npc1', 
    name: '호기심 많은 수집가', 
    isPlayer: false, 
    bidStrategy: bidStrategyModifiers.balanced,
    maxBudget: 3000,
    interestCategories: [ItemCategory.ART, ItemCategory.BOOK]
  },
  { 
    id: 'npc2', 
    name: '부유한 상인', 
    isPlayer: false, 
    bidStrategy: bidStrategyModifiers.aggressive,
    maxBudget: 5000,
    interestCategories: [ItemCategory.JEWELRY, ItemCategory.WEAPON]
  },
  { 
    id: 'npc3', 
    name: '골동품 딜러', 
    isPlayer: false, 
    bidStrategy: bidStrategyModifiers.unpredictable,
    maxBudget: 4000,
    interestCategories: [ItemCategory.ART, ItemCategory.HOUSEHOLD]
  },
  { 
    id: 'npc4', 
    name: '역사학자', 
    isPlayer: false, 
    bidStrategy: bidStrategyModifiers.cautious,
    maxBudget: 2500,
    interestCategories: [ItemCategory.BOOK, ItemCategory.ART]
  },
  { 
    id: 'npc5', 
    name: '무기 수집가', 
    isPlayer: false, 
    bidStrategy: bidStrategyModifiers.aggressive,
    maxBudget: 3500,
    interestCategories: [ItemCategory.WEAPON]
  },
  { 
    id: 'npc6', 
    name: '귀족', 
    isPlayer: false, 
    bidStrategy: bidStrategyModifiers.unpredictable,
    maxBudget: 10000,
    interestCategories: [ItemCategory.JEWELRY, ItemCategory.ART]
  }
];


/**
 * 특정 ID의 NPC 참가자 가져오기
 */
export function getNpcParticipantById(id: string): AuctionParticipant | undefined {
  return auctionNpcs.find(npc => npc.id === id);
}

/**
 * 경매에 참여할 NPC 참가자 랜덤 선택
 */
export function getRandomNpcParticipants(count: number = 3): AuctionParticipant[] {
  // 배열 섞기
  const shuffled = [...auctionNpcs].sort(() => 0.5 - Math.random());
  // 지정된 수만큼 선택
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * 카테고리 관심도에 따른 NPC 필터링
 */
export function getNpcsByInterest(category: ItemCategory): AuctionParticipant[] {
  return auctionNpcs.filter(npc => 
    npc.interestCategories?.includes(category)
  );
}