/**
 * 전문성 시스템의 연락처(Contacts) 데이터
 */
import { ItemCategory } from '@models/item';
import { Reputation } from '@models/player';

/**
 * 게임 내 연락처 데이터
 */
export const contacts: Reputation[] = [
  {
    id: 'smith',
    name: '대장장이 마이클',
    description: '무기와 갑옷에 전문 지식을 가진 대장장이',
    level: 1,
    relationshipLevel: 0,
    faction: '',
    specialties: [ItemCategory.WEAPON, ItemCategory.JEWELRY],
    buyingBonus: 0,
    sellingBonus: 0,
    unlockThreshold: 100,
    isUnlocked: true,
    category: ItemCategory.WEAPON,
    location: 'forge',
    services: ['repair', 'appraisal', 'trade'],
    reputationScore: 0,
    nextLevelThreshold: 100
  },
  {
    id: 'art-dealer',
    name: '화상 엘리자베스',
    description: '예술품과 골동품을 다루는 대가',
    level: 1,
    relationshipLevel: 0,
    faction: '',
    specialties: [ItemCategory.ART],
    buyingBonus: 0,
    sellingBonus: 0,
    unlockThreshold: 100,
    isUnlocked: true,
    category: ItemCategory.ART,
    location: 'gallery',
    services: ['appraisal', 'trade'],
    reputationScore: 0,
    nextLevelThreshold: 100
  },
  {
    id: 'bookkeeper',
    name: '서적상 하워드',
    description: '희귀 서적과 문서를 수집하는 학자',
    level: 1,
    relationshipLevel: 0,
    faction: '',
    specialties: [ItemCategory.BOOK],
    buyingBonus: 0,
    sellingBonus: 0,
    unlockThreshold: 100,
    isUnlocked: true,
    category: ItemCategory.BOOK,
    location: 'library',
    services: ['appraisal', 'trade', 'information'],
    reputationScore: 0,
    nextLevelThreshold: 100
  },
  {
    id: 'jeweler',
    name: '보석상 소피아',
    description: '보석과 귀금속에 전문 지식을 가진 상인',
    level: 1,
    relationshipLevel: 0,
    faction: '',
    specialties: [ItemCategory.JEWELRY],
    buyingBonus: 0,
    sellingBonus: 0,
    unlockThreshold: 100,
    isUnlocked: false,
    category: ItemCategory.JEWELRY,
    location: 'jewelry-shop',
    services: ['appraisal', 'repair', 'trade'],
    reputationScore: 0,
    nextLevelThreshold: 100
  },
  {
    id: 'pawnbroker',
    name: '전당포 주인 조나단',
    description: '다양한 물건을 거래하는 노련한 상인',
    level: 1,
    relationshipLevel: 0,
    faction: '',
    specialties: [ItemCategory.HOUSEHOLD, ItemCategory.MATERIAL],
    buyingBonus: 0,
    sellingBonus: 0,
    unlockThreshold: 100,
    isUnlocked: false,
    category: ItemCategory.HOUSEHOLD,
    location: 'pawnshop',
    services: ['trade', 'information'],
    reputationScore: 0,
    nextLevelThreshold: 100
  }
];

/**
 * ID로 연락처 검색
 */
export function getContactById(contactId: string): Reputation | undefined {
  return contacts.find(contact => contact.id === contactId);
}

/**
 * 특정 카테고리의 연락처만 필터링
 */
export function getContactsByCategory(category: ItemCategory): Reputation[] {
  return contacts.filter(contact => contact.category === category);
}

/**
 * 해금된 연락처만 필터링
 */
export function getUnlockedContacts(): Reputation[] {
  return contacts.filter(contact => contact.isUnlocked);
}

/**
 * 특정 서비스를 제공하는 연락처 필터링
 */
export function getContactsByService(service: string): Reputation[] {
  return contacts.filter(contact => contact.services.includes(service));
}