import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Item, ItemCategory } from '../models/item';
import ItemSlot from '../components/ui/ItemSlot';
import '../styles/components.css';

/**
 * 인벤토리 시스템 테스트 페이지
 */
const InventoryTest: React.FC = () => {
  // 정렬 옵션
  const [sortOption, setSortOption] = useState('recent');
  
  // 카테고리 필터
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | null>(null);
  
  // 검색어
  const [searchQuery, setSearchQuery] = useState('');
  
  // 테스트용 인벤토리 아이템 목록
  const testItems: Item[] = [
    {
      id: 'test-item-1',
      name: '오래된 은단검',
      description: '고대 장인이 만든 것으로 보이는 섬세한 무늬가 새겨진 은단검입니다.',
      condition: 100,
      baseValue: 150,
      actualValue: 375, // 감정 완료 상태
      isAppraised: true,
      category: ItemCategory.WEAPON,
      quantity: 1,
      tags: [
        {
          id: 'tag-1',
          name: '고대의',
          icon: '/assets/tags/ancient.png',
          color: '#FFD700',
          description: '고대 시대에 만들어진 물건입니다.',
          rarity: 'rare',
          valueMultiplier: 2.5,
          isHidden: false
        }
      ],
      hiddenTags: []
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
    },
    {
      id: 'test-item-4',
      name: '구리 동전',
      description: '오래된 구리 동전으로, 표면에 마모된 형상이 있습니다.',
      baseValue: 5,
      isAppraised: false,
      category: ItemCategory.MATERIAL,
      quantity: 12,
      tags: [],
      hiddenTags: []
    },
    {
      id: 'test-item-5',
      name: '낡은 책',
      description: '표지가 닳은 오래된 책으로, 희미하게 문자를 읽을 수 있습니다.',
      condition: 80,
      baseValue: 50,
      actualValue: 65,
      isAppraised: true,
      category: ItemCategory.BOOK,
      quantity: 1,
      tags: [
        {
          id: 'tag-5',
          name: '학술적인',
          icon: '/assets/tags/academic.png',
          color: '#8A2BE2',
          description: '학문적 가치가 있는 아이템입니다.',
          rarity: 'common',
          valueMultiplier: 1.3,
          isHidden: false
        }
      ],
      hiddenTags: []
    }
  ];
  
  // 선택된 아이템
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // 필터링 및 정렬 적용
  const filteredItems = testItems
    .filter(item => {
      // 카테고리 필터
      if (categoryFilter && item.category !== categoryFilter) {
        return false;
      }
      
      // 검색어 필터
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // 정렬 적용
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'value-asc':
          return (a.isAppraised ? a.actualValue : a.baseValue) - (b.isAppraised ? b.actualValue : b.baseValue);
        case 'value-desc':
          return (b.isAppraised ? b.actualValue : b.baseValue) - (a.isAppraised ? a.actualValue : a.baseValue);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'quantity':
          return b.quantity - a.quantity;
        case 'appraised':
          return (b.isAppraised ? 1 : 0) - (a.isAppraised ? 1 : 0);
        default: // recent
          return 0; // 실제로는 획득 시간에 따라 정렬
      }
    });
  
  // 선택된 아이템 세부 정보 표시
  const renderItemDetails = () => {
    if (!selectedItem) {
      return (
        <div className="text-muted">
          <p>아이템을 선택하여 세부 정보를 확인하세요.</p>
        </div>
      );
    }
    
    return (
      <div className="item-details">
        <h3>{selectedItem.name}</h3>
        <p>{selectedItem.description}</p>
        
        <div className="detail-row">
          <div className="label">카테고리:</div>
          <div className="value">{selectedItem.category}</div>
        </div>
        
        <div className="detail-row">
          <div className="label">가치:</div>
          <div className="value">
            {selectedItem.isAppraised 
              ? `${selectedItem.actualValue}G (감정 완료)`
              : `${selectedItem.baseValue}G (추정)`
            }
          </div>
        </div>
        
        <div className="detail-row">
          <div className="label">수량:</div>
          <div className="value">{selectedItem.quantity}</div>
        </div>
        
        <div className="detail-section">
          <h4>태그 정보</h4>
          {selectedItem.isAppraised ? (
            selectedItem.tags.length > 0 ? (
              <div className="tags-grid">
                {selectedItem.tags.map(tag => (
                  <div key={tag.id} className={`tag tag-${tag.rarity}`}>
                    <div className="tag-name">{tag.name}</div>
                    <div className="tag-multiplier">×{tag.valueMultiplier.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">특별한 특성이 없습니다.</p>
            )
          ) : (
            <p className="text-muted">감정이 필요합니다.</p>
          )}
        </div>
        
        <div className="action-buttons mt-4">
          <button className="btn">사용</button>
          <button className="btn">판매</button>
          {!selectedItem.isAppraised && (
            <button className="btn btn-primary">감정</button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/dev" className="back-button">← 테스트 메뉴로</Link>
        <h1>인벤토리 테스트</h1>
      </header>
      
      <main className="app-content">
        <div className="inventory-controls">
          <div className="search-filter">
            <input 
              type="text" 
              placeholder="아이템 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-control"
            />
          </div>
          
          <div className="sort-filter">
            <select 
              value={sortOption} 
              onChange={e => setSortOption(e.target.value)}
              className="form-control"
            >
              <option value="recent">최근 획득순</option>
              <option value="name-asc">이름 (오름차순)</option>
              <option value="name-desc">이름 (내림차순)</option>
              <option value="value-asc">가치 (오름차순)</option>
              <option value="value-desc">가치 (내림차순)</option>
              <option value="category">카테고리별</option>
              <option value="quantity">수량순</option>
              <option value="appraised">감정 상태별</option>
            </select>
          </div>
          
          <div className="category-filter">
            <select
              value={categoryFilter || ''}
              onChange={e => setCategoryFilter(e.target.value ? e.target.value as ItemCategory : null)}
              className="form-control"
            >
              <option value="">모든 카테고리</option>
              {Object.values(ItemCategory).map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="inventory-container">
          <div className="inventory-grid">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={selectedItem?.id === item.id ? 'selected' : ''}
              >
                <ItemSlot 
                  item={item} 
                  count={item.quantity}
                  isSelected={selectedItem?.id === item.id}
                />
              </div>
            ))}
          </div>
          
          <div className="inventory-details">
            <div className="card">
              <div className="card-header">
                <h2>아이템 상세 정보</h2>
              </div>
              <div className="card-body">
                {renderItemDetails()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryTest;