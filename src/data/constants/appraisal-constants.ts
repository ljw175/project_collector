/**
 * 감정(Appraisal) 관련 상수 데이터
 */
import { AppraisalOptions, AppraisalTool } from '@features/appraisal/types/appraisal_types';
import { ItemCategory } from '@models/item';

/**
 * 감정 꼼꼼함에 따른 시간 계수
 */
export const appraisalTimeMultipliers: Record<AppraisalOptions['thoroughness'], number> = {
  'quick': 0.5,     // 빠른 감정: 50% 시간
  'standard': 1.0,  // 기본 감정: 100% 시간
  'thorough': 2.0   // 꼼꼼한 감정: 200% 시간
};

/**
 * 감정 꼼꼼함에 따른 정확도
 */
export const appraisalAccuracyRates: Record<AppraisalOptions['thoroughness'], number> = {
  'quick': 0.7,     // 빠른 감정: 70% 정확도
  'standard': 0.85, // 기본 감정: 85% 정확도
  'thorough': 0.95  // 꼼꼼한 감정: 95% 정확도
};

/**
 * 감정 도구 정보
 */
export const appraisalTools: Record<string, AppraisalTool> = {
  'magnifyingGlass': {
    id: 'magnifyingGlass',
    name: '돋보기',
    description: '작은 돋보기다.',
    maxDurability: 100,
    currentDurability: 100,
    timeMultiplier: 0.9,
    accuracyBonus: 0.05,
    durabilityCost: 5,
    specialEffect: '세부 사항을 더 잘 볼 수 있게 해줍니다.',
    bestCategories: [ItemCategory.JEWELRY, ItemCategory.ART],
    tagsExpose: []
  },
  'scaleTool': {
    id: 'scaleTool',
    name: '정밀 저울',
    description: '무게추와 함께 사용하는 간단한 저울이다.',
    maxDurability: 100,
    currentDurability: 100,
    timeMultiplier: 0.8,
    accuracyBonus: 0.07,
    durabilityCost: 2,
    specialEffect: '무게 측정 시 정확도를 높여줍니다.',
    bestCategories: [ItemCategory.JEWELRY, ItemCategory.MATERIAL],
    tagsExpose: []
  },
  'chemistryKit': {
    id: 'chemistryKit',
    name: '화학 분석 키트',
    description: '화학 성분을 분석하는 도구입니다.',
    maxDurability: 100,
    currentDurability: 100,
    timeMultiplier: 0.7,
    accuracyBonus: 0.1,
    durabilityCost: 10,
    specialEffect: '재료 분석 시 정확도를 높여줍니다.',
    bestCategories: [ItemCategory.MATERIAL, ItemCategory.JEWELRY],
    tagsExpose: []
  },
  'antiques': {
    id: 'antiques',
    name: '골동품 참고서',
    description: '고대 아이템에 대한 참고서입니다.',
    maxDurability: 100,
    currentDurability: 100,
    timeMultiplier: 0.85,
    accuracyBonus: 0.08,
    durabilityCost: 3,
    specialEffect: '역사적 가치 분석 시 정확도를 높여줍니다.',
    bestCategories: [ItemCategory.ART, ItemCategory.HOUSEHOLD],
    tagsExpose: []
  },
  'weaponGuide': {
    id: 'weaponGuide',
    name: '무기 감정 가이드',
    description: '무기 감정에 대한 가이드입니다.',
    maxDurability: 100,
    currentDurability: 100,
    timeMultiplier: 0.75,
    accuracyBonus: 0.12,
    durabilityCost: 8,
    specialEffect: '무기 감정 시 정확도를 높여줍니다.',
    bestCategories: [ItemCategory.WEAPON],
    tagsExpose: []
  }
};

/**
 * 카테고리별 기본 감정 시간 (초)
 */
export const baseCategoryAppraisalTimes: Record<ItemCategory, number> = {
  [ItemCategory.WEAPON]: 35,
  [ItemCategory.JEWELRY]: 40,
  [ItemCategory.ART]: 45,
  [ItemCategory.BOOK]: 30,
  [ItemCategory.HOUSEHOLD]: 25,
  [ItemCategory.MATERIAL]: 20
};

/**
 * 카테고리별 감정 스킬 이름
 */
export const categoryAppraisalSkills: Record<ItemCategory, string> = {
  [ItemCategory.WEAPON]: '무기학',
  [ItemCategory.JEWELRY]: '보석감정',
  [ItemCategory.ART]: '예술사',
  [ItemCategory.BOOK]: '고문서학',
  [ItemCategory.HOUSEHOLD]: '민속학',
  [ItemCategory.MATERIAL]: '재료공학'
};

/**
 * 감정 가치 예상 오차 범위 (%)
 */
export const valueEstimationErrors = {
  min: 5,   // 가장 정확한 예상의 오차 범위 (5%)
  max: 30,  // 가장 부정확한 예상의 오차 범위 (30%)
  defaultError: 15 // 기본 오차 범위 (15%)
};