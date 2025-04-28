/**
 * 게임 상태 관리를 위한 Context
 */
import { createContext, useContext, useMemo, useReducer } from 'react';
import { GameState, GameSettings } from '@models/game';
import { GameAction } from './actionTypes';

// 초기 게임 설정
const initialGameSettings: GameSettings = {
  difficulty: 'normal',
  enableTutorial: true,
  soundVolume: 0.7,
  musicVolume: 0.5,
  textSpeed: 1,
  adaptiveTimer: true,
  timerDuration: 30, // 초 단위
};

// 초기 게임 상태 (새 게임 시작용)
const initialGameState: GameState = {
  player: {
    id: '',
    name: '',
    level: 1,
    experience: 0,
    money: 500,
    reputation: 0,
    expertise: {} as any, // 초기화 시 설정
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
  },
  inventory: [],
  locations: [],
  currentLocationId: 'shop', // 시작 지점
  calendar: [],
  currentDay: 1,
  currentMonth: 1,
  currentYear: 1,
  upcomingAuctions: [],
  activeAuction: null,
  gameSettings: initialGameSettings,
  isGamePaused: false
};

// 리듀서 함수
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER_NAME':
      return {
        ...state,
        player: {
          ...state.player,
          name: action.payload
        }
      };
    
    case 'ADD_ITEM':
      return {
        ...state,
        inventory: [...state.inventory, action.payload]
      };
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        inventory: state.inventory.filter(item => item.id !== action.payload)
      };
    
    case 'REMOVE_ITEMS':
      return {
        ...state,
        inventory: state.inventory.filter(item => !action.payload.includes(item.id))
      };
    
    case 'UPDATE_MONEY':
      return {
        ...state,
        player: {
          ...state.player,
          money: state.player.money + action.payload
        }
      };
    
    case 'CHANGE_LOCATION':
      return {
        ...state,
        currentLocationId: action.payload
      };
    
    case 'ADVANCE_DAY':
      const daysToAdvance = action.payload || 1;
      return {
        ...state,
        currentDay: state.currentDay + daysToAdvance,
        player: {
          ...state.player,
          daysPassed: state.player.daysPassed + daysToAdvance
        }
      };
    
    case 'UPDATE_EXPERIENCE':
      const { amount } = action.payload;
      // 카테고리별 경험치 업데이트 로직 구현 필요
      return {
        ...state,
        player: {
          ...state.player,
          experience: state.player.experience + amount
        }
      };
    
    case 'UPDATE_REPUTATION':
      const { contactId, amount: repAmount } = action.payload;
      // 연락처별 평판 업데이트 로직 구현 필요
      return {
        ...state,
        player: {
          ...state.player,
          reputation: state.player.reputation + repAmount,
          contacts: state.player.contacts.map(contact => 
            contact.id === contactId
              ? { ...contact, reputationScore: contact.reputationScore + repAmount }
              : contact
          )
        }
      };
    
    case 'TOGGLE_PAUSE':
      return {
        ...state,
        isGamePaused: !state.isGamePaused
      };
    
    case 'LOAD_GAME':
      return action.payload;
    
    // 추가 액션 타입은 여기에 구현
    
    default:
      return state;
  }
}

// Context 생성
export const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({
  state: initialGameState,
  dispatch: () => null
});

// Provider 컴포넌트
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Hook
export const useGameState = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};