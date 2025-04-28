import { useState } from 'react';
import { GameProvider } from './store/gameContext';
import './styles/global.css';
import './App.css';

// 테스트용 임시 데이터
import { Item, ItemCategory } from './models/item';
import StoryPanel from './components/ui/StoryPanel';
import TagPopup from './features/appraisal/components/TagPopup';
import ItemSlot from './components/ui/ItemSlot';

function App() {
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // 테스트용 아이템 생성
  const testItem: Item = {
    id: 'test-item-1',
    name: '오래된 은단검',
    description: '고대 장인이 만든 것으로 보이는 섬세한 무늬가 새겨진 은단검입니다.',
    baseValue: 150,
    isAppraised: false,
    category: ItemCategory.WEAPON,
    quantity: 1,
    tags: [],
    hiddenTags: [
      {
        id: 'tag-1',
        name: '고대의',
        icon: '/assets/tags/ancient.png',
        color: '#FFD700',
        description: '고대 시대에 만들어진 물건입니다.',
        rarity: 'rare',
        valueMultiplier: 2.5,
        isHidden: true
      },
      {
        id: 'tag-2',
        name: '장인의',
        icon: '/assets/tags/craftsman.png',
        color: '#C0C0C0',
        description: '뛰어난 장인이 만든 물건입니다.',
        rarity: 'uncommon',
        valueMultiplier: 1.8,
        isHidden: true
      }
    ]
  };
  
  // 테스트용 스토리 메시지
  const testMessages: Array<{
    id: string;
    text: string;
    type: 'normal' | 'success' | 'warning' | 'error';
    timestamp: number;
  }> = [
    {
      id: '1',
      text: '당신은 마을의 골동품 가게에 들어섰습니다.',
      type: 'normal',
      timestamp: Date.now() - 3000
    },
    {
      id: '2',
      text: '점주가 환영하며 이야기합니다. "어서오세요, 오늘은 어떤 물건을 찾고 계신가요?"',
      type: 'normal',
      timestamp: Date.now() - 2000
    },
    {
      id: '3',
      text: '선반 위에 [오래된 은단검]이 눈에 띕니다. 잘 관리된 상태로 보입니다.',
      type: 'normal',
      timestamp: Date.now() - 1000
    },
    {
      id: '4',
      text: '점주가 말합니다. "그 단검은 고풍스러운 물건입니다. 관심 있으신가요?"',
      type: 'normal',
      timestamp: Date.now()
    }
  ];
  
  const handleItemClick = (itemId: string, itemName: string) => {
    console.log(`아이템 클릭: ${itemName} (${itemId})`);
    setSelectedItem(testItem);
    setShowTagPopup(true);
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

  return (
    <GameProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>Collector</h1>
          <div className="player-stats">
            <div className="stat">💰 500G</div>
            <div className="stat">👑 명성 0</div>
            <div className="stat">❤️ 100/100</div>
          </div>
        </header>
        
        <main className="app-content">
          <StoryPanel 
            messages={testMessages} 
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
            <h3>인벤토리</h3>
            <div className="inventory-grid">
              <ItemSlot item={testItem} count={1} />
              {/* 추가 아이템 슬롯 */}
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
    </GameProvider>
  );
}

export default App;
