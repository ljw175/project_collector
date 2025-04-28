/**
 * 감정(Appraisal) 기능을 위한 커스텀 훅
 */
import { useState, useCallback } from 'react';
import { useGameState } from '@store/gameContext';
import { Item, isAppraised, ItemTag } from '@models/item';
import { AppraisalOptions, AppraisalResult, AppraisalState } from '../types/appraisal_types';

export function useAppraisal() {
  const { state, dispatch } = useGameState();
  const [appraisalState, setAppraisalState] = useState<AppraisalState>('idle');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [options, setOptions] = useState<AppraisalOptions>({
    thoroughness: 'standard'
  });
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AppraisalResult | null>(null);

  // 아이템 선택
  const selectItem = useCallback((itemId: string) => {
    const item = state.inventory.find(item => item.id === itemId);
    
    if (item && !item.isAppraised) {
      setSelectedItemId(itemId);
      setAppraisalState('idle');
      setResult(null);
    }
  }, [state.inventory]);

  // 감정 옵션 변경
  const updateOptions = useCallback((newOptions: Partial<AppraisalOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  // 감정 시작
  const startAppraisal = useCallback(() => {
    if (!selectedItemId || appraisalState !== 'idle') return;
    
    const item = state.inventory.find(item => item.id === selectedItemId);
    if (!item || item.isAppraised) return;
    
    setAppraisalState('examining');
    setProgress(0);
    
    // 실제 구현에서는 여기서 감정 진행 상태를 업데이트하는 타이머 등을 설정
    // 예제로 타이머 생략하고 즉시 완료로 가정
    
    const timeRequired = calculateAppraisalTime(options, item);
    
    // 감정 시뮬레이션 - 실제로는 타이머나 애니메이션으로 처리
    setTimeout(() => {
      completeAppraisal();
    }, timeRequired * 1000); // 시연용으로 빠르게 처리
    
  }, [selectedItemId, appraisalState, options, state.inventory]);

  // 감정 완료 처리
  const completeAppraisal = useCallback(() => {
    if (!selectedItemId) return;
    
    const item = state.inventory.find(item => item.id === selectedItemId);
    if (!item || item.isAppraised) return;
    
    // 감정 결과 생성 (실제로는 더 복잡한 로직이 필요)
    const discoveredTags = generateAppraisalResults(item, options);
    const actualValue = calculateActualValue(item, discoveredTags);
    
    // 결과 설정
    const appraisalResult: AppraisalResult = {
      itemId: selectedItemId,
      discoveredTags,
      actualValue,
      condition: Math.floor(Math.random() * 40) + 60, // 60-100 사이 랜덤 값
      timeSpent: calculateAppraisalTime(options, item)
    };
    
    setResult(appraisalResult);
    setAppraisalState('complete');
    
    // 게임 상태 업데이트
    dispatch({ type: 'APPRAISE_ITEM', payload: selectedItemId });
    
  }, [selectedItemId, options, state.inventory, dispatch]);

  // 감정 취소
  const cancelAppraisal = useCallback(() => {
    if (appraisalState === 'examining') {
      setAppraisalState('idle');
      setProgress(0);
    }
  }, [appraisalState]);

  // 감정 시간 계산 (내부 헬퍼 함수)
  const calculateAppraisalTime = (options: AppraisalOptions, item: Item): number => {
    let baseTime = 30; // 기본 30초
    
    // 꼼꼼함 정도에 따른 시간 조정
    switch (options.thoroughness) {
      case 'quick':
        baseTime *= 0.5;
        break;
      case 'thorough':
        baseTime *= 2;
        break;
    }
    
    // 특수 도구 사용 시 시간 절약
    if (options.useSpecialTool) {
      baseTime *= 0.7;
    }
    
    // 아이템 복잡도, 희귀도 등에 따른 시간 조정
    if (item.tags.length > 2) {
      baseTime *= 1.2; // 더 많은 태그가 있는 복잡한 아이템은 더 많은 시간 소요
    }
    
    return Math.round(baseTime);
  };

  // 감정 결과 생성 (내부 헬퍼 함수)
  const generateAppraisalResults = (item: Item, _options: AppraisalOptions): ItemTag[] => {
    // 실제 구현에서는 여기서 플레이어의 전문성, 아이템 태그 등을 고려하여
    // 발견된 태그들을 결정해야 함
    
    // 시연용 더미 데이터
    if (!isAppraised(item)) {
      return item.hiddenTags;
    }
    
    return [];
  };

  // 실제 가치 계산 (내부 헬퍼 함수)
  const calculateActualValue = (item: Item, discoveredTags: ItemTag[]): number => {
    let value = item.baseValue;
    
    // 태그에 따른 가치 수정
    discoveredTags.forEach(tag => {
      value *= tag.valueMultiplier;
    });
    
    // 실제로는 여기서 플레이어의 전문성, 감정 정확도 등을 고려할 필요가 있음
    
    return Math.round(value);
  };

  return {
    appraisalState,
    selectedItemId,
    options,
    progress,
    result,
    selectItem,
    updateOptions,
    startAppraisal,
    cancelAppraisal
  };
}