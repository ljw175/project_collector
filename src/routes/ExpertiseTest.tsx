import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';

/**
 * 전문성/스킬 테스트 페이지
 */
const ExpertiseTest: React.FC = () => {
  // 카테고리 정의
  enum ItemCategory {
    WEAPON = 'weapon',           // 무기
    JEWELRY = 'jewelry',         // 보석/귀금속
    ART = 'art',                 // 예술/골동품
    BOOK = 'book',               // 서적
    HOUSEHOLD = 'household',     // 생활용품
    MATERIAL = 'material'        // 희귀 재료
  }
  
  // 전문성 레벨
  type ExpertiseLevel = 'novice' | 'amateur' | 'professional' | 'expert' | 'master';
  
  // 전문성 정의
  interface Expertise {
    category: ItemCategory;
    level: ExpertiseLevel;
    experience: number;
    nextLevelExp: number;
    bonuses: Array<{
      name: string;
      description: string;
      value: number;
    }>;
  }
  
  // 스킬 정의
  interface Skill {
    id: string;
    name: string;
    description: string;
    category: ItemCategory;
    requiredLevel: ExpertiseLevel;
    isActive: boolean;
    cooldown: number;
    lastUsed: number | null;
    effect: string;
  }
  
  // 플레이어 상태 정의
  const [player, setPlayer] = useState({
    name: '플레이어',
    level: 5,
    skillPoints: 3,
    activeCategory: ItemCategory.WEAPON as ItemCategory
  });
  
  // 전문성 상태
  const [expertises, setExpertises] = useState<Record<ItemCategory, Expertise>>({
    [ItemCategory.WEAPON]: {
      category: ItemCategory.WEAPON,
      level: 'amateur',
      experience: 120,
      nextLevelExp: 200,
      bonuses: [
        { name: '감정 정확도', description: '무기 감정 시 정확도 향상', value: 15 },
        { name: '수리 효율', description: '무기 수리 시 비용 감소', value: 10 }
      ]
    },
    [ItemCategory.JEWELRY]: {
      category: ItemCategory.JEWELRY,
      level: 'novice',
      experience: 40,
      nextLevelExp: 100,
      bonuses: [
        { name: '감정 정확도', description: '보석 감정 시 정확도 향상', value: 5 }
      ]
    },
    [ItemCategory.ART]: {
      category: ItemCategory.ART,
      level: 'professional',
      experience: 220,
      nextLevelExp: 300,
      bonuses: [
        { name: '감정 정확도', description: '예술품 감정 시 정확도 향상', value: 25 },
        { name: '가치 평가', description: '예술품 가치 평가 정확도 향상', value: 20 },
        { name: '네트워크', description: '예술 관련 상인과 관계 개선', value: 15 }
      ]
    },
    [ItemCategory.BOOK]: {
      category: ItemCategory.BOOK,
      level: 'novice',
      experience: 10,
      nextLevelExp: 100,
      bonuses: [
        { name: '감정 정확도', description: '서적 감정 시 정확도 향상', value: 5 }
      ]
    },
    [ItemCategory.HOUSEHOLD]: {
      category: ItemCategory.HOUSEHOLD,
      level: 'amateur',
      experience: 70,
      nextLevelExp: 200,
      bonuses: [
        { name: '감정 정확도', description: '생활용품 감정 시 정확도 향상', value: 15 },
        { name: '판매 가격', description: '생활용품 판매 시 가격 증가', value: 10 }
      ]
    },
    [ItemCategory.MATERIAL]: {
      category: ItemCategory.MATERIAL,
      level: 'novice',
      experience: 30,
      nextLevelExp: 100,
      bonuses: [
        { name: '감정 정확도', description: '희귀 재료 감정 시 정확도 향상', value: 5 }
      ]
    }
  });
  
  // 스킬 상태
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: 'skill-1',
      name: '정밀 감정',
      description: '무기 아이템을 감정할 때 숨겨진 태그를 1개 추가로 발견합니다.',
      category: ItemCategory.WEAPON,
      requiredLevel: 'amateur',
      isActive: true,
      cooldown: 3600000, // 1시간 (밀리초)
      lastUsed: null,
      effect: '숨겨진 태그 +1'
    },
    {
      id: 'skill-2',
      name: '무기 수리 전문가',
      description: '무기의 상태를 15% 추가로 복구합니다.',
      category: ItemCategory.WEAPON,
      requiredLevel: 'professional',
      isActive: false,
      cooldown: 7200000, // 2시간 (밀리초)
      lastUsed: null,
      effect: '수리 효율 +15%'
    },
    {
      id: 'skill-3',
      name: '예술품 감정가',
      description: '예술품/골동품의 가치를 20% 더 정확하게 평가합니다.',
      category: ItemCategory.ART,
      requiredLevel: 'amateur',
      isActive: true,
      cooldown: 3600000, // 1시간 (밀리초)
      lastUsed: null,
      effect: '가치 평가 +20%'
    },
    {
      id: 'skill-4',
      name: '희귀성 식별',
      description: '모든 아이템의 희귀도를 정확하게 판별합니다.',
      category: ItemCategory.ART,
      requiredLevel: 'professional',
      isActive: true,
      cooldown: 7200000, // 2시간 (밀리초)
      lastUsed: null,
      effect: '희귀도 판별 100%'
    },
    {
      id: 'skill-5',
      name: '네트워크 활용',
      description: '생활용품 판매 시 10% 추가 금액을 받습니다.',
      category: ItemCategory.HOUSEHOLD,
      requiredLevel: 'amateur',
      isActive: false,
      cooldown: 3600000, // 1시간 (밀리초)
      lastUsed: null,
      effect: '판매 가격 +10%'
    }
  ]);
  
  // 사용 가능한 스킬 필터링
  const getAvailableSkills = (category: ItemCategory) => {
    return skills.filter(skill => {
      const expertise = expertises[category];
      const levelValue = {
        'novice': 1,
        'amateur': 2,
        'professional': 3,
        'expert': 4,
        'master': 5
      };
      
      // 해당 카테고리의 전문성 레벨이 스킬 요구 레벨 이상인지 체크
      return skill.category === category && 
             levelValue[expertise.level] >= levelValue[skill.requiredLevel];
    });
  };
  
  // 전문성 레벨별 한글 이름
  const getLevelName = (level: ExpertiseLevel): string => {
    const levelNames = {
      'novice': '입문자',
      'amateur': '취미가',
      'professional': '전문가',
      'expert': '달인',
      'master': '장인'
    };
    return levelNames[level];
  };
  
  // 카테고리별 한글 이름
  const getCategoryName = (category: ItemCategory): string => {
    const categoryNames = {
      [ItemCategory.WEAPON]: '무기',
      [ItemCategory.JEWELRY]: '보석/귀금속',
      [ItemCategory.ART]: '예술/골동품',
      [ItemCategory.BOOK]: '서적',
      [ItemCategory.HOUSEHOLD]: '생활용품',
      [ItemCategory.MATERIAL]: '희귀 재료'
    };
    return categoryNames[category];
  };
  
  // 활성 카테고리 변경
  const changeCategory = (category: ItemCategory) => {
    setPlayer(prev => ({
      ...prev,
      activeCategory: category
    }));
  };
  
  // 스킬 활성화/비활성화 토글
  const toggleSkill = (skillId: string) => {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId 
        ? { ...skill, isActive: !skill.isActive } 
        : skill
    ));
  };
  
  // 전문성 경험치 증가 시뮬레이션
  const addExperience = (category: ItemCategory, amount: number) => {
    setExpertises(prev => {
      const expertise = prev[category];
      let newExp = expertise.experience + amount;
      let newLevel = expertise.level;
      let newNextLevelExp = expertise.nextLevelExp;
      
      // 레벨업 체크
      if (newExp >= expertise.nextLevelExp) {
        newExp = newExp - expertise.nextLevelExp;
        
        // 레벨 계산
        const levelOrder: ExpertiseLevel[] = [
          'novice', 'amateur', 'professional', 'expert', 'master'
        ];
        const currentIndex = levelOrder.indexOf(expertise.level);
        
        if (currentIndex < levelOrder.length - 1) {
          newLevel = levelOrder[currentIndex + 1];
          // 다음 레벨업 필요 경험치 계산 (간단한 로직)
          newNextLevelExp = expertise.nextLevelExp * 1.5;
        }
      }
      
      return {
        ...prev,
        [category]: {
          ...expertise,
          level: newLevel,
          experience: newExp,
          nextLevelExp: newNextLevelExp
        }
      };
    });
  };
  
  // 현재 선택된 카테고리의 전문성
  const currentExpertise = expertises[player.activeCategory];
  // 현재 선택된 카테고리의 사용 가능한 스킬
  const availableSkills = getAvailableSkills(player.activeCategory);
  
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/dev" className="back-button">← 테스트 메뉴로</Link>
        <h1>전문성/스킬 테스트</h1>
        <div className="player-level">레벨 {player.level}</div>
      </header>
      
      <main className="app-content">
        <div className="category-tabs">
          {Object.values(ItemCategory).map(category => (
            <button
              key={category}
              className={`category-tab ${player.activeCategory === category ? 'active' : ''}`}
              onClick={() => changeCategory(category)}
            >
              {getCategoryName(category)}
            </button>
          ))}
        </div>
        
        <div className="expertise-panel">
          <div className="expertise-header">
            <h2>{getCategoryName(player.activeCategory)} - {getLevelName(currentExpertise.level)}</h2>
            <div className="exp-bar">
              <div 
                className="exp-fill"
                style={{ width: `${(currentExpertise.experience / currentExpertise.nextLevelExp) * 100}%` }}
              ></div>
              <span className="exp-text">
                {currentExpertise.experience} / {currentExpertise.nextLevelExp}
              </span>
            </div>
          </div>
          
          <div className="expertise-bonuses">
            <h3>전문성 보너스</h3>
            <ul className="bonus-list">
              {currentExpertise.bonuses.map((bonus, index) => (
                <li key={index} className="bonus-item">
                  <div className="bonus-name">{bonus.name}</div>
                  <div className="bonus-value">+{bonus.value}%</div>
                  <div className="bonus-desc">{bonus.description}</div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="exp-test-buttons">
            <h3>경험치 테스트</h3>
            <div className="button-row">
              <button 
                className="btn"
                onClick={() => addExperience(player.activeCategory, 10)}
              >
                +10 경험치
              </button>
              <button 
                className="btn"
                onClick={() => addExperience(player.activeCategory, 50)}
              >
                +50 경험치
              </button>
              <button 
                className="btn"
                onClick={() => addExperience(player.activeCategory, 100)}
              >
                +100 경험치
              </button>
            </div>
          </div>
        </div>
        
        <div className="skills-panel">
          <div className="skills-header">
            <h3>사용 가능한 스킬 ({availableSkills.length})</h3>
            <div className="skill-points">남은 스킬 포인트: {player.skillPoints}</div>
          </div>
          
          {availableSkills.length > 0 ? (
            <ul className="skill-list">
              {availableSkills.map(skill => (
                <li key={skill.id} className={`skill-item ${skill.isActive ? 'active' : ''}`}>
                  <div className="skill-info">
                    <div className="skill-name">{skill.name}</div>
                    <div className="skill-description">{skill.description}</div>
                    <div className="skill-effect">{skill.effect}</div>
                    <div className="skill-requirement">
                      필요 레벨: {getLevelName(skill.requiredLevel)}
                    </div>
                  </div>
                  <div className="skill-controls">
                    <button 
                      className={`btn ${skill.isActive ? 'btn-active' : 'btn-inactive'}`}
                      onClick={() => toggleSkill(skill.id)}
                    >
                      {skill.isActive ? '활성화됨' : '비활성화'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-skills">
              이 카테고리에 사용 가능한 스킬이 없습니다. 전문성을 높여 스킬을 해금하세요.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExpertiseTest;