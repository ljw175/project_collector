/**
 * 감정(Appraisal) 관련 서비스
 * 아이템 감정 로직과 결과 계산을 관리합니다.
 */
import { Item, ItemTag, ItemCategory } from '@models/item';
import { Player, ExpertiseLevel } from '@models/player';
import { 
  AppraisalOptions, 
  AppraisalResult 
} from '@features/appraisal/types/appraisal_types';
import { 
  appraisalTimeMultipliers,
  appraisalAccuracyRates,
  appraisalTools,
  baseCategoryAppraisalTimes,
  valueEstimationErrors
} from '@/data/constants/appraisal-constants';
import { expertiseSkills, expertiseLevelMultipliers } from '@/data/expertise/skills';
import { ExpertiseSkill } from '@features/expertise/types/expertise_types';

/**
 * 감정 서비스 클래스
 */
export class AppraisalService {
  /**
   * 아이템 카테고리에 맞는 감정 스킬 찾기
   */
  private getAppraisalSkillForCategory(category: ItemCategory, playerSkills: string[]): ExpertiseSkill | null {
    const skillId = `appraisal-${category.toLowerCase()}`;
    const skill = expertiseSkills.find(s => 
      s.id === skillId && playerSkills.includes(s.id)
    );
    return skill || null;
  }

  /**
   * 감정 시간 계산
   */
  calculateAppraisalTime(
    item: Item, 
    options: AppraisalOptions,
    playerExpertise: any = {}
  ): number {
    // 카테고리별 기본 시간
    let baseTime = baseCategoryAppraisalTimes[item.category] || 30;
    
    // 꼼꼼함 정도에 따른 시간 조정
    const thoroughnessMultiplier = appraisalTimeMultipliers[options.thoroughness] || 1.0;
    
    // 특수 도구 사용 시 시간 절약
    let toolMultiplier = 1.0;
    if (options.useSpecialTool) {
      toolMultiplier = appraisalTools[options.tool].timeMultiplier;
      
      // 카테고리에 특화된 도구인 경우 추가 보너스
      if (appraisalTools[options.tool].bestCategories.includes(item.category)) {
        toolMultiplier *= 0.9; // 추가 10% 절약
      }
    }
    
    // 아이템 복잡도에 따른 시간 조정
    const complexityMultiplier = 1 + (item.tags.length * 0.1);
    
    // 플레이어 스킬에 따른 시간 절약 (expertise 스킬 데이터 활용)
    let expertiseMultiplier = 1.0;
    if (playerExpertise.skills) {
      const appraisalSkill = this.getAppraisalSkillForCategory(item.category, playerExpertise.skills);
      if (appraisalSkill) {
        // 전문성 레벨에 따른 시간 절약 (레벨이 높을수록 빠르게 감정)
        const levelKey = ExpertiseLevel[appraisalSkill.level].toLowerCase() as keyof typeof expertiseLevelMultipliers;
        const levelMultiplier = 1 / (expertiseLevelMultipliers[levelKey] || 1);
        expertiseMultiplier = Math.max(0.6, levelMultiplier); // 최대 40% 시간 절약
      }
    }
    
    // 최종 감정 시간 계산
    let finalTime = baseTime * thoroughnessMultiplier * toolMultiplier * complexityMultiplier * expertiseMultiplier;
    
    // 최소 시간 보장
    return Math.max(10, Math.round(finalTime));
  }
  
  /**
   * 감정 정확도 계산
   */
  calculateAppraisalAccuracy(
    item: Item,
    options: AppraisalOptions,
    playerExpertise: any = {}
  ): number {
    // 기본 정확도 (꼼꼼함에 따라)
    let baseAccuracy = appraisalAccuracyRates[options.thoroughness] || 0.85;
    
    // 도구 사용 시 정확도 보너스
    let toolBonus = 0;
    if (options.useSpecialTool) {
      toolBonus = appraisalTools[options.tool].accuracyBonus;
      
      // 카테고리에 특화된 도구인 경우 추가 보너스
      if (appraisalTools[options.tool].bestCategories.includes(item.category)) {
        toolBonus *= 1.5; // 50% 더 효과적
      }
    }
    
    // 플레이어 전문성에 따른 정확도 보너스 (expertise 스킬 데이터 활용)
    let expertiseBonus = 0;
    if (playerExpertise.skills) {
      const appraisalSkill = this.getAppraisalSkillForCategory(item.category, playerExpertise.skills);
      if (appraisalSkill) {
        // 감정 스킬의 정확도 보너스 적용
        expertiseBonus += appraisalSkill.bonus.appraisalAccuracy / 100;

        // 전문성 레벨에 따른 추가 보너스
        const levelKey = ExpertiseLevel[appraisalSkill.level].toLowerCase() as keyof typeof expertiseLevelMultipliers;
        const levelMultiplier = expertiseLevelMultipliers[levelKey] || 1;
        expertiseBonus *= levelMultiplier;
      }
    }
    
    // 아이템 희귀도/복잡도에 따른 패널티
    const rarityPenalty = item.tags.length * 0.02; // 태그 수에 따른 패널티
    
    // 최종 정확도 계산
    let finalAccuracy = baseAccuracy + toolBonus + expertiseBonus - rarityPenalty;
    
    // 정확도 범위 제한 (50% ~ 99%)
    return Math.min(0.99, Math.max(0.5, finalAccuracy));
  }
  
  /**
   * 발견된 태그 생성
   */
  generateDiscoveredTags(
    item: Item,
    accuracy: number
  ): ItemTag[] {
    if (!item.hiddenTags || item.hiddenTags.length === 0) {
      return [];
    }
    
    // 정확도가 높을수록 더 많은 태그 발견
    const discoveredCount = Math.round(item.hiddenTags.length * accuracy);
    
    // 희귀도가 높은 태그일수록 발견하기 어려움
    const sortedTags = [...item.hiddenTags].sort((a, b) => {
      return a.rarity.localeCompare(b.rarity);
    });
    
    // 발견된 태그들 반환
    return sortedTags.slice(0, discoveredCount);
  }
  
  /**
   * 실제 가치 계산
   */
  calculateActualValue(
    item: Item,
    discoveredTags: ItemTag[],
    options: AppraisalOptions,
    playerExpertise: any = {}
  ): number {
    let value = item.baseValue;
    
    // 태그에 따른 가치 수정
    discoveredTags.forEach(tag => {
      value *= tag.valueMultiplier;
    });
    
    // 전문성 스킬에 따른 가치 증가 적용
    if (playerExpertise.skills) {
      const appraisalSkill = this.getAppraisalSkillForCategory(item.category, playerExpertise.skills);
      if (appraisalSkill) {
        // 가치 증가 보너스 적용
        const valueIncreasePercent = appraisalSkill.bonus.valueIncrease / 100;
        
        // 레벨에 따른 추가 보너스
        const levelKey = ExpertiseLevel[appraisalSkill.level].toLowerCase() as keyof typeof expertiseLevelMultipliers;
        const levelMultiplier = expertiseLevelMultipliers[levelKey] || 1;
        
        // 최종 가치 보너스 적용
        value *= (1 + (valueIncreasePercent * levelMultiplier));
      }
    }
    
    // 특별한 속성이나 상태에 따른 추가 조정이 필요할 수 있음
    
    return Math.round(value);
  }
  
  /**
   * 조건(상태) 점수 계산
   */
  calculateConditionScore(
    item: Item,
    accuracy: number
  ): number {
    // 실제 점수 (게임 로직에서 정의된 아이템 상태)
    const actualCondition = item.isAppraised ? item.condition || Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 40) + 60; // 60-100 사이 랜덤 값
    
    // 정확도에 따른 오차 생성
    const maxError = Math.round((1 - accuracy) * 20); // 정확도가 낮을수록 오차 증가
    const error = Math.floor(Math.random() * maxError) * (Math.random() > 0.5 ? 1 : -1);
    
