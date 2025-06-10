/**
 * 전문성(Expertise) 화면 컴포넌트
 */
import React, { useEffect, useState } from 'react';
import { useExpertise } from '../hooks/useExpertise';
import { useGameState } from '@store/gameContext';
import { ExpertiseSkill } from '../types/expertise_types';
import { ItemCategory } from '@models/item';
import { ExpertiseLevel, Reputation } from '@/models/character';

// 카테고리 라벨 매핑
const categoryLabels: Record<ItemCategory, string> = {
  [ItemCategory.WEAPON]: '무기',
  [ItemCategory.JEWELRY]: '보석/귀금속',
  [ItemCategory.ART]: '예술/골동품',
  [ItemCategory.BOOK]: '서적',
  [ItemCategory.HOUSEHOLD]: '생활용품',
  [ItemCategory.MATERIAL]: '희귀 재료'
};

// 전문성 레벨 라벨 매핑
const expertiseLevelLabels: Record<ExpertiseLevel, string> = {
  [ExpertiseLevel.BEGINNER]: '초보',
  [ExpertiseLevel.AMATEUR]: '아마추어',
  [ExpertiseLevel.INTERMEDIATE]: '숙련',
  [ExpertiseLevel.EXPERT]: '전문가',
  [ExpertiseLevel.MASTER]: '대가'
};

// 스킬 카드 컴포넌트
const SkillCard: React.FC<{
  skill: ExpertiseSkill;
  isActive: boolean;
  canLevelUp: boolean;
  onActivate: (skillId: string) => void;
  onLevelUp: (skillId: string) => boolean;
}> = ({ skill, isActive, canLevelUp, onActivate, onLevelUp }) => {
  return (
    <div className={`skill-card ${isActive ? 'active' : ''}`}>
      <div className="skill-header">
        <h3>{skill.name}</h3>
        <span className="skill-level">{expertiseLevelLabels[skill.level]}</span>
      </div>
      
      <p className="skill-description">{skill.description}</p>
      
      <div className="skill-bonuses">
        {skill.bonus.appraisalAccuracy && (
          <div className="bonus">
            <span className="label">감정 정확도:</span>
            <span className="value">+{skill.bonus.appraisalAccuracy}%</span>
          </div>
        )}
        {skill.bonus.valueIncrease && (
          <div className="bonus">
            <span className="label">가치 증가:</span>
            <span className="value">+{skill.bonus.valueIncrease}%</span>
          </div>
        )}
        {skill.bonus.repairQuality && (
          <div className="bonus">
            <span className="label">수리 품질:</span>
            <span className="value">+{skill.bonus.repairQuality}%</span>
          </div>
        )}
        {/* 추가 보너스 표시 */}
      </div>
      
      <div className="skill-actions">
        {!isActive && (
          <button 
            className="activate-btn"
            onClick={() => onActivate(skill.id)}
          >
            활성화
          </button>
        )}
        {isActive && <span className="active-indicator">활성화됨</span>}
        
        <button 
          className={`level-up-btn ${canLevelUp ? 'available' : 'disabled'}`}
          onClick={() => onLevelUp(skill.id)}
          disabled={!canLevelUp}
        >
          레벨업
        </button>
      </div>
    </div>
  );
};

// 카테고리 탭 컴포넌트
const CategoryTab: React.FC<{
  category: ItemCategory;
  isSelected: boolean;
  hasSkills: boolean;
  onClick: () => void;
}> = ({ category, isSelected, hasSkills, onClick }) => {
  return (
    <div 
      className={`category-tab ${isSelected ? 'selected' : ''} ${!hasSkills ? 'empty' : ''}`}
      onClick={hasSkills ? onClick : undefined}
    >
      <span className="category-icon">{category.charAt(0)}</span>
      <span className="category-name">{categoryLabels[category]}</span>
      {!hasSkills && <span className="locked-indicator">잠김</span>}
    </div>
  );
};

