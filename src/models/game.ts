/**
 * 게임 상태 관련 타입 정의
 */
import { Item } from './item';
import { Player } from './character';

// 게임 위치 정보
export interface Location {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isUnlocked: boolean;
  travelTime: number; // 이동에 소요되는 시간
  availableActions: LocationAction[];
}

// 위치에서 가능한 행동
export type LocationAction = 
  | 'shop'         // 상점 거래
  | 'collect'      // 아이템 수집
  | 'appraise'     // 아이템 감정
  | 'sell'         // 판매
  | 'repair'       // 수리/복원
  | 'network'      // 인맥 관리
  | 'rest';        // 휴식

// 달력 이벤트
export interface CalendarEvent {
  id: string;
  title: string;
  type: 'auction' | 'festival' | 'market' | 'deadline';
  day: number;
  month: number;
  year: number;
  description: string;
  isClosed?: boolean;
  locationId?: string;
}

// 경매 정보
export interface Auction {
  id: string;
  title: string;
  description: string;
  items: Item[];
  startingBids: Record<string, number>; // 아이템별 시작 입찰가
  currentBids: Record<string, number>;  // 아이템별 현재 입찰가
  highestBidders: Record<string, string>; // 아이템별 최고 입찰자
  startTime: number;
  endTime: number;
  status: 'upcoming' | 'active' | 'ended';
  minBidIncrement: number;
  timePerRound: number; // 라운드당 시간
}

export interface DifficultySettings {
  difficult:{
    id: string;
    startingMoney: number;
    reputationGain: number;
    prices: number;
    rareItemChance: number;
    adaptiveTextSpeed: boolean;
    adaptiveTimer: boolean;
  };
}

// 게임 설정
export interface GameSettings {
  difficulty: DifficultySettings[keyof DifficultySettings];
  enableTutorial: boolean;
  soundVolume: number;
  musicVolume: number;
  textSpeed?: number; // 난이도가 쉬움일때만 텍스트 속도 설정 가능
}

// 게임 진행 상태
export interface GameState {
  player: Player;
  inventory: Item[];
  locations: Location[];
  currentLocationId: string;
  calendar: CalendarEvent[];
  currentDay: number;
  currentMonth: number;
  currentYear: number;
  upcomingAuctions: Auction[];
  activeAuction: Auction | null;
  gameSettings: GameSettings;
  isGamePaused: boolean;
}

// 게임 세이브 정보
export interface GameSave {
  id: string;
  saveName: string;
  saveDate: string; // ISO 날짜 문자열
  gameState: GameState;
  screenshotUrl?: string;
}