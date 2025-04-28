/**
 * 경매(Auction) 화면 컴포넌트
 */
import React, { useState } from 'react';
import { useAuction } from '../hooks/useAuction';
import { useGameState } from '@store/gameContext';
import { AuctionParticipant } from '../types/auction_types';

// 타이머 컴포넌트
const AuctionTimer: React.FC<{ timeRemaining: number }> = ({ timeRemaining }) => {
  // 30초 이하면 경고색으로 변경
  const isWarning = timeRemaining <= 10;
  // 5초 이하면 위험색으로 변경
  const isDanger = timeRemaining <= 5;

  return (
    <div className={`auction-timer ${isWarning ? 'warning' : ''} ${isDanger ? 'danger' : ''}`}>
      <div className="timer-value">{timeRemaining}</div>
      <div className="timer-label">초</div>
    </div>
  );
};

// 경매 참가자 목록 컴포넌트
const ParticipantList: React.FC<{ 
  participants: AuctionParticipant[],
  currentHighestBidderId: string | null
}> = ({ participants, currentHighestBidderId }) => {
  return (
    <div className="participants-list">
      <h3>경매 참가자</h3>
      <ul>
        {participants.map(participant => (
          <li 
            key={participant.id} 
            className={`participant ${participant.isPlayer ? 'player' : ''} ${
              currentHighestBidderId === participant.id ? 'highest-bidder' : ''
            }`}
          >
            <span className="name">{participant.name}</span>
            {currentHighestBidderId === participant.id && (
              <span className="badge">최고 입찰</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// 입찰 기록 컴포넌트
const BidHistory: React.FC<{ 
  bidHistory: Array<{ 
    participantId: string, 
    bidAmount: number, 
    timestamp: number 
  }>,
  participants: AuctionParticipant[]
}> = ({ bidHistory, participants }) => {
  const getParticipantName = (id: string) => {
    const participant = participants.find(p => p.id === id);
    return participant ? participant.name : 'Unknown';
  };

  return (
    <div className="bid-history">
      <h3>입찰 기록</h3>
      <div className="history-list">
        {bidHistory.length === 0 ? (
          <p className="no-bids">아직 입찰 기록이 없습니다.</p>
        ) : (
          <ul>
            {[...bidHistory].reverse().map((bid, index) => (
              <li key={index} className="bid-record">
                <span className="bidder">{getParticipantName(bid.participantId)}</span>
                <span className="amount">{bid.bidAmount}G</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// 입찰 폼 컴포넌트
const BidForm: React.FC<{ 
  currentHighestBid: number, 
  onPlaceBid: (amount: number) => boolean,
  playerMoney: number
}> = ({ currentHighestBid, onPlaceBid, playerMoney }) => {
  const [bidAmount, setBidAmount] = useState(Math.floor(currentHighestBid * 1.1));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (bidAmount <= currentHighestBid) {
      setError("현재 최고 입찰가보다 높아야 합니다.");
      return;
    }

    if (bidAmount > playerMoney) {
      setError("보유 금액보다 많습니다.");
      return;
    }

    const success = onPlaceBid(bidAmount);
    if (!success) {
      setError("입찰에 실패했습니다.");
    }
  };

  // 일반적인 입찰 금액 버튼들 (+10%, +20%, +50%)
  const bidPresets = [
    { label: "+10%", value: Math.floor(currentHighestBid * 1.1) },
    { label: "+20%", value: Math.floor(currentHighestBid * 1.2) },
    { label: "+50%", value: Math.floor(currentHighestBid * 1.5) }
  ];

  return (
    <div className="bid-form">
      <form onSubmit={handleSubmit}>
        <div className="bid-amount-controls">
          <div className="bid-presets">
            {bidPresets.map((preset, index) => (
              <button
                key={index}
                type="button"
                className="preset-button"
                onClick={() => setBidAmount(preset.value)}
                disabled={preset.value > playerMoney}
              >
                {preset.label} ({preset.value}G)
              </button>
            ))}
          </div>
          <div className="custom-bid">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(parseInt(e.target.value, 10) || 0)}
              min={currentHighestBid + 1}
              max={playerMoney}
            />
            <button type="submit" className="bid-button">입찰하기</button>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

// 경매 아이템 디스플레이 컴포넌트
const AuctionItemDisplay: React.FC<{ 
  name: string, 
  description: string, 
  category: string,
  startingBid: number,
  currentBid: number
}> = ({ name, description, category, startingBid, currentBid }) => {
  return (
    <div className="auction-item">
      <div className="item-image">
        {/* 아이템 이미지 또는 카테고리 아이콘 */}
        <div className="category-icon">{category.charAt(0)}</div>
      </div>
      <div className="item-details">
        <h2 className="item-name">{name}</h2>
        <p className="item-description">{description}</p>
        <div className="item-pricing">
          <div className="starting-bid">
            <span className="label">시작가:</span>
            <span className="value">{startingBid}G</span>
          </div>
          <div className="current-bid">
            <span className="label">현재가:</span>
            <span className="value">{currentBid}G</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 경매 상태 메시지 컴포넌트
const AuctionStatusMessage: React.FC<{ 
  status: string, 
  itemName: string,
  round: number,
  totalItems: number
}> = ({ status, itemName, round, totalItems }) => {
  let message = '';
  
  switch(status) {
    case 'scheduled':
      message = '경매가 곧 시작됩니다.';
      break;
    case 'starting':
      message = '경매가 시작되었습니다!';
      break;
    case 'bidding':
      message = `[${round}/${totalItems}] "${itemName}" 경매 진행 중...`;
      break;
    case 'evaluating':
      message = '입찰이 마감되었습니다. 결과를 확인 중...';
      break;
    case 'transitioning':
      message = '다음 아이템으로 넘어갑니다...';
      break;
    case 'concluding':
      message = '모든 경매가 완료되었습니다. 결과를 정리 중...';
      break;
    case 'complete':
      message = '경매가 종료되었습니다.';
      break;
    default:
      message = '경매 준비 중...';
  }
  
  return <div className={`auction-status-message status-${status}`}>{message}</div>;
};

// 경매 결과 요약 컴포넌트
const AuctionSummary: React.FC<{ 
  items: Array<{
    name: string,
    sold: boolean,
    finalPrice: number,
    winner: string
  }>,
  playerItems: string[],
  totalSpent: number
}> = ({ items, playerItems, totalSpent }) => {
  return (
    <div className="auction-summary">
      <h2>경매 결과</h2>
      
      <div className="player-summary">
        <h3>당신의 획득 아이템</h3>
        {playerItems.length === 0 ? (
          <p>획득한 아이템이 없습니다.</p>
        ) : (
          <ul>
            {playerItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        <div className="total-spent">총 지출: {totalSpent}G</div>
      </div>
      
      <div className="all-items-summary">
        <h3>모든 아이템 결과</h3>
        <table>
          <thead>
            <tr>
              <th>아이템</th>
              <th>결과</th>
              <th>최종가</th>
              <th>낙찰자</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.sold ? '낙찰' : '유찰'}</td>
                <td>{item.sold ? `${item.finalPrice}G` : '-'}</td>
                <td>{item.sold ? item.winner : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 메인 경매 컴포넌트
const AuctionScreen: React.FC = () => {
  const { state } = useGameState();
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

  // 테스트용 경매 시작 함수
  const handleStartAuction = () => {
    // 가정: 실제로는 액티브 경매 ID를 state에서 가져옴
    startAuction('test-auction-id');
  };

  // 현재 경매 아이템
  const currentItem = auctionItems[currentItemIndex];

  // 경매 결과 계산 (경매 종료 시)
  const auctionResults = {
    items: auctionItems.map(item => ({
      name: item.item.name,
      sold: item.status === 'sold',
      finalPrice: item.currentBid,
      winner: item.highestBidderId 
        ? participants.find(p => p.id === item.highestBidderId)?.name || '알 수 없음'
        : '-'
    })),
    playerItems: auctionItems
      .filter(item => item.highestBidderId === state.player.id)
      .map(item => item.item.name),
    totalSpent: auctionItems
      .filter(item => item.highestBidderId === state.player.id)
      .reduce((sum, item) => sum + item.currentBid, 0)
  };

  return (
    <div className="auction-screen">
      <h1>경매장</h1>
      
      {(auctionStatus === 'scheduled' || !auctionStatus) && (
        <div className="auction-intro">
          <p>다음 경매가 예정되어 있습니다.</p>
          <button onClick={handleStartAuction}>경매 시작</button>
        </div>
      )}
      
      {auctionStatus !== 'scheduled' && auctionStatus !== 'complete' && currentItem && (
        <>
          <AuctionStatusMessage 
            status={auctionStatus}
            itemName={currentItem.item.name}
            round={currentItemIndex + 1}
            totalItems={auctionItems.length}
          />
          
          <div className="auction-main">
            <div className="auction-left">
              <AuctionItemDisplay 
                name={currentItem.item.name}
                description={currentItem.item.description}
                category={currentItem.item.category}
                startingBid={currentItem.startingBid}
                currentBid={currentRound?.currentHighestBid || currentItem.startingBid}
              />
              
              {auctionStatus === 'bidding' && (
                <>
                  <AuctionTimer timeRemaining={timeRemaining} />
                  <BidForm 
                    currentHighestBid={currentRound?.currentHighestBid || currentItem.startingBid}
                    onPlaceBid={placeBid}
                    playerMoney={state.player.money}
                  />
                </>
              )}
            </div>
            
            <div className="auction-right">
              <ParticipantList 
                participants={participants}
                currentHighestBidderId={currentRound?.currentHighestBidderId || null}
              />
              <BidHistory 
                bidHistory={bidHistory.filter(bid => bid.itemId === currentItem.item.id)}
                participants={participants}
              />
            </div>
          </div>
        </>
      )}
      
      {auctionStatus === 'complete' && (
        <AuctionSummary 
          items={auctionResults.items}
          playerItems={auctionResults.playerItems}
          totalSpent={auctionResults.totalSpent}
        />
      )}
    </div>
  );
};

export default AuctionScreen;