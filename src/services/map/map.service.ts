/**
 * 지도(Map) 관련 서비스
 * 위치 이동, 이벤트 관리 등 지도 관련 기능을 제공합니다.
 */
import { 
  Location, 
  MapEvent, 
  MapEventType, 
  LocationActivity, 
  TravelCost,
  TravelResult 
} from '@features/map/types/map_types';
import { Traveler, TravelerUpdate } from '@features/map/types/map_service_types';
import { 
  gameLocations, 
  mapEvents, 
  calculateTravelCost 
} from '@data/constants/map-constants';

/**
 * 지도 서비스 클래스
 */
export class MapService {
  /**
   * 사용 가능한 모든 위치 정보를 가져옵니다.
   */
  getAllLocations(): Location[] {
    return gameLocations;
  }
  
  /**
   * 발견된 위치만 가져옵니다.
   */
  getDiscoveredLocations(): Location[] {
    return gameLocations.filter(location => location.isDiscovered);
  }
  
  /**
   * 접근 가능한 위치만 가져옵니다.
   */
  getAccessibleLocations(): Location[] {
    return gameLocations.filter(location => location.isAccessible);
  }
  
  /**
   * ID로 위치 정보를 가져옵니다.
   */
  getLocationById(locationId: string): Location | undefined {
    return gameLocations.find(location => location.id === locationId);
  }
  
  /**
   * 특정 활동이 가능한 장소를 가져옵니다.
   */
  getLocationsByActivity(activity: LocationActivity): Location[] {
    return gameLocations.filter(
      location => location.isDiscovered && 
                  location.isAccessible && 
                  location.availableActivities.includes(activity)
    );
  }
  
  /**
   * 현재 위치에서 이동 가능한 위치를 가져옵니다.
   */
  getConnectedLocations(currentLocationId: string): Location[] {
    const currentLocation = this.getLocationById(currentLocationId);
    if (!currentLocation) return [];
    
    return gameLocations.filter(
      location => location.isDiscovered && 
                  location.isAccessible && 
                  currentLocation.connections.includes(location.id)
    );
  }
  
  /**
   * 새로운 위치를 발견 처리합니다.
   */
  discoverLocation(locationId: string): Location | undefined {
    const location = this.getLocationById(locationId);
    if (!location) return undefined;
    
    // 위치를 발견 상태로 변경
    location.isDiscovered = true;
    
    return location;
  }
  
  /**
   * 위치의 접근 가능 상태를 변경합니다.
   */
  setLocationAccessibility(locationId: string, isAccessible: boolean): Location | undefined {
    const location = this.getLocationById(locationId);
    if (!location) return undefined;
    
    location.isAccessible = isAccessible;
    
    return location;
  }
  
  /**
   * 장소 간 이동 비용을 계산합니다.
   */
  calculateTravelCost(fromId: string, toId: string): TravelCost {
    // 중앙화된 함수 사용
    const { time, money } = calculateTravelCost(fromId, toId);
    
    return {
      time,
      money,
      energy: Math.round(time * 10) // 시간당 10 에너지 소모
    };
  }
  
  /**
   * 이동 가능 여부를 확인합니다.
   */
  canTravelTo(fromId: string, toId: string, player: Traveler): { 
    canTravel: boolean; 
    reason?: string;
  } {
    // 위치 존재 여부 확인
    const fromLocation = this.getLocationById(fromId);
    const toLocation = this.getLocationById(toId);
    
    if (!fromLocation || !toLocation) {
      return { canTravel: false, reason: '존재하지 않는 장소입니다.' };
    }
    
    // 같은 위치인지 확인
    if (fromId === toId) {
      return { canTravel: false, reason: '이미 해당 장소에 있습니다.' };
    }
    
    // 목적지가 발견되었는지 확인
    if (!toLocation.isDiscovered) {
      return { canTravel: false, reason: '아직 발견하지 못한 장소입니다.' };
    }
    
    // 목적지에 접근 가능한지 확인
    if (!toLocation.isAccessible) {
      return { canTravel: false, reason: '아직 접근할 수 없는 장소입니다.' };
    }
    
    // 직접 연결되어 있는지 확인
    if (!fromLocation.connections.includes(toId)) {
      return { canTravel: false, reason: '직접 이동할 수 없는 장소입니다.' };
    }
    
    // 비용 계산
    const cost = this.calculateTravelCost(fromId, toId);
    
    // 충분한 에너지가 있는지 확인
    if (player.energy < cost.energy) {
      return { canTravel: false, reason: '에너지가 부족합니다.' };
    }
    
    // 충분한 돈이 있는지 확인
    if (player.money < cost.money) {
      return { canTravel: false, reason: '돈이 부족합니다.' };
    }
    
    return { canTravel: true };
  }
  
  /**
   * 실제 이동을 수행합니다.
   */
  travelTo(
    fromId: string, 
    toId: string, 
    player: Traveler,
    updatePlayerCallback: (updates: TravelerUpdate) => void
  ): TravelResult {
    // 이동 가능 여부 확인
    const canTravel = this.canTravelTo(fromId, toId, player);
    if (!canTravel.canTravel) {
      return { 
        success: false, 
        message: canTravel.reason || '이동할 수 없습니다.',
        cost: null
      };
    }
    
    // 비용 계산
    const cost = this.calculateTravelCost(fromId, toId);
    
    // 플레이어 상태 업데이트
    updatePlayerCallback({
      currentLocationId: toId,
      energy: player.energy - cost.energy,
      money: player.money - cost.money
    });
    
    // 목적지 정보
    const destination = this.getLocationById(toId);
    
    return {
      success: true,
      message: `${destination?.name || toId}(으)로 이동했습니다.`,
      cost
    };
  }
  
  /**
   * 모든 이벤트를 가져옵니다.
   */
  getAllEvents(): MapEvent[] {
    return mapEvents;
  }
  
  /**
   * 현재 활성화된 이벤트만 가져옵니다.
   */
  getActiveEvents(currentDay: number): MapEvent[] {
    return mapEvents.filter(
      event => event.startDay <= currentDay && event.endDay >= currentDay
    );
  }
  
  /**
   * 특정 위치의 활성화된 이벤트를 가져옵니다.
   */
  getEventsByLocation(locationId: string, currentDay: number): MapEvent[] {
    return this.getActiveEvents(currentDay).filter(
      event => event.locationId === locationId
    );
  }
  
  /**
   * 이벤트 활성화 상태를 업데이트합니다.
   */
  updateEventsActiveStatus(currentDay: number): MapEvent[] {
    mapEvents.forEach(event => {
      event.isActive = (event.startDay <= currentDay && event.endDay >= currentDay);
    });
    
    return this.getActiveEvents(currentDay);
  }
  
  /**
   * 특정 유형의 이벤트가 현재 활성화되어 있는지 확인합니다.
   */
  isEventTypeActive(locationId: string, eventType: MapEventType, currentDay: number): boolean {
    return this.getEventsByLocation(locationId, currentDay)
      .some(event => event.type === eventType);
  }
}

// 싱글톤 인스턴스 생성
export const mapService = new MapService();