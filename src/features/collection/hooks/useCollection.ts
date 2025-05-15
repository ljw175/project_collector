/**
 * 수집(Collection) 기능을 위한 커스텀 훅
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useGameState } from '@store/gameContext';
import { Item, ItemCategory } from '@models/item';
import { 
  CollectionEvent, 
  CollectionOptions, 
  ItemDiscoveryResult 
} from '../types/collection_types';
import { collectionService } from '@/services/collection/collection_service_index';

export function useCollection() {
  const { state, dispatch } = useGameState();
  const [activeEvents, setActiveEvents] = useState<CollectionEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CollectionEvent | null>(null);
  const [discoveredItems, setDiscoveredItems] = useState<Item[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [collectionOptions, setCollectionOptions] = useState<CollectionOptions>({
    thoroughness: 'casual'
  });
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectionResults, setCollectionResults] = useState<ItemDiscoveryResult[]>([]);

  // 사용 가능한 수집 이벤트 로드
  const loadEvents = useCallback(() => {
    // 중앙화된 서비스에서 이벤트 데이터 로드
    const events = collectionService.getActiveEvents();
    setActiveEvents(events);
    return events;
  }, []);

  // 이벤트 선택
  const selectEvent = useCallback((eventId: string) => {
    const event = activeEvents.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setDiscoveredItems([]);
      setSelectedItemIds([]);
      setCollectionResults([]);
    }
  }, [activeEvents]);

  // 수집 옵션 변경
  const updateOptions = useCallback((newOptions: Partial<CollectionOptions>) => {
    setCollectionOptions(prev => ({
      ...prev,
      ...newOptions
    }));
  }, []);

  // 수집 시작
  const startCollection = useCallback(() => {
    if (!selectedEvent || isCollecting) return;
    
    // 참여 가능 여부 확인 (중앙화된 서비스 사용)
    if (!collectionService.canParticipateEvent(
        selectedEvent, 
        state.player.status.convertedMoney, 
        state.player.reputation[0].relationshipLevel // 수정 필요
    )) {
      return false;
    }
    
    // 진입 비용 지불
    if (selectedEvent.costToEnter) {
      dispatch({ type: 'UPDATE_CONVERTED_MONEY', payload: -selectedEvent.costToEnter });
    }
    
    setIsCollecting(true);
    
    // 중앙화된 서비스를 통해 아이템 생성
    const discoveryResults = collectionService.generateItems(selectedEvent, collectionOptions);
    
    // 수집 완료 처리
    setTimeout(() => {
      completeCollection(discoveryResults);
    }, 1000); // 1초 후 완료 (실제로는 더 오래 걸리거나 UI 이벤트에 따라 달라짐)
    
    return true;
  }, [selectedEvent, isCollecting, state.player, collectionOptions, dispatch]);

  // 수집 완료
  const completeCollection = useCallback((results: ItemDiscoveryResult[]) => {
    setIsCollecting(false);
    setCollectionResults(results);
    
    // 발견한 아이템 추가
    const newItems = results.map(result => result.item);
    setDiscoveredItems(newItems);
  }, []);

  // 아이템 선택 토글
  const toggleSelectItem = useCallback((itemId: string) => {
    setSelectedItemIds(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);

  // 선택한 아이템 획득
  const acquireSelectedItems = useCallback(() => {
    if (selectedItemIds.length === 0) return;
    
    // 선택한 아이템 수집
    const itemsToAcquire = discoveredItems.filter(item => 
      selectedItemIds.includes(item.id)
    );
    
    // 인벤토리에 추가
    itemsToAcquire.forEach(item => {
      dispatch({ type: 'ADD_ITEM', payload: item });
    });
    
    // 결과 재설정
    setDiscoveredItems([]);
    setSelectedItemIds([]);
    setCollectionResults([]);
    
    return true;
  }, [selectedItemIds, discoveredItems, collectionResults, dispatch]);

  // 수집 가능한지 확인
  const canStartCollection = useMemo(() => {
    if (!selectedEvent || isCollecting) return false;
    
    // 서비스 레이어를 통한 참여 가능 여부 확인
    return collectionService.canParticipateEvent(
      selectedEvent,
      state.player.status.convertedMoney,
      state.player.reputation[0].relationshipLevel // 수정 필요
    );
  }, [selectedEvent, isCollecting, state.player]);

  // 초기 데이터 로드
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    activeEvents,
    selectedEvent,
    discoveredItems,
    selectedItemIds,
    collectionOptions,
    isCollecting,
    collectionResults,
    canStartCollection,
    
    loadEvents,
    selectEvent,
    updateOptions,
    startCollection,
    toggleSelectItem,
    acquireSelectedItems
  };
}