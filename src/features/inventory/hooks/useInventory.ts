/**
 * 인벤토리 관리를 위한 커스텀 훅
 */
import { useState, useMemo, useCallback } from 'react';
import { useGameState } from '@store/gameContext';
import { Item, isAppraised } from '@models/item';
import { InventoryFilter, InventorySortOption } from '../types/inventory_types';

export function useInventory() {
  const { state, dispatch } = useGameState();
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<InventoryFilter>({});
  const [sortOption, setSortOption] = useState<InventorySortOption>('recent');

  // 인벤토리 아이템 필터링
  const filteredItems = useMemo(() => {
    let result = [...state.inventory];

    // 텍스트 검색
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchLower) || 
        item.description.toLowerCase().includes(searchLower)
      );
    }

    // 카테고리 필터
    if (filter.categories && filter.categories.length > 0) {
      result = result.filter(item => 
        filter.categories?.includes(item.category)
      );
    }

    // 감정 상태 필터
    if (filter.isAppraised !== undefined) {
      result = result.filter(item => 
        item.isAppraised === filter.isAppraised
      );
    }

    // 가치 범위 필터
    if (filter.minValue !== undefined || filter.maxValue !== undefined) {
      result = result.filter(item => {
        const value = isAppraised(item) ? item.actualValue : item.baseValue;
        
        if (filter.minValue !== undefined && value < filter.minValue) {
          return false;
        }
        
        if (filter.maxValue !== undefined && value > filter.maxValue) {
          return false;
        }
        
        return true;
      });
    }

    // 태그 필터
    if (filter.tags && filter.tags.length > 0) {
      result = result.filter(item => 
        item.tags.some(tag => filter.tags?.includes(tag.id))
      );
    }

    return result;
  }, [state.inventory, filter]);

  // 아이템 정렬
  const sortedItems = useMemo(() => {
    const items = [...filteredItems];

    switch (sortOption) {
      case 'name-asc':
        return items.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'name-desc':
        return items.sort((a, b) => b.name.localeCompare(a.name));
      
      case 'value-asc':
        return items.sort((a, b) => {
          const valueA = isAppraised(a) ? a.actualValue : a.baseValue;
          const valueB = isAppraised(b) ? b.actualValue : b.baseValue;
          return valueA - valueB;
        });
      
      case 'value-desc':
        return items.sort((a, b) => {
          const valueA = isAppraised(a) ? a.actualValue : a.baseValue;
          const valueB = isAppraised(b) ? b.actualValue : b.baseValue;
          return valueB - valueA;
        });
      
      case 'category':
        return items.sort((a, b) => a.category.localeCompare(b.category));
      
      case 'quantity':
        return items.sort((a, b) => b.quantity - a.quantity);
      
      case 'appraised':
        return items.sort((a, b) => {
          if (a.isAppraised === b.isAppraised) return 0;
          return a.isAppraised ? -1 : 1;
        });
      
      case 'recent':
      default:
        // 여기서는 ID로 정렬 (실제로는 획득 시간 필드가 있을 수 있음)
        return items.sort((a, b) => b.id.localeCompare(a.id));
    }
  }, [filteredItems, sortOption]);

  // 아이템 선택
  const selectItem = useCallback((itemId: string) => {
    setSelectedItemIds(prev => [...prev, itemId]);
  }, []);

  // 아이템 선택 해제
  const deselectItem = useCallback((itemId: string) => {
    setSelectedItemIds(prev => prev.filter(id => id !== itemId));
  }, []);

  // 선택 토글
  const toggleSelectItem = useCallback((itemId: string) => {
    setSelectedItemIds(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  }, []);

  // 모든 아이템 선택
  const selectAllItems = useCallback(() => {
    setSelectedItemIds(sortedItems.map(item => item.id));
  }, [sortedItems]);

  // 모든 선택 해제
  const clearSelection = useCallback(() => {
    setSelectedItemIds([]);
  }, []);

  // 필터 설정
  const updateFilter = useCallback((newFilter: Partial<InventoryFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  // 필터 초기화
  const resetFilter = useCallback(() => {
    setFilter({});
  }, []);

  // 정렬 옵션 설정
  const updateSortOption = useCallback((option: InventorySortOption) => {
    setSortOption(option);
  }, []);

  // 현재 선택된 아이템들
  const selectedItems = useMemo(() => {
    return sortedItems.filter(item => selectedItemIds.includes(item.id));
  }, [sortedItems, selectedItemIds]);

  // 아이템 추가 (수집 시)
  const addItem = useCallback((item: Item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, [dispatch]);

  // 아이템 제거 (판매 시)
  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  }, [dispatch]);

  // 여러 아이템 일괄 제거
  const removeItems = useCallback((itemIds: string[]) => {
    itemIds.forEach(id => {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    });
    setSelectedItemIds(prev => prev.filter(id => !itemIds.includes(id)));
  }, [dispatch]);

  // 아이템 감정
  const appraiseItem = useCallback((itemId: string) => {
    dispatch({ type: 'APPRAISE_ITEM', payload: itemId });
  }, [dispatch]);

  return {
    // 데이터
    items: sortedItems,
    selectedItems,
    selectedItemIds,
    filter,
    sortOption,
    
    // 아이템 관리 함수
    addItem,
    removeItem,
    removeItems,
    appraiseItem,
    
    // 선택 관리 함수
    selectItem,
    deselectItem,
    toggleSelectItem,
    selectAllItems,
    clearSelection,
    
    // 필터/정렬 함수
    updateFilter,
    resetFilter,
    updateSortOption,
  };
}