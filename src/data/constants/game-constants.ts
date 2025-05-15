/**
 * 게임 전체에서 사용되는 기본 상수값 정의
 */

// 난이도 설정
export const difficultySettings = {
  easy: {
    id: 'Just Game',
    startingMoney: 300,
    reputationGain: 1.5,
    prices: 0.7,
    rareItemChance: 1.2,
    adaptiveTextSpeed: false, // Just Game 난이도에서 false 고정
    adaptiveTimer: false, // Just Game 난이도에서 false 고정
  },
  hard: {
    id: 'Reality',
    startingMoney: 0,
    reputationGain: 1.0,
    prices: 1.0,
    rareItemChance: 1.0,
    adaptiveTextSpeed: true, // Reality 난이도에서 true
    adaptiveTimer: true, // Reality 난이도에서 true
  }
};

// 게임 초기 설정
export const initialGameSettings = {
  difficulty: difficultySettings['easy'], // 기본 난이도 설정
  enableTutorial: true,
  soundVolume: 50, // 0~100
  musicVolume: 50, // 0~100
  textSpeed: 1.0, // 기본 텍스트 속도
};

// 초기 플레이어 상태
export const initialPlayerState = {
  id: '',
  name: '',
  level: 1,
  experience: 0,
  reputation: 0,
  expertise: {},
  contacts: [],
  status: {
    hp: 100,
    mp: 100,
    fp: 0,
    maxHp: 100,
    maxMp: 100,
    maxFp: 100,
    sanity: 100,
    maxSanity: 100,
    hunger: 100,
    maxHunger: 100,
    cash: [
      { currency: 'gold', amount: 0 }, 
      { currency: 'silver', amount: 0 }, 
      { currency: 'bronze', amount: 0 }
    ], // 초기화 시 설정
    convertedMoney: 0, // 환산 가치
  },
  daysPassed: 0,
  timerPreference: 'normal'
};