// 전문성 스킬 섹션
const ExpertiseSkillsSection: React.FC = () => {
  const { 
    expertiseState, 
    skillsByCategory,
    setActiveSkill, 
    canLevelUpSkill,
    levelUpSkill
  } = useExpertise();
  
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);
  
  // 초기 카테고리 선택
  useEffect(() => {
    // 스킬이 있는 첫 번째 카테고리 선택
    for (const category of Object.values(ItemCategory)) {
      if (skillsByCategory[category].length > 0) {
        setSelectedCategory(category);
        break;
      }
    }
  }, [skillsByCategory]);
  
  // 선택된 카테고리의 스킬 목록
  const selectedCategorySkills = selectedCategory ? skillsByCategory[selectedCategory] : [];
  
  return (
    <div className="expertise-skills-section">
      <h2>전문성 스킬</h2>
      
      <div className="category-tabs">
        {Object.values(ItemCategory).map(category => (
          <CategoryTab 
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            hasSkills={skillsByCategory[category].length > 0}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>
      
      <div className="skills-container">
        {selectedCategorySkills.length === 0 ? (
          <p className="no-skills">
            {selectedCategory 
              ? `${categoryLabels[selectedCategory]} 카테고리에 보유한 스킬이 없습니다.` 
              : '카테고리를 선택하세요.'}
          </p>
        ) : (
          <div className="skills-grid">
            {selectedCategorySkills.map(skill => (
              <SkillCard 
                key={skill.id}
                skill={skill}
                isActive={skill.id === expertiseState.activeSkillId}
                canLevelUp={canLevelUpSkill(skill.id)}
                onActivate={setActiveSkill}
                onLevelUp={levelUpSkill}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 연락처 카드 컴포넌트
const ContactCard: React.FC<{
  contact: Reputation;
  onSelect: (contactId: string) => void;
  isSelected: boolean;
}> = ({ contact, onSelect, isSelected }) => {
  const favorPercentage = contact.reputationScore 
    ? (contact.reputationScore / contact.level) * 100 
    : 0;
  
  return (
    <div 
      className={`contact-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(contact.id)}
    >
      <div className="contact-avatar">
        {contact.name.charAt(0)}
      </div>
      
      <div className="contact-info">
        <h3>{contact.name}</h3>
        <p className="contact-description">{contact.description}</p>
        
        <div className="contact-details">
          <div className="detail">
            <span className="label">위치:</span>
            <span className="value">{contact.location}</span>
          </div>
          <div className="detail">
            <span className="label">전문분야:</span>
            <span className="value">{categoryLabels[contact.category]}</span>
          </div>
          <div className="detail">
            <span className="label">관계:</span>
            <span className="value">레벨 {contact.level}</span>
          </div>
        </div>
        
        <div className="favor-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${favorPercentage}%` }}
            />
          </div>
          <div className="progress-text">
            호감도: {contact.reputationScore}/{contact.level}
          </div>
        </div>
      </div>
    </div>
  );
};

// 네트워크 이벤트 컴포넌트
const ReputationEventCard: React.FC<{
  title: string;
  description: string;
  reputationGain: number;
  isAvailable: boolean;
  onComplete: () => void;
}> = ({ title, description, reputationGain, isAvailable, onComplete }) => {
  return (
    <div className={`event-card ${isAvailable ? 'available' : 'locked'}`}>
      <div className="event-header">
        <h3>{title}</h3>
        <span className="event-reputation">+{reputationGain} 평판</span>
      </div>
      
      <p className="event-description">{description}</p>
      
      <button 
        className="complete-event-btn"
        onClick={onComplete}
        disabled={!isAvailable}
      >
        {isAvailable ? '완료하기' : '조건 미충족'}
      </button>
    </div>
  );
};

// 평판 섹션
const ReputationSection: React.FC = () => {
  const { 
    expertiseState, 
    selectedContact,
    selectContact,
    completeEvent
  } = useExpertise();
  
  // 선택된 연락처의 이벤트들
  const contactEvents = selectedContact 
    ? expertiseState.pendingEvents.filter(event => event.contactId === selectedContact.id)
    : [];
  
  return (
    <div className="reputation-section">
      <h2>연락처</h2>
      
      <div className="reputation-content">
        <div className="contacts-list">
          {expertiseState.contacts.length === 0 ? (
            <p className="no-contacts">연락처가 없습니다.</p>
          ) : (
            expertiseState.contacts.map(contact => (
              <ContactCard 
                key={contact.id}
                contact={contact}
                onSelect={selectContact}
                isSelected={selectedContact?.id === contact.id}
              />
            ))
          )}
        </div>
        
        <div className="events-container">
          <h3>
            {selectedContact 
              ? `${selectedContact.name}의 이벤트` 
              : '연락처를 선택하세요'
            }
          </h3>
          
          {selectedContact && contactEvents.length === 0 && (
            <p className="no-events">현재 진행 가능한 이벤트가 없습니다.</p>
          )}
          
          {contactEvents.map(event => (
            <ReputationEventCard 
              key={event.id}
              title={event.title}
              description={event.description}
              reputationGain={event.reputationGain}
              isAvailable={event.requirementsMet}
              onComplete={() => completeEvent(event.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// 경험치 로그 컴포넌트
const ExperienceLog: React.FC = () => {
  const { recentExperience } = useExpertise();
  
  // 경험치 소스 라벨 매핑
  const experienceSourceLabels: Record<string, string> = {
    'appraisal': '감정',
    'repair': '수리',
    'sale': '판매',
    'discovery': '발견',
    'reputation': '평판',
    'event': '이벤트',
    'achievement': '업적'
  };
  
  return (
    <div className="experience-log">
      <h3>최근 경험치 획득</h3>
      
      {recentExperience.length === 0 ? (
        <p className="no-experience">최근 획득한 경험치가 없습니다.</p>
      ) : (
        <ul className="experience-list">
          {recentExperience.map((exp, index) => (
            <li key={index} className="experience-item">
              <span className="exp-source">{experienceSourceLabels[exp.source]}</span>
              <span className="exp-amount">+{exp.amount} XP</span>
              <span className="exp-time">
                {new Date(exp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 전문성 화면 메인 컴포넌트
const ExpertiseScreen: React.FC = () => {
  const { state } = useGameState();
  const { 
    loadExpertiseData, 
    isLoading 
  } = useExpertise();
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadExpertiseData();
  }, [loadExpertiseData]);
  
  if (isLoading) {
    return <div className="loading">데이터 로딩 중...</div>;
  }
  
  return (
    <div className="expertise-screen">
      <div className="expertise-header">
        <h1>전문성 & 네트워크</h1>
        <div className="player-stats">
          <div className="stat">
            <span className="label">레벨:</span>
            <span className="value">{state.player.level}</span>
          </div>
          <div className="stat">
            <span className="label">경험치:</span>
            <span className="value">{state.player.experience}</span>
          </div>
          <div className="stat">
            <span className="label">영향력:</span>
            <span className="value">{state.player.reputation}</span>
          </div>
        </div>
      </div>
      
      <div className="expertise-content">
        <ExpertiseSkillsSection />
        <ReputationSection />
      </div>
      
      <ExperienceLog />
    </div>
  );
};

export default ExpertiseScreen;