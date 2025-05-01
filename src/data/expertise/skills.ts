/**
 * 전문성 스킬 데이터
 */
import { ExpertiseLevel } from '@/models';
import { ExpertiseSkill } from '@features/expertise/types/expertise_types';
import { ItemCategory } from '@models/item';

/**
 * 전문성 레벨에 따른 보너스 배수
 */
export const expertiseLevelMultipliers = {
  [ExpertiseLevel.BEGINNER]: 1.0,
  [ExpertiseLevel.AMATEUR]: 1.2,
  [ExpertiseLevel.INTERMEDIATE]: 1.4,
  [ExpertiseLevel.EXPERT]: 1.6,
  [ExpertiseLevel.MASTER]: 2.0
};

/**
 * 전문성 스킬 데이터
 */
export const expertiseSkills: ExpertiseSkill[] = [
  // 무기 카테고리 전문성
  {
    id: 'appraisal-weapon',
    name: '무기 감정',
    description: '무기 아이템의 가치와 특성을 더 정확하게 파악합니다.',
    category: ItemCategory.WEAPON,
    level: ExpertiseLevel.BEGINNER,
    bonus: {
      expertiseMultiplier: expertiseLevelMultipliers[ExpertiseLevel.BEGINNER],
      appraisalAccuracy: 10,
      valueIncrease: 5,
      sellingPriceBonus: 5,
      purchasePriceDiscount: 0,
      repairQuality: 0,
      discoveryChance: 0
    }
  },
  {
    id: 'repair-weapon',
    name: '무기 수리',
    description: '무기를 수리하여 더 좋은 상태로 복원할 수 있습니다.',
    category: ItemCategory.WEAPON,
    level: ExpertiseLevel.BEGINNER,
    bonus: {
      expertiseMultiplier: expertiseLevelMultipliers[ExpertiseLevel.BEGINNER],
      appraisalAccuracy: 0,
      valueIncrease: 0,
      sellingPriceBonus: 0,
      purchasePriceDiscount: 0,
      repairQuality: 15,
      discoveryChance: 0
    }
  },
  {
    id: 'weapon-collector',
    name: '무기 수집가',
    description: '다양한 무기를 식별하고 판매할 때 더 많은 이익을 얻습니다.',
    category: ItemCategory.WEAPON,
    level: ExpertiseLevel.BEGINNER,
    bonus: {
      expertiseMultiplier: expertiseLevelMultipliers[ExpertiseLevel.BEGINNER],
      appraisalAccuracy: 5,
      valueIncrease: 0,
      sellingPriceBonus: 10,
      purchasePriceDiscount: 5,
      repairQuality: 0,
      discoveryChance: 5
    }
  },

  // 보석/귀금속 카테고리 전문성
  {
    id: 'appraisal-jewelry',
    name: '보석 감정',
    description: '보석과 귀금속의 진위와 가치를 더 정확하게 판단합니다.',
    category: ItemCategory.JEWELRY,
    level: ExpertiseLevel.BEGINNER,
    bonus: {
      expertiseMultiplier: expertiseLevelMultipliers[ExpertiseLevel.BEGINNER],
      appraisalAccuracy: 15,
      valueIncrease: 5,
      sellingPriceBonus: 5,
      purchasePriceDiscount: 0,
      repairQuality: 0,
      discoveryChance: 0
    }
  },
  {
    id: 'jewelry-crafting',
    name: '보석 세공',
    description: '보석과 귀금속 아이템을 복원하고 가치를 높입니다.',
    category: ItemCategory.JEWELRY,
    level: ExpertiseLevel.BEGINNER,
    bonus: {
      expertiseMultiplier: expertiseLevelMultipliers[ExpertiseLevel.BEGINNER],
      appraisalAccuracy: 0,
      valueIncrease: 10,
      sellingPriceBonus: 0,
      purchasePriceDiscount: 0,
      repairQuality: 10,
      discoveryChance: 0
    }
  },

  // 예술/골동품 카테고리 전문성
  {
    id: 'appraisal-art',
    name: '예술품 감정',
    description: '예술품과 골동품의 진위와 가치를 더 정확하게 판단합니다.',
    category: ItemCategory.ART,
    level: ExpertiseLevel.BEGINNER,
    bonus: {
      expertiseMultiplier: expertiseLevelMultipliers[ExpertiseLevel.BEGINNER],
      appraisalAccuracy: 10,
      valueIncrease: 5,
      sellingPriceBonus: 5,
      purchasePriceDiscount: 0,
      repairQuality: 0,
      discoveryChance: 0
    }
  },
  {
    id: 'art-restoration',
    name: '예술품 복원',
    description: '손상된 예술품을 복원하여 원래의 상태에 가깝게 만듭니다.',
    category: ItemCategory.ART,
    level: ExpertiseLevel.BEGINNER,
    bonus: {
      expertiseMultiplier: expertiseLevelMultipliers[ExpertiseLevel.BEGINNER],
      appraisalAccuracy: 0,
      valueIncrease: 10,
      sellingPriceBonus: 0,
      purchasePriceDiscount: 0,
      repairQuality: 15,
      discoveryChance: 0
    }
  },

  // 서적 카테고리 전문성
  {
    id: 'appraisal-book',
    name: '서적 감정',
    description: '고서와 문서의 역사적 가치와 희귀성을 더 정확하게 파악합니다.',
    category: ItemCategory.BOOK,
    level: ExpertiseLevel.BEGINNER,
    bonus: {
      expertiseMultiplier: expertiseLevelMultipliers[ExpertiseLevel.BEGINNER],
      appraisalAccuracy: 10,
      valueIncrease: 5,
      sellingPriceBonus: 5,
      purchasePriceDiscount: 0,
      repairQuality: 0,
      discoveryChance: 0
    }
  },
  {
    id: 'book-restoration',
    name: '서적 복원',
    description: '손상된 서적과 문서를 복원하여 가치를 높입니다.',
    category: ItemCategory.BOOK,
    level: ExpertiseLevel.BEGINNER,
    bonus: {
      expertiseMultiplier: expertiseLevelMultipliers[ExpertiseLevel.BEGINNER],
      appraisalAccuracy: 0,
      valueIncrease: 8,
      sellingPriceBonus: 0,
      purchasePriceDiscount: 0,
      repairQuality: 12,
      discoveryChance: 0
    }
  },

  // 생활용품 카테고리 전문성
  {
    id: 'appraisal-household',
    name: '생활용품 감정',
    description: '일상 용품의 특별한 가치와 역사를 더 정확하게 파악합니다.',
    category: ItemCategory.HOUSEHOLD,
    level: ExpertiseLevel.BEGINNER,
    bonus: {
      expertiseMultiplier: expertiseLevelMultipliers[ExpertiseLevel.BEGINNER],
      appraisalAccuracy: 8,
      valueIncrease: 3,
      sellingPriceBonus: 5,
      purchasePriceDiscount: 0,
      repairQuality: 0,
      discoveryChance: 0
    }
  },
  {
    id: 'household-repair',
    name: '생활용품 수리',
    description: '사용된 생활용품을 수리하여 상태를 개선합니다.',
    category: ItemCategory.HOUSEHOLD,
    level: ExpertiseLevel.BEGINNER,
    bonus: {
      expertiseMultiplier: expertiseLevelMultipliers[ExpertiseLevel.BEGINNER],
      appraisalAccuracy: 0,
      valueIncrease: 5,
      sellingPriceBonus: 0,
      purchasePriceDiscount: 0,
      repairQuality: 10,
      discoveryChance: 0
    }
  },

  // 희귀 재료 카테고리 전문성
  {
    id: 'appraisal-material',
    name: '재료 감정',
    description: '희귀 재료의 품질과 용도를 더 정확하게 파악합니다.',
    category: ItemCategory.MATERIAL,
    level: ExpertiseLevel.BEGINNER,
    bonus: {
      expertiseMultiplier: expertiseLevelMultipliers[ExpertiseLevel.BEGINNER],
      appraisalAccuracy: 10,
      valueIncrease: 5,
      sellingPriceBonus: 5,
      purchasePriceDiscount: 0,
      repairQuality: 0,
      discoveryChance: 0
    }
  },
  {
    id: 'material-processing',
    name: '재료 가공',
    description: '재료를 정제하거나 가공하여 가치를 높입니다.',
    category: ItemCategory.MATERIAL,
    level: ExpertiseLevel.BEGINNER,
    bonus: {
      expertiseMultiplier: expertiseLevelMultipliers[ExpertiseLevel.BEGINNER],
      appraisalAccuracy: 0,
      valueIncrease: 12,
      sellingPriceBonus: 0,
      purchasePriceDiscount: 0,
      repairQuality: 5,
      discoveryChance: 0
    }
  }
];

/**
 * 특정 카테고리의 전문성 스킬 목록을 반환
 */
export function getSkillsByCategory(category: ItemCategory): ExpertiseSkill[] {
  return expertiseSkills.filter(skill => skill.category === category);
}

/**
 * ID로 스킬 조회
 */
export function getSkillById(skillId: string): ExpertiseSkill | undefined {
  return expertiseSkills.find(skill => skill.id === skillId);
}

/**
 * 레벨별 업그레이드 비용 (경험치)
 */
export const skillUpgradeCosts = {
  [ExpertiseLevel.BEGINNER]: 0,
  [ExpertiseLevel.AMATEUR]: 100,
  [ExpertiseLevel.INTERMEDIATE]: 200,
  [ExpertiseLevel.EXPERT]: 800,
  [ExpertiseLevel.MASTER]: 2000
};