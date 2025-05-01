import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';
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
    cost: { money: number; timeDays: number; fatigue: number }; 
    message: string 
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
    console.log(`새 장소를 발견했습니다: ${updated?.find(l => l.id === locationId)?.name}`);
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
          {/* 현재 위치 정보 */}
          <div className="current-location-panel">
            <h2>현재 위치</h2>
            {currentLocation ? (
              <div className="location-info">
                <div className="location-header">
                  <h3>{currentLocation.name}</h3>
                  <div className="location-type">{currentLocation.type}</div>
                </div>
                
                <p className="location-description">
                  {currentLocation.description}
                </p>
                
                <div className="location-activities">
                  <h4>가능한 활동</h4>
                  <div className="activity-list">
                    {currentLocation.availableActivities.map(activity => (
                      <div key={activity} className="activity-badge">
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 현재 위치의 이벤트 */}
                {currentLocationEvents.length > 0 && (
                  <div className="location-events">
                    <h4>이벤트</h4>
                    <ul className="event-list">
                      {currentLocationEvents.map(event => (
                        <li key={event.id} className="event-item">
                          <div className="event-title">{event.title}</div>
                          <div className="event-description">{event.description}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-location">
                <p>위치 정보를 불러올 수 없습니다.</p>
              </div>
            )}
          </div>
          
          {/* 맵과 이동 가능 위치 */}
          <div className="map-navigation">
            <div className="map-filters">
              <h3>탐색 필터</h3>
              <div className="activity-filters">
                <button 
                  className={activityFilter === null ? 'active' : ''}
                  onClick={() => handleActivityFilter(null)}
                >
                  모든 장소
                </button>
                <button 
                  className={activityFilter === LocationActivity.BUY ? 'active' : ''}
                  onClick={() => handleActivityFilter(LocationActivity.BUY)}
                >
                  상점
                </button>
                <button 
                  className={activityFilter === LocationActivity.APPRAISE ? 'active' : ''}
                  onClick={() => handleActivityFilter(LocationActivity.APPRAISE)}
                >
                  감정소
                </button>
                <button 
                  className={activityFilter === LocationActivity.SELL ? 'active' : ''}
                  onClick={() => handleActivityFilter(LocationActivity.SELL)}
                >
                  경매장
                </button>
                <button 
                  className={activityFilter === LocationActivity.COLLECT ? 'active' : ''}
                  onClick={() => handleActivityFilter(LocationActivity.COLLECT)}
                >
                  수집장소
                </button>
              </div>
            </div>
            
            {/* 이동 가능 위치 목록 */}
            <div className="locations-grid">
              {filteredLocations.length > 0 ? (
                filteredLocations.map(location => (
                  <div
                    key={location.id}
                    className={`location-card ${currentLocation?.id === location.id ? 'current' : ''}`}
                    onClick={() => {
                      if (location.id !== currentLocation?.id && location.isAccessible) {
                        handleTravel(location.id);
                      }
                    }}
                  >
                    <div className="location-name">{location.name}</div>
                    <div className="location-type">{location.type}</div>
                    <div className="location-status">
                      {!location.isAccessible && <span className="locked">🔒</span>}
                      {currentLocation?.id === location.id && <span className="current-badge">현재 위치</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-locations">
                  {activityFilter 
                    ? `${activityFilter} 활동이 가능한 장소가 없습니다.` 
                    : '발견한 장소가 없습니다.'}
                </div>
              )}
            </div>
          </div>
          
          {/* 전체 맵 (시각적 표현) */}
          <div className="map-visual">
            <h3>전체 맵</h3>
            <div className="map-visual-content">
              {/* 실제 프로젝트에서는 canvas나 SVG 등으로 구현 */}
              <div className="map-placeholder">
                <div className="map-background"></div>
                
                {/* 위치 표시 */}
                {locations.map(location => (
                  <div
                    key={location.id}
                    className={`map-location-marker ${location.isDiscovered ? 'discovered' : 'undiscovered'} 
                      ${currentLocation?.id === location.id ? 'current' : ''}`}
                    style={{
                      left: `${location.coordinates.x}%`,
                      top: `${location.coordinates.y}%`
                    }}
                    title={location.isDiscovered ? location.name : '미발견 지역'}
                    onClick={() => {
                      if (!location.isDiscovered) {
                        handleDiscoverLocation(location.id);
                      } else if (location.isAccessible && location.id !== currentLocation?.id) {
                        handleTravel(location.id);
                      }
                    }}
                  >
                    {location.isDiscovered 
                      ? (
                        <div className="marker-content">
                          <div className="marker-icon">
                            {location.type === LocationType.SHOP ? '🏪' : 
                             location.type === LocationType.MARKET ? '🛒' :
                             location.type === LocationType.AUCTION_HOUSE ? '🏛️' : 
                             location.type === LocationType.WORKSHOP ? '🔨' : 
                             location.type === LocationType.LIBRARY ? '📚' : 
                             location.type === LocationType.COLLECTOR ? '🧐' : 
                             location.type === LocationType.COLLECTION_SITE ? '📦' : '✨'}
                          </div>
                          <div className="marker-name">{location.name}</div>
                        </div>
                      ) 
                      : '?'
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 이동 결과 메시지 */}
        {travelResult && (
          <div className={`travel-result ${travelResult.success ? 'success' : 'error'}`}>
            {travelResult.message}
            {travelResult.success && ` (소요 시간: ${travelResult.cost}시간)`}
          </div>
        )}
      </main>
    </div>
  );
};

export default MapTest;