/**
 * 게임 상태 관리를 위한 Context
 */
import { createContext, useContext, useMemo, useReducer } from 'react';
import { GameState, GameSettings, CalendarEvent } from '@models/game';
import { AppraisedItem, UnappraisedItem, ItemCategory, ItemTag, isAppraised, Value } from '@/models/item'; // Value 추가
import { GameAction } from './actionTypes';
import { initialPlayerState as constantInitialPlayer, initialGameSettings as constantInitialSettings } from '@/data/constants/game-constants';
import { CategoryExpertise, CharacterInfo, Reputation } from '@/models/player'; // CharacterInfo, Reputation 추가
import { getTagById } from '@/data/items/item-tags';
import { ValueCurrencies } from '@/data/items/common-items'; // ValueCurrencies 추가


// 초기 게임 상태 (새 게임 시작용)
const initialGameState: GameState = {
  player: {
    id: constantInitialPlayer.id || '', // game-constants에서 가져옴
    info: { // CharacterInfo 타입에 맞게 확장
      name: constantInitialPlayer.name || '', // game-constants에서 가져옴
      age: 0, // 기본값 또는 다른 소스에서
      sex: { type: "None", enum: ["Male", "Female", "None"] }, // 기본값
      height: 0, // 기본값
      weight: 0, // 기본값
      race: { type: "Human", enum: ["Human", "Elf", "Dwarf", "Ain", "Preta", "Dragon", "Bird"] }, // 기본값
      background: { type: "Commoner", enum: ["Lower", "Commoner", "Middle", "Noble", "Royal"] }, // 기본값
      origin: { type: "Tirin", enum: ["Aviarium", "Tirin", "Flusum", "Ulbua", "Bupoli"] }, // 기본값
    } as CharacterInfo,
    level: constantInitialPlayer.level, // game-constants에서 가져옴
    experience: constantInitialPlayer.experience, // game-constants에서 가져옴
    reputation: [], // Reputation[] 타입이므로 빈 배열로 시작, game-constants의 reputation(number)은 다른 방식으로 활용하거나 무시
    expertise: Object.values(ItemCategory).reduce((acc, category) => { // ItemCategory 기반으로 초기화
      acc[category] = { level: 0, experience: 0, nextLevelThreshold: 100 };
      return acc;
    }, {} as CategoryExpertise),
    // PlayerStatus 모델에 맞게 필드명 및 구조 조정, game-constants에서 가져옴
    status: { 
      hp: constantInitialPlayer.status.hp, 
      maxHp: constantInitialPlayer.status.maxHp, 
      mp: constantInitialPlayer.status.mp, 
      maxMp: constantInitialPlayer.status.maxMp, 
      fp: constantInitialPlayer.status.fp, 
      maxFp: constantInitialPlayer.status.maxFp, 
      sanity: constantInitialPlayer.status.sanity, 
      maxSanity: constantInitialPlayer.status.maxSanity, 
      hunger: constantInitialPlayer.status.hunger, 
      maxHunger: constantInitialPlayer.status.maxHunger, 
      cash: constantInitialPlayer.status.cash.map(m => { 
        const currencyInfo = ValueCurrencies.find(vc => vc.id === m.currency);
        return {
          currency: currencyInfo || ValueCurrencies[0], // 못찾으면 기본 통화
          amount: m.amount
        } as Value;
      }),
      convertedMoney: constantInitialPlayer.status.convertedMoney, 
    },
    daysPassed: constantInitialPlayer.daysPassed, 
    timerPreference: constantInitialPlayer.timerPreference as 'relaxed' | 'normal' | 'challenging', // 타입 단언
  },
  inventory: [],
  locations: [],
  currentLocationId: 'shop',
  calendar: [],
  currentDay: 1,
  currentMonth: 1,
  currentYear: 1,
  upcomingAuctions: [],
  activeAuction: null,
  gameSettings: { // GameSettings 모델 기준으로 필드 설정, game-constants에서 가져옴
    difficulty: constantInitialSettings.difficulty, // 기본 난이도 설정
    enableTutorial: constantInitialSettings.enableTutorial,
    soundVolume: constantInitialSettings.soundVolume,
    musicVolume: constantInitialSettings.musicVolume,
    textSpeed: constantInitialSettings.difficulty.id === 'Just Game' ? constantInitialSettings.textSpeed : undefined, // Just Game 난이도에서만 기본 텍스트 속도 참조 & 설정 가능
  },
  isGamePaused: false,
};

// 리듀서 함수
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    // CoreGameAction 처리
    case 'SET_PLAYER_NAME': // PlayerAction과 중복, PlayerAction 우선 또는 CoreGameAction의 SET_PLAYER_NAME으로 통합
      return {
        ...state,
        player: {
          ...state.player,
          info: {
            ...state.player.info,
            name: action.payload,
          },
        },
      };
    case 'UPDATE_MONEY': // payload: Value[]
      return {
        ...state,
        player: {
          ...state.player,
          status: {
            ...state.player.status,
            cash: state.player.status.cash.map(currentCash => {
              const payloadCash = action.payload.find(p => p.currency.id === currentCash.currency.id);
              if (payloadCash) {
                return { ...currentCash, amount: currentCash.amount + payloadCash.amount };
              }
              return currentCash;
            }),
            // convertedMoney도 함께 업데이트 필요
            convertedMoney: state.player.status.cash.reduce((sum, cashVal) => sum + (cashVal.amount * cashVal.currency.exchangeRate), 0) // 예시: 모든 통화의 가치를 합산
          },
        },
      };
    case 'UPDATE_CONVERTED_MONEY':
      return {
        ...state,
        player: {
          ...state.player,
          status: {
            ...state.player.status,
            convertedMoney: action.payload,
          },
        },
      };
    case 'CHANGE_LOCATION': // CoreGameAction, MapAction의 SET_CURRENT_LOCATION과 동일 기능
      return {
        ...state,
        currentLocationId: action.payload,
      };
    case 'ADVANCE_DAY': // CoreGameAction & CalendarAction
      const daysToAdvance = action.payload || 1;
      let newDay = state.currentDay + daysToAdvance;
      let newMonth = state.currentMonth;
      let newYear = state.currentYear;

      // TODO: 월별 정확한 일수 계산 (예: getDaysInMonth(month, year) 함수 사용)
      while (newDay > 30) { // 임시로 30일 기준
        newDay -= 30;
        newMonth++;
        if (newMonth > 12) {
          newMonth = 1;
          newYear++;
        }
      }

      return {
        ...state,
        currentDay: newDay,
        currentMonth: newMonth,
        currentYear: newYear,
        player: {
          ...state.player,
          daysPassed: state.player.daysPassed + daysToAdvance,
        },
      };
    case 'START_AUCTION':
      const auctionToStart = state.upcomingAuctions.find(auc => auc.id === action.payload);
      if (!auctionToStart) return state;
      return {
        ...state,
        activeAuction: { ...auctionToStart, status: 'active' },
        upcomingAuctions: state.upcomingAuctions.filter(auc => auc.id !== action.payload),
      };
    case 'END_AUCTION':
      return {
        ...state,
        activeAuction: null,
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        gameSettings: {
          ...state.gameSettings,
          ...action.payload,
        },
      };
    case 'TOGGLE_PAUSE':
      return {
        ...state,
        isGamePaused: !state.isGamePaused,
      };
    case 'LOAD_GAME':
      return action.payload;
    case 'RESET_GAME':
      return initialGameState;

    // InventoryAction 처리
    case 'ADD_ITEM':
      const existingItemIndex = state.inventory.findIndex(
        item => !isAppraised(item) && !isAppraised(action.payload) && item.name === action.payload.name && item.category === action.payload.category
      );
      if (existingItemIndex > -1 && state.inventory[existingItemIndex].quantity < 999) { // 스택 가능한 미감정 아이템
        return {
          ...state,
          inventory: state.inventory.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { // 새 아이템 또는 감정된 아이템
        ...state,
        inventory: [...state.inventory, action.payload],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        inventory: state.inventory.filter(item => item.id !== action.payload),
      };
    case 'REMOVE_ITEMS':
      return {
        ...state,
        inventory: state.inventory.filter(item => !action.payload.includes(item.id)),
      };
    case 'UPDATE_ITEM_QUANTITY':
      return {
        ...state,
        inventory: state.inventory.map(item =>
          item.id === action.payload.itemId
            ? { ...item, quantity: Math.max(0, action.payload.quantity) } // 수량 0 미만 방지
            : item
        ).filter(item => item.quantity > 0), // 수량이 0인 아이템 제거
      };

    // AppraisalAction 처리
    case 'APPRAISE_ITEM': {
      const { itemId, actualValue, convertedActualValue, condition, discoveredTags, history: appraisalHistory, tool } = action.payload;
      return {
        ...state,
        inventory: state.inventory.map(item => {
          if (item.id === itemId) {
            const baseProperties = { ...item };
            
            const newResolvedTags: ItemTag[] = discoveredTags.map(tagOrId => {
              if (typeof tagOrId === 'string') {
                const foundTag = getTagById(tagOrId);
                return foundTag || { id: tagOrId, name: tagOrId, description: `Discovered with ${tool}`, rarity: 'common', valueMultiplier: 1, icon: '', color: '', isHidden: false };
              }
              return tagOrId; // 이미 ItemTag 객체인 경우
            });

            const existingTags = item.tags || [];
            const combinedTags = [...existingTags];
            newResolvedTags.forEach(newTag => {
              if (!combinedTags.some(existingTag => existingTag.id === newTag.id)) {
                combinedTags.push(newTag);
              }
            });
            
            const appraisedItem: AppraisedItem = {
              ...(baseProperties as Omit<UnappraisedItem, 'isAppraised' | 'hiddenTags'>), // 타입 단언으로 UnappraisedItem의 특정 속성 제외
              isAppraised: true,
              actualValue: actualValue,
              convertedActualValue: convertedActualValue,
              condition: condition,
              tags: combinedTags, // 발견된 태그와 기존 태그 병합
              history: appraisalHistory || (isAppraised(item) ? item.history : `Appraised with ${tool}`), // 감정 이력
              hiddenTags: [], // 감정 후에는 숨겨진 태그가 없다고 가정 (또는 discoveredTags 중 isHidden으로 처리)
            };
            return appraisedItem;
          }
          return item;
        }),
      };
    }
    case 'COMPLETE_APPRAISAL': { // 이 액션은 APPRAISE_ITEM과 유사하나, 주로 UI 완료 시점 등에서 사용될 수 있음
        const { itemId, actualValue, condition } = action.payload;
        return {
            ...state,
            inventory: state.inventory.map(item => {
                if (item.id === itemId && isAppraised(item)) { 
                    return {
                        ...item,
                        actualValue: actualValue, // 실제 가치 업데이트
                        condition: condition,   // 상태 업데이트
                    };
                }
                return item;
            }),
        };
    }

    // ExpertiseAction 처리
    case 'UPDATE_EXPERIENCE': { 
      const { amount, category, source } = action.payload; // source는 로그 등에 활용 가능
      const currentCategoryExpertise = state.player.expertise[category as ItemCategory] || { experience: 0, level: 0, nextLevelThreshold: 100 };
      const newExperience = currentCategoryExpertise.experience + amount;
      // TODO: 레벨업 로직 (skills.ts의 skillUpgradeCosts 등 참조)
      // const { newLevel, newNextLevelThreshold } = calculateNewLevel(category, newExperience, currentCategoryExpertise.level);
      return {
        ...state,
        player: {
          ...state.player,
          experience: state.player.experience + amount, // 총 경험치도 업데이트
          expertise: {
            ...state.player.expertise,
            [category as ItemCategory]: {
              ...currentCategoryExpertise,
              experience: newExperience,
              // level: newLevel, // 레벨업 로직 결과 반영
              // nextLevelThreshold: newNextLevelThreshold, // 레벨업 로직 결과 반영
            },
          },
        },
      };
    }
    case 'UPDATE_REPUTATION': { // PlayerAction과 중복, ExpertiseAction 우선 또는 통합
      const { contactId, amount: repAmount } = action.payload;
      const existingReputationIndex = state.player.reputation.findIndex(rep => rep.id === contactId);
      
      if (existingReputationIndex > -1) {
        return {
          ...state,
          player: {
            ...state.player,
            reputation: state.player.reputation.map((rep, index) =>
              index === existingReputationIndex
                ? { ...rep, reputationScore: rep.reputationScore + repAmount /* TODO: 평판 레벨 변경 로직 */ }
                : rep
            ),
          },
        };
      } else {
        // TODO: contacts.ts 에서 contactId로 기본 평판 정보 찾아 새 Reputation 객체로 추가
        // const contactData = getContactById(contactId);
        // if (contactData) {
        //   const newRep: Reputation = { ...contactData, reputationScore: repAmount, relationshipLevel: 0, isUnlocked: true, nextLevelThreshold: 100 };
        //   return { ...state, player: { ...state.player, reputation: [...state.player.reputation, newRep]}};
        // }
        return state; 
      }
    }
    case 'LEVEL_UP_EXPERTISE': { 
        const { category } = action.payload;
        const currentExpertise = state.player.expertise[category as ItemCategory];
        if (!currentExpertise) return state;
        // TODO: 실제 레벨업 로직 구현 (skills.ts 데이터 기반, 경험치 차감 등)
        // const upgradeCost = getSkillUpgradeCost(category, currentExpertise.level);
        // if (currentExpertise.experience >= currentExpertise.nextLevelThreshold && state.player.experience >= (upgradeCost?.experience || Infinity)) {
        //   return { ...state, player: { ...state.player, experience: state.player.experience - (upgradeCost?.experience || 0), expertise: { ... }}};
        // }
        return state;
    }
    case 'UNLOCK_SKILL': // Player 모델에 unlockedSkills: string[] 추가 필요
        // const skillId = action.payload;
        // if (state.player.unlockedSkills?.includes(skillId)) return state; 
        // return { ...state, player: { ...state.player, unlockedSkills: [...(state.player.unlockedSkills || []), skillId] } };
        return state;
    case 'ACTIVATE_SKILL': // Player 모델에 activeSkills: string[] 추가 필요
        // const skillToActivate = action.payload;
        // return { ...state, player: { ...state.player, activeSkills: [...(state.player.activeSkills || []), skillToActivate] } };
        return state;

    // MapAction 처리
    case 'SET_CURRENT_LOCATION': 
      return {
        ...state,
        currentLocationId: action.payload,
      };
    case 'DISCOVER_LOCATION': { 
        const locationId = action.payload;
        // 이미 발견 및 잠금 해제된 장소면 변경 없음
        if (state.locations.find(loc => loc.id === locationId && loc.isUnlocked)) {
            return state;
        }
        // TODO: src/data/locations/map-locations.ts 에서 locationId로 장소 정보(LocationData)를 찾아와야 함
        // const locationData = getLocationDataById(locationId); 
        // if (!locationData) return state; // 없는 장소 ID면 무시

        const existingLocationIdx = state.locations.findIndex(loc => loc.id === locationId);
        if (existingLocationIdx > -1) { // 이미 목록에 있지만 잠금 해제 안된 경우
            return {
                ...state,
                locations: state.locations.map((loc, idx) => 
                    idx === existingLocationIdx ? { ...loc, isUnlocked: true } : loc
                ),
            };
        } else { // 새 장소 발견
            // return {
            // ...state,
            // locations: [...state.locations, { ...locationData, isUnlocked: true, availableActions: locationData.actions }], // Location 타입에 맞게 변환
            // };
            return state; // locationData 로드 로직 구현 후 주석 해제
        }
    }
    case 'SET_LOCATION_ACCESSIBLE': { 
        const { locationId, isAccessible } = action.payload;
        return {
            ...state,
            locations: state.locations.map(loc =>
                loc.id === locationId ? { ...loc, isUnlocked: isAccessible } : loc
            ),
        };
    }
    case 'MARK_LOCATION': // GameState에 markedLocationId: string | null 같은 필드 필요
        // return { ...state, markedLocationId: action.payload };
        return state;

    // PlayerAction 처리
    // SET_PLAYER_NAME은 CoreGameAction 또는 ExpertiseAction에서 처리될 수 있음 (중복 정의)
    // PlayerAction의 SET_PLAYER_NAME은 CoreGameAction의 것과 동일하므로 여기서는 생략 가능
    case 'SET_HEALTH': 
      return {
        ...state,
        player: {
          ...state.player,
          status: {
            ...state.player.status,
            hp: Math.max(0, Math.min(action.payload, state.player.status.maxHp)), 
          },
        },
      };
    case 'SET_MENTAL': 
      return {
        ...state,
        player: {
          ...state.player,
          status: {
            ...state.player.status,
            mp: Math.max(0, Math.min(action.payload, state.player.status.maxMp)), 
          },
        },
      };
    case 'SET_FATIGUE': 
      return {
        ...state,
        player: {
          ...state.player,
          status: {
            ...state.player.status,
            fp: Math.max(0, Math.min(action.payload, state.player.status.maxFp)), 
          },
        },
      };
    case 'SET_MONEY': // PlayerAction의 SET_MONEY는 특정 통화에 대한 설정인지, convertedMoney인지 명확히 해야 함.
                      // 여기서는 convertedMoney를 업데이트하는 것으로 가정 (CoreGameAction의 UPDATE_CONVERTED_MONEY와 유사)
      return {
        ...state,
        player: {
          ...state.player,
          status: {
            ...state.player.status,
            convertedMoney: action.payload,
            // 또는 특정 주 통화(예: gold)의 amount를 직접 설정할 수도 있음
            // cash: state.player.status.cash.map(c => c.currency.id === 'gold' ? {...c, amount: action.payload} : c)
          },
        },
      };
    // PlayerAction의 UPDATE_REPUTATION은 ExpertiseAction의 것과 동일하므로 여기서는 생략 가능

    // CalendarAction 처리
    // ADVANCE_DAY는 CoreGameAction에서 이미 처리되었으므로 여기서는 생략 가능
    case 'SET_CURRENT_DAY': 
      // TODO: 유효한 날짜 범위 검사 (월별 최대 일수 고려)
      // const daysInMonth = getDaysInMonth(state.currentMonth, state.currentYear);
      // if (action.payload < 1 || action.payload > daysInMonth) return state;
      return {
        ...state,
        currentDay: action.payload,
      };
    case 'SET_CURRENT_MONTH': 
      // if (action.payload < 1 || action.payload > 12) return state;
      return {
        ...state,
        currentMonth: action.payload,
      };
    case 'SET_CURRENT_YEAR': 
      return {
        ...state,
        currentYear: action.payload,
      };
    case 'ADD_EVENT': { 
        const newEventPayload = action.payload;
        if (state.calendar.find(event => event.id === newEventPayload.id)) return state; // 중복 ID 방지
        // CalendarEvent 타입에 맞게 payload 변환 (필요시)
        const newEvent: CalendarEvent = {
            id: newEventPayload.id,
            title: newEventPayload.title,
            description: newEventPayload.description,
            type: newEventPayload.type as CalendarEvent['type'], // 타입 단언
            day: newEventPayload.day,
            month: newEventPayload.month,
            year: newEventPayload.year,
            isClosed: newEventPayload.isClosed || false,
            locationId: newEventPayload.locationId,
            // importance는 CalendarEvent 모델에 없으므로 제외하거나 모델에 추가
        };
        return {
            ...state,
            calendar: [...state.calendar, newEvent], 
        };
    }
    case 'UPDATE_EVENT': { 
        const { id, ...updatePayload } = action.payload;
        return {
            ...state,
            calendar: state.calendar.map(event =>
                event.id === id ? { ...event, ...updatePayload } : event
            ),
        };
    }
    case 'REMOVE_EVENT': 
      return {
        ...state,
        calendar: state.calendar.filter(event => event.id !== action.payload),
      };

    default:
      // 모든 GameAction 타입을 명시적으로 처리했는지 확인하기 위한 exhaustive check
      // 만약 GameAction에 새로운 타입이 추가되고 여기서 case 처리가 누락되면 컴파일 에러 발생
      const exhaustiveCheck: never = action; 
      console.warn(`Unhandled action: ${(exhaustiveCheck as any).type}`);
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
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};