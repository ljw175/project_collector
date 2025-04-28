/**
 * 달력(Calendar) 관련 타입 정의
 */

// 이벤트 유형
export type CalendarEventType = 
  | 'auction'     // 경매
  | 'festival'    // 축제
  | 'market'      // 시장
  | 'deadline'    // 마감일
  | 'personal';   // 개인 일정

// 달력 이벤트
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: CalendarEventType;
  day: number;
  month: number;
  year: number;
  isClosed: boolean;
  locationId?: string;
  importance: 'low' | 'medium' | 'high';
  reward?: number; // 이벤트 참여 시 보상
  deadline?: number; // 마감일(날짜 형식)
}

// 날짜
export interface GameDate {
  day: number;
  month: number;
  year: number;
}

// 달력 뷰 타입
export type CalendarViewType = 
  | 'month' // 월 단위 뷰
  | 'week'  // 주 단위 뷰
  | 'day';  // 일 단위 뷰

// 달력 마커
export interface CalendarMarker {
  date: GameDate;
  type: 'current' | 'selected' | 'event' | 'closed';
  events: CalendarEvent[];
}

// 달력 상태
export interface CalendarState {
  currentDate: GameDate;
  selectedDate: GameDate;
  viewType: CalendarViewType;
  events: CalendarEvent[];
  markers: CalendarMarker[];
}