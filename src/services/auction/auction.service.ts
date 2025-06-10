/**
 * 경매(Auction) 관련 서비스
 * 경매 데이터 접근과 입찰 로직을 관리합니다.
 */
import { Item } from '@models/item';
import { Player } from '@/models/character';
import { 
  AuctionItem, 
  AuctionParticipant, 
  AuctionRound, 
  AuctionStatus, 
  BidRecord 
} from '@features/auction/types/auction_types';
import { 
  auctionNpcs,
  bidStrategyModifiers,
  bidTimerSettings,
  getRandomNpcParticipants
} from '@/data/constants/auction-constants';

/**
 * 경매 서비스 클래스
 */
export class AuctionService {
  /**
   * 경매 NPC 참가자 목록 가져오기
   */
  getAuctionNpcs(): AuctionParticipant[] {
    // NPC 참가자 목록을 가져옵니다.
    return auctionNpcs;
  }
  
  /**
   * 랜덤 NPC 참가자 선택
   */
  getRandomParticipants(count: number = 3): AuctionParticipant[] {
    return getRandomNpcParticipants(count);
  }
  
  /**
   * 플레이어를 포함한 경매 참가자 목록 생성
   */
  createParticipantsList(player: Player, npcCount: number = 3): AuctionParticipant[] {
    // 플레이어 참가자 객체 생성
    const playerParticipant: AuctionParticipant = { 
      id: player.id, 
      name: player.info.name, 
      isPlayer: true 
    };
    
    // NPC 참가자 목록 가져오기
    const npcParticipants = this.getRandomParticipants(npcCount);
    
    // 참가자 목록 합치기
    return [playerParticipant, ...npcParticipants];
  }
  
  /**
   * 경매 아이템 생성
   */
  createAuctionItems(items: Item[], startingBids?: Record<string, number>): AuctionItem[] {
    return items.map((item, index) => ({
      item,
      startingBid: startingBids?.[item.id] || this.calculateStartingBid(item),
      currentBid: startingBids?.[item.id] || this.calculateStartingBid(item),
      highestBidderId: null,
      isReservePrice: false,
      round: index + 1,
      status: index === 0 ? 'active' : 'upcoming'
    }));
  }
  
  /**
   * 시작 입찰가 계산
   */
  private calculateStartingBid(item: Item): number {
    // 기본 가치의 60-80%를 시작가로 설정
    const valueMultiplier = 0.6 + Math.random() * 0.2;
    const baseValue = item.isAppraised ? item.convertedActualValue : item.convertedBaseValue;
    return Math.floor(baseValue * valueMultiplier);
  }
  
  /**
   * 경매 라운드 생성
   */
  createAuctionRound(roundNumber: number, itemId: string, startingBid: number): AuctionRound {
    return {
      roundNumber,
      currentItemId: itemId,
      timeRemaining: this.calculateRoundTime(),
      currentHighestBid: startingBid,
      currentHighestBidderId: '',
      bids: [],
      isComplete: false
    };
  }
  
  /**
   * 라운드 시간 계산
   */
  calculateRoundTime(timerPreference: 'default' | 'relaxed' | 'challenging' = 'default'): number {
    return bidTimerSettings[timerPreference];
  }
  
  /**
   * 입찰 유효성 검사
   */
  validateBid(
    amount: number, 
    currentHighestBid: number, 
    playerMoney: number
  ): boolean {
    // 입찰액이 현재 최고 입찰액보다 큰지 확인
    if (amount <= currentHighestBid) return false;
    
    // 플레이어 돈이 충분한지 확인
    if (amount > playerMoney) return false;
    
    return true;
  }
  
  /**
   * 입찰 기록 생성
   */
  createBidRecord(
    itemId: string, 
    participantId: string, 
    amount: number, 
    round: number
  ): BidRecord {
    return {
      itemId,
      participantId,
      bidAmount: amount,
      timestamp: Date.now(),
      round
    };
  }
  
  /**
   * NPC 입찰 생성
   */
  generateNpcBid(
    npc: AuctionParticipant,
    currentItemId: string,
    currentRound: AuctionRound,
    currentItem: AuctionItem
  ): BidRecord | null {
    // 이미 최고 입찰자면 패스
    if (npc.id === currentRound.currentHighestBidderId) return null;
    
    // 예산 초과하면 패스
    if (npc.maxBudget && currentRound.currentHighestBid >= npc.maxBudget) return null;
    
    // 관심 카테고리가 아니면 입찰 확률 낮춤
    const isInterestedCategory = npc.interestCategories?.includes(currentItem.item.category);
    const bidProbability = isInterestedCategory 
      ? bidStrategyModifiers[npc.id].bidProbability
      : bidStrategyModifiers[npc.id].bidProbability * 0.5;
    
    // 입찰 확률 체크
    if (Math.random() > bidProbability) return null;
    
    // 입찰 금액 계산
    const minIncrement = Math.max(10, currentRound.currentHighestBid * 0.05);
    // 증액 배수 가져오기
    const modifiers = bidStrategyModifiers[npc.id];
    
    // 증액 범위 계산
    const incrementMultiplier = modifiers.minIncrementMultiplier + 
      Math.random() * (modifiers.maxIncrementMultiplier - modifiers.minIncrementMultiplier);
    
    let bidAmount = currentRound.currentHighestBid + 
      Math.ceil(currentRound.currentHighestBid * incrementMultiplier);
    
    // 최소 증액 적용
    if (bidAmount < currentRound.currentHighestBid + minIncrement) {
      bidAmount = Math.ceil(currentRound.currentHighestBid + minIncrement);
    }
    
    // 예산 제한 적용
    if (npc.maxBudget && bidAmount > npc.maxBudget) {
      bidAmount = npc.maxBudget;
    }
    
    // 이미 최고 입찰가보다 낮으면 패스
    if (bidAmount <= currentRound.currentHighestBid) return null;
    
    // 입찰 기록 생성
    return this.createBidRecord(
      currentItemId,
      npc.id,
      bidAmount,
      currentRound.roundNumber
    );
  }
  
  /**
   * 여러 NPC의 입찰 생성
   */
  generateAllNpcBids(
    npcs: AuctionParticipant[],
    currentRound: AuctionRound,
    currentItem: AuctionItem
  ): BidRecord[] {
    const bids: BidRecord[] = [];
    
    // NPC별로 입찰 생성 시도
    npcs.forEach(npc => {
      const bid = this.generateNpcBid(npc, currentRound.currentItemId, currentRound, currentItem);
      if (bid) {
        bids.push(bid);
      }
    });
    
    // 입찰이 여러 개면 가장 높은 입찰만 선택
    if (bids.length > 1) {
      bids.sort((a, b) => b.bidAmount - a.bidAmount);
      return [bids[0]];
    }
    
    return bids;
  }
  
  /**
   * 경매 라운드 결과 평가
   */
  evaluateRoundResult(
    round: AuctionRound, 
    item: AuctionItem
  ): AuctionItem {
    // 입찰자가 있으면 낙찰 처리
    if (round.currentHighestBidderId) {
      return {
        ...item,
        currentBid: round.currentHighestBid,
        highestBidderId: round.currentHighestBidderId,
        status: 'sold'
      };
    }
    
    // 입찰자가 없으면 유찰 처리
    return {
      ...item,
      status: 'notSold'
    };
  }
}

// 싱글톤 인스턴스 생성
export const auctionService = new AuctionService();