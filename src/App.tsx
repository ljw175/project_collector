import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider, useGameState } from './store/gameContext';
import { Item } from './models/item'; // Item 타입 임포트 추가
import { testItems } from './data/items/common-items'; // 테스트 아이템 데이터 가져오기
import CurrencyDisplay from './components/ui/CurrencyDisplay';
import './styles/global.css';
import './App.css';

// 컴포넌트 임포트
import StoryPanel from './components/ui/StoryPanel';
import TagPopup from './features/appraisal/components/TagPopup';
import ItemSlot from './components/ui/ItemSlot';

// 라우트 컴포넌트
import MainNav from './routes/MainNav';
import CollectionTest from './routes/CollectionTest';
import AppraisalTest from './routes/AppraisalTest';
import InventoryTest from './routes/InventoryTest';
import MapTest from './routes/MapTest';
import CalendarTest from './routes/CalendarTest';
import AuctionTest from './routes/AuctionTest';
import ExpertiseTest from './routes/ExpertiseTest';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/dev" element={<MainNav />} />
          <Route path="/collection-test" element={<CollectionTest />} />
          <Route path="/appraisal-test" element={<AppraisalTest />} />
          <Route path="/inventory-test" element={<InventoryTest />} />
          <Route path="/map-test" element={<MapTest />} />
          <Route path="/calendar-test" element={<CalendarTest />} />
          <Route path="/auction-test" element={<AuctionTest />} />
          <Route path="/expertise-test" element={<ExpertiseTest />} />
          <Route path="/" element={<MainGameScreen />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

// StoryPanel의 메시지 타입과 일치하는 메시지 타입 정의
type MessageType = 'normal' | 'success' | 'warning' | 'error';

// 메인 게임 화면 컴포넌트
const MainGameScreen = () => {
  const { state } = useGameState();
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // 진열된 테스트 아이템들 (common-items.ts에서 가져옴)
  const displayedItems = testItems.slice(0, 3); // 처음 3개 아이템만 사용
  
  // 아이템 링크를 포함한 메시지 생성
  const itemLinkText = displayedItems.map(item => `[${item.name}]`).join(' ');
  
  // 게임 진행 메시지용 상태 (type을 제한된 타입으로 명시)
  const [gameMessages] = useState([
    {
      id: '1',
      text: '당신은 마을의 골동품 가게에 들어섰습니다.',
      type: 'normal' as MessageType,
      timestamp: Date.now() - 3000
    },
    {
      id: '2',
      text: '점주가 환영하며 이야기합니다. "어서오세요, 오늘은 어떤 물건을 찾고 계신가요?"',
      type: 'normal' as MessageType,
      timestamp: Date.now() - 2000
    },
    {
      id: '3',
      text: `현재 진열대에 몇 가지 물건이 보입니다: ${itemLinkText}`,
      type: 'normal' as MessageType,
      timestamp: Date.now() - 1000
    }
  ]);
  
  // 인벤토리에서 아이템 클릭 시 처리
  const handleItemClick = (itemId: string, itemName: string) => {
    console.log(`아이템 클릭: ${itemName} (${itemId})`);
    
    // 진열된 아이템 중에서 클릭한 아이템 찾기
    const clickedDisplayItem = displayedItems.find(item => 
      item.name === itemName || item.id === itemId
    );
    
    // 인벤토리 아이템 중에서 찾기
    const clickedInventoryItem = state.inventory.find(item => 
      item.id === itemId
    );
    
    // 찾은 아이템을 selectedItem으로 설정
    if (clickedDisplayItem) {
      setSelectedItem(clickedDisplayItem);
      setShowTagPopup(true);
    } else if (clickedInventoryItem) {
      setSelectedItem(clickedInventoryItem);
      setShowTagPopup(true);
    }
  };
  
  const handleClosePopup = () => {
    setShowTagPopup(false);
    setSelectedItem(null);
  };
  
  const handleAppraise = () => {
    console.log('아이템 감정 시작...');
    // 감정 로직 구현 필요
    setShowTagPopup(false);
  };

  // 플레이어 상태 표시용 포맷팅 함수
  const formatHealth = (health: number, maxHealth: number) => {
    return `${health}/${maxHealth}`;
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Collector</h1>
        <div className="player-stats">
          <div className="stat" style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '4px' }}>💰</span>
            <CurrencyDisplay values={state.player.money} size="large" />
          </div>
          <div className="stat">👑 명성 {state.player.reputation}</div>
          <div className="stat">❤️ {formatHealth(state.player.status.health, state.player.status.maxHealth)}</div>
        </div>
      </header>
      
      <main className="app-content">
        <StoryPanel 
          messages={gameMessages} 
          onItemClick={handleItemClick} 
        />
        
        <div className="action-panel">
          <div className="action-buttons">
            <button className="btn">살펴보기</button>
            <button className="btn">대화하기</button>
            <button className="btn btn-primary">물건 구매</button>
            <button className="btn">떠나기</button>
          </div>
        </div>
        
        <div className="inventory-preview">
          <h3>인벤토리 ({state.inventory.length})</h3>
          <div className="inventory-grid">
            {state.inventory.slice(0, 4).map(item => (
              <ItemSlot 
                key={item.id} 
                item={item} 
                count={item.quantity} 
                isSelected={selectedItem?.id === item.id}
                onClick={() => handleItemClick(item.id, item.name)}
              />
            ))}
          </div>
        </div>
      </main>
      
      {showTagPopup && selectedItem && (
        <TagPopup 
          item={selectedItem} 
          onClose={handleClosePopup}
          onAppraise={handleAppraise}
        />
      )}
    </div>
  );
};

export default App;
