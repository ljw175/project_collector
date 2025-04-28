/**
 * 맵(Map) 기능 관련 훅
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useGameState } from '@store/gameContext';
import { Location, MapEvent, MapEventType, TravelCost, MapState, LocationType, LocationActivity } from '../types/map_types';

export function useMap() {
  const { state, dispatch } = useGameState();
  
  // 맵 데이터 상태
  const [mapState, setMapState] = useState<MapState>({
    locations: [],
    discoveredLocationIds: [],
    currentLocationId: state.currentLocationId,
    activeEvents: [],
    markedLocationId: null
  });
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  
  // 선택된 위치 ID
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  
  // 이동 모달 표시 여부
  const [showTravelModal, setShowTravelModal] = useState(false);
  
  // 이동 비용
  const [travelCost, setTravelCost] = useState<TravelCost | null>(null);
  
  // 현재 위치 및 선택된 위치 데이터
  const currentLocation = useMemo(() => 
    mapState.locations.find(loc => loc.id === mapState.currentLocationId)
  , [mapState.locations, mapState.currentLocationId]);
  
  const selectedLocation = useMemo(() => 
    selectedLocationId ? mapState.locations.find(loc => loc.id === selectedLocationId) : null
  , [mapState.locations, selectedLocationId]);
  
  // 데이터 로드 - 실제 게임에서는 저장소나 API에서 데이터를 가져옴
  const loadMapData = useCallback(() => {
    setIsLoading(true);
    
    // 여기에서는 예시 데이터를 사용
    // 실제 구현에서는 다음과 같은 소스에서 데이터를 가져올 수 있음:
    //  1. 로컬 스토리지 또는 게임 저장 파일
    //  2. 게임 스토어의 데이터
    //  3. 서버 API (온라인 게임인 경우)
    
    // 예시 위치 데이터
    const exampleLocations: Location[] = [
      {
        id: 'shop',
        name: '골동품 상점',
        description: '오래된 물건들을 파는 상점입니다. 은퇴한 수집가가 운영하며, 종종 희귀한 물건들이 등장합니다.',
        type: LocationType.SHOP,
        coordinates: { x: 45, y: 35 },
        isDiscovered: true,
        isAccessible: true,
        connections: ['market', 'library'],
        availableActivities: [LocationActivity.BUY, LocationActivity.SELL, LocationActivity.TALK],
      },
      {
        id: 'market',
        name: '중앙 시장',
        description: '도시의 중심부에 위치한 번화한 시장입니다. 다양한 상인들이 모여 거래를 합니다.',
        type: LocationType.MARKET,
        coordinates: { x: 60, y: 50 },
        isDiscovered: true,
        isAccessible: true,
        connections: ['shop', 'auction', 'workshop'],
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
        connections: ['market', 'collector'],
        availableActivities: [LocationActivity.SELL]
      },
      {
        id: 'workshop',
        name: '장인의 공방',
        description: '노련한 장인이 운영하는 공방입니다. 물건을 수리하거나 개조할 수 있습니다.',
        type: LocationType.WORKSHOP,
        coordinates: { x: 65, y: 65 },
        isDiscovered: true,
        isAccessible: true,
        connections: ['market'],
        availableActivities: [LocationActivity.REPAIR]  
      },
      {
        id: 'library',
        name: '고문서 도서관',
        description: '역사와 골동품에 관한 방대한 자료를 보유한 도서관입니다.',
        type: LocationType.LIBRARY,
        coordinates: { x: 30, y: 45 },
        isDiscovered: true,
        isAccessible: true,
        connections: ['shop'],
        availableActivities: [LocationActivity.RESEARCH]  
      },
      {
        id: 'collector',
        name: '부유한 수집가의 저택',
        description: '희귀 물품을 수집하는 부유한 귀족의 저택입니다. 방문하려면 초대장이 필요합니다.',
        type: LocationType.COLLECTOR,
        coordinates: { x: 85, y: 25 },
        isDiscovered: true,
        isAccessible: false,
        connections: ['auction'],
        availableActivities: [LocationActivity.SELL, LocationActivity.TALK],
        requiredReputation: 30
      }
    ];
    
    // 예시 이벤트 데이터
    const exampleEvents: MapEvent[] = [
      {
        id: 'market-festival',
        locationId: 'market',
        title: '봄맞이 시장 축제',
        description: '봄을 맞아 시장에서 특별 축제가 열립니다. 다양한 상인들이 모여 평소보다 저렴한 가격에 물건을 판매합니다.',
        type: MapEventType.FESTIVAL,
        duration: 5,
        startDay: state.currentDay - 1, // 어제 시작
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
        type: MapEventType.SPECIAL_ITEM,
        duration: 1,
        startDay: state.currentDay + 2, // 이틀 후 시작
        isActive: false
      }
    ];
    
    // 활성 이벤트만 필터링
    const activeEvents = exampleEvents.filter(event => 
      event.isActive && 
      event.startDay + event.duration >= state.currentDay
    );
    
    // 상태 업데이트
    setMapState({
      locations: exampleLocations,
      discoveredLocationIds: exampleLocations
        .filter(loc => loc.isDiscovered)
        .map(loc => loc.id),
      currentLocationId: state.currentLocationId,
      activeEvents,
      markedLocationId: null
    });
    
    setIsLoading(false);
  }, [state.currentDay, state.currentLocationId]);
  
  // 위치 선택
  const selectLocation = useCallback((locationId: string) => {
    setSelectedLocationId(locationId);
    
    // 이미 현재 위치라면 이동 모달을 표시하지 않음
    if (locationId === mapState.currentLocationId) {
      setShowTravelModal(false);
      return;
    }
    
    // 이동 비용 계산
    const targetLocation = mapState.locations.find(loc => loc.id === locationId);
    const currentLoc = mapState.locations.find(loc => loc.id === mapState.currentLocationId);
    
    if (targetLocation && currentLoc) {
      // 직접 연결되어 있는지 확인
      const isDirectlyConnected = currentLoc.connections.includes(locationId);
      
      // 기본 비용 설정
      const cost: TravelCost = {
        money: targetLocation.visitCost || (isDirectlyConnected ? 10 : 25),
        timeDays: isDirectlyConnected ? 1 : 2,
        fatigue: isDirectlyConnected ? 5 : 15
      };
      
      setTravelCost(cost);
      setShowTravelModal(true);
    }
  }, [mapState.currentLocationId, mapState.locations]);
  
  // 위치 마킹 토글
  const toggleMarkLocation = useCallback((locationId: string) => {
    setMapState(prev => ({
      ...prev,
      markedLocationId: prev.markedLocationId === locationId ? null : locationId
    }));
  }, []);
  
  // 위치로 이동
  const travelToLocation = useCallback((locationId: string) => {
    // 이동 가능한지 확인
    const targetLocation = mapState.locations.find(loc => loc.id === locationId);
    
    if (!targetLocation || !targetLocation.isAccessible) {
      return;
    }
    
    // 비용 확인
    if (travelCost) {
      if (travelCost.money > state.player.money) {
        // 돈이 부족함
        return;
      }
      
      // 비용 지불
      dispatch({ type: 'UPDATE_MONEY', payload: -travelCost.money });
      
      // 피로도 증가 (실제 구현에서 추가)
      // 예: dispatch({ type: 'UPDATE_FATIGUE', payload: travelCost.fatigue });
      
      // 날짜 진행
      dispatch({ type: 'ADVANCE_DAY', payload: travelCost.timeDays });
    }
    
    // 위치 변경
    dispatch({ type: 'CHANGE_LOCATION', payload: locationId });
    
    // 상태 업데이트
    setMapState(prev => ({
      ...prev,
      currentLocationId: locationId
    }));
    
    // 모달 닫기
    setShowTravelModal(false);
  }, [travelCost, mapState.locations, state.player.money, dispatch]);
  
  // 맵 데이터 초기 로드
  useEffect(() => {
    loadMapData();
  }, [loadMapData]);
  
  // 위치 접근성 업데이트 (예: 평판 요구사항)
  useEffect(() => {
    if (mapState.locations.length === 0) return;
    
    setMapState(prev => {
      const updatedLocations = prev.locations.map(location => {
        // 평판 요구사항 확인
        if (location.requiredReputation !== undefined && 
            state.player.reputation >= location.requiredReputation &&
            !location.isAccessible) {
          return { ...location, isAccessible: true };
        }
        
        // 필요 아이템 확인
        if (location.requiredItemIds && !location.isAccessible) {
          const hasAllRequiredItems = location.requiredItemIds.every(itemId => 
            state.inventory.some(item => item.id === itemId)
          );
          
          if (hasAllRequiredItems) {
            return { ...location, isAccessible: true };
          }
        }
        
        return location;
      });
      
      return {
        ...prev,
        locations: updatedLocations
      };
    });
  }, [state.player.reputation, state.inventory]);
  
  return {
    mapState,
    currentLocation,
    selectedLocation,
    activeEvents: mapState.activeEvents,
    isLoading,
    showTravelModal,
    travelCost,
    
    loadMapData,
    selectLocation,
    toggleMarkLocation,
    travelToLocation,
    setShowTravelModal
  };
}