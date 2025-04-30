import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';

/**
 * 경매 시스템 테스트 페이지
 */
const AuctionTest: React.FC = () => {
  // 경매 상태 정의
  enum AuctionState {
    PREVIEW = 'preview',   // 경매 시작 전 미리보기
    BIDDING = 'bidding',   // 경매 진행 중
    FINISHED = 'finished'  // 경매 종료
  }
  
  // 아이템 카테고리
  enum ItemCategory {
    WEAPON = 'weapon',
    JEWELRY = 'jewelry',
    ART = 'art',
    BOOK = 'book',
    HOUSEHOLD = 'household',
    MATERIAL = 'material'
  }
  
  // 아이템 정의
  interface AuctionItem {
    id: string;
    name: string;
    description: string;
    category: ItemCategory;
    baseValue: number;
    estimatedValue: number;
    minBid: number;
    image?: string;
    tags: string[];
  }
  
  // 입찰 정의
  interface Bid {
    id: string;
    bidderId: string;
    bidderName: string;
    amount: number;
    timestamp: number;
    isAutoBid: boolean;
  }
  
  // NPC 입찰자 정의
  interface NpcBidder {
    id: string;
    name: string;
    maxBid: number;
    bidProbability: number;     // 0-1 사이의 입찰 확률
    bidStyle: 'aggressive' | 'cautious' | 'unpredictable';
    interests: ItemCategory[];  // 관심 있는 아이템 카테고리
  }
  
  // 테스트용 아이템 데이터
  const [currentItem, setCurrentItem] = useState<AuctionItem>({
    id: 'item-1',
    name: '고대의 장식용 단검',
    description: '구리로 만들어진 의식용 단검으로, 손잡이에는 정교한 문양이 새겨져 있다. 칼날은 놀랍도록 잘 보존되어 있다.',
    category: ItemCategory.WEAPON,
    baseValue: 500,
    estimatedValue: 800,
    minBid: 500,
    tags: ['고대의', '의식용', '잘 보존된'],
  });
  
  // 테스트용 NPC 입찰자 데이터
  const [npcBidders, setNpcBidders] = useState<NpcBidder[]>([
    {
      id: 'npc-1',
      name: '김 수집가',
      maxBid: 1200,
      bidProbability: 0.8,
      bidStyle: 'cautious',
      interests: [ItemCategory.WEAPON, ItemCategory.ART]
    },
    {
      id: 'npc-2',
      name: '이 골동품상',
      maxBid: 900,
      bidProbability: 0.6,
      bidStyle: 'aggressive',
      interests: [ItemCategory.WEAPON, ItemCategory.JEWELRY]
    },
    {
      id: 'npc-3',
      name: '박 상인',
      maxBid: 700,
      bidProbability: 0.5,
      bidStyle: 'unpredictable',
      interests: [ItemCategory.BOOK, ItemCategory.MATERIAL]
    }
  ]);
  
  // 플레이어 정보
  const [player, setPlayer] = useState({
    id: 'player-1',
    name: '플레이어',
    coins: 2000,
    maxAutoBid: 0  // 자동 입찰 최대 금액
  });
  
  // 경매 상태
  const [auctionState, setAuctionState] = useState<AuctionState>(AuctionState.PREVIEW);
  const [currentBids, setCurrentBids] = useState<Bid[]>([]);
  const [winningBid, setWinningBid] = useState<Bid | null>(null);
  const [roundTime, setRoundTime] = useState(20); // 라운드 시간(초)
  const [timeRemaining, setTimeRemaining] = useState(roundTime);
  const [roundCount, setRoundCount] = useState(0);
  
  // 입력 값
  const [manualBidAmount, setManualBidAmount] = useState(currentItem.minBid.toString());
  const [autoBidAmount, setAutoBidAmount] = useState('0');
  
  // 타이머 ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 경매 시작
  const startAuction = () => {
    setAuctionState(AuctionState.BIDDING);
    setRoundCount(1);
    setTimeRemaining(roundTime);
    setCurrentBids([]);
    
    // 시작 입찰가로 최소 입찰가 설정
    setManualBidAmount(currentItem.minBid.toString());
    
    // 타이머 시작
    startTimer();
  };
  
  // 타이머 시작
  const startTimer = () => {
    // 이전 타이머 제거
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // 새 타이머 설정
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // 타이머 종료
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          
          // 라운드 종료 처리
          endRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // 라운드 종료
  const endRound = () => {
    // NPC 입찰 결정
    npcBidders.forEach(npc => {
      // 이미 최고 입찰가가 npc의 최대 입찰가를 초과하면 입찰하지 않음
      const highestBid = getHighestBid();
      if (highestBid && highestBid.amount >= npc.maxBid) return;
      
      // 입찰 확률에 따라 입찰 여부 결정
      if (Math.random() <= npc.bidProbability) {
        const currentMinBid = highestBid ? highestBid.amount + 50 : currentItem.minBid;
        
        // 입찰 금액 결정 (입찰 스타일에 따라 다름)
        let bidAmount = currentMinBid;
        if (npc.bidStyle === 'aggressive') {
          // 공격적: 현재 최고가보다 10-20% 더 높게 입찰
          bidAmount = Math.min(npc.maxBid, Math.floor(currentMinBid * (1 + 0.1 + Math.random() * 0.1)));
        } else if (npc.bidStyle === 'cautious') {
          // 신중함: 현재 최고가보다 약간만 더 높게 입찰
          bidAmount = Math.min(npc.maxBid, currentMinBid + Math.floor(Math.random() * 50) + 10);
        } else {
          // 예측불가: 랜덤하게 입찰
          bidAmount = Math.min(npc.maxBid, currentMinBid + Math.floor(Math.random() * 100));
        }
        
        // 아이템이 관심 카테고리인 경우 더 높게 입찰
        if (npc.interests.includes(currentItem.category)) {
          bidAmount = Math.min(npc.maxBid, Math.floor(bidAmount * 1.2));
        }
        
        // 최소 입찰가보다 높은 경우에만 입찰
        if (bidAmount > currentMinBid) {
          addBid({
            id: `bid-${Date.now()}-${npc.id}`,
            bidderId: npc.id,
            bidderName: npc.name,
            amount: bidAmount,
            timestamp: Date.now(),
            isAutoBid: false
          });
        }
      }
    });
    
    // 플레이어 자동 입찰 처리
    if (player.maxAutoBid > 0) {
      const highestBid = getHighestBid();
      if (highestBid && highestBid.bidderId !== player.id && highestBid.amount < player.maxAutoBid) {
        const autoBidAmount = Math.min(player.maxAutoBid, highestBid.amount + 50);
        addBid({
          id: `bid-${Date.now()}-${player.id}`,
          bidderId: player.id,
          bidderName: player.name,
          amount: autoBidAmount,
          timestamp: Date.now(),
          isAutoBid: true
        });
      }
    }
    
    // 다음 라운드 결정
    if (roundCount < 5) {
      setRoundCount(prev => prev + 1);
      setTimeRemaining(roundTime);
      startTimer();
    } else {
      // 경매 종료
      endAuction();
    }
  };
  
  // 경매 종료
  const endAuction = () => {
    // 타이머 중지
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // 경매 결과 설정
    setAuctionState(AuctionState.FINISHED);
    
    // 최종 낙찰자 결정
    const highestBid = getHighestBid();
    if (highestBid) {
      setWinningBid(highestBid);
      
      // 플레이어가 낙찰받은 경우 코인 차감
      if (highestBid.bidderId === player.id) {
        setPlayer(prev => ({
          ...prev,
          coins: prev.coins - highestBid.amount
        }));
      }
    }
  };
  
  // 수동 입찰
  const placeBid = () => {
    const bidAmount = parseInt(manualBidAmount);
    
    // 유효한 입찰 금액 확인
    if (isNaN(bidAmount) || bidAmount <= 0) return;
    
    // 최소 입찰가 확인
    const highestBid = getHighestBid();
    const minBid = highestBid ? highestBid.amount + 10 : currentItem.minBid;
    
    if (bidAmount < minBid) {
      alert(`최소 입찰가는 ${minBid}입니다.`);
      return;
    }
    
    // 플레이어 소지금 확인
    if (bidAmount > player.coins) {
      alert('소지금이 부족합니다.');
      return;
    }
    
    // 입찰 추가
    addBid({
      id: `bid-${Date.now()}-${player.id}`,
      bidderId: player.id,
      bidderName: player.name,
      amount: bidAmount,
      timestamp: Date.now(),
      isAutoBid: false
    });
  };
  
  // 자동 입찰 설정
  const setAutoBid = () => {
    const maxBid = parseInt(autoBidAmount);
    
    // 유효한 금액 확인
    if (isNaN(maxBid) || maxBid <= 0) return;
    
    // 플레이어 소지금 확인
    if (maxBid > player.coins) {
      alert('소지금이 부족합니다.');
      return;
    }
    
    // 자동 입찰 최대 금액 설정
    setPlayer(prev => ({
      ...prev,
      maxAutoBid: maxBid
    }));
    
    // 현재 최고 입찰가보다 높은 경우 즉시 입찰
    const highestBid = getHighestBid();
    const minBid = highestBid ? highestBid.amount + 10 : currentItem.minBid;
    
    if (maxBid >= minBid && (!highestBid || highestBid.bidderId !== player.id)) {
      addBid({
        id: `bid-${Date.now()}-${player.id}`,
        bidderId: player.id,
        bidderName: player.name,
        amount: minBid,
        timestamp: Date.now(),
        isAutoBid: true
      });
    }
  };
  
  // 입찰 취소
  const cancelBid = () => {
    setPlayer(prev => ({
      ...prev,
      maxAutoBid: 0
    }));
  };
  
  // 입찰 추가
  const addBid = (bid: Bid) => {
    setCurrentBids(prev => [...prev, bid]);
  };
  
  // 최고 입찰 조회
  const getHighestBid = (): Bid | null => {
    if (currentBids.length === 0) return null;
    
    return currentBids.reduce((highest, bid) => {
      return bid.amount > highest.amount ? bid : highest;
    });
  };
  
  // 페이지 언마운트 시 타이머 제거
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/dev" className="back-button">← 테스트 메뉴로</Link>
        <h1>경매 시스템 테스트</h1>
        <div className="player-coins">
          <span>보유 코인: {player.coins}</span>
        </div>
      </header>
      
      <main className="app-content">
        {/* 경매 상태 표시 */}
        <div className="auction-status">
          {auctionState === AuctionState.PREVIEW && (
            <div className="status-message">경매 준비 중</div>
          )}
          {auctionState === AuctionState.BIDDING && (
            <>
              <div className="status-message">경매 진행 중 - 라운드 {roundCount}/5</div>
              <div className="timer">
                <div className="timer-bar">
                  <div 
                    className="timer-fill" 
                    style={{ width: `${(timeRemaining / roundTime) * 100}%` }}
                  ></div>
                </div>
                <div className="timer-text">{timeRemaining}초</div>
              </div>
            </>
          )}
          {auctionState === AuctionState.FINISHED && (
            <div className="status-message">경매 종료</div>
          )}
        </div>
        
        {/* 경매 상태별 화면 */}
        {auctionState === AuctionState.PREVIEW && (
          <div className="auction-preview">
            <h2>다음 경매 아이템</h2>
            <p><strong>{currentItem.name}</strong></p>
            <p>{currentItem.description}</p>
            <p>최소 입찰가: {currentItem.minBid} 코인</p>
            <p>예상 가치: {currentItem.estimatedValue} 코인</p>
            <p>경매 참여자: {npcBidders.length}명의 NPC + 플레이어</p>
            <button className="btn btn-primary" onClick={startAuction}>
              경매 시작
            </button>
          </div>
        )}
        
        {auctionState === AuctionState.BIDDING && (
          <div className="auction-main">
            {/* 아이템 정보 */}
            <div className="item-details">
              <h2>{currentItem.name}</h2>
              <div className="item-info">
                <div className="item-image-placeholder">
                  아이템 이미지
                </div>
                <div className="item-data">
                  <p>{currentItem.description}</p>
                  <p><strong>카테고리:</strong> {currentItem.category}</p>
                  <p><strong>태그:</strong> {currentItem.tags.join(', ')}</p>
                  <p><strong>최소 입찰가:</strong> {currentItem.minBid} 코인</p>
                  <p><strong>현재 최고 입찰:</strong> {getHighestBid()?.amount || '없음'} 코인 
                    ({getHighestBid()?.bidderName || '-'})
                  </p>
                </div>
              </div>
            </div>
            
            {/* 경매 컨트롤 */}
            <div className="bidding-section">
              {/* 입찰 기록 */}
              <div className="bid-history">
                <h3>입찰 기록</h3>
                {currentBids.length > 0 ? (
                  currentBids.slice().reverse().map(bid => (
                    <div key={bid.id} className="bid-entry">
                      <span>{bid.bidderName} {bid.isAutoBid ? '(자동)' : ''}</span>
                      <span>{bid.amount} 코인</span>
                    </div>
                  ))
                ) : (
                  <div className="no-bids">아직 입찰이 없습니다.</div>
                )}
              </div>
              
              {/* 입찰 컨트롤 */}
              <div className="bid-controls">
                <div className="player-info">
                  현재 보유: {player.coins} 코인 
                  {player.maxAutoBid > 0 && (
                    <span> (자동 입찰: {player.maxAutoBid} 코인까지)</span>
                  )}
                </div>
                
                <div className="manual-bid">
                  <input 
                    type="number" 
                    value={manualBidAmount}
                    onChange={(e) => setManualBidAmount(e.target.value)}
                    min={getHighestBid() ? getHighestBid()!.amount + 10 : currentItem.minBid}
                    placeholder="입찰 금액"
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={placeBid}
                  >
                    입찰
                  </button>
                </div>
                
                <div className="auto-bid">
                  <input 
                    type="number" 
                    value={autoBidAmount}
                    onChange={(e) => setAutoBidAmount(e.target.value)}
                    placeholder="최대 자동 입찰 금액"
                  />
                  <button 
                    className="btn"
                    onClick={setAutoBid}
                    disabled={player.maxAutoBid > 0}
                  >
                    자동 입찰 설정
                  </button>
                </div>
                
                {player.maxAutoBid > 0 && (
                  <button 
                    className="btn"
                    onClick={cancelBid}
                  >
                    자동 입찰 취소
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {auctionState === AuctionState.FINISHED && (
          <div className="result-section">
            <h3>경매 결과</h3>
            
            {winningBid ? (
              <div className="auction-result">
                <div className="winner">낙찰자: {winningBid.bidderName}</div>
                <div className="final-price">낙찰가: {winningBid.amount} 코인</div>
                
                {winningBid.bidderId === player.id ? (
                  <p>축하합니다! 당신이 이 아이템을 획득했습니다.</p>
                ) : (
                  <p>{winningBid.bidderName}이(가) 이 아이템을 획득했습니다.</p>
                )}
              </div>
            ) : (
              <div className="no-bidders">
                입찰자가 없어 경매가 유찰되었습니다.
              </div>
            )}
            
            <button 
              className="btn btn-primary"
              onClick={() => {
                setAuctionState(AuctionState.PREVIEW);
                setWinningBid(null);
              }}
            >
              다음 경매
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AuctionTest;