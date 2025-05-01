/**
 * 맵(Map) 관련 타입 정의
 */


// 위치 유형 열거형
export enum LocationType {
  SHOP = 'shop',               // 상점
  MARKET = 'market',           // 시장
  AUCTION_HOUSE = 'auction',   // 경매장
  WORKSHOP = 'workshop',       // 공방
  LIBRARY = 'library',         // 도서관
  COLLECTOR = 'collector',     // 수집가
  SPECIAL = 'special',         // 특별 장소
  COLLECTION_SITE = 'collection_site' // 수집 장소
}

// 위치에서 가능한 활동 열거형
export enum LocationActivity {
  BUY = 'buy',                 // 구매
  SELL = 'sell',               // 판매
  APPRAISE = 'appraise',       // 감정
  REPAIR = 'repair',           // 수리
  COLLECT = 'collect',         // 수집
  RESEARCH = 'research',       // 연구
  TALK = 'talk',               // 대화
  REST = 'rest'                // 휴식
}

// 맵 이벤트 유형 열거형
export enum MapEventType {
  AUCTION = 'auction',         // 경매
  MARKET = 'market',           // 시장
  FESTIVAL = 'festival',       // 축제
  SPECIAL_SALE = 'sale',       // 특별 할인
  SPECIAL_ITEM = 'special_item', // 특별 아이템
  COMPETITION = 'competition', // 경쟁/대회
  DISASTER = 'disaster',       // 재해/사건
  RESEARCH_EVENT = 'research_event' // 연구 이벤트 추가
}

// 위치 인터페이스
export interface Location {
  id: string;
  name: string;
  description: string;
  type: LocationType;
  coordinates: {
    x: number;  // 맵에서의 X 좌표 (백분율 0-100)
    y: number;  // 맵에서의 Y 좌표 (백분율 0-100)
  };
  isDiscovered: boolean;       // 발견 여부
  isAccessible: boolean;       // 접근 가능 여부
  connections: string[];       // 연결된 위치 ID 목록
  availableActivities: LocationActivity[]; // 가능한 활동 목록
  visitCost?: number;          // 방문 비용 (옵션)
  requiredReputation?: number; // 필요 평판 (옵션)
  requiredItemIds?: string[];  // 필요 아이템 (옵션)
  currentVisitors?: string[];   // 현재 방문자 목록 (플레이어 ID 등) 추가
}

// 맵 이벤트 인터페이스
export interface MapEvent {
  id: string;
  locationId: string;          // 관련 위치 ID
  title: string;
  description: string;
  type: MapEventType;
  duration: number;            // 지속 일수
  startDay: number;            // 시작일
  isActive: boolean;           // 현재 활성화 여부
  rewards: {                  // 이벤트 보상 (옵션)
    money?: number;
    reputation?: number;
    items?: string[];          // 아이템 ID 목록
  };
  requirements: {             // 이벤트 참가 요구사항 (옵션)
    money?: number;
    reputation?: number;
    itemIds?: string[];
    itemTags?: string[]; // 아이템 태그 목록
  };
}

// 이동 비용 인터페이스
export interface TravelCost {
  money: number;               // 이동 비용 (골드)
  time: number;            // 소요 시간 (초)
  fatigue: number;             // 피로도 증가
}

// 맵 상태 인터페이스
export interface MapState {
  locations: Location[];
  discoveredLocationIds: string[];
  currentLocationId: string; // 현재 위치 ID
  activeEvents: MapEvent[];
  markedLocationId: string | null;  // 플레이어가 표시한 위치
  travelTime: number;                // 이동 소요 시간
}

export interface TravelResult {
  success: boolean;            // 이동 성공 여부
  cost: TravelCost;            // 이동 비용
  message: string;            // 결과 메시지
  currentLocationId: string; // 현재 위치 ID (이동 후)
  travelTime: number;        // 이동 소요 시간
}