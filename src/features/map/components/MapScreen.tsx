/**
 * 맵(Map) 화면 컴포넌트
 */
import React, { useEffect, useState } from 'react';
import { useMap } from '../hooks/useMap';
import { useGameState } from '@store/gameContext';
import { LocationType, LocationActivity, TravelCost, Location } from '../types/map_types';

// 위치 유형 아이콘 매핑
const locationTypeIcons: Record<LocationType, string> = {
  [LocationType.SHOP]: '🏪',
  [LocationType.MARKET]: '🛒',
  [LocationType.AUCTION_HOUSE]: '🏛️',
  [LocationType.WORKSHOP]: '🔨',
  [LocationType.LIBRARY]: '📚',
  [LocationType.COLLECTOR]: '🧐',
  [LocationType.COLLECTION_SITE]: '📦',
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
  playerConvertedMoney: number;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ locationName, cost, playerConvertedMoney, onConfirm, onCancel }) => {
  const canAfford = playerConvertedMoney >= cost.money;
  
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
            <span className="value">{cost.time}일</span>
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
    locations,
    currentLocation,
    selectedLocation,
    activeEvents,
    currentDay,
    isLoading,
    
    setSelectedLocationId,
    setShowTravelModal,
    travelTo,
    calculateTravelCost,
    getEventsByLocation
  } = useMap();
  
  // 마킹된 위치 ID
  const [markedLocationId, setMarkedLocationId] = useState<string | null>(null);
  
  // 이동 모달 표시 여부 상태
  const [showTravelConfirm, setShowTravelConfirm] = useState(false);
  
  // 이동 비용 상태
  const [activeTravelCost, setActiveTravelCost] = useState<TravelCost | null>(null);
  
  // 활성 이벤트 맵
  const [locationEventMap, setLocationEventMap] = useState<Record<string, boolean>>({});
  
  // 활성 이벤트 맵 업데이트
  useEffect(() => {
    const newEventMap: Record<string, boolean> = {};
    
    activeEvents.forEach(event => {
      newEventMap[event.locationId] = true;
    });
    
    setLocationEventMap(newEventMap);
  }, [activeEvents]);
  
  // 위치 선택 처리
  const handleSelectLocation = (locationId: string) => {
    setSelectedLocationId(locationId);
    
    // 위치를 선택했을 때 여행 비용 계산
    const cost = calculateTravelCost(locationId);
    setActiveTravelCost(cost);
    
    // 선택한 위치가 현재 위치가 아니라면 여행 확인 모달 표시
    if (currentLocation && currentLocation.id !== locationId) {
      setShowTravelConfirm(true);
    }
  };
  
  // 위치 마킹 토글
  const toggleMarkLocation = (locationId: string) => {
    if (markedLocationId === locationId) {
      setMarkedLocationId(null);
    } else {
      setMarkedLocationId(locationId);
    }
  };
  
  // 이동 처리
  const handleTravel = () => {
    if (selectedLocation) {
      const result = travelTo(selectedLocation.id);
      
      // 이동 성공 시 모달 닫기
      if (result.success) {
        setShowTravelConfirm(false);
      }
    }
  };
  
  // 이동 취소
  const handleCancelTravel = () => {
    setShowTravelConfirm(false);
  };
  
  // 선택된 위치의 이벤트
  const selectedLocationEvents = selectedLocation
    ? getEventsByLocation(selectedLocation.id)
        .map(event => ({
          title: event.title,
          description: event.description,
          duration: event.duration - (currentDay - event.startDay)
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
          {locations
            .filter((location: Location) => location.isDiscovered)
            .map((location: Location) => (
              <LocationMarker 
                key={location.id}
                id={location.id}
                name={location.name}
                type={location.type}
                x={location.coordinates.x}
                y={location.coordinates.y}
                isCurrentLocation={currentLocation ? location.id === currentLocation.id : false}
                isMarked={location.id === markedLocationId}
                isAccessible={location.isAccessible}
                hasActiveEvent={!!locationEventMap[location.id]}
                onSelect={handleSelectLocation}
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
      
      {showTravelConfirm && selectedLocation && activeTravelCost && (
        <TravelConfirmModal 
          locationName={selectedLocation.name}
          cost={activeTravelCost}
          playerConvertedMoney={state.player.status.convertedMoney}
          onConfirm={handleTravel}
          onCancel={handleCancelTravel}
        />
      )}
    </div>
  );
};

export default MapScreen;