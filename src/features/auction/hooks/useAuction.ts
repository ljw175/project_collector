/**
 * 경매(Auction) 기능을 위한 커스텀 훅
 */
import { useState, useCallback, useEffect } from 'react';
import { useGameState } from '@store/gameContext';
import { 
  AuctionItem, 
  AuctionStatus, 
  AuctionParticipant, 
  BidRecord, 
  AuctionRound 
} from '../types/auction_types';

export function useAuction() {
  const { state, dispatch } = useGameState();
  const [auctionStatus, setAuctionStatus] = useState<AuctionStatus>('scheduled');
  const [currentRound, setCurrentRound] = useState<AuctionRound | null>(null);
  const [participants, setParticipants] = useState<AuctionParticipant[]>([]);
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [bidHistory, setBidHistory] = useState<BidRecord[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // 경매 시작
  const startAuction = useCallback((auctionId: string) => {
    // 실제 구현에서는 서버에서 경매 데이터를 가져오거나, 
    // 경매 데이터를 생성하는 로직이 추가되어야 함
    const auction = state.upcomingAuctions.find(a => a.id === auctionId);
    if (!auction) return;

    // 참가자 설정 (플레이어 + NPC)
    const newParticipants: AuctionParticipant[] = [
      { 
        id: state.player.id, 
        name: state.player.name, 
        isPlayer: true 
      },
      // NPCs - 실제 구현에서는 더 복잡한 로직으로 생성
      { 
        id: 'npc1', 
        name: '호기심 많은 수집가', 
        isPlayer: false, 
        bidStrategy: 'cautious',
        maxBudget: 3000,
        interestCategories: ['art', 'book']
      },
      { 
        id: 'npc2', 
        name: '부유한 상인', 
        isPlayer: false, 
        bidStrategy: 'aggressive',
        maxBudget: 5000,
        interestCategories: ['jewelry', 'weapon']
      },
      { 
        id: 'npc3', 
        name: '골동품 딜러', 
        isPlayer: false, 
        bidStrategy: 'unpredictable',
        maxBudget: 4000,
        interestCategories: ['art', 'household']
      }
    ];
    
    // 경매 아이템 설정
    const newAuctionItems: AuctionItem[] = auction.items.map((item, index) => ({
      item,
      startingBid: auction.startingBids[item.id] || 100,
      currentBid: auction.startingBids[item.id] || 100,
      highestBidderId: null,
      isReservePrice: false,
      round: index + 1,
      status: index === 0 ? 'active' : 'upcoming'
    }));
    
    setParticipants(newParticipants);
    setAuctionItems(newAuctionItems);
    setAuctionStatus('starting');
    setCurrentItemIndex(0);
    setBidHistory([]);
    
    // 게임 상태 업데이트
    dispatch({ type: 'START_AUCTION', payload: auctionId });
    
    // 첫 번째 아이템으로 라운드 시작
    startRound(0);
    
  }, [state.upcomingAuctions, state.player, dispatch]);

  // 라운드 시작
  const startRound = useCallback((itemIndex: number) => {
    if (itemIndex >= auctionItems.length) {
      // 모든 아이템 경매 완료
      endAuction();
      return;
    }
    
    const item = auctionItems[itemIndex];
    
    // 새 라운드 생성
    const newRound: AuctionRound = {
      roundNumber: itemIndex + 1,
      currentItemId: item.item.id,
      timeRemaining: calculateRoundTime(),
      currentHighestBid: item.startingBid,
      currentHighestBidderId: '',
      bids: [],
      isComplete: false
    };
    
    setCurrentRound(newRound);
    setTimeRemaining(newRound.timeRemaining);
    setAuctionStatus('bidding');
    
    // 타이머 시작
    const newTimer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(newTimer);
          evaluateRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimer(newTimer);
    
  }, [auctionItems]);
  
  // 플레이어 입찰
  const placeBid = useCallback((amount: number) => {
    if (!currentRound || auctionStatus !== 'bidding') return false;
    
    // 입찰 유효성 검사
    if (amount <= currentRound.currentHighestBid) return false;
    if (amount > state.player.money) return false;
    
    // 새 입찰 기록 생성
    const newBid: BidRecord = {
      itemId: currentRound.currentItemId,
      participantId: state.player.id,
      bidAmount: amount,
      timestamp: Date.now(),
      round: currentRound.roundNumber
    };
    
    // 라운드 업데이트
    setCurrentRound(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentHighestBid: amount,
        currentHighestBidderId: state.player.id,
        bids: [...prev.bids, newBid]
      };
    });
    
    // 전체 입찰 기록 업데이트
    setBidHistory(prev => [...prev, newBid]);
    
    return true;
  }, [currentRound, auctionStatus, state.player]);
  
  // NPC 입찰 생성
  const generateNpcBids = useCallback(() => {
    if (!currentRound || auctionStatus !== 'bidding') return;
    
    // NPC 참가자들만 필터링
    const npcParticipants = participants.filter(p => !p.isPlayer);
    
    // 현재 경매 아이템
    const currentItem = auctionItems[currentItemIndex];
    
    // 각 NPC에 대해 입찰 여부와 금액 결정
    npcParticipants.forEach(npc => {
      // 50% 확률로 입찰 시도
      if (Math.random() > 0.5) return;
      
      // 이미 최고 입찰자면 패스
      if (npc.id === currentRound.currentHighestBidderId) return;
      
      // 예산 초과하면 패스
      if (npc.maxBudget && currentRound.currentHighestBid >= npc.maxBudget) return;
      
      // 관심 카테고리가 아니면 입찰 확률 낮춤
      const isInterestedCategory = npc.interestCategories?.includes(currentItem.item.category);
      if (!isInterestedCategory && Math.random() > 0.3) return;
      
      // 입찰 금액 계산
      let bidAmount = 0;
      const minIncrement = Math.max(10, currentRound.currentHighestBid * 0.05);
      
      switch (npc.bidStrategy) {
        case 'aggressive':
          // 10-20% 증액
          bidAmount = currentRound.currentHighestBid + 
            Math.ceil(currentRound.currentHighestBid * (0.1 + Math.random() * 0.1));
          break;
        
        case 'cautious':
          // 최소 증액
          bidAmount = currentRound.currentHighestBid + Math.ceil(minIncrement);
          break;
          
        case 'unpredictable':
          // 5-30% 증액 (무작위)
          bidAmount = currentRound.currentHighestBid + 
            Math.ceil(currentRound.currentHighestBid * (0.05 + Math.random() * 0.25));
          break;
          
        default:
          // 기본: 5-15% 증액
          bidAmount = currentRound.currentHighestBid + 
            Math.ceil(currentRound.currentHighestBid * (0.05 + Math.random() * 0.1));
      }
      
      // 예산 제한 적용
      if (npc.maxBudget && bidAmount > npc.maxBudget) {
        bidAmount = npc.maxBudget;
      }
      
      // 이미 최고 입찰가보다 낮으면 패스
      if (bidAmount <= currentRound.currentHighestBid) return;
      
      // 새 입찰 기록 생성
      const newBid: BidRecord = {
        itemId: currentRound.currentItemId,
        participantId: npc.id,
        bidAmount,
        timestamp: Date.now(),
        round: currentRound.roundNumber
      };
      
      // 라운드 업데이트
      setCurrentRound(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentHighestBid: bidAmount,
          currentHighestBidderId: npc.id,
          bids: [...prev.bids, newBid]
        };
      });
      
      // 전체 입찰 기록 업데이트
      setBidHistory(prev => [...prev, newBid]);
    });
    
  }, [currentRound, auctionStatus, participants, auctionItems, currentItemIndex]);
  
  // 라운드 평가
  const evaluateRound = useCallback(() => {
    if (!currentRound) return;
    
    setAuctionStatus('evaluating');
    
    // 타이머 정리
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    // 현재 라운드 완료 처리
    setCurrentRound(prev => {
      if (!prev) return null;
      return { ...prev, isComplete: true };
    });
    
    // 현재 아이템 상태 업데이트
    setAuctionItems(prev => {
      const updated = [...prev];
      const currentItem = updated[currentItemIndex];
      
      if (currentRound.currentHighestBidderId) {
        // 낙찰
        updated[currentItemIndex] = {
          ...currentItem,
          currentBid: currentRound.currentHighestBid,
          highestBidderId: currentRound.currentHighestBidderId,
          status: 'sold'
        };
        
        // 플레이어가 낙찰받았으면 인벤토리에 추가 및 비용 차감
        if (currentRound.currentHighestBidderId === state.player.id) {
          dispatch({ type: 'ADD_ITEM', payload: currentItem.item });
          dispatch({ type: 'UPDATE_MONEY', payload: -currentRound.currentHighestBid });
        }
      } else {
        // 유찰
        updated[currentItemIndex] = {
          ...currentItem,
          status: 'notSold'
        };
      }
      
      // 다음 아이템이 있으면 활성화
      if (currentItemIndex + 1 < updated.length) {
        updated[currentItemIndex + 1] = {
          ...updated[currentItemIndex + 1],
          status: 'active'
        };
      }
      
      return updated;
    });
    
    // 잠시 후 다음 라운드로 전환
    setTimeout(() => {
      setAuctionStatus('transitioning');
      
      // 다음 라운드 준비
      setTimeout(() => {
        setCurrentItemIndex(prev => prev + 1);
        startRound(currentItemIndex + 1);
      }, 1500);
      
    }, 2000);
    
  }, [currentRound, timer, currentItemIndex, auctionItems, state.player.id, dispatch]);
  
  // 경매 종료
  const endAuction = useCallback(() => {
    setAuctionStatus('concluding');
    
    // 경매 결과 정리...
    // (실제 구현에서는 여기에 결과 요약, 통계 등을 처리)
    
    setTimeout(() => {
      setAuctionStatus('complete');
      dispatch({ type: 'END_AUCTION' });
    }, 3000);
    
  }, [dispatch]);
  
  // 라운드 시간 계산 (내부 헬퍼 함수)
  const calculateRoundTime = () => {
    // 기본 시간
    let baseTime = 30; // 초
    
    // 플레이어 설정에 따른 조정
    switch (state.player.timerPreference) {
      case 'relaxed':
        baseTime = 45;
        break;
      case 'challenging':
        baseTime = 20;
        break;
    }
    
    // 적응형 타이머 적용 (게임 설정에 따라)
    if (state.gameSettings.adaptiveTimer) {
      // 적응형 로직 구현...
    }
    
    return baseTime;
  };
  
  // NPC 자동 입찰 로직
  useEffect(() => {
    if (auctionStatus !== 'bidding' || !currentRound) return;
    
    // 주기적으로 NPC 입찰 생성
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% 확률로 입찰 시도
        generateNpcBids();
      }
    }, 2000 + Math.random() * 3000); // 2-5초 간격
    
    return () => clearInterval(interval);
  }, [auctionStatus, currentRound, generateNpcBids]);
  
  return {
    auctionStatus,
    currentRound,
    timeRemaining,
    auctionItems,
    currentItemIndex,
    bidHistory,
    participants,
    startAuction,
    placeBid
  };
}