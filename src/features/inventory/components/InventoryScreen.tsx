/**
 * 인벤토리 화면 컴포넌트
 */
import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { ItemCategory } from '@models/item';

// 인벤토리 필터 컴포넌트
const InventoryFilter: React.FC = () => {
  const { filter, updateFilter, resetFilter } = useInventory();
  const [searchText, setSearchText] = useState(filter.searchText || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({ searchText });
  };

  const handleCategoryFilter = (category: ItemCategory) => {
    const categories = filter.categories || [];
    if (categories.includes(category)) {
      updateFilter({ 
        categories: categories.filter(c => c !== category) 
      });
    } else {
      updateFilter({ 
        categories: [...categories, category] 
      });
    }
  };

  const handleAppraisedFilter = (value: boolean | undefined) => {
    updateFilter({ isAppraised: value });
  };

  return (
    <div className="inventory-filter">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="아이템 검색..."
        />
        <button type="submit">검색</button>
      </form>

      <div className="category-filters">
        {Object.values(ItemCategory).map(category => (
          <button
            key={category}
            className={filter.categories?.includes(category) ? 'active' : ''}
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="appraisal-filters">
        <button 
          className={filter.isAppraised === true ? 'active' : ''}
          onClick={() => handleAppraisedFilter(
            filter.isAppraised === true ? undefined : true
          )}
        >
          감정됨
        </button>
        <button 
          className={filter.isAppraised === false ? 'active' : ''}
          onClick={() => handleAppraisedFilter(
            filter.isAppraised === false ? undefined : false
          )}
        >
          미감정
        </button>
      </div>

      <button onClick={resetFilter}>필터 초기화</button>
    </div>
  );
};

// 인벤토리 정렬 컴포넌트
const InventorySort: React.FC = () => {
  const { sortOption, updateSortOption } = useInventory();

  const sortOptions = [
    { value: 'recent', label: '최근 획득순' },
    { value: 'name-asc', label: '이름 (오름차순)' },
    { value: 'name-desc', label: '이름 (내림차순)' },
    { value: 'value-asc', label: '가치 (오름차순)' },
    { value: 'value-desc', label: '가치 (내림차순)' },
    { value: 'category', label: '카테고리별' },
    { value: 'quantity', label: '수량순' },
    { value: 'appraised', label: '감정 상태별' }
  ];

  return (
    <div className="inventory-sort">
      <select 
        value={sortOption} 
        onChange={(e) => updateSortOption(e.target.value as any)}
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// 아이템 슬롯 컴포넌트
const ItemSlot: React.FC<{
  name: string;
  isAppraised: boolean;
  value: number;
  category: ItemCategory;
  quantity: number;
  selected: boolean;
  onSelect: () => void;
}> = ({ 
  name, 
  isAppraised, 
  value, 
  category, 
  quantity, 
  selected, 
  onSelect 
}) => {
  return (
    <div 
      className={`item-slot ${isAppraised ? 'appraised' : ''} ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      data-state={quantity > 1 ? 'stack' : 'single'}
      data-count={quantity > 1 ? quantity : undefined}
    >
      <div className="item-icon">
        {/* 아이템 아이콘 */}
        <span className="category-icon">{category.charAt(0)}</span>
      </div>
      <div className="item-name">{name}</div>
      {isAppraised && <div className="item-value">{value}</div>}
      {!isAppraised && <div className="item-status">?</div>}
    </div>
  );
};

// 인벤토리 액션 바 컴포넌트
const InventoryActions: React.FC = () => {
  const { 
    selectedItems, 
    selectedItemIds, 
    clearSelection, 
    removeItems, 
    appraiseItem 
  } = useInventory();

  const handleAppraise = () => {
    // 하나의 아이템만 감정 가능
    if (selectedItemIds.length === 1) {
      appraiseItem(selectedItemIds[0]);
    }
  };

  const handleSell = () => {
    // 선택된 아이템 판매
    if (selectedItemIds.length > 0) {
      removeItems(selectedItemIds);
      // 실제로는 판매 로직이 추가되어야 함
    }
  };

  return (
    <div className="inventory-actions">
      <button 
        onClick={handleAppraise} 
        disabled={selectedItemIds.length !== 1 || selectedItems[0]?.isAppraised}
      >
        감정
      </button>
      <button 
        onClick={handleSell} 
        disabled={selectedItemIds.length === 0}
      >
        판매
      </button>
      <button 
        onClick={clearSelection} 
        disabled={selectedItemIds.length === 0}
      >
        선택 해제
      </button>
    </div>
  );
};

// 메인 인벤토리 컴포넌트
export const InventoryScreen: React.FC = () => {
  const { items, selectedItemIds, toggleSelectItem } = useInventory();

  return (
    <div className="inventory-screen">
      <h1>인벤토리</h1>

      <div className="inventory-header">
        <InventoryFilter />
        <InventorySort />
      </div>

      <div className="inventory">
        <div className="item-grid">
          {items.map(item => (
            <ItemSlot
              key={item.id}
              name={item.name}
              isAppraised={item.isAppraised}
              value={item.isAppraised ? (item as any).actualValue : item.baseValue}
              category={item.category}
              quantity={item.quantity}
              selected={selectedItemIds.includes(item.id)}
              onSelect={() => toggleSelectItem(item.id)}
            />
          ))}
        </div>
      </div>

      <InventoryActions />
    </div>
  );
};