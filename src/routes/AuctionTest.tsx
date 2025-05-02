import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';
import '../styles/auction-test.css';
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
        <div className="player-stats">
          <span>보유 자금: {player.coins} 코인</span>
        </div>
      </header>
      
      <main className="app-content">
        <div className="auction-container">
          {/* 경매 아이템 패널 */}
          <div className="auction-items-panel">
            <h2 className="panel-title">경매 아이템</h2>
            
            {isAuctionIdle && !selectedItem && (
              <div className="auctionable-items">
                {items.filter(item => item.isAppraised).map(item => (
                  <div 
                    key={item.id} 
                    className={`auction-item ${selectedItem === item ? 'selected' : ''}`} 
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="item-header">
                      <div className="item-name">{item.name}</div>
                      <div className="item-value">
                        {item.actualValue[0].amount || item.baseValue[0].amount} 금화
                      </div>
                    </div>
                    <div className="item-description">{item.description.substring(0, 50)}...</div>
                    <div className="item-attributes">
                      <span className="item-attribute">{item.category}</span>
                      {item.tags && item.tags.length > 0 && 
                        item.tags.slice(0, 2).map(tag => (
                          <span key={tag.id} className="item-attribute">{tag.name}</span>
                        ))
                      }
                    </div>
                  </div>
                ))}
                
                {items.filter(item => item.isAppraised).length === 0 && (
                  <div className="empty-auction">
                    <div className="empty-icon">📦</div>
                    <div className="empty-message">판매할 감정된 아이템이 없습니다. 인벤토리에서 아이템을 먼저 감정하세요.</div>
                    <button className="start-auction-button" disabled>경매 시작</button>
                  </div>
                )}
              </div>
            )}
            
            {isAuctionIdle && selectedItem && (
              <div className="auction-item selected">
                <h3 className="item-name">{selectedItem.name}</h3>
                <p className="item-description">{selectedItem.description}</p>
                
                <div className="auction-stats">
                  <div className="stat-item">
                    <div className="stat-label">최소 입찰가</div>
                    <div className="stat-value">{parseInt(manualBidAmount) || 0} 코인</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">예상 판매가</div>
                    <div className="stat-value">
                      {(() => {
                        const estimate = estimateSalePrice(selectedItem);
                        return `${estimate.min}~${estimate.max} 코인`;
                      })()}
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">참가자</div>
                    <div className="stat-value">{participants.length}명</div>
                  </div>
                </div>
                
                <div className="auction-control-buttons">
                  <button className="create-button" onClick={initializeAndStartAuction}>
                    경매 시작
                  </button>
                </div>
              </div>
            )}
            
            {(isAuctionActive || isAuctionEnded) && bidHistory.length > 0 && (
              <div>
                <h3 className="history-title">입찰 기록</h3>
                <div className="history-list">
                  {bidHistory.slice().reverse().map((bid, index) => (
                    <div key={index} className="bid-entry">
                      <span className="entry-bidder">{getBidderName(bid.participantId)}</span>
                      <span className="entry-amount">{bid.bidAmount} 코인</span>
                      <span className="entry-time">{new Date(bid.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 경매 워크스페이스 */}
          <div className="auction-workspace">
            <div className="workspace-header">
              <h2 className="workspace-title">경매장</h2>
              <div className={`auction-status ${isAuctionIdle ? 'status-inactive' : isAuctionActive ? 'status-active' : 'status-completed'}`}>
                {isAuctionIdle ? '대기 중' : isAuctionActive ? '진행 중' : '완료'}
              </div>
            </div>
            
            {isAuctionIdle && !selectedItem && (
              <div className="empty-auction">
                <div className="empty-icon">🏛️</div>
                <div className="empty-message">좌측에서 경매에 올릴 아이템을 선택하세요.</div>
              </div>
            )}
            
            {isAuctionActive && currentAuctionItem && (
              <div className="active-auction-display">
                <div className="auction-item-details">
                  <div className="auction-item-image">
                    아이템 이미지
                  </div>
                  <div className="auction-item-info">
                    <div className="info-title">{currentAuctionItem.item.name}</div>
                    <div className="info-description">{currentAuctionItem.item.description}</div>
                    <div className="info-details">
                      <div className="info-detail">
                        <span className="detail-label">카테고리</span>
                        <span className="detail-value">{currentAuctionItem.item.category}</span>
                      </div>
                      <div className="info-detail">
                        <span className="detail-label">시작가</span>
                        <span className="detail-value">{currentAuctionItem.startingBid} 코인</span>
                      </div>
                      <div className="info-detail">
                        <span className="detail-label">현재 최고가</span>
                        <span className="detail-value value">{currentHighestBid || '없음'} 코인</span>
                      </div>
                      <div className="info-detail">
                        <span className="detail-label">최고 입찰자</span>
                        <span className="detail-value">{getBidderName(currentHighestBidder)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="auction-timer">
                  <div className="timer-label">남은 시간</div>
                  <div className="timer-display">{timeRemaining}초</div>
                </div>
                
                <div className="bidding-section">
                  <h3 className="section-title">입찰</h3>
                  
                  <div className="current-bid">
                    <div className="bid-info">
                      <span className="bid-label">현재 최고 입찰가</span>
                      <span className="bid-value">{currentHighestBid || currentAuctionItem.startingBid} 코인</span>
                    </div>
                    <div className="bidder-info">
                      <span className="bidder-label">최고 입찰자</span>
                      <span className="bidder-name">{getBidderName(currentHighestBidder) || '없음'}</span>
                    </div>
                  </div>
                  
                  <div className="player-info">
                    현재 보유: {player.coins} 코인 
                    {player.maxAutoBid > 0 && (
                      <span> (자동 입찰: {player.maxAutoBid} 코인까지)</span>
                    )}
                  </div>
                  
                  <div className="bid-form">
                    <input 
                      type="number" 
                      className="bid-input"
                      value={manualBidAmount}
                      onChange={(e) => setManualBidAmount(e.target.value)}
                      min={currentHighestBid ? currentHighestBid + 10 : currentAuctionItem.startingBid}
                      placeholder="입찰 금액"
                    />
                    <button 
                      className="bid-button"
                      onClick={handlePlaceBid}
                      disabled={
                        parseInt(manualBidAmount) <= currentHighestBid ||
                        parseInt(manualBidAmount) > player.coins
                      }
                    >
                      입찰하기
                    </button>
                  </div>
                  
                  <div className="bid-form">
                    <input 
                      type="number" 
                      className="bid-input"
                      value={autoBidAmount}
                      onChange={(e) => setAutoBidAmount(e.target.value)}
                      placeholder="최대 자동 입찰 금액"
                    />
                    <button 
                      className="bid-button"
                      onClick={setAutoBid}
                      disabled={
                        player.maxAutoBid > 0 ||
                        parseInt(autoBidAmount) <= currentHighestBid ||
                        parseInt(autoBidAmount) > player.coins
                      }
                    >
                      자동 입찰 설정
                    </button>
                  </div>
                  
                  {player.maxAutoBid > 0 && (
                    <button 
                      className="bid-button"
                      onClick={cancelBid}
                    >
                      자동 입찰 취소
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {isAuctionEnded && (
              <div className="auction-results">
                <h3 className="results-title">경매 결과</h3>
                
                {currentHighestBidder ? (
                  <>
                    <div className="winner-info">
                      <div className="winner-label">낙찰자:</div>
                      <div className="winner-name">{getBidderName(currentHighestBidder)}</div>
                      <div className="final-bid">{currentHighestBid} 코인</div>
                    </div>
                    
                    {currentHighestBidder === player.id ? (
                      <p>축하합니다! 당신이 이 아이템을 획득했습니다.</p>
                    ) : (
                      <>
                        <p>{getBidderName(currentHighestBidder)}가 이 아이템을 획득했습니다.</p>
                        <button 
                          className="create-button"
                          onClick={handleSellItem}
                        >
                          판매 완료 ({currentHighestBid} 코인 획득)
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="no-bidders">
                    입찰자가 없어 경매가 유찰되었습니다.
                  </div>
                )}
                
                <button 
                  className="create-button"
                  onClick={resetTestAuction}
                >
                  다음 경매
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuctionTest;