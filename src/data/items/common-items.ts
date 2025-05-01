/**
 * 테스트 및 기본 아이템 데이터
 */
import { ItemTag, Item, ItemCategory, BaseItem, AppraisedItem, UnappraisedItem, Value, ValueCurrency } from '@models/item';
import { generateRandomTags } from './item-tags';

/**
 * 테스트용 가치 통화 목록
 */

export const ValueCurrencies: ValueCurrency[] = [
  {
    id: 'gold',
    name: '금화',
    symbol: 'G',
    exchangeRate: 10000,
    icon: '/assets/icons/currencies/gold.png'
  },
  {
    id: 'silver',
    name: '은화',
    symbol: 'S',
    exchangeRate: 100,
    icon: '/assets/icons/currencies/silver.png'
  },
  {
    id: 'copper',
    name: '동화',
    symbol: 'C',
    exchangeRate: 1,
    icon: '/assets/icons/currencies/copper.png'
  }
];



/**
 * 테스트용 기본 아이템 목록
 */
export const testItems: Item[] = [
  {
    id: 'test-item-1',
    name: '오래된 은단검',
    description: '고대 장인이 만든 것으로 보이는 섬세한 무늬가 새겨진 은단검입니다.',
    condition: 100,
    baseValue: [{ currency: ValueCurrencies[0], amount: 2 }, { currency: ValueCurrencies[1], amount: 50 }, { currency: ValueCurrencies[2], amount: 10 }],
    convertedBaseValue: 25000, // 환산 가치
    actualValue: [{ currency: ValueCurrencies[0], amount: 3 }, { currency: ValueCurrencies[1], amount: 75 }, { currency: ValueCurrencies[2], amount: 15 }],
    convertedActualValue: 37515, // 감정 완료 상태 환산 가치
    isAppraised: true,
    category: ItemCategory.WEAPON,
    quantity: 1,
    tags: [
      {
        id: 'ancient',
        name: '고대의',
        icon: '/assets/tags/ancient.png',
        color: '#FFD700',
        description: '고대 시대에 만들어진 물건입니다.',
        rarity: 'rare',
        valueMultiplier: 2.5,
        isHidden: false
      }
    ],
    hiddenTags: []
  },
  {
    id: 'test-item-2',
    name: '깨진 청동 거울',
    description: '부분적으로 깨진 청동 거울로, 뒷면에 독특한 문양이 새겨져 있습니다.',
    baseValue: [{ currency: ValueCurrencies[0], amount: 1 }, { currency: ValueCurrencies[1], amount: 10 }, { currency: ValueCurrencies[2], amount: 5 }],
    convertedBaseValue: 11005, // 환산 가치
    isAppraised: false,
    category: ItemCategory.HOUSEHOLD,
    quantity: 1,
    tags: [],
    hiddenTags: [
      {
        id: 'rare',
        name: '희귀한',
        icon: '/assets/tags/rare.png',
        color: '#C0C0C0',
        description: '흔치 않은 물건입니다.',
        rarity: 'uncommon',
        valueMultiplier: 1.5,
        isHidden: true
      }
    ]
  },
  {
    id: 'test-item-3',
    name: '금도금 반지',
    description: '순금으로 얇게 도금된 반지입니다. 작은 보석이 박혀 있습니다.',
    baseValue: [{ currency: ValueCurrencies[0], amount: 5 }, { currency: ValueCurrencies[1], amount: 20 }, { currency: ValueCurrencies[2], amount: 2 }],
    convertedBaseValue: 52002, // 환산 가치
    isAppraised: false,
    category: ItemCategory.JEWELRY,
    quantity: 1,
    tags: [],
    hiddenTags: [
      {
        id: 'detailed',
        name: '정교한',
        icon: '/assets/tags/detailed.png',
        color: '#FFD700',
        description: '정교한 솜씨로 만들어진 물건입니다.',
        rarity: 'uncommon',
        valueMultiplier: 1.3,
        isHidden: true
      }
    ]
  },
  {
    id: 'test-item-4',
    name: '구리 동전',
    description: '오래된 구리 동전으로, 표면에 마모된 형상이 있습니다.',
    baseValue: [{ currency: ValueCurrencies[0], amount: 0 }, { currency: ValueCurrencies[1], amount: 0 }, { currency: ValueCurrencies[2], amount: 1 }],
    convertedBaseValue: 1, // 환산 가치
    isAppraised: false,
    category: ItemCategory.MATERIAL,
    quantity: 12,
    tags: [],
    hiddenTags: []
  },
  {
    id: 'test-item-5',
    name: '낡은 책',
    description: '표지가 닳은 오래된 책으로, 희미하게 문자를 읽을 수 있습니다.',
    condition: 80,
    baseValue: [{ currency: ValueCurrencies[0], amount: 0 }, { currency: ValueCurrencies[1], amount: 5 }, { currency: ValueCurrencies[2], amount: 0 }],
    convertedBaseValue: 500, // 환산 가치
    actualValue: [{ currency: ValueCurrencies[0], amount: 0 }, { currency: ValueCurrencies[1], amount: 10 }, { currency: ValueCurrencies[2], amount: 0 }],
    convertedActualValue: 1000, // 감정 완료 상태
    isAppraised: true,
    category: ItemCategory.BOOK,
    quantity: 1,
    tags: [
      {
        id: 'academic',
        name: '학술적인',
        icon: '/assets/tags/academic.png',
        color: '#8A2BE2',
        description: '학문적 가치가 있는 아이템입니다.',
        rarity: 'common',
        valueMultiplier: 1.3,
        isHidden: false
      }
    ],
    hiddenTags: []
  }
];

