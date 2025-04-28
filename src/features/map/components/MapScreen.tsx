/**
 * 맵(Map) 화면 컴포넌트
 */
import React, { useEffect, useState } from 'react';
import { useMap } from '../hooks/useMap';
import { useGameState } from '@store/gameContext';
import { LocationType, LocationActivity, TravelCost } from '../types/map_types';

// 위치 유형 아이콘 매핑
const locationTypeIcons: Record<LocationType, string> = {
  [LocationType.SHOP]: '🏪',
  [LocationType.MARKET]: '🛒',
  [LocationType.AUCTION_HOUSE]: '🏛️',
  [LocationType.WORKSHOP]: '🔨',
  [LocationType.LIBRARY]: '📚',
  [LocationType.COLLECTOR]: '🧐',
  [LocationType.SPECIAL]: '✨'
};

// 활동 유형 라벨 매핑
const activityLabels: Record<LocationActivity, string> = {
  [LocationActivity.BUY]: '구매',
  [LocationActivity.SELL]: '판매',
  [LocationActivity.APPRAISE]: '감정',
  [LocationActivity.REPAIR]: '수리',
  [LocationActivity.COLLECT]: '수집',
  [LocationActivity.RESEARCH]: '연구',
  [LocationActivity.TALK]: '대화',
  [LocationActivity.REST]: '휴식'
};

// 위치 마커 컴포넌트
const LocationMarker: React.FC<{
  id: string;
  name: string;
  type: LocationType;
  x: number;
  y: number;
  isCurrentLocation: boolean;
  isMarked: boolean;
  isAccessible: boolean;
  hasActiveEvent: boolean;
  onSelect: (id: string) => void;
  onMark: (id: string) => void;
}> = ({ 
  id, 
  name, 
  type,
  x, 
  y, 
  isCurrentLocation,
  isMarked,
  isAccessible,
  hasActiveEvent,
  onSelect,
  onMark
}) => {
  return (
    <div 
      className={`location-marker 
        ${isCurrentLocation ? 'current' : ''} 
        ${isMarked ? 'marked' : ''} 
        ${!isAccessible ? 'inaccessible' : ''}
        ${hasActiveEvent ? 'has-event' : ''}
      `}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={() => isAccessible && onSelect(id)}
    >
      <div className="marker-icon">{locationTypeIcons[type]}</div>
      <div className="marker-name">{name}</div>
      
      {hasActiveEvent && (
        <div className="event-indicator">!</div>
      )}
      
      <button 
        className="mark-button"
        onClick={(e) => {
          e.stopPropagation();
          onMark(id);
        }}
      >
        {isMarked ? '★' : '☆'}
      </button>
    </div>
  );
};

