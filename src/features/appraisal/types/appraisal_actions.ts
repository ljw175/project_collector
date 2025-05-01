/**
 * 감정(Appraisal) 모듈 액션 타입
 */

import { ValueCurrency } from "@/models";

// 감정 액션 타입 정의
export type AppraisalAction = 
  | { type: 'APPRAISE_ITEM'; payload: { itemId: string; discoveredTags: string[]; actualValue: Array<{ currency: ValueCurrency; amount: number }>; convertedActualValue: number; condition: number; tool: string; history?: string } }
  | { type: 'COMPLETE_APPRAISAL'; payload: { itemId: string; actualValue: Array<{ currency: ValueCurrency; amount: number }>; condition: number } }