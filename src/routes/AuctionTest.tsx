import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';
import { useAuction } from '../features/auction/hooks/useAuction';
import { useInventory } from '../features/inventory/hooks/useInventory';
import { Item } from '../models/item';

/**
 * 경매 시스템 테스트 페이지
 */
const AuctionTest: React.FC = () => {
  // 플레이어 정보
  const [player, setPlayer] = useState({
    id: 'player-1',
    name: '플레이어',
    coins: 2000,
    maxAutoBid: 0  // 자동 입찰 최대 금액
  });
  
  // 선택된 아이템 상태 관리
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [auctionId, setAuctionId] = useState<string | null>(null);
  
  // 입력 값
  const [manualBidAmount, setManualBidAmount] = useState('');
  const [autoBidAmount, setAutoBidAmount] = useState('0');
  
  // 인벤토리 훅 사용
  const { items, addItem, removeItem } = useInventory();
  
  // 경매 훅 사용
  const {
    auctionStatus,
    currentRound,
    timeRemaining,
    auctionItems,
    currentItemIndex,
    bidHistory,
    participants,
    startAuction,
    placeBid
  } = useAuction();
  
  // 현재 경매 아이템
  const currentAuctionItem = auctionItems[currentItemIndex] || null;
  
  // 편의를 위한 파생 값
  const isAuctionActive = auctionStatus === 'bidding';
  const isAuctionEnded = auctionStatus === 'complete';
  const isAuctionIdle = !isAuctionActive && !isAuctionEnded;
  const currentHighestBid = currentRound?.currentHighestBid || 0;
  const currentHighestBidder = currentRound?.currentHighestBidderId || '';
  
  // 경매 참가자 이름 가져오기
  const getBidderName = (bidderId: string) => {
    if (bidderId === player.id) return '플레이어';
    return participants.find(p => p.id === bidderId)?.name || '알 수 없음';
  };
  
  // 아이템 선택 시 경매 ID 생성
  useEffect(() => {
    if (selectedItem && !auctionId) {
      // 랜덤 경매 ID 생성
      const newAuctionId = `auction-${Date.now()}`;
      setAuctionId(newAuctionId);
      
      // 초기 입찰액 설정
      const basePrice = selectedItem.isAppraised ? selectedItem.convertedActualValue : selectedItem.convertedBaseValue;
      const startingBid = Math.max(50, Math.floor(basePrice * 0.5));
      setManualBidAmount(startingBid.toString());
    }
  }, [selectedItem, auctionId]);
  
  // 수동 입찰
  const handlePlaceBid = () => {
    const bidAmount = parseInt(manualBidAmount);
    
    // 유효한 입찰 금액 확인
    if (isNaN(bidAmount) || bidAmount <= 0) return;
    
    // 최소 입찰가 확인
    const minBid = currentHighestBid ? currentHighestBid + 10 : currentAuctionItem?.startingBid || 0;
    
    if (bidAmount < minBid) {
      alert(`최소 입찰가는 ${minBid}입니다.`);
      return;
    }
    
    // 플레이어 소지금 확인
    if (bidAmount > player.coins) {
      alert('소지금이 부족합니다.');
      return;
    }
    
    // 입찰 실행
    const bidResult = placeBid(bidAmount);
    
    if (bidResult) {
      // 플레이어 소지금 업데이트 (실제로는 훅 내부나 리덕스 등에서 처리될 것)
      setPlayer(prev => ({
        ...prev,
        coins: prev.coins - bidAmount // 단순화를 위해 즉시 차감
      }));
    } else {
      alert('입찰에 실패했습니다.');
    }
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
    const minBid = currentHighestBid ? currentHighestBid + 10 : currentAuctionItem?.startingBid || 0;
    
    if (maxBid >= minBid && currentHighestBidder !== player.id) {
      placeBid(minBid);
      setPlayer(prev => ({
        ...prev,
        coins: prev.coins - minBid
      }));
    }
  };
  
  // 자동 입찰 취소
  const cancelBid = () => {
    setPlayer(prev => ({
      ...prev,
      maxAutoBid: 0
    }));
  };
  
  // 판매 완료 처리
  const handleSellItem = () => {
    if (!isAuctionEnded || !currentAuctionItem) return;
    
    // 경매 종료 후 아이템 판매 처리
    if (currentHighestBidder && currentHighestBidder !== player.id) {
      // 인벤토리에서 아이템 제거
      if (selectedItem) {
        removeItem(selectedItem.id);
      }
      
      // 코인 획득
      setPlayer(prev => ({
        ...prev, 
        coins: prev.coins + currentHighestBid
      }));
      
      // 경매 초기화
      setSelectedItem(null);
      setAuctionId(null);
    }
  };
  
  // 이 테스트 페이지를 위한 경매 초기화 함수
  const initializeAndStartAuction = () => {
    if (!selectedItem || !auctionId) return;
    
    // 이 테스트 페이지에서는 간소화된 경매 시작 방식 사용
    startAuction(auctionId);
  };
  
  // 이 테스트 페이지를 위한 경매 리셋 함수
  const resetTestAuction = () => {
    setSelectedItem(null);
    setAuctionId(null);
    setManualBidAmount('');
    setAutoBidAmount('0');
  };
  
  // 예상 판매가 계산 (더미 구현, 실제로는 서비스에서 구현)
  const estimateSalePrice = (item: Item) => {
    const basePrice = item.isAppraised ? item.convertedActualValue : item.convertedBaseValue;
    // 예시로 기본 가치의 80% ~ 120% 범위로 설정
    return {
      min: Math.floor(basePrice * 0.8),
      average: basePrice,
      max: Math.floor(basePrice * 1.2)
    };
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/dev" className="back-button">← 테스트 메뉴로</Link>
        <h1>경매 시스템 테스트</h1>
        <div className="player-coins">
          <span>보유 자금: {player.coins}</span>
        </div>
      </header>
      
        {/* 경매 상태 표시 */}
        <div className="auction-status">
          {isAuctionIdle && (
            <div className="status-message">경매 준비 중</div>
          )}
          {isAuctionActive && (
            <>
              <div className="status-message">경매 진행 중 - 라운드 {currentItemIndex + 1}/{auctionItems.length}</div>
              <div className="timer">
                <div className="timer-bar">
                  <div 
                    className="timer-fill" 
                    style={{ width: `${(timeRemaining / 30) * 100}%` }}
                  ></div>
                </div>
                <div className="timer-text">{timeRemaining}초</div>
              </div>
            </>
          )}
          {isAuctionEnded && (
            <div className="status-message">경매 종료</div>
          )}
        </div>
        {/* 경매 상태별 화면 */}
        {isAuctionIdle && 
          <div className="auction-preview">
            {selectedItem ? (
              <>
                <h2>경매 아이템</h2>
                <p><strong>{selectedItem.name}</strong></p>
                <p>{selectedItem.description}</p>
                <p>최소 입찰가: {parseInt(manualBidAmount) || 0} 코인</p>
                
                {/* 예상 판매가 표시 */}
                {selectedItem.isAppraised && (
                  <div className="estimate">
                    <h3>예상 판매가</h3>
                    {(() => {
                      const estimate = estimateSalePrice(selectedItem);
                      return (
                        <p>
                          <span className="estimate-min">{estimate.min}</span>
                          {' ~ '}
                          <span className="estimate-avg">{estimate.average}</span>
                          {' ~ '}
                          <span className="estimate-max">{estimate.max}</span>
                          {' 코인'}
                        </p>
                      );
                    })()}
                  </div>
                )}
                
                <p>경매 참여자: {participants.length}명의 참가자</p>
                <button className="btn btn-primary" onClick={initializeAndStartAuction}>
                  경매 시작
                </button>
              </>
            ) : (
              <>
                <h2>판매할 아이템 선택</h2>
                <div className="items-grid">
                  {items.filter(item => item.isAppraised).map(item => (
                    <div 
                      key={item.id} 
                      className={`item-card ${selectedItem === item.id ? 'selected' : '' }`} 
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="item-name">{item.name}</div>
                      <div className="item-value">{item.actualValue[0].amount || item.baseValue[0].amount} 금화 {item.actualValue[1].amount || item.baseValue[1].amount} 은화 {item.actualValue[2].amount || item.baseValue[2].amount} 동화 </div>
                    </div>
                  ))}
                </div>
                
                {items.filter(item => item.isAppraised).length === 0 && (
                  <p className="text-muted">판매할 감정된 아이템이 없습니다. 인벤토리에서 아이템을 먼저 감정하세요.</p>
                )}
              </>
            )}
          </div>
        }
        {isAuctionActive && currentAuctionItem && (
          <div className="auction-main">
            {/* 아이템 정보 */}
            <div className="item-details">
              <h2>{currentAuctionItem.item.name}</h2>
              <div className="item-info">
                <div className="item-image-placeholder">
                  아이템 이미지
                </div>
                <div className="item-data">
                  <p>{currentAuctionItem.item.description}</p>
                  <p><strong>카테고리:</strong> {currentAuctionItem.item.category}</p>
                  <p><strong>태그:</strong> {Array.isArray(currentAuctionItem.item.tags) && currentAuctionItem.item.tags.length > 0 ? 
                      currentAuctionItem.item.tags.map(tag => tag.name).join(', ') : 
                      '없음'}</p>
                  <p><strong>최소 입찰가:</strong> {currentAuctionItem.startingBid || '없음'} 코인</p>
                  <p>
                    <strong>현재 최고 입찰:</strong> {currentHighestBid || '없음'} 코인 
                    ({getBidderName(currentHighestBidder)})
                  </p>
                </div>
              </div>
            </div>
            
            {/* 경매 컨트롤 */}
            <div className="bidding-section">
              {/* 입찰 기록 */}
              <div className="bid-history">
                <h3>입찰 기록</h3>
                {bidHistory.length > 0 ? (
                  bidHistory.slice().reverse().map((bid, index) => (
                    <div key={index} className="bid-entry">
                      <span>{getBidderName(bid.participantId)}</span>
                      <span>{bid.bidAmount} 코인</span>
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
                    min={currentHighestBid ? currentHighestBid + 10 : 10}
                    placeholder="입찰 금액"
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={handlePlaceBid}
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
        
        {isAuctionEnded && (
          <div className="result-section">
            <h3>경매 결과</h3>
            
            {currentHighestBidder ? (
              <div className="auction-result">
                <div className="winner">
                  낙찰자: {getBidderName(currentHighestBidder)}
                </div>
                <div className="final-price">낙찰가: {currentHighestBid} 코인</div>
                
                {currentHighestBidder === player.id ? (
                  <p>축하합니다! 당신이 이 아이템을 획득했습니다.</p>
                ) : (
                  <>
                    <p>{getBidderName(currentHighestBidder)}가 이 아이템을 획득했습니다.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={handleSellItem}
                    >
                      판매 완료 ({currentHighestBid} 코인 획득)
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="no-bidders">
                입찰자가 없어 경매가 유찰되었습니다.
              </div>
            )}
            
            <button 
              className="btn"
              onClick={resetTestAuction}
            >
              다음 경매
            </button>
          </div>
        )}
      </div>
  );
};

export default AuctionTest;