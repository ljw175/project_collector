/**
 * 플레이어 관련 타입 정의
 */
import { ItemCategory } from './item';

// 전문성 레벨 (각 카테고리별 플레이어 전문 지식)
export enum ExpertiseLevel {
  BEGINNER = 0,      // 초보자
  AMATEUR = 1,     // 아마추어
  INTERMEDIATE = 2,     // 숙련자
  EXPERT = 3,      // 전문가
  MASTER = 4       // 대가
}

// 카테고리별 전문성
export type CategoryExpertise = {
  [key in ItemCategory]: {
    level: ExpertiseLevel;
    experience: number;
    nextLevelThreshold: number;
  }
};

// 평판 (상인, 조합 등과의 관계)
export interface Reputation {
  id: string;
  name: string;
  description: string;
  level: number;
  category: ItemCategory;
  location: string;
  services: string[];
  faction: string;
  relationshipLevel: number; // 0-100
  specialties: ItemCategory[];
  buyingBonus?: number;      // 구매 가격 보너스
  sellingBonus?: number;     // 판매 가격 보너스
  unlockThreshold: number;   // 관계 해제 임계값
  isUnlocked: boolean;       // 해제 여부
  reputationScore: number;
  nextLevelThreshold: number;
}

// 플레이어 상태
export interface PlayerStatus {
  health: number;          // 체력
  mental: number;          // 정신력
  fatigue: number;         // 피로도
  maxHealth: number;
  maxMental: number;
  maxFatigue: number;
}

// 플레이어 주요 정보
export interface Player {
  id: string;
  name: string;
  level: number;
  experience: number;
  money: number;
  reputation: number;
  expertise: CategoryExpertise;
  contacts: Reputation[];
  status: PlayerStatus;
  daysPassed: number;     // 게임 내 경과 일수
  timerPreference: 'relaxed' | 'normal' | 'challenging'; // 경매 타이머 설정
}

// 플레이어 통계
export interface PlayerStats {
  itemsAppraised: number;
  itemsSold: number;
  auctionsWon: number;
  auctionsLost: number;
  moneyEarned: number;
  moneySpent: number;
  bestDeal: {
    itemName: string;
    profit: number;
  }
}