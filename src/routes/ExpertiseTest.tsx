import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';
import { useExpertise } from '../features/expertise/hooks/useExpertise';
import { ExpertiseLevel } from '../models/player';
import { ExpertiseSkill } from '../features/expertise/types/expertise_types';
import { ItemCategory } from '../models/item';
import { expertiseService } from '../services/expertise/expertise_service_index';

/**
 * 전문성 시스템 테스트 페이지
 */
const ExpertiseTest: React.FC = () => {
  // 전문성 훅 사용
  const {
    playerSkills,
    experience,
    acquireSkill,
    upgradeSkill,
    addExperience,
    getSkillsByCategory,
    calculateCategoryBonus,
    canUpgradeSkill
  } = useExpertise();
  
  // 선택된 스킬
  const [selectedSkill, setSelectedSkill] = useState<ExpertiseSkill | null>(null);
  
  // 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);
  
  // 경험치 추가 입력 값
  const [expAmount, setExpAmount] = useState('50');
  
  // 카테고리에 따른 스킬 필터링
  const filteredSkills = selectedCategory 
    ? getSkillsByCategory(selectedCategory)
    : playerSkills;
  
  // 경험치 추가 핸들러
  const handleAddExperience = () => {
    const amount = parseInt(expAmount);
    if (!isNaN(amount) && amount > 0) {
      addExperience(amount);
    }
  };
  
  // 스킬 업그레이드 핸들러
  const handleUpgradeSkill = (skill: ExpertiseSkill, targetLevel: ExpertiseLevel) => {
    if (canUpgradeSkill(skill.id, targetLevel)) {
      upgradeSkill(skill.id, targetLevel);
    }
  };
  
  // 레벨별 경험치 요구량 - 중앙화된 데이터 사용
  const getRequiredExpForLevel = (level: ExpertiseLevel): number => {
    return expertiseService.calculateUpgradeCost(level);
  };
  
  // 스킬 세부 정보 표시
  const renderSkillDetails = () => {
    if (!selectedSkill) {
      return (
        <div className="skill-details-empty">
          <p>좌측 스킬 목록에서 스킬을 선택하세요.</p>
        </div>
      );
    }
    
    // 각 레벨에 대한 업그레이드 가능 여부 계산
    const possibleUpgrades = [ExpertiseLevel.BEGINNER, ExpertiseLevel.AMATEUR, ExpertiseLevel.INTERMEDIATE, ExpertiseLevel.EXPERT, ExpertiseLevel.MASTER].map(level => ({
      level: level as ExpertiseLevel,
      canUpgrade: canUpgradeSkill(selectedSkill.id, level as ExpertiseLevel),
      requiredExp: getRequiredExpForLevel(level as ExpertiseLevel)
    }));
    
    return (
      <div className="skill-details">
        <h3>{selectedSkill.name}</h3>
        <div className="skill-description">
          <p>{selectedSkill.description}</p>
        </div>
        
        <div className="skill-level">
          <span className="label">현재 레벨:</span>
          <span className={`value level-${selectedSkill.level}`}>{selectedSkill.level}</span>
        </div>
        
        <div className="skill-category">
          <span className="label">카테고리:</span>
          <span className="value">{selectedSkill.category}</span>
        </div>
        
        <div className="skill-bonuses">
          <h4>보너스 효과</h4>
          <ul>
            {selectedSkill.bonus && Object.entries(selectedSkill.bonus)
              .filter(([_, value]) => value > 0)
              .map(([key, value], index) => (
                <li key={index}>
                  <span className="bonus-type">{getBonusTypeLabel(key)}:</span>
                  <span className="bonus-value">+{value}%</span>
                </li>
              ))}
          </ul>
        </div>
        
        <div className="skill-upgrade">
          <h4>업그레이드</h4>
          <div className="upgrade-options">
            {possibleUpgrades.map(upgrade => (
              <button
                key={upgrade.level}
                className={`upgrade-btn ${upgrade.canUpgrade ? 'available' : ''}`}
                onClick={() => handleUpgradeSkill(selectedSkill, upgrade.level)}
                disabled={!upgrade.canUpgrade}
              >
                {upgrade.level} ({upgrade.requiredExp} 경험치)
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // 보너스 타입 레이블 변환
  const getBonusTypeLabel = (bonusType: string): string => {
    const bonusLabels: Record<string, string> = {
      'appraisalAccuracy': '감정 정확도',
      'valueIncrease': '가치 증가',
      'sellingPriceBonus': '판매 가격',
      'purchasePriceDiscount': '구매 할인',
      'repairQuality': '수리 품질',
      'discoveryChance': '희귀 발견'
    };
    return bonusLabels[bonusType] || bonusType;
  };
  
  // 카테고리 보너스 표시
  const renderCategoryBonuses = () => {
    if (!selectedCategory) return null;
    
    const appraisalBonus = calculateCategoryBonus(selectedCategory, 'appraisal');
    const valueBonus = calculateCategoryBonus(selectedCategory, 'value');
    const rareChanceBonus = calculateCategoryBonus(selectedCategory, 'rare_chance');
    
    return (
      <div className="category-bonuses">
        <h3>{selectedCategory} 전문성 보너스</h3>
        <div className="bonus-list">
          <div className="bonus-item">
            <span className="label">감정 성공률:</span>
            <span className="value">+{appraisalBonus}%</span>
          </div>
          <div className="bonus-item">
            <span className="label">아이템 가치:</span>
            <span className="value">+{valueBonus}%</span>
          </div>
          <div className="bonus-item">
            <span className="label">희귀 특성 발견:</span>
            <span className="value">+{rareChanceBonus}%</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/dev" className="back-button">← 테스트 메뉴로</Link>
        <h1>전문성 시스템 테스트</h1>
        <div className="experience-display">
          경험치: {experience}
          <div className="exp-controls">
            <input
              type="number"
              className="exp-input"
              value={expAmount}
              onChange={e => setExpAmount(e.target.value)}
              min="1"
            />
            <button className="btn-small" onClick={handleAddExperience}>
              추가
            </button>
          </div>
        </div>
      </header>
      
      <main className="app-content">
        <div className="expertise-container">
          {/* 필터링 컨트롤 */}
          <div className="expertise-controls">
            <div className="category-filters">
              <button
                className={selectedCategory === null ? 'active' : ''}
                onClick={() => setSelectedCategory(null)}
              >
                모든 스킬
              </button>
              {Object.values(ItemCategory).map(category => (
                <button
                  key={category}
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {renderCategoryBonuses()}
          </div>
          
          <div className="expertise-content">
            {/* 스킬 목록 */}
            <div className="skills-list">
              <h2>보유한 전문성 스킬</h2>
              
              {filteredSkills.length > 0 ? (
                <div className="skills-grid">
                  {filteredSkills.map(skill => (
                    <div
                      key={skill.id}
                      className={`skill-card ${selectedSkill?.id === skill.id ? 'selected' : ''}`}
                      onClick={() => setSelectedSkill(skill)}
                    >
                      <div className="skill-name">{skill.name}</div>
                      <div className={`skill-level-badge level-${skill.level}`}>
                        {skill.level}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-skills-message">
                  선택한 카테고리의 스킬이 없습니다.
                </div>
              )}
            </div>
            
            {/* 스킬 상세 정보 */}
            <div className="skill-details-panel">
              {renderSkillDetails()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpertiseTest;