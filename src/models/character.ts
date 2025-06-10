/**
 * 캐릭터 관련 타입 정의
 */
import { ItemCategory, Value } from './item';
import { 
  CharacterSexEnum, 
  CharacterRaceEnum, 
  CharacterBackgroundEnum, 
  CharacterOriginEnum, 
  CharacterPersonalityEnum
} from '../../src/data/constants/character-constants';

// 전문성 레벨 (각 카테고리별 캐릭터 전문 지식)
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

// 캐릭터 영향력
export interface CharacterInfluence {
  influence: number; // 영향력 (명성 - 은폐된 명성)
  fame: number;      // 명성
  veil: number;      // 베일 (은폐된 명성)
}

// 캐릭터 상태
export interface CharacterStatus {
  hp: number;          // 체력
  maxHp: number;
  mp: number;          // 정신력
  maxMp: number;
  fp: number;         // 피로도
  maxFp: number;
  sanity: number;     // 이성
  maxSanity: number;
  hunger: number;     // 배고픔
  maxHunger: number;
  cash: Value[];
  convertedMoney: number; // 환산 가치 (통화의 총합)
  influence: CharacterInfluence[]; // 영향력
}

// 캐릭터 기본 정보
export interface CharacterInfo {
  name: string;           // 캐릭터 이름
  age: number;         // 캐릭터 나이
  sex: {
    type: string,
    enum: typeof CharacterSexEnum
  }; // 성별
  height: number;         // 키 (cm)
  weight: number;         // 몸무게 (kg)
  race: {
    type: string,
    enum: typeof CharacterRaceEnum
  }; // 종족
  background: {
    type: string,
    enum: typeof CharacterBackgroundEnum
  }; // 배경
  origin: {
    type: string,
    enum: typeof CharacterOriginEnum
  }; // 출신지
  personality?: {
    type: string,
    enum: typeof CharacterPersonalityEnum
  }; // 성격
  history?: string;    // 이력
  image?: string;      // 캐릭터 이미지 경로
  description?: string; // 캐릭터 설명
  faction?: string;    // 소속 세력
  hobbies?: string[]; // 취미
}

// 플레이어 주요 정보
export interface Player {
  id: string;
  info: CharacterInfo;
  level: number;
  experience: number;
  reputation: Reputation[]; // 평판
  expertise: CategoryExpertise;
  status: CharacterStatus;
  daysPassed: number;     // 게임 내 경과 일수
}

// NPC 주요 정보
export interface NPC {
  id: string;
  info: CharacterInfo;
  level: number;
  experience: number;
  reputation: Reputation[]; // 평판
  expertise: CategoryExpertise;
  status: CharacterStatus;
  daysPassed: number;     // 게임 내 경과 일수
}

// 캐릭터 통계
export interface Statistics {
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