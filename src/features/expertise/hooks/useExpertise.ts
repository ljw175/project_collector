/**
 * 전문성(Expertise) 기능을 위한 커스텀 훅
 */
import { useState, useCallback, useMemo } from 'react';
import { useGameState } from '@store/gameContext';
import { ItemCategory } from '@models/item';
import { ExpertiseLevel, Reputation } from '@models/player';
import { 
  ExpertiseSkill, 
  ReputationEvent,
  ExpertiseState,
  ExperienceSource 
} from '../types/expertise_types';

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

  // 전문성 데이터 로드
  const loadExpertiseData = useCallback(() => {
    setIsLoading(true);
    
    // 실제 구현에서는 여기서 저장된 데이터를 불러오거나 초기 설정
    // 예시 데이터 생성
    const mockSkills: ExpertiseSkill[] = [
      {
        id: 'appraisal-weapon',
        name: '무기 감정',
        description: '무기 아이템의 가치와 특성을 더 정확하게 파악합니다.',
        category: ItemCategory.WEAPON,
        level: ExpertiseLevel.BEGINNER,
        bonus: {
          appraisalAccuracy: 10,
          valueIncrease: 5,
          sellingPriceBonus: 5,
          purchasePriceDiscount: 0,
          repairQuality: 0,
          discoveryChance: 0
        }
      },
      {
        id: 'appraisal-art',
        name: '예술품 감정',
        description: '예술품과 골동품의 진위와 가치를 더 정확하게 판단합니다.',
        category: ItemCategory.ART,
        level: ExpertiseLevel.BEGINNER,
        bonus: {
          appraisalAccuracy: 10,
          valueIncrease: 5,
          sellingPriceBonus: 5,
          purchasePriceDiscount: 0,
          repairQuality: 0,
          discoveryChance: 0
        }
      },
      {
        id: 'repair-jewelry',
        name: '보석 세공',
        description: '보석과 귀금속 아이템을 복원하고 가치를 높입니다.',
        category: ItemCategory.JEWELRY,
        level: ExpertiseLevel.BEGINNER,
        bonus: {
          appraisalAccuracy: 0,
          valueIncrease: 10,
          sellingPriceBonus: 0,
          purchasePriceDiscount: 0,
          repairQuality: 10,
          discoveryChance: 0
        }
      }
    ];
    
    const mockContacts: Reputation[] = [
      {
        id: 'smith',
        name: '대장장이 마이클',
        description: '무기와 갑옷에 전문 지식을 가진 대장장이',
        level: 1,
        relationshipLevel: 0,
        faction: '',
        specialties: [ItemCategory.WEAPON, ItemCategory.JEWELRY],
        buyingBonus: 0,
        sellingBonus: 0,
        unlockThreshold: 100,
        isUnlocked: true,
        category: ItemCategory.WEAPON,
        location: 'forge',
        services: ['repair', 'appraisal', 'trade'],
        reputationScore: 0,
        nextLevelThreshold: 100
      },
      {
        id: 'art-dealer',
        name: '화상 엘리자베스',
        description: '예술품과 골동품을 다루는 대가',
        level: 1,
        relationshipLevel: 0,
        faction: '',
        specialties: [ItemCategory.ART],
        buyingBonus: 0,
        sellingBonus: 0,
        unlockThreshold: 100,
        isUnlocked: true,
        category: ItemCategory.ART,
        location: 'gallery',
        services: ['appraisal', 'trade'],
        reputationScore: 0,
        nextLevelThreshold: 100
      }
    ];
    
    const mockEvents: ReputationEvent[] = [
      {
        id: 'event1',
        contactId: 'smith',
        title: '대장장이의 부탁',
        description: '마이클이 특별한 광석을 찾고 있습니다. 도와주면 감사하겠다고 합니다.',
        requirementsMet: true,
        reputationGain: 20,
        rewardType: 'skill',
        rewardId: 'repair-weapon'
      }
    ];
    
    setExpertiseState({
      skills: mockSkills,
      unlockedCategories: [ItemCategory.WEAPON, ItemCategory.ART],
      contacts: mockContacts,
      pendingEvents: mockEvents,
      activeSkillId: mockSkills[0].id
    });
    
    setIsLoading(false);
  }, []);

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
    // 실제 구현에서는 여기서 게임 상태 업데이트도 필요
  }, []);

  // 스킬 레벨업 가능 여부 확인
  const canLevelUpSkill = useCallback((skillId: string): boolean => {
    const skill = expertiseState.skills.find(s => s.id === skillId);
    if (!skill) return false;
    
    // 레벨별 필요 경험치 계산 (실제 구현에서는 더 복잡할 수 있음)
    const requiredExp = skill.level * 100;
    
    // 플레이어 경험치 확인 (실제 구현에서는 특정 카테고리별 경험치가 필요할 수 있음)
    const playerExperience = state.player.experience;
    
    return playerExperience >= requiredExp;
  }, [expertiseState.skills, state.player.experience]);

  // 스킬 레벨업
  const levelUpSkill = useCallback((skillId: string): boolean => {
    if (!canLevelUpSkill(skillId)) return false;
    
    const skill = expertiseState.skills.find(s => s.id === skillId);
    if (!skill) return false;
    
    const requiredExp = skill.level * 100;
    
    // 스킬 레벨 업데이트
    setExpertiseState(prev => ({
      ...prev,
      skills: prev.skills.map(s => 
        s.id === skillId 
          ? { 
              ...s, 
              level: (s.level + 1) as ExpertiseLevel,
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
    
    // 경험치 소모
    dispatch({ 
      type: 'UPDATE_EXPERIENCE', 
      payload: { 
        amount: -requiredExp, 
        category: skill.category.toString(), 
        source: 'skillLevelUp' 
      } 
    });
    
    return true;
  }, [canLevelUpSkill, expertiseState.skills, dispatch]);

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
          favorPoints: newFavorPoints,
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
      // 스킬 보상 처리 (실제 구현에서 더 복잡할 수 있음)
    } else if (event.rewardType === 'item') {
      // 아이템 보상 처리
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
  }, [expertiseState.pendingEvents, dispatch, increaseContactFavor]);

  // 전문성 보너스 계산
  const calculateExpertiseBonus = useCallback((category: ItemCategory, bonusType: keyof ExpertiseSkill['bonus']): number => {
    // 해당 카테고리의 활성화된 스킬 찾기
    const activeSkill = expertiseState.skills.find(s => 
      s.id === expertiseState.activeSkillId && s.category === category
    );
    
    if (!activeSkill || !activeSkill.bonus[bonusType]) return 0;
    
    return activeSkill.bonus[bonusType] as number;
  }, [expertiseState.skills, expertiseState.activeSkillId]);

  // 카테고리별 보유 스킬
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

  // 초기 데이터 로드
  // useEffect(() => {
  //   loadExpertiseData();
  // }, [loadExpertiseData]);

  return {
    expertiseState,
    selectedSkill,
    selectedContact,
    recentExperience,
    isLoading,
    
    loadExpertiseData,
    selectSkill,
    selectContact,
    setActiveSkill,
    canLevelUpSkill,
    levelUpSkill,
    increaseContactFavor,
    completeEvent,
    gainExperience,
    calculateExpertiseBonus,
    skillsByCategory
  };
}