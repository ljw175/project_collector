/**
 * 인벤토리 관리를 위한 커스텀 훅
 */
import { useState, useMemo, useCallback } from 'react';
import { useGameState } from '@store/gameContext';
import { Item, isAppraised } from '@models/item';
import { InventoryFilter, InventorySortOption } from '../types/inventory_types';
import { inventoryService } from '@/services/inventory/inventory_service_index';

export function useInventory() {
  const { state, dispatch } = useGameState();
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<InventoryFilter>({ searchText: '', categories: [], isAppraised: false, minValue: 0, maxValue: 0, tags: [] });
  const [sortOption, setSortOption] = useState<InventorySortOption>('recent');

  // 인벤토리 아이템 필터링 - 서비스 사용
  const filteredItems = useMemo(() => {
    return inventoryService.filterItems(state.inventory, filter);
  }, [state.inventory, filter]);

  // 아이템 정렬 - 서비스 사용
  const sortedItems = useMemo(() => {
    return inventoryService.sortItems(filteredItems, sortOption);
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
    setFilter({ searchText: '', categories: [], isAppraised: false, minValue: 0, maxValue: 0, tags: [] });
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
    // 인벤토리 용량 확인
    if (inventoryService.isInventoryFull(state.inventory)) {
      // 용량 초과 시 처리 로직 (실제 구현에서는 알림 등이 필요)
      console.warn('인벤토리 용량 초과');
      return false;
    }
    
    dispatch({ type: 'ADD_ITEM', payload: item });
    return true;
  }, [dispatch, state.inventory]);

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
    const item = state.inventory.find(item => item.id === itemId);
    if (!item || item.isAppraised) return;

    dispatch({ type: 'APPRAISE_ITEM', payload: { itemId, discoveredTags: [], actualValue: [], convertedActualValue: 0, condition: 0, tool: 'none' } });
  }, [dispatch]);
  
  // 인벤토리 총 가치 계산
  const totalValue = useMemo(() => {
    return inventoryService.calculateTotalValue(state.inventory);
  }, [state.inventory]);
  
  // 카테고리별 통계
  const categoryStats = useMemo(() => {
    return inventoryService.getCategoryStats(state.inventory);
  }, [state.inventory]);
  
  // 인벤토리 용량 정보
  const inventoryCapacity = useMemo(() => {
    const total = state.inventory.reduce((count, item) => count + item.quantity, 0);
    const limit = inventoryService.getInventoryCapacityLimit('basic');
    return { total, limit, isFull: total >= limit };
  }, [state.inventory]);

  return {
    // 데이터
    items: sortedItems,
    selectedItems,
    selectedItemIds,
    filter,
    sortOption,
    totalValue,
    categoryStats,
    inventoryCapacity,
    
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
    
    // 서비스 접근
    service: inventoryService
  };
}