/**
 * 카테고리별 아이템 이름 템플릿
 * 아이템 생성 시 활용
 */
export const itemNameTemplates: Record<ItemCategory, string[]> = {
  [ItemCategory.WEAPON]: [
    '녹슨 {0}', '오래된 {0}', '장식된 {0}', '손잡이가 화려한 {0}', '새겨진 {0}'
  ],
  [ItemCategory.JEWELRY]: [
    '빛바랜 {0}', '작은 {0}', '화려한 {0}', '고풍스러운 {0}', '정교한 {0}'
  ],
  [ItemCategory.ART]: [
    '희미한 {0}', '작은 {0}', '프레임이 낡은 {0}', '오래된 {0}', '깊이 있는 {0}'
  ],
  [ItemCategory.BOOK]: [
    '낡은 {0}', '표지가 닳은 {0}', '먼지 쌓인 {0}', '바랜 {0}', '주석이 달린 {0}'
  ],
  [ItemCategory.HOUSEHOLD]: [
    '깨진 {0}', '낡은 {0}', '녹슨 {0}', '흠집난 {0}', '사용된 {0}'
  ],
  [ItemCategory.MATERIAL]: [
    '희귀한 {0}', '빛나는 {0}', '무거운 {0}', '변색된 {0}', '부식된 {0}'
  ]
};

/**
 * 카테고리별 아이템 기본형
 */
export const categoryBaseItems: Record<ItemCategory, string[]> = {
  [ItemCategory.WEAPON]: ['단검', '장검', '도끼', '창', '활', '방패', '총'],
  [ItemCategory.JEWELRY]: ['목걸이', '반지', '귀걸이', '팔찌', '브로치', '왕관', '장신구'],
  [ItemCategory.ART]: ['그림', '조각상', '꽃병', '도자기', '태피스트리', '부조', '초상화'],
  [ItemCategory.BOOK]: ['서적', '일기', '논문', '지도', '편지', '두루마리', '족보'],
  [ItemCategory.HOUSEHOLD]: ['그릇', '컵', '시계', '램프', '거울', '의자', '탁자'],
  [ItemCategory.MATERIAL]: ['광석', '보석', '천', '가죽', '목재', '금속', '유리']
};

/**
 * 카테고리별 기본 가치 범위
 */
export const categoryValueRanges: Record<ItemCategory, { min: number, max: number }> = {
  [ItemCategory.WEAPON]: { min: 80, max: 200 },
  [ItemCategory.JEWELRY]: { min: 120, max: 300 },
  [ItemCategory.ART]: { min: 100, max: 250 },
  [ItemCategory.BOOK]: { min: 40, max: 150 },
  [ItemCategory.HOUSEHOLD]: { min: 30, max: 120 },
  [ItemCategory.MATERIAL]: { min: 5, max: 80 }
};

/**
 * 랜덤 아이템 생성 함수
 * 수집 이벤트 등에서 사용
 */
export function generateRandomItem(category?: ItemCategory): UnappraisedItem {
  // 카테고리가 지정되지 않은 경우 랜덤 선택
  const itemCategory = category || Object.values(ItemCategory)[
    Math.floor(Math.random() * Object.values(ItemCategory).length)
  ];
  
  // 기본 아이템 형태 선택
  const baseItemType = categoryBaseItems[itemCategory][
    Math.floor(Math.random() * categoryBaseItems[itemCategory].length)
  ];
  
  // 이름 템플릿 선택
  const nameTemplate = itemNameTemplates[itemCategory][
    Math.floor(Math.random() * itemNameTemplates[itemCategory].length)
  ];
  
  // 아이템 이름 생성
  const itemName = nameTemplate.replace('{0}', baseItemType);
  
  // 아이템 기본 가치 생성
  const valueRange = categoryValueRanges[itemCategory];
  const baseValue = Math.floor(
    valueRange.min + Math.random() * (valueRange.max - valueRange.min)
  );
  
  // 기본 설명 생성
  const descriptions = [
    `오래된 ${baseItemType}으로, 시간이 지나며 손상된 흔적이 있습니다.`,
    `${baseItemType}입니다. 일반적인 것 같지만 자세히 살펴볼 필요가 있습니다.`,
    `정교하게 만들어진 ${baseItemType}입니다. 상태가 좋아 보입니다.`,
    `낡은 ${baseItemType}입니다. 여러 흔적이 역사를 말해줍니다.`,
    `상태가 좋은 ${baseItemType}입니다. 주인이 잘 관리한 것 같습니다.`
  ];
  
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // 아이템 ID 생성
  const id = `item-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  
  // 기본 아이템 생성
  return {
    id,
    name: itemName,
    description,
    baseValue: [{ currency: ValueCurrencies[0], amount: baseValue }, { currency: ValueCurrencies[1], amount: baseValue }, { currency: ValueCurrencies[2], amount: baseValue }],
    convertedBaseValue: baseValue * ValueCurrencies[0].exchangeRate + baseValue * ValueCurrencies[1].exchangeRate + baseValue * ValueCurrencies[2].exchangeRate, // 환산 가치
    category: itemCategory,
    isAppraised: false,
    quantity: 1,
    tags: [],
    hiddenTags: [],
  };
}

/**
 * ID로 테스트 아이템 조회
 */
export function getTestItemById(id: string): Item | undefined {
  return testItems.find(item => item.id === id);
}