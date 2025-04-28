/**
 * 달력 화면 컴포넌트
 */
import React from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { CalendarEvent, CalendarMarker, GameDate } from '../types/calendar_types';

// 달력 헤더 컴포넌트
const CalendarHeader: React.FC = () => {
  const { 
    currentMonthName, 
    selectedDate, 
    navigateToPrevMonth, 
    navigateToNextMonth,
    changeViewType,
    viewType
  } = useCalendar();

  return (
    <div className="calendar-header">
      <div className="calendar-title">
        <h2>{`${selectedDate.year}년 ${currentMonthName}`}</h2>
      </div>
      
      <div className="calendar-controls">
        <button onClick={navigateToPrevMonth}>◀</button>
        <div className="view-controls">
          <button 
            className={viewType === 'month' ? 'active' : ''} 
            onClick={() => changeViewType('month')}
          >
            월
          </button>
          <button 
            className={viewType === 'week' ? 'active' : ''} 
            onClick={() => changeViewType('week')}
          >
            주
          </button>
          <button 
            className={viewType === 'day' ? 'active' : ''} 
            onClick={() => changeViewType('day')}
          >
            일
          </button>
        </div>
        <button onClick={navigateToNextMonth}>▶</button>
      </div>
    </div>
  );
};

// 달력 요일 헤더
const CalendarWeekdays: React.FC = () => {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  
  return (
    <div className="calendar-weekdays">
      {weekdays.map(day => (
        <div key={day} className="weekday">
          {day}
        </div>
      ))}
    </div>
  );
};

// 달력 날짜 셀 컴포넌트
const CalendarCell: React.FC<{
  marker: CalendarMarker;
  onSelect: (date: GameDate) => void;
}> = ({ marker, onSelect }) => {
  const { date, type, events } = marker;
  
  // 이벤트 아이콘 표시
  const eventIcons = events.map(event => {
    let iconClass = '';
    
    switch (event.type) {
      case 'auction':
        iconClass = 'event-icon auction';
        break;
      case 'festival':
        iconClass = 'event-icon festival';
        break;
      case 'market':
        iconClass = 'event-icon market';
        break;
      case 'deadline':
        iconClass = 'event-icon deadline';
        break;
      case 'personal':
        iconClass = 'event-icon personal';
        break;
    }
    
    return (
      <div key={event.id} className={iconClass} title={event.title}>
        {event.isClosed && <div className="closed-overlay" />}
      </div>
    );
  });
  
  return (
    <div 
      className={`calendar-cell ${type}`}
      onClick={() => onSelect(date)}
    >
      <div className="date-number">{date.day}</div>
      {events.length > 0 && (
        <div className="event-indicators">
          {eventIcons}
        </div>
      )}
    </div>
  );
};

// 달력 그리드 컴포넌트
const CalendarGrid: React.FC = () => {
  const { markers, selectDate } = useCalendar();
  
  return (
    <div className="calendar-grid">
      <CalendarWeekdays />
      <div className="calendar-days">
        {markers.map((marker, index) => (
          <CalendarCell
            key={`${marker.date.year}-${marker.date.month}-${marker.date.day}-${index}`}
            marker={marker}
            onSelect={selectDate}
          />
        ))}
      </div>
    </div>
  );
};

// 이벤트 세부 정보 컴포넌트
const EventDetails: React.FC<{
  event: CalendarEvent;
  onClose: () => void;
  onToggleStatus: (status: boolean) => void;
}> = ({ event, onClose, onToggleStatus }) => {
  return (
    <div className="event-details">
      <div className="event-header">
        <h3>{event.title}</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="event-info">
        <p className="event-description">{event.description}</p>
        <div className="event-metadata">
          <div className="event-type">
            <span className="label">유형:</span>
            <span className="value">{event.type}</span>
          </div>
          
          <div className="event-date">
            <span className="label">날짜:</span>
            <span className="value">{`${event.year}년 ${event.month}월 ${event.day}일`}</span>
          </div>
          
          {event.deadline && (
            <div className="event-deadline">
              <span className="label">마감일:</span>
              <span className="value">{`D-${event.deadline}`}</span>
            </div>
          )}
          
          {event.reward && (
            <div className="event-reward">
              <span className="label">보상:</span>
              <span className="value">{event.reward}</span>
            </div>
          )}
          
          {event.locationId && (
            <div className="event-location">
              <span className="label">위치:</span>
              <span className="value">{event.locationId}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="event-actions">
        <button 
          className={event.isClosed ? 'action-btn closed' : 'action-btn'}
          onClick={() => onToggleStatus(!event.isClosed)}
        >
          {event.isClosed ? '참여 취소' : '참여 예약'}
        </button>
      </div>
    </div>
  );
};

// 선택된 날짜의 이벤트 목록 컴포넌트
const DayEventsList: React.FC = () => {
  const { 
    selectedDate, 
    selectedDateEvents, 
    selectedEvent, 
    formatDate,
    selectEvent,
    toggleEventStatus
  } = useCalendar();
  
  // 이벤트가 없는 경우
  if (selectedDateEvents.length === 0) {
    return (
      <div className="day-events empty">
        <h3>{formatDate(selectedDate)}</h3>
        <p className="no-events">예정된 이벤트가 없습니다.</p>
      </div>
    );
  }
  
  // 선택된 이벤트가 있는 경우 세부 정보 표시
  if (selectedEvent) {
    return (
      <div className="day-events with-details">
        <EventDetails 
          event={selectedEvent} 
          onClose={() => selectEvent('')}
          onToggleStatus={(status) => toggleEventStatus(selectedEvent.id, status)}
        />
      </div>
    );
  }
  
  // 이벤트 목록 표시
  return (
    <div className="day-events list">
      <h3>{formatDate(selectedDate)}</h3>
      <ul className="events-list">
        {selectedDateEvents.map(event => (
          <li 
            key={event.id} 
            className={`event-item ${event.isClosed ? 'closed' : ''} ${event.type}`}
            onClick={() => selectEvent(event.id)}
          >
            <div className="event-title">
              <span className="event-icon" />
              {event.title}
            </div>
            <div className="event-importance">{event.importance}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 달력 하단 컨트롤 패널
const CalendarControls: React.FC = () => {
  const { 
    advanceDay
  } = useCalendar();
  
  // 주석만 남기고 사용되지 않는 변수는 제거
  // 현재 날짜보다 앞선 날짜인지 확인하는 로직
  
  return (
    <div className="calendar-controls-panel">
      <button 
        className="day-advance-btn"
        onClick={advanceDay}
      >
        다음 날로 진행
      </button>
    </div>
  );
};

// 메인 달력 화면 컴포넌트
const CalendarScreen: React.FC = () => {
  return (
    <div className="calendar-screen">
      <CalendarHeader />
      <div className="calendar-container">
        <CalendarGrid />
        <DayEventsList />
      </div>
      <CalendarControls />
    </div>
  );
};

export default CalendarScreen;