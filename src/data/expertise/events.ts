/**
 * 전문성 시스템 이벤트 데이터
 */
import { ReputationEvent } from '@features/expertise/types/expertise_types';

/**
 * 평판 이벤트 데이터
 */
export const reputationEvents: ReputationEvent[] = [
  {
    id: 'event1',
    contactId: 'smith',
    title: '대장장이의 부탁',
    description: '마이클이 특별한 광석을 찾고 있습니다. 도와주면 감사하겠다고 합니다.',
    requirementsMet: true,
    reputationGain: 20,
    rewardType: 'skill',
    rewardId: 'repair-weapon'
  },
  {
    id: 'event2',
    contactId: 'art-dealer',
    title: '진품 감정',
    description: '엘리자베스가 의심스러운 작품의 진위를 판별하는데 도움을 구합니다.',
    requirementsMet: false,
    reputationGain: 15,
    rewardType: 'discount',
    rewardId: 'art-appraisal'
  },
  {
    id: 'event3',
    contactId: 'bookkeeper',
    title: '고서 번역',
    description: '하워드가 고대 언어로 쓰인 책의 번역을 도와줄 사람을 찾고 있습니다.',
    requirementsMet: false,
    reputationGain: 25,
    rewardType: 'information',
    rewardId: 'ancient-language'
  },
  {
    id: 'event4',
    contactId: 'smith',
    title: '희귀 재료 수집',
    description: '마이클이 특별한 무기를 만들기 위한 희귀 재료를 구하고 있습니다.',
    requirementsMet: false,
    reputationGain: 30,
    rewardType: 'item',
    rewardId: 'masterwork-weapon'
  },
  {
    id: 'event5',
    contactId: 'art-dealer',
    title: '특별 전시회',
    description: '엘리자베스가 특별 전시회를 준비 중입니다. 독특한 예술 작품을 찾고 있습니다.',
    requirementsMet: false,
    reputationGain: 40,
    rewardType: 'skill',
    rewardId: 'art-appraisal-advanced'
  }
];

/**
 * 특정 연락처의 이벤트 조회
 */
export function getEventsByContactId(contactId: string): ReputationEvent[] {
  return reputationEvents.filter(event => event.contactId === contactId);
}

/**
 * 조건이 충족된 이벤트만 조회
 */
export function getAvailableEvents(): ReputationEvent[] {
  return reputationEvents.filter(event => event.requirementsMet);
}

/**
 * ID로 이벤트 조회
 */
export function getEventById(eventId: string): ReputationEvent | undefined {
  return reputationEvents.find(event => event.id === eventId);
}