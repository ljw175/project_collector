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
        <div className="empty-workspace">
          <div className="empty-icon">🔍</div>
          <div className="empty-message">사용 가능한 수집 이벤트가 없습니다.</div>
        </div>
      );
    }
    
    return (
      <div className="collection-grid">
        {activeEvents.map(event => (
          <div key={event.id} className="collection-item event-item">
            <div className="item-image">
              {/* 이벤트 이미지가 있을 경우 */}
              <div className="item-icon">🗺️</div>
            </div>
            <div className="item-details">
              <h3 className="item-name">{event.name}</h3>
              <p className="item-category">{event.description}</p>
              <div className="item-stats">
                <span className={`item-rarity ${event.rarity}`}>
                  {event.rarity === 'common' && '일반'}
                  {event.rarity === 'uncommon' && '비일반'}
                  {event.rarity === 'rare' && '희귀'}
                  {event.rarity === 'epic' && '영웅'}
                </span>
                <span className="item-date">
                  기간: {event.durationDays}일
                </span>
              </div>
              <div className="item-tags">
                {event.costToEnter && (
                  <span className="item-tag">
                    비용: {event.costToEnter} 골드
                  </span>
                )}
                {event.minimumReputation && (
                  <span className="item-tag">
                    필요 평판: {event.minimumReputation}
                  </span>
                )}
              </div>
            </div>
            <button 
              className="collection-button"
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
      <div className="collection-container">
        <div className="collection-sidebar">
          <div className="sidebar-header">
            <button 
              className="back-button" 
              onClick={handleBackToEvents}
            >
              ← 이벤트 목록으로
            </button>
          </div>
          
          <div className="collection-stats">
            <h3>{selectedEvent.name}</h3>
            <div className="stat-row">
              <span className="stat-label">이벤트 등급:</span>
              <span className={`stat-value highlight ${selectedEvent.rarity}`}>
                {selectedEvent.rarity === 'common' && '일반'}
                {selectedEvent.rarity === 'uncommon' && '비일반'}
                {selectedEvent.rarity === 'rare' && '희귀'}
                {selectedEvent.rarity === 'epic' && '영웅'}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">기간:</span>
              <span className="stat-value">{selectedEvent.durationDays}일</span>
            </div>
            {selectedEvent.costToEnter && (
              <div className="stat-row">
                <span className="stat-label">비용:</span>
                <span className="stat-value">{selectedEvent.costToEnter} 골드</span>
              </div>
            )}
          </div>
          
          <div className="collection-categories">
            <h3 className="categories-title">집중 카테고리</h3>
            <div className="category-list">
              <div 
                className={`category-item ${!collectionOptions.focusCategory ? 'active' : ''}`}
                onClick={() => handleOptionChange('focusCategory', undefined)}
              >
                <span className="category-name">전체</span>
              </div>
              <div
                className={`category-item ${collectionOptions.focusCategory === ItemCategory.WEAPON ? 'active' : ''}`}
                onClick={() => handleOptionChange('focusCategory', ItemCategory.WEAPON)}
              >
                <span className="category-name">무기</span>
              </div>
              <div 
                className={`category-item ${collectionOptions.focusCategory === ItemCategory.JEWELRY ? 'active' : ''}`}
                onClick={() => handleOptionChange('focusCategory', ItemCategory.JEWELRY)}
              >
                <span className="category-name">보석</span>
              </div>
              <div 
                className={`category-item ${collectionOptions.focusCategory === ItemCategory.ART ? 'active' : ''}`}
                onClick={() => handleOptionChange('focusCategory', ItemCategory.ART)}
              >
                <span className="category-name">예술품</span>
              </div>
              <div 
                className={`category-item ${collectionOptions.focusCategory === ItemCategory.BOOK ? 'active' : ''}`}
                onClick={() => handleOptionChange('focusCategory', ItemCategory.BOOK)}
              >
                <span className="category-name">서적</span>
              </div>
            </div>
          </div>
          
          <div className="collection-filters">
            <h3 className="filters-title">탐색 방식</h3>
            <div className="filter-group">
              <div 
                className={`option-btn ${collectionOptions.thoroughness === 'casual' ? 'active' : ''}`}
                onClick={() => handleOptionChange('thoroughness', 'casual')}
              >
                기본 탐색
                <div className="option-description">
                  기본적인 탐색 방식입니다. 아이템 발견 확률이 낮습니다.
                </div>
              </div>
              <div 
                className={`option-btn ${collectionOptions.thoroughness === 'focused' ? 'active' : ''}`}
                onClick={() => handleOptionChange('thoroughness', 'focused')}
              >
                집중 탐색
                <div className="option-description">
                  특정 지역에 집중 탐색합니다. 선택한 카테고리의 아이템 발견 확률이 높아집니다.
                </div>
              </div>
              <div 
                className={`option-btn ${collectionOptions.thoroughness === 'meticulous' ? 'active' : ''}`}
                onClick={() => handleOptionChange('thoroughness', 'meticulous')}
              >
                꼼꼼한 탐색
                <div className="option-description">
                  모든 곳을 꼼꼼하게 탐색합니다. 희귀 아이템 발견 확률이 높아집니다.
                </div>
              </div>
            </div>
            
            <div className="filter-actions">
              <button 
                className="apply-filters-btn"
                onClick={handleStartCollection}
                disabled={!canStartCollection || isCollecting}
              >
                {isCollecting ? '수집 중...' : '수집 시작'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="collection-main">
          <div className="main-header">
            <div className="collection-title">
              {selectedEvent.name} - {selectedEvent.description}
            </div>
            <div className="view-controls">
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input type="text" className="search-input" placeholder="아이템 검색..." />
              </div>
            </div>
          </div>
          
          {renderDiscoveredItems()}
        </div>
      </div>
    );
  };
  
  // 발견된 아이템 표시
  const renderDiscoveredItems = () => {
    if (!discoveredItems.length) {
      if (isCollecting) {
        return (
          <div className="collection-progress">
            <div className="progress-animation">🔍</div>
            <div className="progress-message">아이템을 수집하는 중입니다...</div>
          </div>
        );
      }
      
      return (
        <div className="empty-workspace">
          <div className="empty-icon">🔍</div>
          <div className="empty-message">수집을 시작하면 발견된 아이템이 여기에 표시됩니다.</div>
        </div>
      );
    }
    
    return (
      <>
        <div className="collection-grid">
          {collectionResults.map(result => (
            <div 
              key={result.item.id} 
              className={`collection-item ${selectedItemIds.includes(result.item.id) ? 'selected' : ''}`}
              onClick={() => handleToggleItem(result.item.id)}
            >
              <div className="item-image">
                <div className="item-img"></div>
                {result.isRare && <div className="item-rarity rare"></div>}
                <div className="item-favorite">
                  {selectedItemIds.includes(result.item.id) ? '★' : '☆'}
                </div>
              </div>
              <div className="item-details">
                <div className="item-name">{result.item.name}</div>
                <div className="item-category">{result.item.category}</div>
                <div className="item-stats">
                  <div className="item-value">
                    {result.item.baseValue[0].amount} 금화
                  </div>
                  <div className="item-date">
                    방금 발견
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="collection-pagination">
          <div className="pagination-container">
            <button 
              className="apply-filters-btn"
              onClick={handleAcquireItems}
              disabled={selectedItemIds.length === 0}
            >
              선택한 아이템 획득 ({selectedItemIds.length})
            </button>
          </div>
        </div>
      </>
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