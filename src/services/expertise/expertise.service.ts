/**
 * 전문성(Expertise) 관련 서비스
 * 데이터 액세스와 비즈니스 로직을 관리합니다.
 */
import { 
  expertiseSkills, 
  getSkillsByCategory, 
  getSkillById,
  skillUpgradeCosts,
  expertiseLevelMultipliers 
} from '@data/expertise/skills.ts';
import { 
  contacts, 
  getContactById, 
  getContactsByCategory, 
  getUnlockedContacts 
} from '@data/expertise/contacts.ts';
import { 
  reputationEvents, 
  getEventsByContactId, 
  getAvailableEvents, 
  getEventById 
} from '@data/expertise/events.ts';
import { ItemCategory } from '@models/item';
import { ExpertiseLevel, Reputation } from '@models/player';
import { ExpertiseSkill, ReputationEvent } from '@features/expertise/types/expertise_types';

/**
 * 전문성 시스템 서비스
 */
export class ExpertiseService {
  // 스킬 관련 메서드
  
  /**
   * 전체 스킬 목록 반환
   */
  getAllSkills(): ExpertiseSkill[] {
    return expertiseSkills;
  }

  /**
   * 카테고리별 스킬 목록 반환
   */
  getSkillsByCategory(category: ItemCategory): ExpertiseSkill[] {
    return getSkillsByCategory(category);
  }

  /**
   * ID로 스킬 조회
   */
  getSkillById(skillId: string): ExpertiseSkill | undefined {
    return getSkillById(skillId);
  }

  /**
   * 전문성 레벨 업그레이드 비용 계산
   */
  calculateUpgradeCost(level: ExpertiseLevel): number {
    return skillUpgradeCosts[level] || 0;
  }

  /**
   * 보너스 배수 계산
   * @param level 전문성 레벨
   */
  getBonusMultiplier(level: ExpertiseLevel): number {
    return expertiseLevelMultipliers[level] || 1.0;
  }

  /**
   * 카테고리별 특정 보너스 타입 계산
   * @param skills 보유 스킬 목록
   * @param category 아이템 카테고리
   * @param bonusType 보너스 유형 (appraisal, value, rare_chance 등)
   */
  calculateCategoryBonus(
    skills: ExpertiseSkill[], 
    category: ItemCategory, 
    bonusType: string
  ): number {
    // 해당 카테고리 스킬 필터링
    const categorySkills = skills.filter(skill => skill.category === category);
    
    // 보너스 합산
    let totalBonus = 0;
    
    categorySkills.forEach(skill => {
      const multiplier = this.getBonusMultiplier(skill.level);
      
      // 보너스 타입에 따라 적절한 값 추가
      switch (bonusType) {
        case 'appraisal':
          totalBonus += (skill.bonus.appraisalAccuracy || 0) * multiplier;
          break;
        case 'value':
          totalBonus += (skill.bonus.valueIncrease || 0) * multiplier;
          break;
        case 'rare_chance':
          totalBonus += (skill.bonus.discoveryChance || 0) * multiplier;
          break;
        case 'selling':
          totalBonus += (skill.bonus.sellingPriceBonus || 0) * multiplier;
          break;
        case 'repair':
          totalBonus += (skill.bonus.repairQuality || 0) * multiplier;
          break;
      }
    });
    
    return Math.round(totalBonus);
  }

  /**
   * 스킬 레벨업 가능 여부 확인
   */
  canUpgradeSkill(
    skill: ExpertiseSkill, 
    targetLevel: ExpertiseLevel, 
    playerExperience: number
  ): boolean {
    // 이미 해당 레벨 이상인 경우
    if (this.getLevelValue(skill.level) >= this.getLevelValue(targetLevel)) {
      return false;
    }
    
    // 연속적인 레벨업만 가능 (중간 레벨 건너뛰기 불가)
    if (this.getLevelValue(targetLevel) > this.getLevelValue(skill.level) + 1) {
      return false;
    }
    
    // 필요 경험치 계산
    const requiredExp = this.calculateUpgradeCost(targetLevel);
    
    // 경험치 충분한지 확인
    return playerExperience >= requiredExp;
  }
  
  /**
   * 레벨 값을 숫자로 변환 (비교 용이성)
   */
  private getLevelValue(level: ExpertiseLevel): number {
    const levelValues = {
      [ExpertiseLevel.BEGINNER]: 0,
      [ExpertiseLevel.AMATEUR]: 1,
      [ExpertiseLevel.INTERMEDIATE]: 2,
      [ExpertiseLevel.EXPERT]: 3,
      [ExpertiseLevel.MASTER]: 4
    };
    
    return levelValues[level] || 0;
  }
  
  // 연락처 관련 메서드
  
  /**
   * 모든 연락처 목록 반환
   */
  getAllContacts(): Reputation[] {
    return contacts;
  }
  
  /**
   * 해금된 연락처만 반환
   */
  getUnlockedContacts(): Reputation[] {
    return getUnlockedContacts();
  }
  
  /**
   * ID로 연락처 조회
   */
  getContactById(contactId: string): Reputation | undefined {
    return getContactById(contactId);
  }
  
  /**
   * 카테고리별 연락처 반환
   */
  getContactsByCategory(category: ItemCategory): Reputation[] {
    return getContactsByCategory(category);
  }
  
  /**
   * 연락처 해금 여부 확인
   */
  isContactUnlocked(contactId: string): boolean {
    const contact = this.getContactById(contactId);
    return contact ? contact.isUnlocked : false;
  }
  
  /**
   * 특정 서비스를 제공하는 연락처 조회
   */
  getContactsByService(service: string): Reputation[] {
    return contacts.filter(contact => 
      contact.isUnlocked && contact.services.includes(service)
    );
  }
  
  // 이벤트 관련 메서드
  
  /**
   * 모든 평판 이벤트 반환
   */
  getAllEvents(): ReputationEvent[] {
    return reputationEvents;
  }
  
  /**
   * 조건이 충족된 이벤트만 반환
   */
  getAvailableEvents(): ReputationEvent[] {
    return getAvailableEvents();
  }
  
  /**
   * ID로 이벤트 조회
   */
  getEventById(eventId: string): ReputationEvent | undefined {
    return getEventById(eventId);
  }
  
  /**
   * 특정 연락처의 이벤트 목록 반환
   */
  getEventsByContactId(contactId: string): ReputationEvent[] {
    return getEventsByContactId(contactId);
  }
  
  /**
   * 특정 연락처의 사용 가능한 이벤트만 반환
   */
  getAvailableEventsByContactId(contactId: string): ReputationEvent[] {
    return this.getEventsByContactId(contactId).filter(event => event.requirementsMet);
  }
}

// 싱글톤 인스턴스 생성
export const expertiseService = new ExpertiseService();