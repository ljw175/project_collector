/**
 * 아이템 태그 시스템 데이터
 */
import { ItemTag } from '@models/item';

/**
 * 아이템 태그 데이터
 */
export const itemTags: ItemTag[] = [
  // 희귀도 관련 태그
  {
    id: 'common',
    name: '일반적인',
    description: '흔히 볼 수 있는 평범한 물건입니다.',
    rarity: 'common',
    valueMultiplier: 1.0,
    icon: '/assets/icons/tags/common.svg',
    color: '#9e9e9e',
    isHidden: false
  },
  {
    id: 'uncommon',
    name: '희귀한',
    description: '흔치 않은 물건입니다.',
    rarity: 'uncommon',
    valueMultiplier: 1.5,
    icon: '/assets/icons/tags/uncommon.svg',
    color: '#4caf50',
    isHidden: false
  },
  {
    id: 'rare',
    name: '귀중한',
    description: '귀중한 가치를 지닌 물건입니다.',
    rarity: 'rare',
    valueMultiplier: 2.0,
    icon: '/assets/icons/tags/rare.svg',
    color: '#2196f3',
    isHidden: false
  },
  {
    id: 'epic',
    name: '영예로운',
    description: '역사적으로 중요한 가치를 지닌 특별한 물건입니다.',
    rarity: 'epic',
    valueMultiplier: 3.0,
    icon: '/assets/icons/tags/epic.svg',
    color: '#9c27b0',
    isHidden: false
  },
  {
    id: 'legendary',
    name: '전설적인',
    description: '전설로 전해지는 매우 희귀한 물건입니다.',
    rarity: 'legendary',
    valueMultiplier: 5.0,
    icon: '/assets/icons/tags/legendary.svg',
    color: '#ff9800',
    isHidden: false
  },

  // 역사적 시대
  {
    id: 'ancient',
    name: '고대의',
    description: '고대 시대에 만들어진 물건입니다.',
    rarity: 'rare',
    valueMultiplier: 2.5,
    icon: '/assets/icons/tags/ancient.svg',
    color: '#FFD700',
    isHidden: true
  },
  {
    id: 'medieval',
    name: '중세의',
    description: '중세 시대에 만들어진 물건입니다.',
    rarity: 'uncommon',
    valueMultiplier: 1.8,
    icon: '/assets/icons/tags/medieval.svg',
    color: '#A0522D',
    isHidden: true
  },
  {
    id: 'renaissance',
    name: '르네상스',
    description: '르네상스 시대에 만들어진 물건입니다.',
    rarity: 'rare',
    valueMultiplier: 2.2,
    icon: '/assets/icons/tags/renaissance.svg',
    color: '#8B4513',
    isHidden: true
  },
  {
    id: 'industrial',
    name: '산업시대',
    description: '산업혁명 시기에 만들어진 물건입니다.',
    rarity: 'uncommon',
    valueMultiplier: 1.5,
    icon: '/assets/icons/tags/industrial.svg',
    color: '#708090',
    isHidden: true
  },
  {
    id: 'modern',
    name: '현대의',
    description: '현대에 만들어진 물건입니다.',
    rarity: 'common',
    valueMultiplier: 1.0,
    icon: '/assets/icons/tags/modern.svg',
    color: '#C0C0C0',
    isHidden: true
  },

  // 제작 품질
  {
    id: 'crude',
    name: '조잡한',
    description: '투박하게 만들어진 물건입니다.',
    rarity: 'common',
    valueMultiplier: 0.7,
    icon: '/assets/icons/tags/crude.svg',
    color: '#A9A9A9',
    isHidden: true
  },
  {
    id: 'standard',
    name: '표준',
    description: '표준적인 품질로 만들어진 물건입니다.',
    rarity: 'common',
    valueMultiplier: 1.0,
    icon: '/assets/icons/tags/standard.svg',
    color: '#C0C0C0',
    isHidden: true
  },
  {
    id: 'finely-crafted',
    name: '정교한',
    description: '정교한 솜씨로 만들어진 물건입니다.',
    rarity: 'uncommon',
    valueMultiplier: 1.3,
    icon: '/assets/icons/tags/finely-crafted.svg',
    color: '#4682B4',
    isHidden: true
  },
  {
    id: 'masterwork',
    name: '장인의',
    description: '뛰어난 장인이 만든 물건입니다.',
    rarity: 'rare',
    valueMultiplier: 1.8,
    icon: '/assets/icons/tags/masterwork.svg',
    color: '#DAA520',
    isHidden: true
  },
  {
    id: 'flawless',
    name: '완벽한',
    description: '어떠한 결함도 없이 완벽하게 만들어진 물건입니다.',
    rarity: 'epic',
    valueMultiplier: 2.5,
    icon: '/assets/icons/tags/flawless.svg',
    color: '#9370DB',
    isHidden: true
  },

  // 물질 및 재료
  {
    id: 'wooden',
    name: '목재',
    description: '나무로 만들어진 물건입니다.',
    rarity: 'common',
    valueMultiplier: 1.0,
    icon: '/assets/icons/tags/wooden.svg',
    color: '#8B4513',
    isHidden: true
  },
  {
    id: 'stone',
    name: '석재',
    description: '돌로 만들어진 물건입니다.',
    rarity: 'common',
    valueMultiplier: 1.1,
    icon: '/assets/icons/tags/stone.svg',
    color: '#708090',
    isHidden: true
  },
  {
    id: 'iron',
    name: '철제',
    description: '철로 만들어진 물건입니다.',
    rarity: 'common',
    valueMultiplier: 1.2,
    icon: '/assets/icons/tags/iron.svg',
    color: '#708090',
    isHidden: true
  },
  {
    id: 'silver',
    name: '은제',
    description: '은으로 만들어진 물건입니다.',
    rarity: 'uncommon',
    valueMultiplier: 1.5,
    icon: '/assets/icons/tags/silver.svg',
    color: '#C0C0C0',
    isHidden: true
  },
  {
    id: 'gold',
    name: '금제',
    description: '금으로 만들어진 물건입니다.',
    rarity: 'rare',
    valueMultiplier: 2.0,
    icon: '/assets/icons/tags/gold.svg',
    color: '#FFD700',
    isHidden: true
  },
  {
    id: 'platinum',
    name: '백금',
    description: '백금으로 만들어진 물건입니다.',
    rarity: 'epic',
    valueMultiplier: 2.8,
    icon: '/assets/icons/tags/platinum.svg',
    color: '#E5E4E2',
    isHidden: true
  },
  {
    id: 'crystal',
    name: '수정',
    description: '수정으로 만들어진 물건입니다.',
    rarity: 'rare',
    valueMultiplier: 2.2,
    icon: '/assets/icons/tags/crystal.svg',
    color: '#B9F2FF',
    isHidden: true
  },
  {
    id: 'diamond',
    name: '다이아몬드',
    description: '다이아몬드가 포함된 물건입니다.',
    rarity: 'epic',
    valueMultiplier: 3.0,
    icon: '/assets/icons/tags/diamond.svg',
    color: '#B9F2FF',
    isHidden: true
  },

  // 특별한 속성
  {
    id: 'magical',
    name: '마법적인',
    description: '마법적인 특성을 지닌 물건입니다.',
    rarity: 'epic',
    valueMultiplier: 3.2,
    icon: '/assets/icons/tags/magical.svg',
    color: '#8A2BE2',
    isHidden: true
  },
  {
    id: 'cursed',
    name: '저주받은',
    description: '저주가 깃든 물건입니다.',
    rarity: 'rare',
    valueMultiplier: 2.5,
    icon: '/assets/icons/tags/cursed.svg',
    color: '#800000',
    isHidden: true
  },
  {
    id: 'blessed',
    name: '축복받은',
    description: '신성한 힘이 깃든 물건입니다.',
    rarity: 'epic',
    valueMultiplier: 3.0,
    icon: '/assets/icons/tags/blessed.svg',
    color: '#FFD700',
    isHidden: true
  },
  {
    id: 'royal',
    name: '왕실의',
    description: '왕실에서 사용된 물건입니다.',
    rarity: 'rare',
    valueMultiplier: 2.5,
    icon: '/assets/icons/tags/royal.svg',
    color: '#800080',
    isHidden: true
  },
  {
    id: 'ceremonial',
    name: '의식용',
    description: '종교적 또는 문화적 의식에 사용된 물건입니다.',
    rarity: 'rare',
    valueMultiplier: 2.2,
    icon: '/assets/icons/tags/ceremonial.svg',
    color: '#8B4513',
    isHidden: true
  },
  {
    id: 'historical',
    name: '역사적인',
    description: '역사적으로 중요한 사건과 관련된 물건입니다.',
    rarity: 'epic',
    valueMultiplier: 3.5,
    icon: '/assets/icons/tags/historical.svg',
    color: '#A0522D',
    isHidden: true
  },

  // 상태 관련
  {
    id: 'pristine',
    name: '완전한',
    description: '완벽한 상태로 보존된 물건입니다.',
    rarity: 'rare',
    valueMultiplier: 2.0,
    icon: '/assets/icons/tags/pristine.svg',
    color: '#00BFFF',
    isHidden: true
  },
  {
    id: 'damaged',
    name: '손상된',
    description: '일부 손상된 물건입니다.',
    rarity: 'common',
    valueMultiplier: 0.6,
    icon: '/assets/icons/tags/damaged.svg',
    color: '#CD5C5C',
    isHidden: true
  },
  {
    id: 'restored',
    name: '복원된',
    description: '복원 작업을 거친 물건입니다.',
    rarity: 'uncommon',
    valueMultiplier: 1.3,
    icon: '/assets/icons/tags/restored.svg',
    color: '#8FBC8F',
    isHidden: true
  },
  {
    id: 'genuine',
    name: '진품',
    description: '진위가 확인된 진품입니다.',
    rarity: 'rare',
    valueMultiplier: 2.0,
    icon: '/assets/icons/tags/genuine.svg',
    color: '#00BFFF',
    isHidden: true
  },
  {
    id: 'counterfeit',
    name: '위조품',
    description: '진품을 모방한 위조품입니다.',
    rarity: 'common',
    valueMultiplier: 0.3,
    icon: '/assets/icons/tags/counterfeit.svg',
    color: '#CD5C5C',
    isHidden: true
  },

  // 학술적 가치
  {
    id: 'academic',
    name: '학술적인',
    description: '학문적 가치가 있는 아이템입니다.',
    rarity: 'uncommon',
    valueMultiplier: 1.3,
    icon: '/assets/icons/tags/academic.svg',
    color: '#8A2BE2',
    isHidden: true
  },
  {
    id: 'mysterious',
    name: '신비로운',
    description: '알려지지 않은 출처나 용도를 가진 물건입니다.',
    rarity: 'rare',
    valueMultiplier: 1.8,
    icon: '/assets/icons/tags/mysterious.svg',
    color: '#9370DB',
    isHidden: true
  }
];

/**
 * 태그 ID로 태그 정보 조회
 */
export function getTagById(id: string): ItemTag | undefined {
  return itemTags.find(tag => tag.id === id);
}

/**
 * 희귀도별 태그 목록 조회
 */
export function getTagsByRarity(rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'): ItemTag[] {
  return itemTags.filter(tag => tag.rarity === rarity);
}

/**
 * 일반적인 속성 태그와 카테고리별 태그의 조합 생성
 * 실제 게임에서는 더 복잡한 알고리즘으로 확장 가능
 */
export function generateRandomTags(count: number = 3): string[] {
  const shuffled = [...itemTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(tag => tag.id);
}

/**
 * 특정 태그들의 가치 승수 계산
 */
export function calculateTagsValueMultiplier(tagIds: string[]): number {
  let multiplier = 1.0;
  
  for (const tagId of tagIds) {
    const tag = getTagById(tagId);
    if (tag) {
      multiplier *= tag.valueMultiplier;
    }
  }
  
  return multiplier;
}