/**
 * 플레이어 관련 타입 정의
 */
import { ItemCategory, Value } from './item';

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
}

// 캐릭터 기본 정보
export interface CharacterInfo {
  name: string;           // 캐릭터 이름
  age: number;         // 캐릭터 나이
  sex: {
    type: string,
    enum: ["Male", "Female", "None"]
  }; // 성별
  height: number;         // 키 (cm)
  weight: number;         // 몸무게 (kg)
  race: {
    type: string,
    enum: ["Human", "Elf", "Dwarf", "Ain", "Preta", "Dragon", "Bird"] 
  }; // 종족
  background: {
    type: string,
    enum: ["Lower", "Commoner", "Middle", "Noble", "Royal"]
  }; // 배경
  origin: {
    type: string,
    enum: ["Aviarium", "Tirin", "Flusum", "Ulbua", "Bupoli"]
  }; // 출신지


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
  timerPreference: 'relaxed' | 'normal' | 'challenging'; // 경매 타이머 설정
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