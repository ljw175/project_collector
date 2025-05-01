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
import { auctionService } from '@/services/auction';

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
    // 경매 데이터 가져오기
    const auction = state.upcomingAuctions.find(a => a.id === auctionId);
    if (!auction) return;

    // 중앙화된 서비스를 통해 참가자 목록 생성
    const newParticipants = auctionService.createParticipantsList(state.player);
    
    // 중앙화된 서비스를 통해 경매 아이템 생성
    const newAuctionItems = auctionService.createAuctionItems(auction.items, auction.startingBids);
    
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
    
    // 중앙화된 서비스를 통해 새 라운드 생성
    const newRound = auctionService.createAuctionRound(
      itemIndex + 1,
      item.item.id,
      item.startingBid
    );
    
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
    
    // 중앙화된 서비스를 통해 입찰 유효성 검사
    const isValid = auctionService.validateBid(
      amount,
      currentRound.currentHighestBid,
      state.player.money
    );
    
    if (!isValid) return false;
    
    // 중앙화된 서비스를 통해 입찰 기록 생성
    const newBid = auctionService.createBidRecord(
      currentRound.currentItemId,
      state.player.id,
      amount,
      currentRound.roundNumber
    );
    
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
    
    // 중앙화된 서비스를 통해 NPC 입찰 생성
    const npcBids = auctionService.generateAllNpcBids(
      npcParticipants,
      currentRound,
      currentItem
    );
    
    // 입찰이 있는 경우 적용
    if (npcBids.length > 0) {
      const highestBid = npcBids[0]; // 내림차순으로 정렬되어 있음
      
      // 라운드 업데이트
      setCurrentRound(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentHighestBid: highestBid.bidAmount,
          currentHighestBidderId: highestBid.participantId,
          bids: [...prev.bids, ...npcBids]
        };
      });
      
      // 전체 입찰 기록 업데이트
      setBidHistory(prev => [...prev, ...npcBids]);
    }
    
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
      
      // 중앙화된 서비스를 통해 라운드 결과 평가
      updated[currentItemIndex] = auctionService.evaluateRoundResult(
        currentRound,
        currentItem
      );
      
      // 플레이어가 낙찰받았으면 인벤토리에 추가 및 비용 차감
      if (currentRound.currentHighestBidderId === state.player.id) {
        dispatch({ type: 'ADD_ITEM', payload: currentItem.item });
        dispatch({ type: 'UPDATE_MONEY', payload: -currentRound.currentHighestBid });
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
    placeBid,
    service: auctionService
  };
}