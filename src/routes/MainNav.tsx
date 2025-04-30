import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';

/**
 * 모든 테스트 페이지로 이동할 수 있는 메인 네비게이션 컴포넌트
 */
const MainNav: React.FC = () => {
  // 각 기능 모듈에 대한 테스트 페이지 링크 정의
  const modules = [
    { name: '수집 시스템', path: '/collection-test', icon: '📦' },
    { name: '감정 시스템', path: '/appraisal-test', icon: '🔍' },
    { name: '인벤토리', path: '/inventory-test', icon: '🎒' },
    { name: '맵/이동', path: '/map-test', icon: '🗺️' },
    { name: '달력/시간', path: '/calendar-test', icon: '📅' },
    { name: '경매 시스템', path: '/auction-test', icon: '🏛️' },
    { name: '전문성/스킬', path: '/expertise-test', icon: '📚' },
    { name: '메인 게임 화면', path: '/', icon: '🎮' }
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Collector - 개발자 테스트 환경</h1>
      </header>
      
      <main className="test-navigation">
        <h2>기능 모듈 테스트 페이지</h2>
        <p className="text-muted">테스트하려는 기능 모듈을 선택하세요.</p>
        
        <div className="module-grid">
          {modules.map((module) => (
            <Link 
              to={module.path} 
              key={module.path} 
              className="module-card"
            >
              <div className="module-icon">{module.icon}</div>
              <div className="module-name">{module.name}</div>
            </Link>
          ))}
        </div>
        
        <div className="dev-note">
          <h3>개발자 노트</h3>
          <p>
            이 화면은 개발 및 테스트 전용입니다. 각 모듈은 독립적으로 테스트할 수 있으며, 
            피드백 루프를 빠르게 형성하기 위해 구현되었습니다.
          </p>
        </div>
      </main>
    </div>
  );
};

export default MainNav;