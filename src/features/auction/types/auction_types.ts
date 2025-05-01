/**
 * 경매(Auction) 관련 타입 정의
 */
import { Item } from '@models/item';

// 경매 참가자 타입
export interface AuctionParticipant {
  id: string;
  name: string;
  isPlayer: boolean;
  bidStrategy?: BidStrategy; // 입찰 전략
  maxBudget?: number;
  interestCategories?: string[]; // 관심 카테고리
}

export interface BidStrategy {
  minIncrementMultiplier: number; // 최소 입찰 증가 배수 (0-1)
  maxIncrementMultiplier: number; // 최대 입찰 증가 배수 (0-1)
  bidProbability: number; // 입찰 시도 확률 (0-1)
}

// 입찰 기록
export interface BidRecord {
  itemId: string;
  participantId: string;
  bidAmount: number;
  timestamp: number;
  round: number;
}

// 경매 라운드 상태
export interface AuctionRound {
  roundNumber: number;
  currentItemId: string;
  timeRemaining: number;
  currentHighestBid: number;
  currentHighestBidderId: string;
  bids: BidRecord[];
  isComplete: boolean;
}

// 경매 아이템
export interface AuctionItem {
  item: Item;
  startingBid: number;
  currentBid: number;
  highestBidderId: string | null;
  isReservePrice: boolean;
  round: number;
  status: 'upcoming' | 'active' | 'sold' | 'notSold';
}

// 경매 상태
export type AuctionStatus = 
  | 'scheduled'    // 예정됨 
  | 'starting'     // 시작 중
  | 'bidding'      // 입찰 진행 중
  | 'evaluating'   // 입찰 평가 중
  | 'transitioning' // 다음 아이템으로 전환 중
  | 'concluding'   // 경매 종료 중
  | 'complete';    // 완료됨

// 경매 타이머 설정
export interface AuctionTimerSettings {
  baseTime: number;     // 기본 시간 (초)
  playerModifier: number; // 플레이어 설정에 따른 수정자
  adaptiveMultiplier: number; // 적응형 곱셈 계수
}