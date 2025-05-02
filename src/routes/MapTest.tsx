import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';
import '../styles/map-test.css';
import { useMap } from '../features/map/hooks/useMap';
import { LocationType, LocationActivity, MapEvent } from '../features/map/types/map_types';

/**
 * 맵 시스템 테스트 페이지
 */
const MapTest: React.FC = () => {
  // 맵 훅 사용
  const {
    locations,
    currentLocation,
    activeEvents,
    currentDay,
    isLoading,
    travelTo,
    discoverLocation,
    setLocationAccessible,
    getLocationsByActivity,
    getEventsByLocation,
    advanceDay
  } = useMap();
  
  // 이동 관련 상태
  const [travelResult, setTravelResult] = useState<{ 
    success: boolean; 
    cost: { money: number; time: number; fatigue: number }; 
    message: string;
    currentLocationId: string;
  } | null>(null);
  
  // 특정 활동 필터
  const [activityFilter, setActivityFilter] = useState<LocationActivity | null>(null);
  
  // 활동 필터에 따른 위치 목록
  const filteredLocations = activityFilter
    ? getLocationsByActivity(activityFilter)
    : locations.filter(location => location.isDiscovered);
  
  // 현재 위치의 이벤트 목록
  const currentLocationEvents = currentLocation
    ? getEventsByLocation(currentLocation.id)
    : [];
  
  // 새로운 장소로 이동
  const handleTravel = (locationId: string) => {
    const result = travelTo(locationId);
    setTravelResult(result);
    
    // 3초 후 메시지 사라짐
    setTimeout(() => {
      setTravelResult(null);
    }, 3000);
  };
  
  // 날짜 진행
  const handleAdvanceDay = () => {
    const newDay = advanceDay(1);
    console.log(`날짜가 ${newDay}일로 진행되었습니다.`);
  };
  
  // 활동 필터 변경
  const handleActivityFilter = (activity: LocationActivity | null) => {
    setActivityFilter(activity);
  };
  
  // 새 장소 발견 (테스트용)
  const handleDiscoverLocation = (locationId: string) => {
    const updated = discoverLocation(locationId);
    console.log(`새 장소를 발견했습니다: ${updated?.name}`);
  };
  
  // 로딩 화면
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>맵 데이터를 불러오는 중...</p>
      </div>
    );
  }
  
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/dev" className="back-button">← 테스트 메뉴로</Link>
        <h1>맵 시스템 테스트</h1>
        <div className="current-day">
          현재 날짜: {currentDay}일
          <button className="btn-small" onClick={handleAdvanceDay}>다음날</button>
        </div>
      </header>
      
      <main className="app-content">
        <div className="map-container">
          {/* 맵 디스플레이 영역 */}
          <div className="map-display">
            <h2 className="map-title">수집가의 세계</h2>
            <div className="map-area">
              {/* 실제 맵 이미지 */}
              <div className="map-image"></div>
              
              {/* 위치 마커들 */}
              {locations.map(location => (
                <div
                  key={location.id}
                  className={`location-marker ${!location.isDiscovered ? 'undiscovered' : 
                    currentLocation?.id === location.id ? 'current' : 
                    location.isAccessible ? '' : 'inaccessible'} 
                    ${location.currentVisitors ? 'visited' : ''}`}
                  style={{
                    left: `${location.coordinates.x}%`,
                    top: `${location.coordinates.y}%`
                  }}
                  onClick={() => {
                    if (!location.isDiscovered) {
                      handleDiscoverLocation(location.id);
                    } else if (location.isAccessible && location.id !== currentLocation?.id) {
                      handleTravel(location.id);
                    }
                  }}
                >
                  {location.isDiscovered ? 
                    location.type === LocationType.SHOP ? '🏪' : 
                    location.type === LocationType.MARKET ? '🛒' :
                    location.type === LocationType.AUCTION_HOUSE ? '🏛️' : 
                    location.type === LocationType.WORKSHOP ? '🔨' : 
                    location.type === LocationType.LIBRARY ? '📚' : 
                    location.type === LocationType.COLLECTOR ? '🧐' : 
                    location.type === LocationType.COLLECTION_SITE ? '📦' : '✨'
                  : '?'}
                  
                  <div className="location-tooltip">
                    {location.isDiscovered ? location.name : '미발견 지역'}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 지역 정보 패널 */}
          <div className="location-info-panel">
            {currentLocation ? (
              <>
                <h3 className="info-header">현재 위치</h3>
                <div className="current-location">
                  <h4 className="location-name">{currentLocation.name}</h4>
                  <div className={`location-type ${currentLocation.type.toLowerCase()}`}>
                    {currentLocation.type}
                  </div>
                  <p className="location-description">{currentLocation.description}</p>
                </div>
                
                {/* 방문 가능 장소 */}
                <div className="available-locations">
                  <h4 className="section-title">이동 가능 장소</h4>
                  <div className="location-cards">
                    {filteredLocations
                      .filter(loc => loc.id !== currentLocation.id && loc.isAccessible)
                      .map(location => (
                        <div
                          key={location.id}
                          className="location-card"
                          onClick={() => handleTravel(location.id)}
                        >
                          <div className="location-icon">
                            {location.type === LocationType.SHOP ? '🏪' : 
                             location.type === LocationType.MARKET ? '🛒' :
                             location.type === LocationType.AUCTION_HOUSE ? '🏛️' : 
                             location.type === LocationType.WORKSHOP ? '🔨' : 
                             location.type === LocationType.LIBRARY ? '📚' : 
                             location.type === LocationType.COLLECTOR ? '🧐' : 
                             location.type === LocationType.COLLECTION_SITE ? '📦' : '✨'}
                          </div>
                          <div className="location-info">
                            <div className="info-name">{location.name}</div>
                            <div className="info-type">{location.type}</div>
                            <div className="location-distance">약 1시간 거리</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                {/* 이동 버튼 영역 */}
                <div className="location-actions">
                  <button 
                    className="travel-button"
                    onClick={() => handleAdvanceDay()}
                  >
                    하루 휴식
                  </button>
                  
                  <button 
                    className="interact-button"
                    onClick={() => console.log("이 장소에서 활동하기")}
                  >
                    활동하기
                  </button>
                </div>
                
                {/* 여행 결과 패널 */}
                {travelResult && (
                  <div className="travel-panel">
                    <h4 className="travel-title">여행 결과</h4>
                    <div className="travel-progress">
                      <div className="progress-bar"></div>
                    </div>
                    <div className="travel-info">
                      <span className="from-location">출발: {locations.find(loc => loc.id === travelResult.currentLocationId)?.name}</span>
                      <span className="travel-time">소요 시간: {travelResult.cost.time}시간</span>
                    </div>
                    <p className="travel-message">{travelResult.message}</p>
                  </div>
                )}
                
                {/* 장소 내 이벤트 */}
                {currentLocationEvents.length > 0 && (
                  <div className="location-npcs">
                    <h4 className="section-title">이벤트</h4>
                    <div className="npc-list">
                      {currentLocationEvents.map(event => (
                        <div key={event.id} className="npc-card">
                          <div className="npc-avatar">🧙</div>
                          <div className="npc-info">
                            <div className="npc-name">{event.title}</div>
                            <div className="npc-role">{event.description}</div>
                          </div>
                          <div className="npc-action">대화하기</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 이벤트 히스토리 */}
                <div className="event-history">
                  <h4 className="section-title">최근 활동</h4>
                  <div className="history-list">
                    <div className="event-entry">
                      <span className="event-time">오늘 09:00</span>
                      <span className="event-description">{currentLocation.name}에 도착했습니다.</span>
                    </div>
                    <div className="event-entry">
                      <span className="event-time">어제 18:30</span>
                      <span className="event-description">탐험을 마치고 쉬었습니다.</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🗺️</div>
                <p className="empty-message">위치 정보를 불러올 수 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapTest;