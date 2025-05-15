/**
 * 게임 전체에서 사용되는 기본 상수값 정의
 */

// 게임 초기 설정
export const initialGameSettings = {
  adaptiveTimer: true,    // 경매 타이머 적응형 여부
  soundEnabled: true,     // 소리 활성화 여부
  textSpeed: 'normal',    // 텍스트 표시 속도
  autoSave: true          // 자동 저장 여부
};

// 초기 플레이어 상태
export const initialPlayerState = {
  id: '',
  name: '',
  level: 1,
  experience: 0,
  money: [
    { currency: 'gold', amount: 0 }, 
    { currency: 'silver', amount: 5 }, 
    { currency: 'bronze', amount: 0 }
  ], // 초기화 시 설정
  convertedMoney: 500, // 환산 가치
  reputation: 0,
  expertise: {},
  contacts: [],
  status: {
    health: 100,
    mental: 100,
    fatigue: 0,
    maxHealth: 100,
    maxMental: 100,
    maxFatigue: 100
  },
  daysPassed: 0,
  timerPreference: 'normal'
};

// 경매 타이머 설정 (초)
export const auctionTimerSettings = {
  relaxed: 45,       // 여유로운 모드
  normal: 30,        // 일반 모드
  challenging: 20    // 도전 모드
};

// 난이도 설정
export const difficultySettings = {
  easy: {
    startingMoney: 700,
    reputationGain: 1.2,
    prices: 0.9,
    rareItemChance: 1.1
  },
  normal: {
    startingMoney: 500,
    reputationGain: 1.0,
    prices: 1.0,
    rareItemChance: 1.0
  },
  hard: {
    startingMoney: 300,
    reputationGain: 0.8,
    prices: 1.1,
    rareItemChance: 0.9
  }
};