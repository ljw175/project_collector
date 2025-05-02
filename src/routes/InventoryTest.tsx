import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ItemCategory } from '../models/item';
import ItemSlot from '../components/ui/ItemSlot';
import TagDisplay from '../components/ui/TagDisplay';
import '../styles/components.css';
import '../styles/inventory-test.css';
import { useInventory } from '../features/inventory/hooks/useInventory';
import { categoryLabels, sortOptions, valueRangeOptions } from '../data/constants/inventory-constants';
import { getTestItemById } from '../data/items/common-items';

/**
 * 인벤토리 시스템 테스트 페이지
 */
const InventoryTest: React.FC = () => {
  // 중앙화된 인벤토리 훅 사용
  const { 
    items,
    selectedItems,
    selectedItemIds,
    filter,
    sortOption,
    totalValue,
    categoryStats,
    inventoryCapacity,
    
    addItem,
    removeItem,
    appraiseItem,
    
    toggleSelectItem,
    clearSelection,
    
    updateFilter,
    resetFilter,
    updateSortOption,
    
    service
  } = useInventory();
  
  // 선택된 아이템 (첫 번째 선택된 아이템)
  const selectedItem = selectedItems.length > 0 ? selectedItems[0] : null;
  
  // 가치 범위 필터
  const [valueRangeIndex, setValueRangeIndex] = useState(0);
  
  // 필터 토글 상태
  const [showFilters, setShowFilters] = useState(false);
  
  // 컴포넌트 마운트 시 인벤토리에 테스트 아이템 추가
  useEffect(() => {
    // 인벤토리가 비어있으면 테스트 아이템 추가
    if (items.length === 0) {
      addRandomItems(5);
    }
  }, [items]);
  
  // 랜덤 아이템 추가 (테스트용)
  const addRandomItem = (category?: ItemCategory) => {
    // 테스트 아이템 ID 목록에서 랜덤 선택
    const testItemIds = ['test-item-1', 'test-item-2', 'test-item-3', 'test-item-4', 'test-item-5'];
    const randomItemId = testItemIds[Math.floor(Math.random() * testItemIds.length)];
    const testItem = getTestItemById(randomItemId);
    
    if (testItem) {
      // 카테고리가 지정된 경우 해당 카테고리로 변경
      if (category) {
        testItem.category = category;
      }
      
      // 인벤토리에 아이템 추가
      addItem({
        ...testItem,
        id: `${testItem.id}-${Date.now()}`, // 고유한 ID 생성
      });
    }
  };
  
  // 여러 랜덤 아이템 추가 (테스트용)
  const addRandomItems = (count: number) => {
    for (let i = 0; i < count; i++) {
      addRandomItem();
    }
  };
  
  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: any) => {
    updateFilter({ [key]: value });
  };
  
  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter({ searchText: e.target.value });
  };
  
  // 카테고리 필터 변경 핸들러
  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (value === '') {
      // 모든 카테고리 선택 시 필터 제거
      updateFilter({ categories: undefined });
    } else {
      // 특정 카테고리 선택 시 해당 카테고리만 필터링
      updateFilter({ categories: [value as ItemCategory] });
    }
  };
  
  // 가치 범위 필터 변경 핸들러
  const handleValueRangeChange = (index: number) => {
    setValueRangeIndex(index);
    const range = valueRangeOptions[index];
    updateFilter({ minValue: range.min, maxValue: range.max });
  };
  
  // 감정 상태 필터 변경 핸들러
  const handleAppraisedFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (value === 'all') {
      updateFilter({ isAppraised: undefined });
    } else {
      updateFilter({ isAppraised: value === 'true' });
    }
  };
  
  // 아이템 감정 핸들러
  const handleAppraiseItem = (itemId: string) => {
    appraiseItem(itemId);
  };
  
  // 필터 초기화
  const handleResetFilters = () => {
    resetFilter();
    setValueRangeIndex(0);
  };
  
  // 선택된 아이템 세부 정보 표시
  const renderItemDetails = () => {
    if (!selectedItem) {
      return (
        <div className="details-empty">
          <div className="empty-icon">🧰</div>
          <p className="empty-message">아이템을 선택하여 세부 정보를 확인하세요.</p>
        </div>
      );
    }
    
    return (
      <div className="item-details">
        <h3 className="item-name">{selectedItem.name}</h3>
        <p className="item-description">{selectedItem.description}</p>
        
        <div className="detail-section">
          <div className="detail-row">
            <div className="detail-label">카테고리:</div>
            <div className="detail-value">
              {categoryLabels[selectedItem.category] || selectedItem.category}
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">가치:</div>
            <div className="detail-value">
              {selectedItem.isAppraised 
                ? <span className="value-appraised">{selectedItem.actualValue[0].amount}G {selectedItem.actualValue[1].amount}S {selectedItem.actualValue[2].amount}C (감정 완료)</span>
                : <span className="value-base">{selectedItem.baseValue[0].amount}G {selectedItem.baseValue[1].amount}S {selectedItem.baseValue[2].amount}C (추정)</span>
              }
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">수량:</div>
            <div className="detail-value">{selectedItem.quantity}</div>
          </div>
        </div>
        
        <div className="tags-section">
          <h4 className="section-title">태그 정보</h4>
          {selectedItem.isAppraised ? (
            selectedItem.tags.length > 0 ? (
              <div className="tags-container">
                {selectedItem.tags.map(tag => (
                  <TagDisplay key={tag.id} tag={tag} />
                ))}
              </div>
            ) : (
              <p className="no-tags-message">특별한 특성이 없습니다.</p>
            )
          ) : (
            <p className="no-appraisal-message">감정이 필요합니다.</p>
          )}
        </div>
        
        <div className="item-actions">
          <button className="action-btn use-btn">사용</button>
          <button 
            className="action-btn sell-btn"
            onClick={() => removeItem(selectedItem.id)}
          >
            판매
          </button>
          {!selectedItem.isAppraised && (
            <button 
              className="action-btn appraise-btn"
              onClick={() => handleAppraiseItem(selectedItem.id)}
            >
              감정
            </button>
          )}
        </div>
      </div>
    );
  };
  
  // 인벤토리 통계 표시
  const renderInventoryStats = () => {
    return (
      <div className="inventory-summary">
        <div className="summary-item">
          <div className="item-label">총 아이템:</div>
          <div className="item-value">{inventoryCapacity.total}/{inventoryCapacity.limit}</div>
        </div>
        <div className="summary-item">
          <div className="item-label">총 가치:</div>
          <div className="item-value">{totalValue}G</div>
        </div>
        <div className="category-summary">
          {Object.entries(categoryStats).map(([category, count]) => (
            count > 0 && (
              <div key={category} className="category-item">
                <div className="category-label">{categoryLabels[category as ItemCategory] || category}:</div>
                <div className="category-count">{count}</div>
              </div>
            )
          ))}
        </div>
      </div>
    );
  };
  
  // 필터 UI 렌더링
  const renderFilters = () => {
    if (!showFilters) {
      return (
        <div className="filter-simple">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="아이템 검색..."
              value={filter.searchText || ''}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="sort-dropdown">
            <select 
              value={sortOption} 
              onChange={e => updateSortOption(e.target.value as any)}
              className="sort-select"
            >
              {Object.entries(sortOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="filter-toggle-btn" 
            onClick={() => setShowFilters(true)}
          >
            고급 필터
          </button>
        </div>
      );
    }
    
    return (
      <div className="filter-advanced">
        <div className="filter-header">
          <h3 className="filter-title">아이템 필터</h3>
          <button 
            className="filter-toggle-btn" 
            onClick={() => setShowFilters(false)}
          >
            간단히 보기
          </button>
        </div>
        
        <div className="filter-options">
          <div className="filter-group">
            <label className="filter-label">검색어:</label>
            <input 
              type="text" 
              placeholder="아이템 검색..."
              value={filter.searchText || ''}
              onChange={handleSearchChange}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">정렬:</label>
            <select 
              value={sortOption} 
              onChange={e => updateSortOption(e.target.value as any)}
              className="filter-select"
            >
              {Object.entries(sortOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">카테고리:</label>
            <select
              value={filter.categories?.length ? filter.categories[0] : ''}
              onChange={handleCategoryFilterChange}
              className="filter-select"
            >
              <option value="">모든 카테고리</option>
              {Object.entries(categoryLabels).map(([category, label]) => (
                <option key={category} value={category}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">감정 상태:</label>
            <select
              value={filter.isAppraised === undefined ? 'all' : filter.isAppraised.toString()}
              onChange={handleAppraisedFilterChange}
              className="filter-select"
            >
              <option value="all">모든 상태</option>
              <option value="true">감정 완료</option>
              <option value="false">미감정</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">가치 범위:</label>
            <div className="range-buttons">
              {valueRangeOptions.map((range, index) => (
                <button
                  key={index}
                  className={`range-btn ${valueRangeIndex === index ? 'active' : ''}`}
                  onClick={() => handleValueRangeChange(index)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-actions">
            <button 
              className="reset-btn"
              onClick={handleResetFilters}
            >
              필터 초기화
            </button>
          </div>
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
        {/* 인벤토리 통계 */}
        {renderInventoryStats()}
        
        {/* 필터 및 검색 */}
        {renderFilters()}

        {/* 테스트용 아이템 추가 버튼 */}
        <div className="test-actions">
          <button className="add-item-btn primary" onClick={() => addRandomItem()}>
            랜덤 아이템 추가
          </button>
          <div className="category-buttons">
            {Object.entries(categoryLabels).map(([category, label]) => (
              <button 
                key={category}
                className="add-item-btn" 
                onClick={() => addRandomItem(category as ItemCategory)}
              >
                {label} 추가
              </button>
            ))}
          </div>
        </div>
        
        {/* 인벤토리 및 아이템 상세 정보 */}
        <div className="inventory-container">
          <div className="inventory-grid">
            {items.length > 0 ? (
              items.map(item => (
                <div 
                  key={item.id}
                  className={`inventory-slot ${selectedItemIds.includes(item.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelectItem(item.id)}
                >
                  <ItemSlot 
                    item={item} 
                    count={item.quantity}
                    isSelected={selectedItemIds.includes(item.id)}
                  />
                </div>
              ))
            ) : (
              <div className="empty-inventory">
                <div className="empty-icon">📦</div>
                <p className="empty-message">인벤토리가 비어있습니다. 아이템을 추가해보세요.</p>
              </div>
            )}
          </div>
          
          <div className="details-panel">
            <div className="details-header">
              <h2 className="panel-title">아이템 상세 정보</h2>
            </div>
            <div className="details-content">
              {renderItemDetails()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryTest;