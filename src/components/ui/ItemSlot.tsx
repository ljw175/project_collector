import React from 'react';
import { Item, isAppraised } from '@models/item';
//import TagDisplay from './TagDisplay';
import './ItemSlot.css';

interface ItemSlotProps {
  item: Item;
  count?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * 인벤토리에서 단일 아이템을 표시하는 슬롯 컴포넌트
 * 미감정 아이템은 스택 표시, 감정된 아이템은 특성 표시
 */
const ItemSlot: React.FC<ItemSlotProps> = ({ 
  item, 
  count = 1, 
  isSelected = false, 
  onClick 
}) => {
  // 아이템이 감정되었는지 여부
  const appraised = isAppraised(item);
  
  // 아이템 카테고리에 따른 아이콘 클래스
  const categoryIconClass = `category-icon category-${item.category.toLowerCase()}`;
  
  // 태그 중 가장 희귀한 태그를 대표 태그로 표시
  const displayTag = appraised
    ? [...item.tags].sort((a, b) => {
        const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      })[0]
    : null;

  return (
    <div 
      className={`item-slot ${appraised ? 'appraised' : ''} ${isSelected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      <div className={categoryIconClass}></div>
      
      <div className="item-name">
        {item.name}
      </div>
      
      {!appraised && count > 1 && (
        <div className="stack-count">×{count}</div>
      )}
      
      {appraised && displayTag && (
        <div className="item-tag-preview">
          <div 
            className={`tag-chip tag-${displayTag.rarity}`} 
            title={displayTag.name}
          ></div>
        </div>
      )}
      
      {appraised && (
        <div className="item-value">
          {item.actualValue}G
        </div>
      )}
      
      {!appraised && (
        <div className="item-value">
          ?G
        </div>
      )}
    </div>
  );
};

export default ItemSlot;