/**
 * 수집(Collection) 화면 컴포넌트
 */
import React, { useEffect, useState } from 'react';
import { useCollection } from '../hooks/useCollection';
import { ItemCategory } from '@models/item';
import type { CollectionOptions } from '../types/collection_types';
import { useGameState } from '@store/gameContext';

// 수집 이벤트 목록 컴포넌트
const CollectionEventList: React.FC<{
  events: Array<{
    id: string;
    name: string;
    description: string;
    rarity: string;
    costToEnter?: number;
    minimumReputation?: number;
  }>;
  onSelectEvent: (eventId: string) => void;
  selectedEventId: string | null;
}> = ({ events, onSelectEvent, selectedEventId }) => {
  return (
    <div className="events-list">
      <h2>탐색 장소</h2>
      {events.length === 0 ? (
        <p className="no-events">현재 가능한 수집 장소가 없습니다.</p>
      ) : (
        <ul>
          {events.map(event => (
            <li 
              key={event.id} 
              className={`event-item ${event.id === selectedEventId ? 'selected' : ''} rarity-${event.rarity}`}
              onClick={() => onSelectEvent(event.id)}
            >
              <div className="event-header">
                <h3>{event.name}</h3>
                {event.costToEnter && (
                  <div className="event-cost">{event.costToEnter}G</div>
                )}
              </div>
              <p className="event-description">{event.description}</p>
              {event.minimumReputation && (
                <div className="reputation-required">
                  필요 평판: {event.minimumReputation}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 수집 옵션 컴포넌트
const CollectionOptions: React.FC<{
  options: CollectionOptions;
  onChange: (newOptions: Partial<CollectionOptions>) => void;
  playerMoney: number;
}> = ({ options, onChange, playerMoney }) => {
  return (
    <div className="collection-options">
      <h3>수집 방식</h3>
      
      <div className="option-group">
        <label>꼼꼼함:</label>
        <div className="button-group">
          <button 
            className={options.thoroughness === 'casual' ? 'active' : ''} 
            onClick={() => onChange({ thoroughness: 'casual' })}
          >
            간단히
          </button>
          <button 
            className={options.thoroughness === 'focused' ? 'active' : ''} 
            onClick={() => onChange({ thoroughness: 'focused' })}
          >
            집중해서
          </button>
          <button 
            className={options.thoroughness === 'meticulous' ? 'active' : ''}
            onClick={() => onChange({ thoroughness: 'meticulous' })}
          >
            꼼꼼하게
          </button>
        </div>
      </div>
      
      <div className="option-group">
        <label>집중 카테고리:</label>
        <select 
          value={options.focusCategory || ''} 
          onChange={e => onChange({ 
            focusCategory: e.target.value ? e.target.value as ItemCategory : undefined 
          })}
        >
          <option value="">모든 카테고리</option>
          <option value={ItemCategory.WEAPON}>무기</option>
          <option value={ItemCategory.JEWELRY}>보석/귀금속</option>
          <option value={ItemCategory.ART}>예술/골동품</option>
          <option value={ItemCategory.BOOK}>서적</option>
          <option value={ItemCategory.HOUSEHOLD}>생활용품</option>
          <option value={ItemCategory.MATERIAL}>희귀 재료</option>
        </select>
      </div>
      
      {options.thoroughness === 'meticulous' && (
        <div className="option-info">
          <p>꼼꼼하게 살펴보면 더 많은 물건을 찾을 수 있지만, 시간이 오래 걸립니다.</p>
        </div>
      )}
      
      {options.focusCategory && (
        <div className="option-info">
          <p>특정 카테고리에 집중하면 해당 종류의 물건을 찾을 확률이 높아집니다.</p>
        </div>
      )}
      
      {options.budget !== undefined && (
        <div className="option-group">
          <label>예산:</label>
          <input 
            type="range" 
            min="0" 
            max={playerMoney} 
            step="10" 
            value={options.budget} 
            onChange={e => onChange({ budget: parseInt(e.target.value) })}
          />
          <span>{options.budget}G</span>
        </div>
      )}
    </div>
  );
};

// 발견된 아이템 컴포넌트
const DiscoveredItems: React.FC<{
  items: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    isRare?: boolean;
    cost?: number;
    discoveryText?: string;
  }>;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}> = ({ items, selectedIds, onToggleSelect }) => {
  return (
    <div className="discovered-items">
      <h3>발견한 물건</h3>
      
      {items.length === 0 ? (
        <p className="no-items">아직 발견한 물건이 없습니다.</p>
      ) : (
        <ul className="items-list">
          {items.map(item => (
            <li 
              key={item.id} 
              className={`item ${selectedIds.includes(item.id) ? 'selected' : ''} ${item.isRare ? 'rare' : ''}`}
              onClick={() => onToggleSelect(item.id)}
            >
              <div className="item-header">
                <h4 className="item-name">{item.name}</h4>
                <div className="item-category">{item.category}</div>
              </div>
              <p className="item-description">{item.description}</p>
              {item.discoveryText && (
                <p className="discovery-text">{item.discoveryText}</p>
              )}
              {item.cost !== undefined && (
                <div className="item-cost">가격: {item.cost}G</div>
              )}
              <div className="select-indicator">
                {selectedIds.includes(item.id) ? '✓' : '선택하기'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 수집 진행 상태 컴포넌트
const CollectionProgress: React.FC<{
  isCollecting: boolean;
  eventName: string;
}> = ({ isCollecting, eventName }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!isCollecting) {
      setProgress(0);
      return;
    }
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isCollecting]);
  
  if (!isCollecting) return null;
  
  return (
    <div className="collection-progress">
      <h3>수집 진행 중...</h3>
      <p>{eventName}에서 물건을 찾고 있습니다.</p>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

// 결과 요약 컴포넌트
const CollectionSummary: React.FC<{
  itemsFound: number;
  rareItemsFound: number;
  totalCost?: number;
  onClose: () => void;
}> = ({ itemsFound, rareItemsFound, totalCost, onClose }) => {
  return (
    <div className="collection-summary">
      <h3>수집 결과</h3>
      <ul>
        <li>발견한 물건: {itemsFound}개</li>
        {rareItemsFound > 0 && (
          <li>희귀한 물건: {rareItemsFound}개</li>
        )}
        {totalCost !== undefined && totalCost > 0 && (
          <li>총 비용: {totalCost}G</li>
        )}
      </ul>
      <button onClick={onClose}>확인</button>
    </div>
  );
};

// 메인 수집 컴포넌트
const CollectionScreen: React.FC = () => {
  const { state } = useGameState();
  const { 
    activeEvents,
    selectedEvent,
    discoveredItems,
    selectedItemIds,
    collectionOptions,
    isCollecting,
    collectionResults,
    canStartCollection,
    
    loadEvents,
    selectEvent,
    updateOptions,
    startCollection,
    toggleSelectItem,
    acquireSelectedItems
  } = useCollection();
  
  const [showSummary, setShowSummary] = useState(false);

  // 컴포넌트 마운트 시 이벤트 로드
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // 시작 처리
  const handleStartCollection = () => {
    const success = startCollection();
    if (!success) {
      // 오류 처리 (돈 부족, 평판 부족 등)
      alert("수집을 시작할 수 없습니다.");
    }
  };

  // 아이템 획득 처리
  const handleAcquireItems = () => {
    const success = acquireSelectedItems();
    if (success) {
      // 결과 요약 표시
      setShowSummary(true);
    }
  };

  // 결과 요약 닫기
  const handleCloseSummary = () => {
    setShowSummary(false);
  };

  // 발견된 아이템 가공 (컴포넌트에 전달할 형태로)
  const formattedItems = discoveredItems.map((item, index) => {
    const result = collectionResults[index];
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      isRare: result ? result.isRare : false,
      cost: result ? result.cost : undefined,
      discoveryText: result ? result.discoveryText : undefined
    };
  });

  // 결과 요약 계산
  const summary = {
    itemsFound: discoveredItems.length,
    rareItemsFound: collectionResults.filter(r => r.isRare).length,
    totalCost: collectionResults
      .filter(r => selectedItemIds.includes(r.item.id) && r.cost !== undefined)
      .reduce((sum, r) => sum + (r.cost || 0), 0)
  };

  return (
    <div className="collection-screen">
      <h1>수집</h1>
      
      {/* 이벤트 선택 영역 */}
      {selectedEvent === null || selectedEvent === undefined ? (
        <CollectionEventList 
          events={activeEvents}
          onSelectEvent={selectEvent}
          selectedEventId={null}
        />
      ) : (
        <div className="collection-workspace">
          {/* 선택된 이벤트 정보 */}
          <div className="event-details">
            <h2>{selectedEvent.name}</h2>
            <p>{selectedEvent.description}</p>
            <button 
              className="back-button"
              onClick={() => selectEvent('')}
            >
              돌아가기
            </button>
          </div>
          
          {/* 수집 진행 중이 아닐 때 */}
          {!isCollecting && discoveredItems.length === 0 && (
            <div className="collection-setup">
              <CollectionOptions 
                options={collectionOptions}
                onChange={updateOptions}
                playerMoney={state.player.money}
              />
              
              <button 
                className="start-button"
                onClick={handleStartCollection}
                disabled={!canStartCollection}
              >
                수집 시작
              </button>
              
              {!canStartCollection && selectedEvent.costToEnter && selectedEvent.costToEnter > state.player.money && (
                <p className="error-message">비용을 지불할 돈이 부족합니다.</p>
              )}
              
              {!canStartCollection && selectedEvent.minimumReputation && selectedEvent.minimumReputation > state.player.reputation && (
                <p className="error-message">필요한 평판이 부족합니다.</p>
              )}
            </div>
          )}
          
          {/* 수집 진행 중 */}
          {isCollecting && (
            <CollectionProgress 
              isCollecting={isCollecting}
              eventName={selectedEvent.name}
            />
          )}
          
          {/* 발견된 아이템이 있을 때 */}
          {!isCollecting && discoveredItems.length > 0 && (
            <div className="collection-results">
              <DiscoveredItems 
                items={formattedItems}
                selectedIds={selectedItemIds}
                onToggleSelect={toggleSelectItem}
              />
              
              <div className="action-buttons">
                <button 
                  className="acquire-button"
                  onClick={handleAcquireItems}
                  disabled={selectedItemIds.length === 0}
                >
                  선택한 아이템 획득
                </button>
                
                <button 
                  className="skip-button"
                  onClick={() => {
                    // Reset by re-selecting the current event
                    if (selectedEvent) {
                      selectEvent(selectedEvent.id);
                    }
                  }}
                >
                  모두 버리기
                </button>
              </div>
            </div>
          )}
          
          {/* 결과 요약 (모달) */}
          {showSummary && (
            <div className="summary-overlay">
              <CollectionSummary 
                itemsFound={summary.itemsFound}
                rareItemsFound={summary.rareItemsFound}
                totalCost={summary.totalCost}
                onClose={handleCloseSummary}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionScreen;