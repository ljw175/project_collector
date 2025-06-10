/*
 * NPC 캐릭터 데이터
 */
import { NPC } from '@models/character';
import { ItemCategory } from '@models/item';
import { ValueCurrencies } from '../items/common-items';
import { 
    CharacterSexEnum, 
    CharacterRaceEnum, 
    CharacterBackgroundEnum, 
    CharacterOriginEnum,
    CharacterPersonalityEnum
} from '@/data/constants/character-constants';


export const npcs: NPC[] = [
  {
    id: 'npc_1',
    info: {
        name: 'NPC 1',
        age: 30,         // 캐릭터 나이
        sex: {
            type: CharacterSexEnum.MALE,
            enum: CharacterSexEnum
        }, // 성별
        height: 180,         // 키 (cm)
        weight: 75,         // 몸무게 (kg)
        race: {
            type: CharacterRaceEnum.HUMAN,
            enum: CharacterRaceEnum
        }, // 종족
        background: {
            type: CharacterBackgroundEnum.COMMONER,
            enum: CharacterBackgroundEnum
        }, // 배경
        origin: {
            type: CharacterOriginEnum.TIRIN,
            enum: CharacterOriginEnum
        }, // 출신지
        personality: {
            type: CharacterPersonalityEnum.CYNICAL,
            enum: CharacterPersonalityEnum
        }, // 성격
       },
    level: 1,
    experience: 0,
    reputation: [],
    expertise: {
        [ItemCategory.WEAPON]: {
            level: 1,
            experience: 0,
            nextLevelThreshold: 100,
        },
        [ItemCategory.JEWELRY]: {
            level: 1,
            experience: 0,
            nextLevelThreshold: 100,
        },
        [ItemCategory.ART]: {
            level: 1,
            experience: 0,
            nextLevelThreshold: 100,
        },
        [ItemCategory.BOOK]: {
            level: 1,
            experience: 0,
            nextLevelThreshold: 100,
        },
        [ItemCategory.HOUSEHOLD]: {
            level: 1,
            experience: 0,
            nextLevelThreshold: 100,
        },
        [ItemCategory.MATERIAL]: {
            level: 1,
            experience: 0,
            nextLevelThreshold: 100,
        },
    },
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
            {
                currency: ValueCurrencies[0],
                amount: 14,
            },
            {
                currency: ValueCurrencies[1],
                amount: 4,
            },
            {
                currency: ValueCurrencies[2],
                amount: 3,
            },
        ],
        convertedMoney: 14403, // 환산 가치 (통화의 총합)
        influence: [
            {
                influence: 0,
                fame: 0,
                veil: 0,
            },
        ]
    },
    daysPassed: 0,
  },
]
