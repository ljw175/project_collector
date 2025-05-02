import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';
import '../styles/expertise-test.css';
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
        <div className="empty-details">
          <div className="empty-icon">🧠</div>
          <p className="empty-message">좌측 스킬 목록에서 스킬을 선택하세요.</p>
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
        <div className="skill-header">
          <h3 className="skill-title">{selectedSkill.name}</h3>
          <div className={`skill-level-indicator level-${String(selectedSkill.level).toLowerCase()}`}>
            {selectedSkill.level}
          </div>
        </div>
        
        <div className="skill-description">
          <p>{selectedSkill.description}</p>
        </div>
        
        <div className="skill-info">
          <div className="info-item">
            <span className="info-label">카테고리:</span>
            <span className="info-value">{selectedSkill.category}</span>
          </div>
          <div className="info-item">
            <span className="info-label">획득일:</span>
            <span className="info-value">2025년 4월 15일</span>
          </div>
        </div>
        
        <div className="skill-bonuses">
          <h4 className="section-title">보너스 효과</h4>
          <div className="bonuses-list">
            {selectedSkill.bonus && Object.entries(selectedSkill.bonus)
              .filter(([_, value]) => value > 0)
              .map(([key, value], index) => (
                <div key={index} className="bonus-item">
                  <div className="bonus-type">{getBonusTypeLabel(key)}</div>
                  <div className="bonus-value">+{value}%</div>
                  <div className="bonus-bar">
                    <div className="bonus-progress" style={{ width: `${Math.min(value * 2, 100)}%` }}></div>
                  </div>
                </div>
              ))}
            {(!selectedSkill.bonus || Object.values(selectedSkill.bonus).every(v => v <= 0)) && (
              <p className="no-bonus">이 스킬은 현재 보너스 효과가 없습니다.</p>
            )}
          </div>
        </div>
        
        <div className="skill-upgrade">
          <h4 className="section-title">스킬 업그레이드</h4>
          <div className="upgrade-path">
            {possibleUpgrades.map((upgrade, index) => (
              <div 
                key={upgrade.level} 
                className={`upgrade-node ${selectedSkill.level === upgrade.level ? 'current' : 
                  upgrade.canUpgrade ? 'available' : ''}`}
              >
                <div className="node-level">{upgrade.level}</div>
                <div className="node-cost">{upgrade.requiredExp} 경험치</div>
                {upgrade.canUpgrade && selectedSkill.level !== upgrade.level && (
                  <button 
                    className="upgrade-btn"
                    onClick={() => handleUpgradeSkill(selectedSkill, upgrade.level)}
                  >
                    업그레이드
                  </button>
                )}
              </div>
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
      <div className="category-summary">
        <h3 className="summary-title">{selectedCategory} 전문성 요약</h3>
        <div className="bonus-list">
          <div className="bonus-item">
            <div className="bonus-icon">🔍</div>
            <div className="bonus-info">
              <div className="bonus-name">감정 성공률</div>
              <div className="bonus-value">+{appraisalBonus}%</div>
            </div>
            <div className="bonus-bar">
              <div className="bonus-progress" style={{ width: `${Math.min(appraisalBonus * 2, 100)}%` }}></div>
            </div>
          </div>
          
          <div className="bonus-item">
            <div className="bonus-icon">💰</div>
            <div className="bonus-info">
              <div className="bonus-name">아이템 가치</div>
              <div className="bonus-value">+{valueBonus}%</div>
            </div>
            <div className="bonus-bar">
              <div className="bonus-progress" style={{ width: `${Math.min(valueBonus * 2, 100)}%` }}></div>
            </div>
          </div>
          
          <div className="bonus-item">
            <div className="bonus-icon">✨</div>
            <div className="bonus-info">
              <div className="bonus-name">희귀 특성 발견</div>
              <div className="bonus-value">+{rareChanceBonus}%</div>
            </div>
            <div className="bonus-bar">
              <div className="bonus-progress" style={{ width: `${Math.min(rareChanceBonus * 2, 100)}%` }}></div>
            </div>
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
          <div className="exp-label">보유 경험치:</div>
          <div className="exp-value">{experience} EXP</div>
          <div className="exp-controls">
            <input
              type="number"
              className="exp-input"
              value={expAmount}
              onChange={e => setExpAmount(e.target.value)}
              min="1"
            />
            <button className="exp-add-btn" onClick={handleAddExperience}>
              추가
            </button>
          </div>
        </div>
      </header>
      
      <main className="app-content">
        <div className="expertise-container">
          {/* 사이드바 - 카테고리 필터 */}
          <div className="expertise-sidebar">
            <div className="sidebar-section categories">
              <h3 className="section-title">카테고리</h3>
              <div className="category-list">
                <div
                  className={`category-item ${selectedCategory === null ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  <span className="category-name">모든 스킬</span>
                </div>
                {Object.values(ItemCategory).map(category => (
                  <div
                    key={category}
                    className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <span className="category-name">{category}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {renderCategoryBonuses()}
          </div>
          
          <div className="expertise-main">
            {/* 스킬 목록 */}
            <div className="skills-panel">
              <div className="panel-header">
                <h2 className="panel-title">
                  {selectedCategory ? `${selectedCategory} 전문성 스킬` : '모든 전문성 스킬'}
                </h2>
              </div>
              
              {filteredSkills.length > 0 ? (
                <div className="skills-grid">
                  {filteredSkills.map(skill => (
                    <div
                      key={skill.id}
                      className={`skill-card ${selectedSkill?.id === skill.id ? 'selected' : ''}`}
                      onClick={() => setSelectedSkill(skill)}
                    >
                      <div className="skill-icon">
                        {skill.category === ItemCategory.WEAPON ? '⚔️' :
                         skill.category === ItemCategory.JEWELRY ? '💎' :
                         skill.category === ItemCategory.ART ? '🎨' :
                         skill.category === ItemCategory.BOOK ? '📚' : '🧠'}
                      </div>
                      <div className="skill-content">
                        <div className="skill-name">{skill.name}</div>
                        <div className="skill-category">{skill.category}</div>
                      </div>
                      <div className={`skill-level level-${String(skill.level).toLowerCase()}`}>
                        {skill.level}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-skills">
                  <div className="empty-icon">📋</div>
                  <p className="empty-message">
                    {selectedCategory ? 
                      `${selectedCategory} 카테고리에 습득한 스킬이 없습니다.` : 
                      '습득한 스킬이 없습니다.'}
                  </p>
                </div>
              )}
            </div>
            
            {/* 스킬 상세 정보 */}
            <div className="details-panel">
              <div className="panel-header">
                <h2 className="panel-title">스킬 세부 정보</h2>
              </div>
              <div className="panel-content">
                {renderSkillDetails()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpertiseTest;