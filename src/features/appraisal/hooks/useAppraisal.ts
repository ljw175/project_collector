/**
 * 감정(Appraisal) 기능을 위한 커스텀 훅
 */
import { useState, useCallback, useMemo } from 'react';
import { useGameState } from '@store/gameContext';
import { Item } from '@models/item';
import { AppraisalOptions, AppraisalResult, AppraisalState } from '../types/appraisal_types';
import { appraisalService } from '@/services/appraisal/appraisal_service_index';
import { ExpertiseLevel } from '@/models';
import { expertiseSkills } from '@/data/expertise/skills';

export function useAppraisal() {
  const { state, dispatch } = useGameState();
  const [appraisalState, setAppraisalState] = useState<AppraisalState>('idle');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [options, setOptions] = useState<AppraisalOptions>({
    thoroughness: 'standard',
    focusArea: 'condition',
    tool: 'none',
    useSpecialTool: false,
    playerExpertise: ExpertiseLevel.BEGINNER // 기본 전문성 레벨
  });
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AppraisalResult | null>(null);

  // 플레이어의 습득 스킬 목록 가져오기
  const playerSkills = useMemo(() => {
    return state.player.expertise ? 
      Object.keys(state.player.expertise)
        .flatMap(category => {
          // 카테고리별 스킬 중 플레이어 레벨보다 낮거나 같은 레벨의 스킬 ID만 추출
          const playerLevel = state.player.expertise[category as keyof typeof state.player.expertise]?.level || 0;
          return expertiseSkills
            .filter(skill => 
              skill.category === category && 
              skill.level <= playerLevel)
            .map(skill => skill.id);
        }) : [];
  }, [state.player.expertise]);

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
    
    // 감정 시간 계산 (playerSkills 전달)
    const playerExpertiseData = {
      skills: playerSkills,
      level: state.player.expertise[item.category]?.level || 0
    };
    
    const timeRequired = appraisalService.calculateAppraisalTime(
      item, 
      options,
      playerExpertiseData
    );
    
    // 진행 상태 업데이트 타이머 설정
    const progressInterval = 100; // ms
    const progressStep = 100 / (timeRequired * (1000 / progressInterval));
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + progressStep;
        
        if (newProgress >= 100) {
          clearInterval(timer);
          completeAppraisal(item);
          return 100;
        }
        
        return newProgress;
      });
    }, progressInterval);
    
    // 시연용으로 빠르게 처리
    setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      completeAppraisal(item);
    }, timeRequired * 200); // 실제 시간보다 빠르게 처리
    
  }, [selectedItemId, appraisalState, options, state.inventory, state.player.expertise, playerSkills]);

  // 감정 완료 처리
  const completeAppraisal = useCallback((item: Item) => {
    if (!item || item.isAppraised) return;
    
    // 플레이어 전문성 데이터 구성
    const playerExpertiseData = {
      skills: playerSkills,
      level: state.player.expertise[item.category]?.level || 0
    };
    
    // 중앙화된 서비스를 통해 감정 결과 생성
    const appraisalResult = appraisalService.generateFullAppraisalResult(
      item,
      options,
      playerExpertiseData
    );
    
    setResult(appraisalResult);
    setAppraisalState('complete');
    
    // 게임 상태 업데이트
    dispatch({
      type: 'APPRAISE_ITEM',
      payload: {
        itemId: item.id,
        discoveredTags: appraisalResult.discoveredTags.map(tag => String(tag)),
        convertedActualValue: appraisalResult.convertedActualValue,
        actualValue: appraisalResult.actualValue,
        condition: appraisalResult.condition,
        tool: options.tool,
        history: appraisalResult.history
      }
    });
    
  }, [options, playerSkills, state.player.expertise, dispatch]);

  // 감정 취소
  const cancelAppraisal = useCallback(() => {
    if (appraisalState === 'examining') {
      setAppraisalState('idle');
      setProgress(0);
    }
  }, [appraisalState]);

  // 빠른 감정 수행 (즉시 결과 반환)
  const performQuickAppraisal = useCallback((itemId: string) => {
    const item = state.inventory.find(item => item.id === itemId);
    if (!item || item.isAppraised) return;
    
    // 플레이어 전문성 데이터 구성
    const playerExpertiseData = {
      skills: playerSkills,
      level: state.player.expertise[item.category]?.level || 0
    };
    
    // 중앙화된 서비스를 통해 빠른 감정 결과 생성
    const quickResult = appraisalService.performQuickAppraisal(
      item, 
      playerExpertiseData
    );
    
    // 게임 상태 업데이트
    dispatch({
      type: 'APPRAISE_ITEM',
      payload: {
        itemId: item.id,
        discoveredTags: quickResult.discoveredTags.map(tag => String(tag)),
        convertedActualValue: quickResult.convertedActualValue,
        actualValue: quickResult.actualValue,
        condition: quickResult.condition,
        history: quickResult.history,
        tool: 'none'
      }
    });
    
    return quickResult;
  }, [state.inventory, playerSkills, state.player.expertise, dispatch]);

  // 감정 비용 계산
  const calculateCost = useCallback((itemId: string, appraisalOptions: AppraisalOptions) => {
    const item = state.inventory.find(item => item.id === itemId);
    if (!item) return 0;
    
    return appraisalService.calculateAppraisalCost(item, appraisalOptions);
  }, [state.inventory]);

  // 카테고리에 적합한 도구 추천
  const recommendTool = useCallback((itemId: string) => {
    const item = state.inventory.find(item => item.id === itemId);
    if (!item) return null;
    
    return appraisalService.recommendToolForCategory(item.category);
  }, [state.inventory]);

  return {
    appraisalState,
    selectedItemId,
    options,
    progress,
    result,
    selectItem,
    updateOptions,
    startAppraisal,
    cancelAppraisal,
    performQuickAppraisal,
    calculateCost,
    recommendTool,
    service: appraisalService
  };
}