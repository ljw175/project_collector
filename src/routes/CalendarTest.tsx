import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';

/**
 * 달력/일정 시스템 테스트 페이지
 */
const CalendarTest: React.FC = () => {
  // 현재 월 설정 (0: 1월 ~ 11: 12월)
  const [currentMonth, setCurrentMonth] = useState(3); // 4월
  const [currentYear, setCurrentYear] = useState(2025);
  
  // 현재 선택된 날짜
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  
  // 선택된 이벤트
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // 달력에 표시할 월 이름
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월', 
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  
  // 요일 이름
  const weekdayNames = ['일', '월', '화', '수', '목', '금', '토'];
  
  // 테스트용 이벤트 데이터
  const testEvents = [
    {
      id: 'event-1',
      title: '봄맞이 시장 축제',
      description: '봄을 맞아 시장에서 특별 축제가 열립니다. 다양한 상인들이 모여 평소보다 저렴한 가격에 물건을 판매합니다.',
      type: 'festival',
      location: '중앙 시장',
      year: 2025,
      month: 3, // 4월
      day: 15,
      importance: '보통',
      isClosed: false
    },
    {
      id: 'event-2',
      title: '특별 경매',
      description: '희귀 유물 컬렉션에 대한 특별 경매가 예정되어 있습니다. 참가하면 평소보다 좋은 물건을 얻을 기회가 있습니다.',
      type: 'auction',
      location: '경매장',
      year: 2025,
      month: 3, // 4월
      day: 20,
      importance: '높음',
      isClosed: false
    },
    {
      id: 'event-3',
      title: '장인 공방 방문',
      description: '유명한 장인이 공방에서 맞춤 제작 의뢰를 받습니다. 한정된 시간 동안만 방문합니다.',
      type: 'personal',
      location: '장인의 공방',
      year: 2025,
      month: 3, // 4월
      day: 25,
      importance: '보통',
      isClosed: true
    }
  ];
  
  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = (day: number) => {
    return testEvents.filter(
      event => event.year === currentYear && event.month === currentMonth && event.day === day
    );
  };
  
  // 선택된 날짜의 이벤트 목록
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  
  // 선택된 이벤트 정보
  const selectedEventData = selectedEvent 
    ? testEvents.find(event => event.id === selectedEvent) 
    : null;
  
  // 해당 월의, 빈 칸까지 포함한 모든 날짜 배열 생성
  const getDaysInMonth = (year: number, month: number) => {
    // 해당 월의 첫째 날
    const firstDay = new Date(year, month, 1);
    // 해당 월의 첫째 날의 요일 (0: 일요일, 1: 월요일, ...)
    const firstDayOfWeek = firstDay.getDay();
    
    // 해당 월의 마지막 날
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // 달력에 표시할 날짜 배열 생성
    const days = [];
    
    // 첫째 주 시작 전 빈 칸
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // 실제 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  // 월 변경 핸들러
  const changeMonth = (delta: number) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(null);
    setSelectedEvent(null);
  };
  
  // 날짜 선택 핸들러
  const handleDateSelect = (day: number | null) => {
    if (!day) return;
    
    setSelectedDate(day);
    setSelectedEvent(null);
  };
  
  // 이벤트 참여 상태 변경 핸들러
  const toggleEventStatus = (eventId: string) => {
    // 실제 구현에서는 이벤트 상태를 업데이트하는 로직이 필요
    console.log(`이벤트 ${eventId}의 참여 상태 변경`);
  };
  
  // 현재 날짜 (테스트용)
  const today = {
    year: 2025,
    month: 3,
    day: 10
  };
  
  // 날짜 포맷 함수
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}년 ${month + 1}월 ${day}일`;
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/dev" className="back-button">← 테스트 메뉴로</Link>
        <h1>달력/일정 시스템 테스트</h1>
      </header>
      
      <main className="app-content">
        <div className="calendar-container">
          <div className="calendar-header">
            <button 
              className="month-nav-btn"
              onClick={() => changeMonth(-1)}
            >
              ◀
            </button>
            <h2>{currentYear}년 {monthNames[currentMonth]}</h2>
            <button 
              className="month-nav-btn"
              onClick={() => changeMonth(1)}
            >
              ▶
            </button>
          </div>
          
          <div className="calendar-weekdays">
            {weekdayNames.map(weekday => (
              <div key={weekday} className="weekday">
                {weekday}
              </div>
            ))}
          </div>
          
          <div className="calendar-days">
            {getDaysInMonth(currentYear, currentMonth).map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="calendar-day empty"></div>;
              }
              
              const dayEvents = getEventsForDate(day);
              const isToday = currentYear === today.year && 
                              currentMonth === today.month && 
                              day === today.day;
              const isSelected = selectedDate === day;
              
              return (
                <div 
                  key={`day-${day}`}
                  className={`calendar-day 
                    ${isToday ? 'today' : ''} 
                    ${isSelected ? 'selected' : ''}
                    ${dayEvents.length > 0 ? 'has-events' : ''}
                  `}
                  onClick={() => handleDateSelect(day)}
                >
                  <div className="day-number">{day}</div>
                  
                  {dayEvents.length > 0 && (
                    <div className="day-events">
                      {dayEvents.map(event => (
                        <div 
                          key={event.id}
                          className={`event-dot ${event.type} ${event.isClosed ? 'closed' : ''}`}
                          title={event.title}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="events-panel">
          {selectedDate ? (
            <div className="date-events">
              <h3>{formatDate(currentYear, currentMonth, selectedDate)}</h3>
              
              {selectedDateEvents.length > 0 ? (
                <div className="events-list">
                  {selectedEvent ? (
                    <div className="event-details">
                      <div className="event-header">
                        <h4>{selectedEventData?.title}</h4>
                        <button 
                          className="close-btn"
                          onClick={() => setSelectedEvent(null)}
                        >
                          ×
                        </button>
                      </div>
                      <p className="event-description">{selectedEventData?.description}</p>
                      <div className="event-meta">
                        <div className="meta-item">
                          <span className="label">장소:</span>
                          <span className="value">{selectedEventData?.location}</span>
                        </div>
                        <div className="meta-item">
                          <span className="label">유형:</span>
                          <span className="value">{selectedEventData?.type}</span>
                        </div>
                        <div className="meta-item">
                          <span className="label">중요도:</span>
                          <span className="value">{selectedEventData?.importance}</span>
                        </div>
                      </div>
                      <div className="event-actions">
                        <button 
                          className={`event-toggle-btn ${selectedEventData?.isClosed ? 'closed' : ''}`}
                          onClick={() => selectedEventData && toggleEventStatus(selectedEventData.id)}
                        >
                          {selectedEventData?.isClosed ? '참여 취소' : '참여 예약'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    selectedDateEvents.map(event => (
                      <div 
                        key={event.id}
                        className={`event-item ${event.type} ${event.isClosed ? 'closed' : ''}`}
                        onClick={() => setSelectedEvent(event.id)}
                      >
                        <div className="event-title">
                          <span className="event-icon" />
                          {event.title}
                        </div>
                        <div className="event-importance">{event.importance}</div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <p className="no-events">이 날짜에 예정된 이벤트가 없습니다.</p>
              )}
            </div>
          ) : (
            <div className="no-date-selected">
              <p>달력에서 날짜를 선택하여 일정을 확인하세요.</p>
            </div>
          )}
        </div>
        
        <div className="calendar-controls">
          <button className="btn btn-primary">다음 날로 진행</button>
          <div className="current-date">
            <span className="label">현재 게임 날짜:</span>
            <span className="value">{formatDate(today.year, today.month, today.day)}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarTest;