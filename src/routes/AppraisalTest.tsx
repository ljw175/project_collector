import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppraisal } from '../features/appraisal/hooks/useAppraisal';
import { Item, ItemCategory } from '../models/item';
import '../styles/components.css';

/**
 * 감정 시스템 테스트 페이지
 */
const AppraisalTest: React.FC = () => {
  // 테스트용 아이템 생성
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  
  // 예시 미감정 아이템 목록
  const testItems: Item[] = [
    {
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
        }
      ]
    },
    {
      id: 'test-item-2',
      name: '깨진 청동 거울',
      description: '부분적으로 깨진 청동 거울로, 뒷면에 독특한 문양이 새겨져 있습니다.',
      baseValue: 80,
      isAppraised: false,
      category: ItemCategory.HOUSEHOLD,
      quantity: 1,
      tags: [],
      hiddenTags: [
        {
          id: 'tag-3',
          name: '희귀한',
          icon: '/assets/tags/rare.png',
          color: '#C0C0C0',
          description: '흔치 않은 물건입니다.',
          rarity: 'uncommon',
          valueMultiplier: 1.5,
          isHidden: true
        }
      ]
    },
    {
      id: 'test-item-3',
      name: '금도금 반지',
      description: '순금으로 얇게 도금된 반지입니다. 작은 보석이 박혀 있습니다.',
      baseValue: 200,
      isAppraised: false,
      category: ItemCategory.JEWELRY,
      quantity: 1,
      tags: [],
      hiddenTags: [
        {
          id: 'tag-4',
          name: '정교한',
          icon: '/assets/tags/detailed.png',
          color: '#FFD700',
          description: '정교한 솜씨로 만들어진 물건입니다.',
          rarity: 'uncommon',
          valueMultiplier: 1.3,
          isHidden: true
        }
      ]
    }
  ];
  
  // 감정 프로세스 상태
  const [isAppraising, setIsAppraising] = useState(false);
  const [appraisalProgress, setAppraisalProgress] = useState(0);
  const [appraisalResult, setAppraisalResult] = useState<{
    actualValue: number;
    discoveredTags: any[];
  } | null>(null);
  
  // 감정 시작
  const startAppraisal = (index: number) => {
    setSelectedItemIndex(index);
    setIsAppraising(true);
    setAppraisalProgress(0);
    setAppraisalResult(null);
    
    // 감정 진행 시뮬레이션
    const timer = setInterval(() => {
      setAppraisalProgress(prev => {
        const newProgress = prev + 5;
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsAppraising(false);
          
          // 감정 결과 생성
          const item = testItems[index];
          const multiplier = item.tags.reduce((acc, tag) => acc * tag.valueMultiplier, 1);
          setAppraisalResult({
            actualValue: Math.floor(item.baseValue * multiplier),
            discoveredTags: item.tags
          });
          
          return 100;
        }
        
        return newProgress;
      });
    }, 200);
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/dev" className="back-button">← 테스트 메뉴로</Link>
        <h1>감정 시스템 테스트</h1>
      </header>
      
      <main className="app-content">
        <div className="card">
          <div className="card-header">
            <h2>감정할 아이템 선택</h2>
          </div>
          <div className="card-body">
            <div className="items-list">
              {testItems.map((item, index) => (
                <div 
                  key={item.id}
                  className={`item-row ${selectedItemIndex === index ? 'selected' : ''}`}
                  onClick={() => !isAppraising && setSelectedItemIndex(index)}
                >
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="item-tags">
                      <span className="tag">{item.category}</span>
                      <span className="tag">기본가: {item.baseValue}G</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => startAppraisal(index)}
                    disabled={isAppraising}
                  >
                    감정
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {isAppraising && selectedItemIndex !== null && (
          <div className="card mt-4">
            <div className="card-header">
              <h2>감정 진행 중</h2>
            </div>
            <div className="card-body">
              <h3>{testItems[selectedItemIndex].name} 감정 중...</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${appraisalProgress}%` }}
                />
              </div>
              <p className="text-center">{appraisalProgress}%</p>
            </div>
          </div>
        )}
        
        {appraisalResult && selectedItemIndex !== null && (
          <div className="card mt-4">
            <div className="card-header">
              <h2>감정 결과</h2>
            </div>
            <div className="card-body">
              <h3>{testItems[selectedItemIndex].name}</h3>
              <div className="result-row">
                <div className="label">기본 가치:</div>
                <div className="value">{testItems[selectedItemIndex].baseValue}G</div>
              </div>
              <div className="result-row highlight">
                <div className="label">실제 가치:</div>
                <div className="value">{appraisalResult.actualValue}G</div>
              </div>
              
              <h4>발견된 특성:</h4>
              <div className="tags-grid">
                {appraisalResult.discoveredTags.map((tag: any) => (
                  <div key={tag.id} className={`tag tag-${tag.rarity}`}>
                    <div className="tag-name">{tag.name}</div>
                    <div className="tag-multiplier">×{tag.valueMultiplier.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppraisalTest;