/**
 * 전문성(Expertise) 관련 타입 정의
 */
import { ItemCategory } from '@models/item';
import { ExpertiseLevel, Reputation } from '@/models/character';

// 전문성 스킬 정의
export interface ExpertiseSkill {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  level: ExpertiseLevel;
  bonus: {
    expertiseMultiplier: number; // 전문성에 따른 시간 절약 보너스(배수)
    appraisalAccuracy: number;    // 감정 정확도 보너스
    valueIncrease: number;        // 가치 증가율
    sellingPriceBonus: number;    // 판매 가격 보너스
    purchasePriceDiscount: number; // 구매 가격 할인율
    repairQuality: number;        // 수리 품질 보너스
    discoveryChance: number;      // 희귀 아이템 발견 확률
  }
}

// 전문성 향상 요건
export interface ExpertiseRequirement {
  itemsAppraised?: number;       // 감정한 아이템 수
  itemsSold?: number;            // 판매한 아이템 수
  specificItemsFound?: string[]; // 특정 아이템 발견 필요
  contactLevel?: number;         // 특정 연락처 관계 레벨
  experience: number;            // 필요 경험치
}

// 평판 이벤트
export interface ReputationEvent {
  id: string;
  contactId: string;
  title: string;
  description: string;
  requirementsMet: boolean;
  reputationGain: number;
  rewardType: 'item' | 'skill' | 'discount' | 'information';
  rewardId: string;
}

// 전문성 상태
export interface ExpertiseState {
  skills: ExpertiseSkill[];
  unlockedCategories: ItemCategory[];
  contacts: Reputation[];
  pendingEvents: ReputationEvent[];
  activeSkillId: string | null;
}

// 전문성 경험치 획득 소스
export type ExperienceSource = 
  | 'appraisal'
  | 'repair'
  | 'sale'
  | 'discovery'
  | 'network'
  | 'event';