// 이동 확인 모달 컴포넌트
const TravelConfirmModal: React.FC<{
  locationName: string;
  cost: TravelCost;
  playerMoney: number;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ locationName, cost, playerMoney, onConfirm, onCancel }) => {
  const canAfford = playerMoney >= cost.money;
  
  return (
    <div className="modal-overlay">
      <div className="travel-modal">
        <h3>이동 확인</h3>
        <p><strong>{locationName}</strong>에 가려고 합니다.</p>
        
        <div className="cost-details">
          <div className="cost-item">
            <span className="label">비용:</span>
            <span className={`value ${!canAfford ? 'insufficient' : ''}`}>
              {cost.money}G {!canAfford && '(잔액 부족)'}
            </span>
          </div>
          <div className="cost-item">
            <span className="label">소요 시간:</span>
            <span className="value">{cost.timeDays}일</span>
          </div>
          <div className="cost-item">
            <span className="label">피로도 증가:</span>
            <span className="value">+{cost.fatigue}</span>
          </div>
        </div>
        
        <div className="modal-actions">
          <button 
            className="confirm-btn"
            onClick={onConfirm}
            disabled={!canAfford}
          >
            이동
          </button>
          <button 
            className="cancel-btn"
            onClick={onCancel}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

// 위치 정보 패널 컴포넌트
const LocationInfoPanel: React.FC<{
  id: string;
  name: string;
  description: string;
  type: LocationType;
  activities: LocationActivity[];
  events: Array<{
    title: string;
    description: string;
    duration: number;
  }>;
}> = ({ id: _id, name, description, type, activities, events }) => {
  return (
    <div className="location-info-panel">
      <div className="location-header">
        <div className="location-icon">{locationTypeIcons[type]}</div>
        <h2>{name}</h2>
      </div>
      
      <p className="location-description">{description}</p>
      
      <div className="available-activities">
        <h3>가능한 활동</h3>
        <div className="activity-tags">
          {activities.map(activity => (
            <span key={activity} className="activity-tag">
              {activityLabels[activity]}
            </span>
          ))}
        </div>
      </div>
      
      {events.length > 0 && (
        <div className="location-events">
          <h3>진행 중인 이벤트</h3>
          {events.map((event, index) => (
            <div key={index} className="event-card">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
              <div className="event-duration">
                남은 기간: {event.duration}일
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 맵 화면 메인 컴포넌트
const MapScreen: React.FC = () => {
  const { state } = useGameState();
  const { 
    mapState, 
    currentLocation,
    selectedLocation,
    activeEvents,
    isLoading,
    showTravelModal,
    travelCost,
    
    loadMapData,
    selectLocation,
    toggleMarkLocation,
    travelToLocation,
    setShowTravelModal
  } = useMap();
  
  // 활성 이벤트 맵
  const [locationEventMap, setLocationEventMap] = useState<Record<string, boolean>>({});
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadMapData();
  }, [loadMapData]);
  
  // 활성 이벤트 맵 업데이트
  useEffect(() => {
    const newEventMap: Record<string, boolean> = {};
    
    activeEvents.forEach(event => {
      newEventMap[event.locationId] = true;
    });
    
    setLocationEventMap(newEventMap);
  }, [activeEvents]);
  
  // 이동 처리
  const handleTravel = () => {
    if (selectedLocation) {
      travelToLocation(selectedLocation.id);
    }
  };
  
  // 이동 취소
  const handleCancelTravel = () => {
    setShowTravelModal(false);
  };
  
  // 선택된 위치의 이벤트
  const selectedLocationEvents = selectedLocation
    ? activeEvents
        .filter(event => event.locationId === selectedLocation.id)
        .map(event => ({
          title: event.title,
          description: event.description,
          duration: event.duration - (state.currentDay - event.startDay)
        }))
    : [];
  
  if (isLoading) {
    return <div className="loading">지도 로딩 중...</div>;
  }
  
  return (
    <div className="map-screen">
      <div className="map-header">
        <h1>지도</h1>
        <div className="player-location">
          현재 위치: {currentLocation?.name || '알 수 없음'}
        </div>
      </div>
      
      <div className="map-container">
        <div className="map-background">
          {/* 맵 배경 이미지 */}
          <div className="map-grid" />
        </div>
        
        <div className="map-markers">
          {mapState.locations
            .filter(location => location.isDiscovered)
            .map(location => (
              <LocationMarker 
                key={location.id}
                id={location.id}
                name={location.name}
                type={location.type}
                x={location.coordinates.x}
                y={location.coordinates.y}
                isCurrentLocation={location.id === mapState.currentLocationId}
                isMarked={location.id === mapState.markedLocationId}
                isAccessible={location.isAccessible}
                hasActiveEvent={!!locationEventMap[location.id]}
                onSelect={selectLocation}
                onMark={toggleMarkLocation}
              />
            ))}
        </div>
      </div>
      
      {selectedLocation && (
        <LocationInfoPanel 
          id={selectedLocation.id}
          name={selectedLocation.name}
          description={selectedLocation.description}
          type={selectedLocation.type}
          activities={selectedLocation.availableActivities}
          events={selectedLocationEvents}
        />
      )}
      
      {showTravelModal && selectedLocation && travelCost && (
        <TravelConfirmModal 
          locationName={selectedLocation.name}
          cost={travelCost}
          playerMoney={state.player.money}
          onConfirm={handleTravel}
          onCancel={handleCancelTravel}
        />
      )}
    </div>
  );
};

export default MapScreen;