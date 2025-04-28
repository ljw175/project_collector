/**
 * 감정(Appraisal) 화면 컴포넌트
 */
import React, { useState, useEffect } from 'react';
import { useAppraisal } from '../hooks/useAppraisal';
import { useGameState } from '@store/gameContext';
import { Item, ItemTag } from '@models/item';
import { AppraisalOptions } from '../types/appraisal_types';

// 아이템 선택 컴포넌트
const ItemSelector: React.FC<{
  items: Item[];
  selectedItemId: string | null;
  onSelectItem: (itemId: string) => void;
}> = ({ items, selectedItemId, onSelectItem }) => {
  // 감정되지 않은 아이템만 필터링
  const unappraisedItems = items.filter(item => !item.isAppraised);
  
  return (
    <div className="item-selector">
      <h3>감정할 아이템 선택</h3>
      
      {unappraisedItems.length === 0 ? (
        <p className="no-items">감정할 수 있는 아이템이 없습니다.</p>
      ) : (
        <ul className="item-list">
          {unappraisedItems.map(item => (
            <li 
              key={item.id} 
              className={`item ${selectedItemId === item.id ? 'selected' : ''}`}
              onClick={() => onSelectItem(item.id)}
            >
              <div className="item-info">
                <h4>{item.name}</h4>
                <div className="item-category">{item.category}</div>
              </div>
              <div className="item-state">
                <span className="state-indicator unapprised">미감정</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 감정 옵션 컴포넌트
const AppraisalOptionsSelector: React.FC<{
  options: AppraisalOptions;
  onChange: (newOptions: Partial<AppraisalOptions>) => void;
}> = ({ options, onChange }) => {
  return (
    <div className="appraisal-options">
      <h3>감정 방식</h3>
      
      <div className="option-group">
        <label>꼼꼼함:</label>
        <div className="button-group">
          <button 
            className={options.thoroughness === 'quick' ? 'active' : ''} 
            onClick={() => onChange({ thoroughness: 'quick' })}
          >
            빠르게
          </button>
          <button 
            className={options.thoroughness === 'standard' ? 'active' : ''} 
            onClick={() => onChange({ thoroughness: 'standard' })}
          >
            표준
          </button>
          <button 
            className={options.thoroughness === 'thorough' ? 'active' : ''} 
            onClick={() => onChange({ thoroughness: 'thorough' })}
          >
            꼼꼼하게
          </button>
        </div>
      </div>
      
      <div className="option-group">
        <label>집중 영역:</label>
        <select 
          value={options.focusArea || ''} 
          onChange={e => onChange({ 
            focusArea: e.target.value ? e.target.value as 'condition' | 'authenticity' | 'history' : undefined 
          })}
        >
          <option value="">균형 있게</option>
          <option value="condition">상태</option>
          <option value="authenticity">진위 여부</option>
          <option value="history">역사적 배경</option>
        </select>
      </div>
      
      <div className="option-group">
        <label>
          <input 
            type="checkbox" 
            checked={options.useSpecialTool || false} 
            onChange={e => onChange({ useSpecialTool: e.target.checked })}
          />
          특수 도구 사용 (정확도 향상)
        </label>
      </div>
      
      {options.thoroughness === 'thorough' && (
        <div className="option-info">
          <p>꼼꼼하게 감정하면 더 많은 태그를 발견할 수 있지만, 시간이 오래 걸립니다.</p>
        </div>
      )}
      
      {options.useSpecialTool && (
        <div className="option-info">
          <p>특수 도구를 사용하면 감정 정확도가 높아지지만, 비용이 추가됩니다.</p>
        </div>
      )}
    </div>
  );
};

// 감정 진행 프로세스 컴포넌트
const AppraisalProcess: React.FC<{
  isAppraising: boolean;
  itemName: string;
  progress: number;
}> = ({ isAppraising, itemName, progress }) => {
  if (!isAppraising) return null;
  
  return (
    <div className="appraisal-process">
      <h3>감정 진행 중...</h3>
      <p>{itemName}을(를) 분석하고 있습니다.</p>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <div className="process-description">
        {progress < 30 && (
          <p>아이템의 기본 특성을 확인하고 있습니다...</p>
        )}
        {progress >= 30 && progress < 60 && (
          <p>아이템의 상태와 재질을 분석하고 있습니다...</p>
        )}
        {progress >= 60 && progress < 90 && (
          <p>유사한 아이템과 비교하고 있습니다...</p>
        )}
        {progress >= 90 && (
          <p>최종 감정 결과를 정리하고 있습니다...</p>
        )}
      </div>
    </div>
  );
};

// 태그 컴포넌트
const TagDisplay: React.FC<{
  tag: ItemTag;
}> = ({ tag }) => {
  return (
    <div className={`tag tag-${tag.rarity}`} title={tag.description}>
      <div className="tag-name">{tag.name}</div>
      {tag.valueMultiplier > 1 && (
        <div className="tag-multiplier">×{tag.valueMultiplier.toFixed(1)}</div>
      )}
    </div>
  );
};

// 감정 결과 컴포넌트
const AppraisalResult: React.FC<{
  itemName: string;
  baseValue: number;
  actualValue: number;
  condition: number;
  tags: ItemTag[];
  history?: string;
  timeSpent: number;
  onContinue: () => void;
}> = ({ 
  itemName, 
  baseValue, 
  actualValue, 
  condition, 
  tags, 
  history, 
  timeSpent, 
  onContinue 
}) => {
  // 가치 변화 비율
  const valueChange = ((actualValue - baseValue) / baseValue * 100).toFixed(1);
  const isPositiveChange = actualValue > baseValue;
  
  return (
    <div className="appraisal-result">
      <h3>감정 결과</h3>
      
      <div className="result-header">
        <h4>{itemName}</h4>
      </div>
      
      <div className="value-comparison">
        <div className="base-value">
          <div className="label">기본 가치</div>
          <div className="value">{baseValue}G</div>
        </div>
        <div className="arrow">→</div>
        <div className={`actual-value ${isPositiveChange ? 'positive' : 'negative'}`}>
          <div className="label">실제 가치</div>
          <div className="value">{actualValue}G</div>
          <div className="change">
            {isPositiveChange ? '+' : ''}{valueChange}%
          </div>
        </div>
      </div>
      
      <div className="condition-meter">
        <div className="label">상태</div>
        <div className="meter">
          <div 
            className={`fill ${
              condition > 75 ? 'excellent' : 
              condition > 50 ? 'good' : 
              condition > 25 ? 'fair' : 'poor'
            }`}
            style={{ width: `${condition}%` }}
          />
        </div>
        <div className="value">{condition}/100</div>
      </div>
      
      <div className="tags-section">
        <h4>발견된 특성</h4>
        <div className="tags-container">
          {tags.length === 0 ? (
            <p>특별한 특성이 발견되지 않았습니다.</p>
          ) : (
            tags.map((tag, index) => (
              <TagDisplay key={index} tag={tag} />
            ))
          )}
        </div>
      </div>
      
      {history && (
        <div className="history-section">
          <h4>아이템 이력</h4>
          <p>{history}</p>
        </div>
      )}
      
      <div className="time-spent">
        감정 소요 시간: {timeSpent}초
      </div>
      
      <button className="continue-button" onClick={onContinue}>
        확인
      </button>
    </div>
  );
};

// 감정 화면 메인 컴포넌트
const AppraisalScreen: React.FC = () => {
  const { state } = useGameState();
  const { 
    selectedItemId,
    options,
    appraisalState,
    result,
    
    selectItem,
    updateOptions,
    startAppraisal,
    cancelAppraisal
  } = useAppraisal();
  
  const [progress, setProgress] = useState(0);
  
  // 선택된 아이템 정보
  const selectedItem = selectedItemId 
    ? state.inventory.find(item => item.id === selectedItemId) 
    : null;
  
  // 시작 처리
  const handleStartAppraisal = () => {
    if (!selectedItem) return;
    startAppraisal();
  };
  
  // 진행 상태 업데이트
  useEffect(() => {
    if (appraisalState !== 'examining') {
      setProgress(0);
      return;
    }
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50); // 약 5초 동안 진행
    
    return () => clearInterval(interval);
  }, [appraisalState]);
  
  return (
    <div className="appraisal-screen">
      <h1>아이템 감정</h1>
      
      {appraisalState === 'idle' && (
        <div className="appraisal-setup">
          <ItemSelector 
            items={state.inventory}
            selectedItemId={selectedItemId}
            onSelectItem={selectItem}
          />
          
          {selectedItem && (
            <>
              <div className="selected-item-preview">
                <h3>선택된 아이템</h3>
                <div className="item-name">{selectedItem.name}</div>
                <div className="item-description">{selectedItem.description}</div>
              </div>
              
              <AppraisalOptionsSelector 
                options={options}
                onChange={updateOptions}
              />
              
              <button 
                className="start-button"
                onClick={handleStartAppraisal}
                disabled={!selectedItem}
              >
                감정 시작
              </button>
            </>
          )}
        </div>
      )}
      
      {appraisalState === 'examining' && selectedItem && (
        <AppraisalProcess 
          isAppraising={true}
          itemName={selectedItem.name}
          progress={progress}
        />
      )}
      
      {appraisalState === 'complete' && result && selectedItem && (
        <AppraisalResult 
          itemName={selectedItem.name}
          baseValue={selectedItem.baseValue}
          actualValue={result.actualValue}
          condition={result.condition}
          tags={result.discoveredTags}
          history={result.history}
          timeSpent={result.timeSpent}
          onContinue={cancelAppraisal}
        />
      )}
      
      {appraisalState === 'failed' && (
        <div className="appraisal-failed">
          <h3>감정 실패</h3>
          <p>이 아이템을 감정하는데 실패했습니다. 더 숙련된 감정사나 더 나은 도구가 필요할 수 있습니다.</p>
          <button onClick={cancelAppraisal}>확인</button>
        </div>
      )}
    </div>
  );
};

export default AppraisalScreen;