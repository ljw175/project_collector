/**
 * 맵(Map) 기능 관련 훅
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useGameState } from '@store/gameContext';
import { 
  TravelCost, 
  MapState, 
  LocationActivity,
  TravelResult,
  MapEventType
} from '../types/map_types';
import { Traveler, TravelerUpdate } from '../types/map_service_types';
import { mapService } from '@services/map';

export function useMap() {
  const { state, dispatch } = useGameState();
  
  // 맵 데이터 상태
  const [mapState, setMapState] = useState<MapState>({
    locations: [],
    discoveredLocationIds: [],
    currentLocationId: state.currentLocationId,
    activeEvents: [],
    markedLocationId: null,
    travelTime: 0
  });
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  
  // 선택된 위치 ID
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  
  // 이동 모달 표시 여부
  const [showTravelModal, setShowTravelModal] = useState(false);
  
  // 이동 비용
  const [travelCost, setTravelCost] = useState<TravelCost | null>(null);

  // 현재 날짜 상태 (게임 컨텍스트에서 가져오거나 기본값 사용)
  const [currentDay, setCurrentDay] = useState<number>(state.currentDay || 1);
  
  // 현재 위치 및 선택된 위치 데이터
  const currentLocation = useMemo(() => 
    mapState.locations.find(loc => loc.id === mapState.currentLocationId)
  , [mapState.locations, mapState.currentLocationId]);
  
  const selectedLocation = useMemo(() => 
    selectedLocationId ? mapState.locations.find(loc => loc.id === selectedLocationId) : null
  , [mapState.locations, selectedLocationId]);
  
  // 데이터 로드 - 중앙화된 서비스 사용
  const loadMapData = useCallback(() => {
    setIsLoading(true);
    
    // 중앙화된 서비스에서 데이터 가져오기
    const allLocations = mapService.getAllLocations();
    const discoveredLocations = mapService.getDiscoveredLocations();
    const activeEvents = mapService.getActiveEvents(state.currentDay || 1);
    
    // 시작 위치 설정 (저장된 위치 또는 기본 위치)
    const defaultLocationId = 'market'; // 기본 시작 위치
    const currentLocationId = state.currentLocationId || defaultLocationId;
    
    // 상태 업데이트
    setMapState({
      locations: allLocations,
      discoveredLocationIds: discoveredLocations.map(loc => loc.id),
      currentLocationId: currentLocationId,
      activeEvents: activeEvents,
      markedLocationId: null,
      travelTime: 0
    });

    setIsLoading(false);
  }, [state.currentLocationId, state.currentDay]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

  // 장소로 이동하는 함수
  const travelTo = useCallback((locationId: string): TravelResult => {
    // 플레이어 상태 가져오기 - Traveler 인터페이스 사용
    const traveler: Traveler = {
      money: state.player.money || 1000,
      energy: state.player.status.maxFatigue - (state.player.status.fatigue || 0), // 피로도의 반대값을 에너지로 사용
      locationId: mapState.currentLocationId
    };
    
    // 중앙화된 서비스의 이동 함수 사용
    const result = mapService.travelTo(
      mapState.currentLocationId,
      locationId,
      traveler,
      (updates: TravelerUpdate) => {
        // 플레이어 상태 업데이트
        if (updates.locationId) {
          dispatch({ type: 'SET_CURRENT_LOCATION', payload: updates.locationId });
          setMapState(prev => ({ ...prev, currentLocationId: updates.locationId || prev.currentLocationId }));
        }
        
        if (updates.health !== undefined) {
          dispatch({ type: 'SET_HEALTH', payload: updates.health });
        }
        
        if (updates.mental !== undefined) {
          dispatch({ type: 'SET_MENTAL', payload: updates.mental });
        }

        if (updates.energy !== undefined) {
          // 에너지 값을 피로도로 변환하여 저장
          const newFatigue = state.player.status.maxFatigue - updates.energy;
          dispatch({ type: 'SET_FATIGUE', payload: newFatigue });
        }
        
        if (updates.money !== undefined) {
          dispatch({ type: 'SET_MONEY', payload: updates.money });
        }
      }
    );
    
    return result;
  }, [mapState.currentLocationId, state.player.money, state.player.status.fatigue, state.player.status.maxFatigue, dispatch]);

  // 새 장소 발견 함수
  const discoverLocation = useCallback((locationId: string) => {
    // 중앙화된 서비스 사용
    const location = mapService.discoverLocation(locationId);
    
    if (location) {
      // 상태 업데이트
      setMapState(prev => ({
        ...prev,
        locations: mapService.getAllLocations(),
        discoveredLocationIds: [...prev.discoveredLocationIds, locationId]
      }));
      
      return location;
    }
    
    return null;
  }, []);

  // 장소 접근 가능 설정 함수
  const setLocationAccessible = useCallback((locationId: string, isAccessible: boolean) => {
    // 중앙화된 서비스 사용
    const location = mapService.setLocationAccessibility(locationId, isAccessible);
    
    if (location) {
      // 상태 업데이트
      setMapState(prev => ({
        ...prev,
        locations: mapService.getAllLocations()
      }));
      
      return location;
    }
    
    return null;
  }, []);

  // 특정 활동이 가능한 장소 가져오기
  const getLocationsByActivity = useCallback((activity: LocationActivity) => {
    // 중앙화된 서비스 사용
    return mapService.getLocationsByActivity(activity);
  }, []);

  // 특정 장소의 이벤트 가져오기
  const getEventsByLocation = useCallback((locationId: string) => {
    // 중앙화된 서비스 사용
    return mapService.getEventsByLocation(locationId, currentDay);
  }, [currentDay]);

  // 날짜 진행 함수
  const advanceDay = useCallback((days: number = 1) => {
    const newDay = currentDay + days;
    setCurrentDay(newDay);
    
    // 이벤트 활성화 상태 업데이트
    const activeEvents = mapService.updateEventsActiveStatus(newDay);
    
    // 상태 업데이트
    setMapState(prev => ({
      ...prev,
      activeEvents
    }));
    
    // 게임 상태에도 반영
    dispatch({ type: 'SET_CURRENT_DAY', payload: newDay });
    
    return newDay;
  }, [currentDay, dispatch]);

  // 이동 비용 계산 함수
  const calculateTravelCost = useCallback((toLocationId: string) => {
    const cost = mapService.calculateTravelCost(mapState.currentLocationId, toLocationId);
    setTravelCost(cost);
    return cost;
  }, [mapState.currentLocationId]);

  // 연결된 위치 가져오기
  const getConnectedLocations = useCallback(() => {
    return mapService.getConnectedLocations(mapState.currentLocationId);
  }, [mapState.currentLocationId]);

  // 특정 유형의 이벤트가 활성화되어 있는지 확인
  const isEventTypeActive = useCallback((locationId: string, eventType: MapEventType) => {
    return mapService.isEventTypeActive(locationId, eventType, currentDay);
  }, [currentDay]);

  return {
    // 상태값
    locations: mapState.locations,
    currentLocation,
    selectedLocation,
    activeEvents: mapState.activeEvents,
    currentDay,
    isLoading,
    
    // 액션
    travelTo,
    discoverLocation,
    setLocationAccessible,
    getLocationsByActivity,
    getEventsByLocation,
    advanceDay,
    setSelectedLocationId,
    setShowTravelModal,
    
    // 추가된 기능
    calculateTravelCost,
    getConnectedLocations,
    isEventTypeActive
  };
}