    // 최종 표시 점수 (오차 적용, 0-100 범위로 제한)
    return Math.min(100, Math.max(0, actualCondition + error));
  }
  
  /**
   * 완전한 감정 결과 생성
   */
  generateFullAppraisalResult(
    item: Item,
    options: AppraisalOptions,
    playerExpertise: any = {}
  ): AppraisalResult {
    // 정확도 계산
    const accuracy = this.calculateAppraisalAccuracy(item, options, playerExpertise);
    
    // 발견된 태그 생성
    const discoveredTags = this.generateDiscoveredTags(item, accuracy);
    
    // 실제 가치 계산 (스킬 보너스 적용)
    const actualValue = this.calculateActualValue(item, discoveredTags, options, playerExpertise);
    
    // 조건 점수 계산
    const condition = this.calculateConditionScore(item, accuracy);
    
    // 소요 시간 계산
    const timeSpent = this.calculateAppraisalTime(item, options, playerExpertise);
    
    // 아이템 이력 생성 (시간 흐름에 따른 변화, 전문성에 따라 더 상세한 이력 제공)
    let history = this.generateItemHistory(item, accuracy, playerExpertise);
    
    // 감정 결과 생성
    return {
      itemId: item.id,
      discoveredTags,
      actualValue,
      condition,
      timeSpent,
      history
    };
  }
  
  /**
   * 아이템 이력 생성
   */
  private generateItemHistory(
    item: Item, 
    accuracy: number,
    playerExpertise: any = {}
  ): string | undefined {
    // 아이템에 이미 이력이 있으면 그대로 사용
    if ('history' in item && (item as any).history) {
      return (item as any).history;
    }
    
    // 정확도와 전문성에 따라 이력 생성 확률 계산
    let historyGenerationChance = accuracy;
    
    // 전문성 보너스 적용
    if (playerExpertise.skills) {
      const appraisalSkill = this.getAppraisalSkillForCategory(item.category, playerExpertise.skills);
      if (appraisalSkill) {
        // 레벨에 따른 확률 증가
        const levelKey = ExpertiseLevel[appraisalSkill.level].toLowerCase() as keyof typeof expertiseLevelMultipliers;
        const levelMultiplier = expertiseLevelMultipliers[levelKey] || 1;
        historyGenerationChance += (0.1 * levelMultiplier); // 레벨당 최대 10% 확률 증가
      }
    }
    
    // 이력 생성 실패
    if (Math.random() > historyGenerationChance) {
      return undefined;
    }
    
    // 아이템 카테고리별 기본 이력 템플릿
    const historyTemplates = {
      [ItemCategory.WEAPON]: [
        "이 무기는 %year%년경에 제작된 것으로 추정됩니다. %condition%한 상태입니다.",
        "%year%년 %region% 지역에서 사용되던 무기입니다. %maker%에 의해 제작되었을 가능성이 높습니다."
      ],
      [ItemCategory.JEWELRY]: [
        "이 보석은 %year%년대 %region% 출신의 장인이 세공한 것으로 보입니다. %condition%한 상태입니다.",
        "%material%으로 만들어진 이 장신구는 %year%년경 %royalty%의 소유였을 가능성이 있습니다."
      ],
      [ItemCategory.ART]: [
        "이 예술품은 %year%년대 %region% 지역의 %style% 양식을 보여줍니다. %condition%한 상태입니다.",
        "%year%년 %artist% 작품으로 추정됩니다. %event% 이후 여러 소장자를 거쳤을 것으로 보입니다."
      ],
      [ItemCategory.BOOK]: [
        "이 서적은 %year%년 %region%에서 출판되었습니다. %condition%한 상태의 %edition%판입니다.",
        "%year%년 %author%가 저술한 책으로, %event% 당시 많은 영향을 끼쳤습니다."
      ],
      [ItemCategory.HOUSEHOLD]: [
        "이 생활용품은 %year%년대 %region% 지역에서 사용되던 물건입니다. %condition%한 상태입니다.",
        "%year%년경 %maker%가 제작한 것으로 보이며, 당시 %class% 계층에서 주로 사용했습니다."
      ],
      [ItemCategory.MATERIAL]: [
        "이 재료는 %year%년경 %region% 지역에서 채취된 것으로 추정됩니다. %condition%한 상태입니다.",
        "%year%년대 %event% 이후 희소성이 높아진 재료입니다. %property%한 특성을 가지고 있습니다."
      ]
    };
    
    // 카테고리에 맞는 템플릿 선택
    const templates = historyTemplates[item.category] || ["이 물건은 %year%년경의 것으로 추정됩니다. %condition%한 상태입니다."];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // 템플릿 변수 채우기
    const years = [1750, 1800, 1850, 1900, 1920, 1950, 1980];
    const regions = ["유럽", "아시아", "아메리카", "아프리카", "동양", "서양", "북유럽"];
    const conditions = ["매우 훌륭", "잘 보존", "약간 손상", "사용 흔적 있", "복원이 필요"];
    const makers = ["유명 장인", "무명 장인", "지역 장인", "왕실 장인", "길드 소속 장인"];
    const materials = ["금", "은", "다이아몬드", "루비", "에메랄드", "진주", "옥", "청동", "철"];
    const royalties = ["왕족", "귀족", "영주", "부유한 상인", "유명 수집가"];
    const styles = ["고전주의", "르네상스", "바로크", "로코코", "낭만주의", "현대", "고대"];
    const artists = ["유명 화가", "지역 예술가", "혁신적 조각가", "전통 장인"];
    const editions = ["초판", "한정", "재판", "희귀", "특별"];
    const authors = ["유명 작가", "철학자", "학자", "시인", "역사가"];
    const events = ["전쟁", "혁명", "왕조 교체", "경제 위기", "문화 혁명", "대탐험"];
    const classes = ["귀족", "평민", "상인", "종교인", "군인", "농민"];
    const properties = ["내구성 있", "유연", "단단", "가벼", "무거", "특이한 색상을 가진", "희귀"];
    
    let history = template
      .replace("%year%", years[Math.floor(Math.random() * years.length)].toString())
      .replace("%region%", regions[Math.floor(Math.random() * regions.length)])
      .replace("%condition%", conditions[Math.floor(Math.random() * conditions.length)])
      .replace("%maker%", makers[Math.floor(Math.random() * makers.length)])
      .replace("%material%", materials[Math.floor(Math.random() * materials.length)])
      .replace("%royalty%", royalties[Math.floor(Math.random() * royalties.length)])
      .replace("%style%", styles[Math.floor(Math.random() * styles.length)])
      .replace("%artist%", artists[Math.floor(Math.random() * artists.length)])
      .replace("%edition%", editions[Math.floor(Math.random() * editions.length)])
      .replace("%author%", authors[Math.floor(Math.random() * authors.length)])
      .replace("%event%", events[Math.floor(Math.random() * events.length)])
      .replace("%class%", classes[Math.floor(Math.random() * classes.length)])
      .replace("%property%", properties[Math.floor(Math.random() * properties.length)]);
    
    return history;
  }
  
  /**
   * 빠른 감정 수행 (즉시 결과 반환)
   */
  performQuickAppraisal(
    item: Item,
    playerExpertise: any = {}
  ): AppraisalResult {
    // 빠른 감정은 기본적으로 정확도가 낮음
    const quickOptions: AppraisalOptions = {
      thoroughness: 'quick',
      focusArea: 'condition',
      tool: 'none',
      useSpecialTool: false,
      playerExpertise: ExpertiseLevel.INTERMEDIATE
    };
    
    // 플레이어 전문성에 따라 정확도 보정
    const baseAccuracy = 0.7; // 기본 70% 정확도
    let accuracyBonus = 0;
    
    if (playerExpertise.skills) {
      const appraisalSkill = this.getAppraisalSkillForCategory(item.category, playerExpertise.skills);
      if (appraisalSkill) {
        // 감정 스킬의 정확도 보너스 적용 (최대 20%까지만 적용)
        accuracyBonus = Math.min(0.2, appraisalSkill.bonus.appraisalAccuracy / 100);
      }
    }
    
    const accuracy = baseAccuracy + accuracyBonus;
    
    // 발견된 태그
    const discoveredTags = this.generateDiscoveredTags(item, accuracy);
    
    // 가치 계산 (실제 가치보다 약간 낮게 추정)
    const actualValue = Math.round(
      this.calculateActualValue(item, discoveredTags, quickOptions, playerExpertise) * 0.9
    );
    
    // 상태 점수
    const condition = this.calculateConditionScore(item, accuracy);
    
    // 빠른 감정에서는 간략한 이력만 제공
    let history: string | undefined = undefined;
    if (playerExpertise.level >= ExpertiseLevel.INTERMEDIATE) {
      history = this.generateItemHistory(item, accuracy * 0.7, playerExpertise);
    }
    
    return {
      itemId: item.id,
      discoveredTags,
      actualValue,
      condition,
      timeSpent: 5, // 빠른 감정은 항상 5초로 고정
      history
    };
  }
  
  /**
   * 감정 비용 계산
   */
  calculateAppraisalCost(
    item: Item,
    options: AppraisalOptions
  ): number {
    // 기본 비용
    let baseCost = 50;
    
    // 아이템 기본 가치에 따른 추가 비용
    const valueModifier = Math.floor(item.baseValue / 1000);
    baseCost += valueModifier * 10;
    
    // 꼼꼼함에 따른 비용 조정
    const thoroughnessMultiplier = {
      'quick': 0.6,
      'standard': 1.0,
      'thorough': 1.5
    }[options.thoroughness] || 1.0;
    
    // 도구 사용에 따른 추가 비용
    let toolCost = 0;
    if (options.useSpecialTool && options.tool !== 'none') {
      toolCost = appraisalTools[options.tool].durabilityCost || 0;
    }
    
    // 최종 비용
    return Math.round((baseCost * thoroughnessMultiplier) + toolCost);
  }
  
  /**
   * 카테고리에 적합한 도구 추천
   */
  recommendToolForCategory(category: ItemCategory): string {
    // 각 카테고리별 최적 도구
    const categoryTools: Record<ItemCategory, string> = {
      [ItemCategory.WEAPON]: 'microscope',
      [ItemCategory.JEWELRY]: 'jewelers_loupe',
      [ItemCategory.ART]: 'uv_light',
      [ItemCategory.BOOK]: 'magnifying_glass',
      [ItemCategory.HOUSEHOLD]: 'chemical_kit',
      [ItemCategory.MATERIAL]: 'scale'
    };
    
    return categoryTools[category] || 'magnifying_glass';
  }
}

// 싱글톤 인스턴스 생성
export const appraisalService = new AppraisalService();