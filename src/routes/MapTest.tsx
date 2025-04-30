import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useMap } from '../features/map/hooks/useMap';
import { LocationType, LocationActivity } from '../features/map/types/map_types';
import '../styles/components.css';

// 위치 아이콘 이미지 import
import pawnshopIcon from '../assets/icons/locations/pawnshop.png';
import marketIcon from '../assets/icons/locations/market.png';
import bookstoreIcon from '../assets/icons/locations/bookstore.png';
import junkmanIcon from '../assets/icons/locations/junkman.png';
import hideoutIcon from '../assets/icons/locations/hideout.png';
import landfillIcon from '../assets/icons/locations/landfill.png';

/**
 * 맵/이동 시스템 테스트 페이지
 */
const MapTest: React.FC = () => {
  // 선택한 위치 ID
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  
  // 이동 모달 표시 여부
  const [showTravelModal, setShowTravelModal] = useState(false);
  
  // 맵 확대/축소 및 패닝을 위한 상태
  const [mapScale, setMapScale] = useState(1);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // 개발자 모드 상태
  const [isDevMode, setIsDevMode] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  
  // 맵 컨테이너 참조
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const cityMapRef = useRef<HTMLDivElement>(null);
  
  // 저장된 위치 정보 (실제로는 API나 localStorage에서 관리)
  const [savedLocations, setSavedLocations] = useState<Record<string, {x: number, y: number}>>({});
  
  // 테스트용 맵 데이터
  const testLocations = [
    {
      id: 'pawnshop',
      name: '낡은 전당포',
      description: '오래된 물건들을 사고 파는 전당포입니다. 주인장은 골동품에 대한 해박한 지식을 가지고 있습니다.',
      type: LocationType.SHOP,
      coordinates: { x: 45, y: 35 },
      isDiscovered: true,
      isAccessible: true,
      connections: ['market', 'bookstore'],
      availableActivities: [LocationActivity.BUY, LocationActivity.SELL, LocationActivity.TALK]
    },
    {
      id: 'market',
      name: '아비아리움 시장',
      description: '도시의 중심부에 위치한 번화한 시장입니다. 다양한 상인들이 모여 거래를 합니다.',
      type: LocationType.MARKET,
      coordinates: { x: 60, y: 50 },
      isDiscovered: true,
      isAccessible: true,
      connections: ['pawnshop', 'auction', 'junkyard'],
      availableActivities: [LocationActivity.BUY, LocationActivity.SELL, LocationActivity.TALK]
    },
    {
      id: 'auction',
      name: '경매장',
      description: '고급 물품들이 거래되는 경매장입니다. 정기적으로 경매가 열립니다.',
      type: LocationType.AUCTION_HOUSE,
      coordinates: { x: 75, y: 40 },
      isDiscovered: true,
      isAccessible: true,
      connections: ['market', 'hideout'],
      availableActivities: [LocationActivity.SELL]
    },
    {
      id: 'junkyard',
      name: '고물상',
      description: '고철과 폐품을 수집하는 고물상입니다. 가끔 보물 같은 물건이 숨겨져 있기도 합니다.',
      type: LocationType.WORKSHOP,
      coordinates: { x: 65, y: 65 },
      isDiscovered: true,
      isAccessible: true,
      connections: ['market', 'landfill'],
      availableActivities: [LocationActivity.REPAIR, LocationActivity.BUY]
    },
    {
      id: 'bookstore',
      name: '고서점',
      description: '역사와 골동품에 관한 방대한 자료를 보유한 고서점입니다. 귀한 책들이 많이 있습니다.',
      type: LocationType.LIBRARY,
      coordinates: { x: 30, y: 45 },
      isDiscovered: true,
      isAccessible: true,
      connections: ['pawnshop'],
      availableActivities: [LocationActivity.RESEARCH, LocationActivity.BUY]
    },
    {
      id: 'hideout',
      name: '수집가의 은신처',
      description: '희귀 물품을 수집하는 은둔한 수집가의 비밀 거처입니다. 초대받은 사람만 방문할 수 있습니다.',
      type: LocationType.COLLECTOR,
      coordinates: { x: 85, y: 25 },
      isDiscovered: true,
      isAccessible: false,
      connections: ['auction'],
      availableActivities: [LocationActivity.SELL, LocationActivity.TALK],
      requiredReputation: 30
    },
    {
      id: 'landfill',
      name: '쓰레기 매립지',
      description: '도시 외곽의 쓰레기 매립지입니다. 버려진 물건들 사이에서 가치 있는 것을 찾을 수 있을지도 모릅니다.',
      type: LocationType.SPECIAL,
      coordinates: { x: 75, y: 80 },
      isDiscovered: true,
      isAccessible: true,
      connections: ['junkyard'],
      availableActivities: [LocationActivity.COLLECT]
    }
  ];
  
  // 테스트용 이벤트 데이터
  const testEvents = [
    {
      id: 'market-festival',
      locationId: 'market',
      title: '봄맞이 시장 축제',
      description: '봄을 맞아 시장에서 특별 축제가 열립니다. 다양한 상인들이 모여 평소보다 저렴한 가격에 물건을 판매합니다.',
      type: 'FESTIVAL',
      duration: 5,
      startDay: 10, // 현재 날짜 기준
      isActive: true,
      rewards: {
        reputation: 5
      }
    },
    {
      id: 'auction-special',
      locationId: 'auction',
      title: '특별 경매',
      description: '희귀 유물 컬렉션에 대한 특별 경매가 예정되어 있습니다. 참가하면 평소보다 좋은 물건을 얻을 기회가 있습니다.',
      type: 'SPECIAL_ITEM',
      duration: 1,
      startDay: 13, // 이틀 후 시작
      isActive: false
    },
    {
      id: 'landfill-find',
      locationId: 'landfill',
      title: '특별 발견 기회',
      description: '최근 매립지에 대규모 폐기물이 들어왔습니다. 좋은 물건을 찾을 확률이 평소보다 높아졌습니다.',
      type: 'SPECIAL_ITEM',
      duration: 3,
      startDay: 9,
      isActive: true
    }
  ];
  
  // 현재 위치 ID
  const [currentLocationId, setCurrentLocationId] = useState('pawnshop');
  
  // 현재 위치 정보
  const currentLocation = testLocations.find(loc => loc.id === currentLocationId);
  
  // 선택된 위치 정보
  const selectedLocation = selectedLocationId 
    ? testLocations.find(loc => loc.id === selectedLocationId) 
    : null;
  
  // 이동 처리
  const handleTravel = (locationId: string) => {
    // 이동 가능한지 확인
    const location = testLocations.find(loc => loc.id === locationId);
    if (!location || !location.isAccessible) return;
    
    // 현재 위치에서 직접 연결되어 있는지 확인
    if (!currentLocation?.connections.includes(locationId)) {
      alert('직접 연결된 장소로만 이동할 수 있습니다.');
      return;
    }
    
    // 이동 처리
    setCurrentLocationId(locationId);
    setSelectedLocationId(null);
    setShowTravelModal(false);
  };
  
  // 위치 아이콘 매핑
  const locationTypeImages: Record<string, string> = {
    'pawnshop': pawnshopIcon,
    'market': marketIcon,
    'auction': marketIcon, // 현재 경매장은 별도 이미지가 없어 market 이미지 사용
    'junkyard': junkmanIcon,
    'bookstore': bookstoreIcon,
    'hideout': hideoutIcon,
    'landfill': landfillIcon
  };
  
  // 위치 ID에 맞는 이미지 가져오기
  const getLocationImage = (locationId: string) => {
    return locationTypeImages[locationId] || marketIcon; // 기본값으로 market 이미지 사용
  };
  
  // 활동 라벨 매핑
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
  
  // 선택한 위치에서 발생하는 이벤트
  const locationEvents = testEvents.filter(event => event.locationId === selectedLocationId);
  
  // 동적 연결 계산 - 편집된 위치를 기반으로 가장 가까운 장소들을 찾음
  const calculateConnections = useCallback(() => {
    // 저장된 위치 정보가 있는 경우에만 처리
    if (Object.keys(savedLocations).length === 0) return;
    
    // 각 위치마다 가장 가까운 2-3개의 장소를 찾아 연결
    const newConnections: Record<string, string[]> = {};
    
    // 모든 장소 위치 데이터 준비
    const locationPositions = testLocations.map(loc => {
      const savedPos = savedLocations[loc.id];
      return {
        id: loc.id,
        position: savedPos || loc.coordinates
      };
    });
    
    // 각 장소에 대해
    for (const location of locationPositions) {
      // 다른 모든 장소와의 거리 계산
      const distances = locationPositions
        .filter(other => other.id !== location.id)
        .map(other => {
          // 유클리드 거리 계산
          const dx = other.position.x - location.position.x;
          const dy = other.position.y - location.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          return {
            id: other.id,
            distance
          };
        })
        // 거리순으로 정렬
        .sort((a, b) => a.distance - b.distance);
      
      // 가장 가까운 2-3개 장소 선택
      const numConnections = Math.min(3, distances.length);
      newConnections[location.id] = distances
        .slice(0, numConnections)
        .map(d => d.id);
    }
    
    return newConnections;
  }, [savedLocations, testLocations]);
  
  // 동적 연결 데이터
  const [dynamicConnections, setDynamicConnections] = useState<Record<string, string[]> | null>(null);
  
  // 개발자 모드 종료 시 동적 연결 계산
  useEffect(() => {
    if (!isDevMode && Object.keys(savedLocations).length > 0) {
      const newConnections = calculateConnections();
      if (newConnections) {
        setDynamicConnections(newConnections);
      }
    }
  }, [isDevMode, calculateConnections]);
  
  // 초기화: 저장된 위치 정보가 있으면 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem('mapLocations');
    if (savedData) {
      setSavedLocations(JSON.parse(savedData));
    }
  }, []);
  
  // 맵 마우스 이벤트 핸들러
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 우클릭 (컨텍스트 메뉴)이면 드래깅 시작
    if (e.button === 2) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setMapPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (editingLocationId) {
      // 개발자 모드에서 위치 편집 중일 때
      const mapRect = cityMapRef.current?.getBoundingClientRect();
      if (mapRect) {
        const x = ((e.clientX - mapRect.left) / mapRect.width) * 100;
        const y = ((e.clientY - mapRect.top) / mapRect.height) * 100;
        
        setSavedLocations(prev => ({
          ...prev,
          [editingLocationId]: { x, y }
        }));
      }
    }
  }, [isDragging, dragStart, editingLocationId]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (editingLocationId) {
      // 위치 편집이 완료되면 로컬 스토리지에 저장
      localStorage.setItem('mapLocations', JSON.stringify(savedLocations));
      setEditingLocationId(null);
    }
  }, [editingLocationId, savedLocations]);
  
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // 브라우저 컨텍스트 메뉴 방지
  }, []);
  
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setMapScale(prev => {
      const newScale = Math.max(1.0, Math.min(3, prev + delta)); // 최소값을 1.0(100%)으로 변경
      return newScale;
    });
  }, []);
  
  // 개발자 모드 토글
  const toggleDevMode = useCallback(() => {
    setIsDevMode(prev => !prev);
  }, []);
  
  // 위치 편집 시작
  const startEditing = useCallback((locationId: string) => {
    setEditingLocationId(locationId);
  }, []);
  
  // 위치 편집 모드 저장된 위치 초기화
  const resetPositions = useCallback(() => {
    setSavedLocations({});
    localStorage.removeItem('mapLocations');
  }, []);
  
  // 마우스 이벤트 리스너 등록/해제
  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    const cityMap = cityMapRef.current;
    
    if (mapContainer && cityMap) {
      mapContainer.addEventListener('wheel', handleWheel as unknown as EventListener, { passive: false });
      mapContainer.addEventListener('contextmenu', handleContextMenu as unknown as EventListener);
    }
    
    return () => {
      if (mapContainer && cityMap) {
        mapContainer.removeEventListener('wheel', handleWheel as unknown as EventListener);
        mapContainer.removeEventListener('contextmenu', handleContextMenu as unknown as EventListener);
      }
    };
  }, [handleWheel, handleContextMenu]);
  
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/dev" className="back-button">← 테스트 메뉴로</Link>
        <h1>맵/이동 시스템 테스트</h1>
      </header>
      
      <main className="app-content">
        <div className="map-controls">
          <button className="btn" onClick={toggleDevMode}>
            {isDevMode ? '개발자 모드 끄기' : '개발자 모드 켜기'}
          </button>
          
          {isDevMode && (
            <>
              <button className="btn" onClick={resetPositions}>
                위치 초기화
              </button>
              <div className="dev-info">
                {editingLocationId ? 
                  <span>편집 중: {editingLocationId}</span> : 
                  <span>장소를 클릭하여 위치 편집</span>
                }
              </div>
            </>
          )}
          
          <div className="zoom-controls">
            <button className="btn" onClick={() => setMapScale(prev => Math.min(prev + 0.1, 3))}>+</button>
            <span>{Math.round(mapScale * 100)}%</span>
            <button className="btn" onClick={() => setMapScale(prev => Math.max(prev - 0.1, 1.0))}>-</button>
            <button className="btn" onClick={() => {
              setMapScale(1);
              setMapPosition({ x: 0, y: 0 });
            }}>초기화</button>
          </div>
        </div>
        
        <div 
          className="map-container" 
          ref={mapContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            className="city-map"
            ref={cityMapRef}
            style={{
              transform: `scale(${mapScale}) translate(${mapPosition.x}px, ${mapPosition.y}px)`,
              transformOrigin: 'center',
              transition: isDragging ? 'none' : 'transform 0.1s ease'
            }}
          >
            {/* 맵 위 위치 마커 */}
            {testLocations.map(location => {
              // 저장된 위치 정보가 있으면 사용, 없으면 기존 위치 사용
              const savedPosition = savedLocations[location.id];
              const position = savedPosition || location.coordinates;
              
              return (
                <div
                  key={location.id}
                  className={`location-marker 
                    ${location.id === currentLocationId ? 'current' : ''} 
                    ${!location.isAccessible ? 'inaccessible' : ''}
                    ${testEvents.some(e => e.locationId === location.id && e.isActive) ? 'has-event' : ''}
                    ${isDevMode ? 'dev-mode' : ''}
                    ${editingLocationId === location.id ? 'editing' : ''}
                  `}
                  style={{ 
                    left: `${position.x}%`, 
                    top: `${position.y}%`,
                    cursor: isDevMode ? 'move' : 'pointer'
                  }}
                  onClick={(e) => {
                    if (isDevMode) {
                      e.stopPropagation();
                      startEditing(location.id);
                    } else if (location.isAccessible) {
                      setSelectedLocationId(location.id);
                      setShowTravelModal(false);
                    }
                  }}
                >
                  <div className="marker-icon">
                    <img src={getLocationImage(location.id)} alt={location.name} width="32" height="32" />
                  </div>
                  <div className="marker-name">{location.name}</div>
                  
                  {testEvents.some(e => e.locationId === location.id && e.isActive) && (
                    <div className="event-indicator">!</div>
                  )}
                  
                  {isDevMode && (
                    <div className="edit-coordinates">
                      {Math.round(position.x)}%, {Math.round(position.y)}%
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* 위치 간 연결선 */}
            <svg className="connections-layer">
              {!isDevMode && testLocations.map(location => {
                // 동적 연결 정보가 있으면 그것을 사용, 없으면 원래 연결 정보 사용
                const connections = 
                  (dynamicConnections && Object.keys(savedLocations).length > 0) 
                    ? dynamicConnections[location.id] 
                    : location.connections;
                
                return connections && connections.map(connId => {
                  const connectedLoc = testLocations.find(l => l.id === connId);
                  if (!connectedLoc) return null;
                  
                  // 저장된 위치 정보가 있으면 사용, 없으면 기존 위치 사용
                  const savedPosition1 = savedLocations[location.id];
                  const savedPosition2 = savedLocations[connId];
                  
                  const position1 = savedPosition1 || location.coordinates;
                  const position2 = savedPosition2 || connectedLoc.coordinates;
                  
                  return (
                    <line
                      key={`${location.id}-${connId}`}
                      x1={`${position1.x}%`}
                      y1={`${position1.y}%`}
                      x2={`${position2.x}%`}
                      y2={`${position2.y}%`}
                      className={`connection-line ${location.id === currentLocationId || connectedLoc.id === currentLocationId ? 'active' : ''}`}
                    />
                  );
                });
              })}
            </svg>
          </div>
        </div>
        
        {/* 현재 위치 정보 */}
        <div className="current-location-info">
          <div className="card">
            <div className="card-header">
              <h2>현재 위치: {currentLocation?.name}</h2>
              <div className="location-icon-container">
                <img 
                  src={currentLocation ? getLocationImage(currentLocation.id) : ''} 
                  alt={currentLocation?.name} 
                  width="32" 
                  height="32" 
                />
              </div>
            </div>
            <div className="card-body">
              <p>{currentLocation?.description}</p>
              
              <h3>가능한 활동</h3>
              <div className="activities-list">
                {currentLocation?.availableActivities.map(activity => (
                  <button key={activity} className="btn">
                    {activityLabels[activity]}
                  </button>
                ))}
              </div>
              
              {testEvents.filter(e => e.locationId === currentLocationId && e.isActive).map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <h3>{event.title}</h3>
                    <div className="event-badge">진행 중</div>
                  </div>
                  <p>{event.description}</p>
                  <button className="btn btn-primary">이벤트 참여</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 선택된 위치 정보 */}
        {selectedLocation && (
          <div className="location-details">
            <div className="card">
              <div className="card-header">
                <h2>{selectedLocation.name}</h2>
                <div className="location-icon-container">
                  <img 
                    src={getLocationImage(selectedLocation.id)} 
                    alt={selectedLocation.name} 
                    width="32" 
                    height="32" 
                  />
                </div>
              </div>
              <div className="card-body">
                <p>{selectedLocation.description}</p>
                
                {selectedLocation.isAccessible ? (
                  <div className="travel-option">
                    <p>이 장소로 이동하시겠습니까?</p>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleTravel(selectedLocation.id)}
                      >
                        이동
                      </button>
                      <button 
                        className="btn"
                        onClick={() => setSelectedLocationId(null)}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="locked-message">
                    <p>
                      이 장소는 아직 접근할 수 없습니다.
                      {selectedLocation.requiredReputation && (
                        <span> 필요 평판: {selectedLocation.requiredReputation}</span>
                      )}
                    </p>
                  </div>
                )}
                
                {locationEvents.length > 0 && (
                  <div className="location-events">
                    <h3>이벤트</h3>
                    {locationEvents.map(event => (
                      <div key={event.id} className="event-summary">
                        <h4>{event.title}</h4>
                        <p>{event.description}</p>
                        <div className="event-timing">
                          {event.isActive ? (
                            <span className="active-event">진행 중 (남은 기간: {event.duration}일)</span>
                          ) : (
                            <span className="upcoming-event">예정됨 (D-{event.startDay - 10})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MapTest;