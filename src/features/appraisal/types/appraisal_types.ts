/**
 * 감정(Appraisal) 관련 타입 정의
 */
import { ExpertiseLevel } from '@/models';
import { ItemCategory, ItemTag } from '@models/item';

// 감정 결과 타입
export interface AppraisalResult {
  itemId: string;
  discoveredTags: ItemTag[];
  actualValue: number;
  condition: number;
  history?: string;
  timeSpent: number; // 감정에 소요된 시간
}

// 감정 옵션 타입
export interface AppraisalOptions {
  thoroughness: 'quick' | 'standard' | 'thorough'; // 감정의 꼼꼼함 정도
  focusArea: 'condition' | 'authenticity' | 'history'; // 집중 영역
  playerExpertise: ExpertiseLevel; // 플레이어 전문성 (0-100)
  useSpecialTool: boolean; // 특수 도구 사용 여부
  tool: AppraisalTool['name']; // 사용할 도구
}

export interface AppraisalTool {
  id: string; // 도구 고유 ID
  name: string; // 도구 이름
  description: string; // 도구 설명
  maxDurability: number; // 전체 내구도
  currentDurability: number; // 현재 내구도
  timeMultiplier: number; // 소요 시간 배수
  accuracyBonus: number; // 정확도 보너스
  durabilityCost: number; // 내구도 소모량
  specialEffect: string; // 특수 효과 설명
  bestCategories: ItemCategory[]; // 가장 효과적인 카테고리
  tagsExpose: ItemTag[]; // 이 도구를 사용하여 감정했을때 노출되는 태그
}

// 감정 과정 상태
export type AppraisalState = 
  | 'idle'        // 대기 상태
  | 'examining'   // 감정 중
  | 'complete'    // 완료
  | 'failed';     // 실패

// 감정 서비스 설정
export interface AppraisalSettings {
  baseTimeRequired: number;     // 기본 소요 시간 (초)
  accuracyModifier: number;     // 정확도 수정자 (0-1)
  expertiseBonus: number;       // 전문성 보너스
  failureChance: number;        // 실패 확률 (0-1)
}