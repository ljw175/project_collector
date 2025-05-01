import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from '../features/collection/hooks/useCollection';
import { ItemCategory } from '../models/item';
import '../styles/collection-test.css';
import '../styles/components.css';

/**
 * 수집 시스템 테스트 페이지
 */
const CollectionTest: React.FC = () => {
  // 수집 훅 사용
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
  
  // 수집 사이트 표시 제어
  const [showingEvents, setShowingEvents] = useState(true);
  
  // 초기 데이터 로드
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);
  
  // 이벤트 선택 핸들러
  const handleSelectEvent = (eventId: string) => {
    selectEvent(eventId);
    setShowingEvents(false);
  };
  
  // 수집 옵션 변경 핸들러
  const handleOptionChange = (option: string, value: any) => {
    updateOptions({ [option]: value });
  };
  
  // 수집 시작 핸들러
  const handleStartCollection = () => {
    startCollection();
  };
  
  // 이벤트 목록으로 돌아가기
  const handleBackToEvents = () => {
    setShowingEvents(true);
  };
  
  // 아이템 선택 처리
  const handleToggleItem = (itemId: string) => {
    toggleSelectItem(itemId);
  };
  
  // 선택한 아이템 획득
  const handleAcquireItems = () => {
    if (acquireSelectedItems()) {
      setShowingEvents(true);
    }
  };
  
  // 이벤트 목록 표시
  const renderEventsList = () => {
    if (activeEvents.length === 0) {
      return (
        <div className="empty-state">
          <p>사용 가능한 수집 이벤트가 없습니다.</p>
        </div>
      );
    }
    
    return (
      <div className="events-list">
        {activeEvents.map(event => (
          <div key={event.id} className="event-item">
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <div className="event-meta">
              <span className={`event-rarity ${event.rarity}`}>
                {event.rarity === 'common' && '일반'}
                {event.rarity === 'uncommon' && '비일반'}
                {event.rarity === 'rare' && '희귀'}
                {event.rarity === 'epic' && '영웅'}
              </span>
              <span className="event-duration">
                기간: {event.durationDays}일
              </span>
              {event.costToEnter && (
                <span className="event-cost">
                  비용: {event.costToEnter} 골드
                </span>
              )}
              {event.minimumReputation && (
                <span className="event-reputation">
                  필요 평판: {event.minimumReputation}
                </span>
              )}
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => handleSelectEvent(event.id)}
            >
              선택하기
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  // 선택된 이벤트 및 수집 옵션 표시
  const renderSelectedEvent = () => {
    if (!selectedEvent) return null;
    
    return (
      <>
        <div className="card">
          <div className="card-header">
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={handleBackToEvents}
            >
              ← 이벤트 목록으로
            </button>
            <h2>{selectedEvent.name}</h2>
          </div>
          <div className="card-body">
            <p>{selectedEvent.description}</p>
            
            <div className="collection-options">
              <h3>수집 옵션</h3>
              
              <div className="option-group">
                <label>탐색 방식:</label>
                <div className="option-buttons">
                  <button 
                    className={`option-btn ${collectionOptions.thoroughness === 'casual' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('thoroughness', 'casual')}
                  >
                    기본 탐색
                  </button>
                  <button 
                    className={`option-btn ${collectionOptions.thoroughness === 'focused' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('thoroughness', 'focused')}
                  >
                    집중 탐색
                  </button>
                  <button 
                    className={`option-btn ${collectionOptions.thoroughness === 'meticulous' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('thoroughness', 'meticulous')}
                  >
                    꼼꼼한 탐색
                  </button>
                </div>
              </div>
              
              <div className="option-group">
                <label>집중 카테고리:</label>
                <div className="option-buttons">
                  <button 
                    className={`option-btn ${!collectionOptions.focusCategory ? 'active' : ''}`}
                    onClick={() => handleOptionChange('focusCategory', undefined)}
                  >
                    없음
                  </button>
                  <button 
                    className={`option-btn ${collectionOptions.focusCategory === ItemCategory.WEAPON ? 'active' : ''}`}
                    onClick={() => handleOptionChange('focusCategory', ItemCategory.WEAPON)}
                  >
                    무기
                  </button>
                  <button 
                    className={`option-btn ${collectionOptions.focusCategory === ItemCategory.JEWELRY ? 'active' : ''}`}
                    onClick={() => handleOptionChange('focusCategory', ItemCategory.JEWELRY)}
                  >
                    보석
                  </button>
                  <button 
                    className={`option-btn ${collectionOptions.focusCategory === ItemCategory.ART ? 'active' : ''}`}
                    onClick={() => handleOptionChange('focusCategory', ItemCategory.ART)}
                  >
                    예술품
                  </button>
                  <button 
                    className={`option-btn ${collectionOptions.focusCategory === ItemCategory.BOOK ? 'active' : ''}`}
                    onClick={() => handleOptionChange('focusCategory', ItemCategory.BOOK)}
                  >
                    서적
                  </button>
                </div>
              </div>
              
              <button 
                className="btn btn-primary btn-lg"
                onClick={handleStartCollection}
                disabled={!canStartCollection || isCollecting}
              >
                {isCollecting ? '수집 중...' : '수집 시작'}
              </button>
            </div>
          </div>
        </div>
        
        {renderDiscoveredItems()}
      </>
    );
  };
  
  // 발견된 아이템 표시
  const renderDiscoveredItems = () => {
    if (!discoveredItems.length) return null;
    
    return (
      <div className="card mt-4">
        <div className="card-header">
          <h2>발견된 아이템</h2>
        </div>
        <div className="card-body">
          <div className="discovered-items">
            {collectionResults.map(result => (
              <div 
                key={result.item.id} 
                className={`discovered-item ${selectedItemIds.includes(result.item.id) ? 'selected' : ''}`}
                onClick={() => handleToggleItem(result.item.id)}
              >
                <div className="item-header">
                  <h3 className={`item-name ${result.isRare ? 'rare' : ''}`}>
                    {result.item.name}
                  </h3>
                  {result.cost && (
                    <span className="item-cost">{result.cost} 골드</span>
                  )}
                </div>
                <p className="item-description">{result.item.description}</p>
                <p className="discovery-text">{result.discoveryText}</p>
                <div className="item-details">
                  <span className="item-category">
                    {result.item.category}
                  </span>
                  <span className="item-value">
                    가치: {result.item.baseValue} 골드
                  </span>
                </div>
                <div className="item-selection">
                  <input 
                    type="checkbox" 
                    checked={selectedItemIds.includes(result.item.id)} 
                    onChange={() => {}} 
                  />
                  <label>선택됨</label>
                </div>
              </div>
            ))}
          </div>
          
          <div className="actions-bar">
            <button 
              className="btn btn-primary"
              onClick={handleAcquireItems}
              disabled={selectedItemIds.length === 0}
            >
              선택한 아이템 획득 ({selectedItemIds.length})
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/dev" className="back-button">← 테스트 메뉴로</Link>
        <h1>수집 시스템 테스트</h1>
      </header>
      
      <main className="app-content">
        {showingEvents && !selectedEvent ? renderEventsList() : renderSelectedEvent()}
      </main>
    </div>
  );
};

export default CollectionTest;