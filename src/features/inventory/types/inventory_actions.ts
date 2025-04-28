/**
 * 인벤토리(Inventory) 모듈 액션 타입
 */

import { Item } from '@models/item';

// 인벤토리 액션 타입 정의
export type InventoryAction = 
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'REMOVE_ITEMS'; payload: string[] }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { itemId: string; quantity: number } };