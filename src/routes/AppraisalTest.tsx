import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';
import ItemSlot from '../components/ui/ItemSlot';
import TagDisplay from '../components/ui/TagDisplay';
import { useInventory } from '../features/inventory/hooks/useInventory';
import { useAppraisal } from '../features/appraisal/hooks/useAppraisal';
import { Item, ItemTag } from '../models/item';
import { AppraisalOptions } from '../features/appraisal/types/appraisal_types';
import TagPopup from '../features/appraisal/components/TagPopup';

/**
 * 아이템 감정 시스템 테스트 페이지
 */
const AppraisalTest: React.FC = () => {
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [selectedTag, setSelectedTag] = useState<ItemTag | null>(null);
  
  // 플레이어 정보
  const [player, setPlayer] = useState({
    coins: 1000,
    appraisalPoints: 3, // 하루에 가능한 감정 횟수
  });
  
  // 인벤토리 훅 사용
  const {
    items,
    addItem,
    removeItem
  } = useInventory();
  
  // 감정 훅 사용
  const {
    appraisalState,
    selectedItemId,
    options,
    result,
    selectItem,
    updateOptions,
    startAppraisal,
    cancelAppraisal
  } = useAppraisal();
  
  // 감정 상태를 더 쉽게 읽을 수 있는 이름으로 변환
  const isAppraising = appraisalState === 'examining';
  const isComplete = appraisalState === 'complete';
  
  // 현재 선택된 아이템
  const currentItem = items.find(item => item.id === selectedItemId) || null;
  
  // 감정 메시지 생성
  const [appraisalMessage, setAppraisalMessage] = useState('');
  
  // 감정 상태나 결과가 변경될 때 메시지 업데이트
  useEffect(() => {
    if (isAppraising) {
      setAppraisalMessage('아이템을 감정하고 있습니다...');
    } else if (isComplete && result) {
      if (result.discoveredTags.length > 0) {
        setAppraisalMessage(`감정 완료! ${result.discoveredTags.length}개의 특성을 발견했습니다.`);
      } else {
        setAppraisalMessage('감정 완료. 특별한 특성을 발견하지 못했습니다.');
      }
    } else {
      setAppraisalMessage('');
    }
  }, [appraisalState, result, isAppraising, isComplete]);
  
  // 감정되지 않은 아이템 필터링
  const unappraisedItems = items.filter(item => !item.isAppraised);
  
  // 아이템 선택 처리
  const handleSelectItem = (item: Item) => {
    selectItem(item.id);
  };
  
  // 태그 선택 처리
  const handleTagSelect = (tag: ItemTag) => {
    setSelectedTag(tag);
    setShowTagPopup(true);
  };
  
  // 자동 감정 수행
  const handleAppraise = () => {
    if (appraisalState !== 'idle' || !selectedItemId || player.appraisalPoints <= 0) return;
    
    // 감정 포인트 소모
    setPlayer(prev => ({
      ...prev,
      appraisalPoints: prev.appraisalPoints - 1
    }));
    
    // 감정 수행
    startAppraisal();
  };
  
  // 감정 옵션 변경
  const handleChangeAppraisalOption = (optionName: keyof AppraisalOptions, value: any) => {
    updateOptions({ [optionName]: value });
  };
  
  // 포인트 초기화 (테스트용)
  const resetPoints = () => {
    setPlayer(prev => ({
      ...prev,
      appraisalPoints: 3
    }));
  };
  
  // 감정 확률 표시 문자열
  const getAppraisalChanceText = () => {
    if (!currentItem) return '';
    
    // 여기서는 더미 값 사용, 실제로는 더 복잡한 계산이 필요
    const chance = 75;
    
    if (chance >= 90) return '매우 높음 (90%+)';
    if (chance >= 75) return '높음 (75-90%)';
    if (chance >= 50) return '보통 (50-75%)';
    if (chance >= 30) return '낮음 (30-50%)';
    return '매우 낮음 (30% 미만)';
  };
  
  // 감정 힌트 생성
  const getAppraisalHints = () => {
    if (!currentItem) return [];
    
    // 더미 힌트 (실제로는 아이템 특성에 따라 동적 생성)
    const hints = [
      '이 아이템은 특이한 광택을 띄고 있습니다.',
      '세공 흔적이 정교해 보입니다.',
      '일반적인 것보다 무게감이 있습니다.'
    ];
    
    return hints;
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/dev" className="back-button">← 테스트 메뉴로</Link>
        <h1>감정 시스템 테스트</h1>
        <div className="player-stats">
          <span>소지금: {player.coins}코인</span>
          <span>감정 포인트: {player.appraisalPoints}/3</span>
          <button className="btn-small" onClick={resetPoints}>포인트 충전</button>
        </div>
      </header>
      
      <main className="app-content">
        <div className="appraisal-container">
          {/* 인벤토리 섹션 */}
          <div className="inventory-section">
            <h2>감정할 아이템</h2>
            <div className="item-grid">
              {unappraisedItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={selectedItemId === item.id ? 'selected' : ''}
                >
                  <ItemSlot 
                    item={item} 
                    isSelected={selectedItemId === item.id}
                  />
                </div>
              ))}
              
              {unappraisedItems.length === 0 && (
                <div className="empty-notice">
                  감정이 필요한 아이템이 없습니다.
                </div>
              )}
            </div>
          </div>
          
          {/* 감정 작업 섹션 */}
          <div className="appraisal-workspace">
            {currentItem ? (
              <>
                <div className="item-details">
                  <div className="item-header">
                    <h3>{currentItem.name}</h3>
                    <div className="item-base-value">{currentItem.baseValue[0].amount} 금화 {currentItem.baseValue[1].amount} 은화 {currentItem.baseValue[2].amount} 동화</div>
                  </div>
                  
                  <p className="item-description">{currentItem.description}</p>
                  
                  <div className="item-specs">
                    <div className="spec-item">
                      <span className="label">카테고리:</span> 
                      <span className="value">{currentItem.category}</span>
                    </div>
                    <div className="spec-item">
                      <span className="label">감정 확률:</span> 
                      <span className="value">{getAppraisalChanceText()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="appraisal-options">
                  <h4>감정 옵션</h4>
                  <div className="option-row">
                    <label>꼼꼼함:</label>
                    <select 
                      value={options.thoroughness} 
                      onChange={(e) => handleChangeAppraisalOption('thoroughness', e.target.value)}
                      disabled={isAppraising}
                    >
                      <option value="quick">빠르게 (50% 시간, 75% 정확도)</option>
                      <option value="standard">표준 (100% 시간, 100% 정확도)</option>
                      <option value="thorough">꼼꼼하게 (200% 시간, 125% 정확도)</option>
                    </select>
                  </div>
                  
                  <div className="option-row">
                    <label>특수 도구 사용:</label>
                    <input 
                      type="checkbox" 
                      checked={options.useSpecialTool || false}
                      onChange={(e) => handleChangeAppraisalOption('useSpecialTool', e.target.checked)}
                      disabled={isAppraising}
                    />
                    <span className="option-hint">정확도 15% 증가, 시간 30% 감소</span>
                  </div>
                </div>
                
                <div className="appraisal-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={handleAppraise}
                    disabled={isAppraising || player.appraisalPoints <= 0 || appraisalState === 'complete'}
                  >
                    {isAppraising ? '감정 중...' : '감정하기'} 
                    {player.appraisalPoints > 0 ? ` (${player.appraisalPoints} 포인트)` : ' (포인트 부족)'}
                  </button>
                  
                  {isAppraising && (
                    <button className="btn" onClick={cancelAppraisal}>
                      취소
                    </button>
                  )}
                </div>
                
                {/* 감정 결과 메시지 */}
                {appraisalMessage && (
                  <div className="appraisal-result">
                    <p>{appraisalMessage}</p>
                    
                    {isComplete && result && (
                      <div className="result-details">
                        <p>실제 가치: {result.actualValue[0].amount} 금화 {result.actualValue[1].amount} 은화 {result.actualValue[2].amount} 동화 </p>
                        <p>상태: {result.condition}%</p>
                        <p>소요 시간: {result.timeSpent}초</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* 전문가 힌트 표시 */}
                <div className="expert-hints">
                  <h4>전문가 분석</h4>
                  <ul>
                    {getAppraisalHints().map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ul>
                </div>
                
                {/* 아이템의 알려진 태그들 표시 */}
                <div className="known-tags">
                  <h4>확인된 특성</h4>
                  {currentItem.tags.length > 0 ? (
                    <div className="tags-display">
                      {currentItem.tags.map(tag => (
                        <TagDisplay key={tag.id} tag={tag} onClick={() => handleTagSelect(tag)} />
                      ))}
                    </div>
                  ) : (
                    <p className="empty-notice">아직 확인된 특성이 없습니다.</p>
                  )}
                </div>
                
                {isComplete && result && result.discoveredTags.length > 0 && (
                  <div className="discovered-tags">
                    <h4>새로 발견된 특성</h4>
                    <div className="tags-display">
                      {result.discoveredTags.map(tag => (
                        <TagDisplay key={tag.id} tag={tag} onClick={() => handleTagSelect(tag)} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-workspace">
                <p>좌측에서 감정할 아이템을 선택하세요.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* 태그 상세 팝업 */}
        {showTagPopup && selectedTag && currentItem && (
          <TagPopup 
            item={currentItem}
            itemTag={selectedTag}  
            onClose={() => setShowTagPopup(false)} 
          />
        )}
      </main>
    </div>
  );
};

export default AppraisalTest;