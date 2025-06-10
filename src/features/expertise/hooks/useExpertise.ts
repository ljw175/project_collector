/**
 * 전문성(Expertise) 기능을 위한 커스텀 훅
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useGameState } from '@store/gameContext';
import { ItemCategory } from '@models/item';
import { ExpertiseLevel } from '@/models/character';
import { 
  ExpertiseSkill, 
  ReputationEvent,
  ExpertiseState,
  ExperienceSource 
} from '../types/expertise_types';
import { expertiseService } from '@/services/expertise/expertise_service_index';

export function useExpertise() {
  const { state, dispatch } = useGameState();
  
  // 전문성 상태
  const [expertiseState, setExpertiseState] = useState<ExpertiseState>({
    skills: [],
    unlockedCategories: [],
    contacts: [],
    pendingEvents: [],
    activeSkillId: null
  });
  
  // 플레이어 경험치 추적
  const [experience, setExperience] = useState(0);
  
  // 선택된 스킬 ID
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  
  // 선택된 연락처 ID
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  // 경험치 획득 내역
  const [recentExperience, setRecentExperience] = useState<{
    source: ExperienceSource;
    amount: number;
    timestamp: number;
  }[]>([]);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 전문성 데이터 로드
  const loadExpertiseData = useCallback(() => {
    setIsLoading(true);
    
    // 중앙화된 데이터 서비스에서 데이터 로드
    const skills = expertiseService.getAllSkills();
    const contacts = expertiseService.getUnlockedContacts();
    
    // 초기 플레이어 경험치 설정
    setExperience(state.player.experience || 0);
    
    // 초기 언락된 카테고리 설정 (게임 진행에 따라 달라질 수 있음)
    const unlockedCategories = [ItemCategory.WEAPON, ItemCategory.ART];
    
    // 사용 가능한 이벤트 로드
    const availableEvents = expertiseService.getAvailableEvents();
    
    setExpertiseState({
      skills,
      unlockedCategories,
      contacts,
      pendingEvents: availableEvents,
      activeSkillId: skills.length > 0 ? skills[0].id : null
    });
    
    setIsLoading(false);
  }, [state.player.experience]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadExpertiseData();
  }, [loadExpertiseData]);

  // 선택된 스킬
  const selectedSkill = useMemo(() => {
    if (!selectedSkillId) return null;
    return expertiseState.skills.find(skill => skill.id === selectedSkillId) || null;
  }, [expertiseState.skills, selectedSkillId]);

  // 선택된 연락처
  const selectedContact = useMemo(() => {
    if (!selectedContactId) return null;
    return expertiseState.contacts.find(contact => contact.id === selectedContactId) || null;
  }, [expertiseState.contacts, selectedContactId]);

  // 스킬 선택
  const selectSkill = useCallback((skillId: string) => {
    setSelectedSkillId(skillId);
  }, []);

  // 연락처 선택
  const selectContact = useCallback((contactId: string) => {
    setSelectedContactId(contactId);
  }, []);

  // 활성 스킬 변경
  const setActiveSkill = useCallback((skillId: string) => {
    setExpertiseState(prev => ({
      ...prev,
      activeSkillId: skillId
    }));
  }, []);

  // 스킬 획득
  const acquireSkill = useCallback((skillId: string): boolean => {
    const skill = expertiseService.getSkillById(skillId);
    if (!skill) return false;
    
    // 이미 보유한 스킬인지 확인
    if (expertiseState.skills.some(s => s.id === skillId)) {
      return false;
    }
    
    // 스킬 추가
    setExpertiseState(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
    
    return true;
  }, [expertiseState.skills]);

  // 스킬 업그레이드 가능 여부 확인
  const canUpgradeSkill = useCallback((skillId: string, targetLevel: ExpertiseLevel): boolean => {
    const skill = expertiseState.skills.find(s => s.id === skillId);
    if (!skill) return false;
    
    return expertiseService.canUpgradeSkill(skill, targetLevel, experience);
  }, [expertiseState.skills, experience]);

  // 스킬 업그레이드
  const upgradeSkill = useCallback((skillId: string, targetLevel: ExpertiseLevel): boolean => {
    // 업그레이드 가능 여부 확인
    if (!canUpgradeSkill(skillId, targetLevel)) return false;
    
    const skill = expertiseState.skills.find(s => s.id === skillId);
    if (!skill) return false;
    
    // 필요 경험치 계산
    const requiredExp = expertiseService.calculateUpgradeCost(targetLevel);
    
    // 스킬 레벨 업데이트
    setExpertiseState(prev => ({
      ...prev,
      skills: prev.skills.map(s => 
        s.id === skillId 
          ? { 
              ...s, 
              level: targetLevel,
              bonus: {
                ...s.bonus,
                appraisalAccuracy: (s.bonus.appraisalAccuracy || 0) + 5,
                valueIncrease: (s.bonus.valueIncrease || 0) + 5,
                repairQuality: (s.bonus.repairQuality || 0) + 5
              }
            } 
          : s
      )
    }));
    
    // 경험치 차감
    setExperience(prev => prev - requiredExp);
    
    // 경험치 소모 디스패치
    dispatch({ 
      type: 'UPDATE_EXPERIENCE', 
      payload: { 
        amount: -requiredExp, 
        category: skill.category.toString(), 
        source: 'skillLevelUp' 
      } 
    });
    
    return true;
  }, [canUpgradeSkill, expertiseState.skills, dispatch]);

  // 경험치 추가
  const addExperience = useCallback((amount: number): void => {
    setExperience(prev => prev + amount);
    
    // 경험치 추가 디스패치
    dispatch({ 
      type: 'UPDATE_EXPERIENCE', 
      payload: { 
        amount, 
        category: 'general', 
        source: 'manualAdd' 
      } 
    });
  }, [dispatch]);

  // 연락처 호감도 증가
  const increaseContactFavor = useCallback((contactId: string, amount: number): boolean => {
    const contact = expertiseState.contacts.find(c => c.id === contactId);
    if (!contact) return false;
    
    // 호감도 업데이트
    setExpertiseState(prev => ({
      ...prev,
      contacts: prev.contacts.map(c => {
        if (c.id !== contactId) return c;
        
        const newFavorPoints = c.reputationScore + amount;
        let newLevel = c.level;
        let newThreshold = c.nextLevelThreshold;
        
        // 레벨업 확인
        if (newFavorPoints >= c.nextLevelThreshold) {
          newLevel++;
          newThreshold = newLevel * 100; // 다음 레벨 필요 호감도 계산
        }
        
        return {
          ...c,
          reputationScore: newFavorPoints,
          level: newLevel,
          nextLevelThreshold: newThreshold
        };
      })
    }));
    
    return true;
  }, [expertiseState.contacts]);

  // 경험치 획득
  const gainExperience = useCallback((source: ExperienceSource, category: ItemCategory, amount: number): void => {
    // 경험치 기록 추가
    setRecentExperience(prev => [
      {
        source,
        amount,
        timestamp: Date.now()
      },
      ...prev.slice(0, 9) // 최근 10개만 유지
    ]);
    
    // 경험치 추가
    setExperience(prev => prev + amount);
    
    // 경험치 디스패치
    dispatch({ 
      type: 'UPDATE_EXPERIENCE', 
      payload: { 
        amount, 
        category: category.toString(), 
        source: source.toString() 
      } 
    });
  }, [dispatch]);
  
  // 이벤트 완료 처리
  const completeEvent = useCallback((eventId: string): boolean => {
    const event = expertiseState.pendingEvents.find(e => e.id === eventId);
    if (!event) return false;
    
    // 이벤트 제거
    setExpertiseState(prev => ({
      ...prev,
      pendingEvents: prev.pendingEvents.filter(e => e.id !== eventId)
    }));
    
    // 보상 처리
    if (event.rewardType === 'skill') {
      acquireSkill(event.rewardId);
    }
    
    // 평판 증가
    dispatch({ 
      type: 'UPDATE_REPUTATION', 
      payload: { 
        contactId: event.contactId, 
        amount: event.reputationGain 
      } 
    });
    
    // 연락처 호감도 증가
    increaseContactFavor(event.contactId, 50);
    
    return true;
  }, [expertiseState.pendingEvents, dispatch, increaseContactFavor, acquireSkill]);

  // 카테고리별 스킬 목록
  const skillsByCategory = useMemo(() => {
    const result: Record<ItemCategory, ExpertiseSkill[]> = {
      [ItemCategory.WEAPON]: [],
      [ItemCategory.JEWELRY]: [],
      [ItemCategory.ART]: [],
      [ItemCategory.BOOK]: [],
      [ItemCategory.HOUSEHOLD]: [],
      [ItemCategory.MATERIAL]: []
    };
    
    expertiseState.skills.forEach(skill => {
      result[skill.category].push(skill);
    });
    
    return result;
  }, [expertiseState.skills]);

  // 카테고리별 보유 스킬
  const getSkillsByCategory = useCallback((category: ItemCategory): ExpertiseSkill[] => {
    return expertiseState.skills.filter(skill => skill.category === category);
  }, [expertiseState.skills]);

  // 카테고리별 보너스 계산
  const calculateCategoryBonus = useCallback((category: ItemCategory, bonusType: string): number => {
    return expertiseService.calculateCategoryBonus(expertiseState.skills, category, bonusType);
  }, [expertiseState.skills]);

  // 전체 플레이어 스킬
  const playerSkills = useMemo(() => expertiseState.skills, [expertiseState.skills]);

  return {
    playerSkills,
    experience,
    expertiseState,
    selectedSkill,
    selectedContact,
    recentExperience,
    isLoading,
    skillsByCategory,
    
    loadExpertiseData,
    selectSkill,
    selectContact,
    setActiveSkill,
    acquireSkill,
    canUpgradeSkill,
    upgradeSkill,
    addExperience,
    increaseContactFavor,
    completeEvent,
    gainExperience,
    getSkillsByCategory,
    calculateCategoryBonus
  };
}