/**
 * 달력(Calendar) 기능을 위한 커스텀 훅
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useGameState } from '@store/gameContext';
import { 
  CalendarEvent, 
  GameDate, 
  CalendarViewType,
  CalendarMarker
} from '../types/calendar_types';

// 게임 모델의 CalendarEvent를 타입 간 호환성을 위해 가공하는 함수
const adaptModelEvents = (modelEvents: any[] = []): CalendarEvent[] => {
  return modelEvents.map(event => ({
    ...event,
    // 모델에 importance가 없으면 기본값 'medium' 설정
    importance: event.importance || 'medium'
  }));
};

export function useCalendar() {
  const { state, dispatch } = useGameState();
  
  // 현재 날짜 정보
  const [currentDate, setCurrentDate] = useState<GameDate>({
    day: state.currentDay,
    month: state.currentMonth,
    year: state.currentYear
  });
  
  // 선택된 날짜 정보
  const [selectedDate, setSelectedDate] = useState<GameDate>(currentDate);
  
  // 달력 뷰 타입
  const [viewType, setViewType] = useState<CalendarViewType>('month');
  
  // 달력 이벤트 목록 - 모델 이벤트를 적절히 변환
  const [events, setEvents] = useState<CalendarEvent[]>(adaptModelEvents(state.calendar));
  
  // 달력 마커 목록
  const [markers, setMarkers] = useState<CalendarMarker[]>([]);
  
  // 선택된 이벤트
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // 날짜 비교 함수
  const isSameDate = useCallback((date1: GameDate, date2: GameDate): boolean => {
    return date1.day === date2.day && 
           date1.month === date2.month && 
           date1.year === date2.year;
  }, []);
  
  // 날짜 선택 처리
  const selectDate = useCallback((date: GameDate) => {
    setSelectedDate(date);
    setSelectedEvent(null);
  }, []);
  
  // 날짜 이동 처리
  const navigateToDate = useCallback((date: GameDate) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    
    // 뷰에 표시될 수 있도록 마커 업데이트
    generateMarkers(date);
  }, []);
  
  // 다음 날짜로 이동
  const navigateToNextDay = useCallback(() => {
    const nextDate = { ...selectedDate };
    nextDate.day++;
    
    // 간단한 달력 로직 (실제 구현에서는 더 정교한 날짜 계산 필요)
    const daysInMonth = getDaysInMonth(nextDate.month, nextDate.year);
    
    if (nextDate.day > daysInMonth) {
      nextDate.day = 1;
      nextDate.month++;
      
      if (nextDate.month > 12) {
        nextDate.month = 1;
        nextDate.year++;
      }
    }
    
    navigateToDate(nextDate);
  }, [selectedDate, navigateToDate]);
  
  // 이전 날짜로 이동
  const navigateToPrevDay = useCallback(() => {
    const prevDate = { ...selectedDate };
    prevDate.day--;
    
    if (prevDate.day < 1) {
      prevDate.month--;
      
      if (prevDate.month < 1) {
        prevDate.month = 12;
        prevDate.year--;
      }
      
      prevDate.day = getDaysInMonth(prevDate.month, prevDate.year);
    }
    
    navigateToDate(prevDate);
  }, [selectedDate, navigateToDate]);
  
  // 다음 월로 이동
  const navigateToNextMonth = useCallback(() => {
    const nextDate = { ...selectedDate };
    nextDate.month++;
    
    if (nextDate.month > 12) {
      nextDate.month = 1;
      nextDate.year++;
    }
    
    // 해당 월의 최대 일자보다 현재 일자가 크면 조정
    const daysInNextMonth = getDaysInMonth(nextDate.month, nextDate.year);
    if (nextDate.day > daysInNextMonth) {
      nextDate.day = daysInNextMonth;
    }
    
    navigateToDate(nextDate);
  }, [selectedDate, navigateToDate]);
  
  // 이전 월로 이동
  const navigateToPrevMonth = useCallback(() => {
    const prevDate = { ...selectedDate };
    prevDate.month--;
    
    if (prevDate.month < 1) {
      prevDate.month = 12;
      prevDate.year--;
    }
    
    // 해당 월의 최대 일자보다 현재 일자가 크면 조정
    const daysInPrevMonth = getDaysInMonth(prevDate.month, prevDate.year);
    if (prevDate.day > daysInPrevMonth) {
      prevDate.day = daysInPrevMonth;
    }
    
    navigateToDate(prevDate);
  }, [selectedDate, navigateToDate]);
  
  // 뷰 타입 변경
  const changeViewType = useCallback((type: CalendarViewType) => {
    setViewType(type);
    generateMarkers(selectedDate, type);
  }, [selectedDate]);
  
  // 이벤트 선택
  const selectEvent = useCallback((eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      
      // 해당 이벤트가 있는 날짜로 선택 날짜 변경
      setSelectedDate({
        day: event.day,
        month: event.month,
        year: event.year
      });
    }
  }, [events]);
  
  // 이벤트 참여 여부 변경
  const toggleEventStatus = useCallback((eventId: string, isClosed: boolean) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isClosed } 
        : event
    ));
    
    // 실제 구현에서는 여기서 게임 상태 업데이트 필요
    // dispatch({ type: 'UPDATE_EVENT', payload: { id: eventId, isClosed } });
    
    // 마커 업데이트
    generateMarkers(selectedDate, viewType);
  }, [selectedDate, viewType]);
  
  // 게임 시간 진행
  const advanceDay = useCallback(() => {
    // 하루 진행
    dispatch({ type: 'ADVANCE_DAY', payload: 1 });
    
    // 현재 날짜 업데이트
    const newCurrentDate = {
      day: state.currentDay + 1,
      month: state.currentMonth,
      year: state.currentYear
    };
    
    // 월/년 조정 필요한 경우
    const daysInMonth = getDaysInMonth(newCurrentDate.month, newCurrentDate.year);
    if (newCurrentDate.day > daysInMonth) {
      newCurrentDate.day = 1;
      newCurrentDate.month++;
      
      if (newCurrentDate.month > 12) {
        newCurrentDate.month = 1;
        newCurrentDate.year++;
      }
    }
    
    setCurrentDate(newCurrentDate);
    navigateToDate(newCurrentDate);
  }, [state.currentDay, state.currentMonth, state.currentYear, dispatch, navigateToDate]);
  
  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = useCallback((date: GameDate): CalendarEvent[] => {
    return events.filter(event => 
      event.day === date.day && 
      event.month === date.month && 
      event.year === date.year
    );
  }, [events]);
  
  // 특정 날짜가 현재 날짜인지 확인
  const isCurrentDate = useCallback((date: GameDate): boolean => {
    return isSameDate(date, currentDate);
  }, [currentDate, isSameDate]);
  
  // 특정 날짜가 선택된 날짜인지 확인
  const isSelectedDate = useCallback((date: GameDate): boolean => {
    return isSameDate(date, selectedDate);
  }, [selectedDate, isSameDate]);
  
  // 특정 날짜에 이벤트가 있는지 확인
  const hasEvents = useCallback((date: GameDate): boolean => {
    return getEventsForDate(date).length > 0;
  }, [getEventsForDate]);
  
  // 달력 마커 생성
  const generateMarkers = useCallback((baseDate: GameDate, view: CalendarViewType = viewType) => {
    const newMarkers: CalendarMarker[] = [];
    
    if (view === 'month') {
      // 해당 월의 첫 날짜 (1일)의 요일 계산
      const firstDay = new Date(baseDate.year, baseDate.month - 1, 1).getDay();
      // 해당 월의 일수
      const daysInMonth = getDaysInMonth(baseDate.month, baseDate.year);
      
      // 이전 월의 마지막 몇 일을 표시할지 계산
      let prevMonth = baseDate.month - 1;
      let prevYear = baseDate.year;
      if (prevMonth < 1) {
        prevMonth = 12;
        prevYear--;
      }
      const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);
      
      // 이전 월의 날짜 추가 (달력의 첫 주에서 이전 월의 날짜)
      for (let i = 0; i < firstDay; i++) {
        const day = daysInPrevMonth - firstDay + i + 1;
        const date: GameDate = { day, month: prevMonth, year: prevYear };
        
        newMarkers.push({
          date,
          type: 'closed', // 이전 월은 선택 불가능
          events: getEventsForDate(date)
        });
      }
      
      // 현재 월의 날짜 추가
      for (let day = 1; day <= daysInMonth; day++) {
        const date: GameDate = { day, month: baseDate.month, year: baseDate.year };
        const dateEvents = getEventsForDate(date);
        
        let type: 'current' | 'selected' | 'event' | 'closed' = 'closed';
        
        if (isCurrentDate(date)) {
          type = 'current';
        } else if (isSelectedDate(date)) {
          type = 'selected';
        } else if (dateEvents.length > 0) {
          type = 'event';
        } else {
          type = 'closed';
        }
        
        newMarkers.push({
          date,
          type,
          events: dateEvents
        });
      }
      
      // 다음 월의 날짜로 나머지 채우기 (6주 표시를 위해)
      const totalCells = 6 * 7; // 6주 * 7일
      const remainingCells = totalCells - newMarkers.length;
      
      let nextMonth = baseDate.month + 1;
      let nextYear = baseDate.year;
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear++;
      }
      
      for (let day = 1; day <= remainingCells; day++) {
        const date: GameDate = { day, month: nextMonth, year: nextYear };
        
        newMarkers.push({
          date,
          type: 'closed', // 다음 월은 선택 불가능
          events: getEventsForDate(date)
        });
      }
    } else if (view === 'week') {
      // 주 단위 뷰 구현
      // 현재 선택된 날짜가 속한 주의 시작일 (일요일) 계산
      const currentDayOfWeek = new Date(
        baseDate.year, 
        baseDate.month - 1, 
        baseDate.day
      ).getDay();
      
      let weekStartDay = baseDate.day - currentDayOfWeek;
      let startMonth = baseDate.month;
      let startYear = baseDate.year;
      
      // 시작일이 이전 월의 날짜인 경우 조정
      if (weekStartDay <= 0) {
        startMonth--;
        if (startMonth < 1) {
          startMonth = 12;
          startYear--;
        }
        const daysInPrevMonth = getDaysInMonth(startMonth, startYear);
        weekStartDay += daysInPrevMonth;
      }
      
      // 일주일 (7일) 표시
      for (let i = 0; i < 7; i++) {
        let day = weekStartDay + i;
        let month = startMonth;
        let year = startYear;
        
        // 월을 넘어가는 경우 조정
        const daysInMonth = getDaysInMonth(month, year);
        if (day > daysInMonth) {
          day -= daysInMonth;
          month++;
          if (month > 12) {
            month = 1;
            year++;
          }
        }
        
        const date: GameDate = { day, month, year };
        const dateEvents = getEventsForDate(date);
        
        let type: 'current' | 'selected' | 'event' | 'closed' = 'closed';
        
        if (isCurrentDate(date)) {
          type = 'current';
        } else if (isSelectedDate(date)) {
          type = 'selected';
        } else if (dateEvents.length > 0) {
          type = 'event';
        } else {
          type = 'closed';
        }
        
        newMarkers.push({
          date,
          type,
          events: dateEvents
        });
      }
    } else if (view === 'day') {
      // 일 단위 뷰는 선택된 날짜 하나만 표시
      const date = baseDate;
      const dateEvents = getEventsForDate(date);
      
      let type: 'current' | 'selected' | 'event' | 'closed';
      
      if (isCurrentDate(date)) {
        type = 'current';
      } else {
        type = 'selected';
      }
      
      newMarkers.push({
        date,
        type,
        events: dateEvents
      });
    }
    
    setMarkers(newMarkers);
  }, [
    viewType, 
    getEventsForDate, 
    isCurrentDate, 
    isSelectedDate
  ]);
  
  // 선택된 날짜의 이벤트 목록
  const selectedDateEvents = useMemo(() => {
    return getEventsForDate(selectedDate);
  }, [selectedDate, getEventsForDate]);
  
  // 현재 표시 중인 월 이름
  const currentMonthName = useMemo(() => {
    const monthNames = [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ];
    return monthNames[selectedDate.month - 1];
  }, [selectedDate.month]);
  
  // 날짜 표시 문자열 생성
  const formatDate = useCallback((date: GameDate): string => {
    return `${date.year}년 ${date.month}월 ${date.day}일`;
  }, []);
  
  // 날짜 비교 (date1이 date2보다 이전인지)
  const isDateBefore = useCallback((date1: GameDate, date2: GameDate): boolean => {
    if (date1.year < date2.year) return true;
    if (date1.year > date2.year) return false;
    
    if (date1.month < date2.month) return true;
    if (date1.month > date2.month) return false;
    
    return date1.day < date2.day;
  }, []);
  
  // 한 달의 일수 계산 (윤년 고려)
  function getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }
  
  // 이벤트 생성
  const createEvent = useCallback((event: Omit<CalendarEvent, 'id'>): string => {
    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      ...event
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    // 마커 업데이트
    generateMarkers(selectedDate, viewType);
    
    return newEvent.id;
  }, [selectedDate, viewType, generateMarkers]);
  
  // 이벤트 수정
  const updateEvent = useCallback((
    id: string, 
    updates: Partial<Omit<CalendarEvent, 'id'>>
  ): boolean => {
    let updated = false;
    
    setEvents(prev => {
      const index = prev.findIndex(e => e.id === id);
      if (index === -1) return prev;
      
      updated = true;
      const updatedEvents = [...prev];
      updatedEvents[index] = {
        ...updatedEvents[index],
        ...updates
      };
      return updatedEvents;
    });
    
    if (updated) {
      // 마커 업데이트
      generateMarkers(selectedDate, viewType);
    }
    
    return updated;
  }, [selectedDate, viewType, generateMarkers]);
  
  // 이벤트 삭제
  const deleteEvent = useCallback((id: string): boolean => {
    let deleted = false;
    
    setEvents(prev => {
      const index = prev.findIndex(e => e.id === id);
      if (index === -1) return prev;
      
      deleted = true;
      const updatedEvents = [...prev];
      updatedEvents.splice(index, 1);
      return updatedEvents;
    });
    
    if (deleted) {
      // 선택된 이벤트가 삭제된 경우 선택 초기화
      if (selectedEvent && selectedEvent.id === id) {
        setSelectedEvent(null);
      }
      
      // 마커 업데이트
      generateMarkers(selectedDate, viewType);
    }
    
    return deleted;
  }, [selectedDate, viewType, selectedEvent, generateMarkers]);
  
  // 초기 마커 생성
  useEffect(() => {
    // 게임 상태에서 캘린더 이벤트 로드 - 타입 호환성을 위해 변환
    setEvents(adaptModelEvents(state.calendar));
    
    // 현재 날짜로 설정
    const gameDate: GameDate = {
      day: state.currentDay,
      month: state.currentMonth,
      year: state.currentYear
    };
    setCurrentDate(gameDate);
    setSelectedDate(gameDate);
    
    // 마커 생성
    generateMarkers(gameDate);
  }, [state.calendar, state.currentDay, state.currentMonth, state.currentYear, generateMarkers]);
  
  return {
    currentDate,
    selectedDate,
    viewType,
    events,
    markers,
    selectedEvent,
    selectedDateEvents,
    currentMonthName,
    
    selectDate,
    navigateToDate,
    navigateToNextDay,
    navigateToPrevDay,
    navigateToNextMonth,
    navigateToPrevMonth,
    changeViewType,
    selectEvent,
    toggleEventStatus,
    advanceDay,
    createEvent,
    updateEvent,
    deleteEvent,
    formatDate,
    isDateBefore,
    hasEvents,
    isCurrentDate,
    isSelectedDate
  };
}