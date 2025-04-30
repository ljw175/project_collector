import React from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from '../features/collection/hooks/useCollection';
import '../styles/components.css';

/**
 * 수집 시스템 테스트 페이지
 */
const CollectionTest: React.FC = () => {
  // useCollection 훅을 활용하여 수집 기능 테스트
  // 실제 구현 시에는 useCollection 훅의 반환값을 활용
  
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/dev" className="back-button">← 테스트 메뉴로</Link>
        <h1>수집 시스템 테스트</h1>
      </header>
      
      <main className="app-content">
        <div className="card">
          <div className="card-header">
            <h2>수집 이벤트 목록</h2>
          </div>
          <div className="card-body">
            <div className="events-list">
              <div className="event-item">
                <h3>골동품 상점 탐색</h3>
                <p>다양한 골동품과 희귀한 물건들이 있는 상점을 탐색합니다.</p>
                <button className="btn btn-primary">시작하기</button>
              </div>
              
              <div className="event-item">
                <h3>시장 뒷골목 수색</h3>
                <p>도시 시장의 뒷골목에는 보물이 숨겨져 있을지도 모릅니다.</p>
                <button className="btn btn-primary">시작하기</button>
              </div>
              
              <div className="event-item">
                <h3>고택 정리</h3>
                <p>오래된 귀족의 저택에서 정리 작업을 도우며 가치 있는 아이템을 찾습니다.</p>
                <button className="btn btn-primary">시작하기</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card mt-4">
          <div className="card-header">
            <h2>발견된 아이템</h2>
          </div>
          <div className="card-body">
            <p className="text-muted">아이템을 발견하려면 위의 수집 이벤트를 시작하세요.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollectionTest;