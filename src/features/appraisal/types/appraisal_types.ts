/**
 * 감정(Appraisal) 관련 타입 정의
 */
import { ItemTag } from '@models/item';

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
  focusArea?: 'condition' | 'authenticity' | 'history'; // 집중 영역
  useSpecialTool?: boolean; // 특수 도구 사용 여부
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