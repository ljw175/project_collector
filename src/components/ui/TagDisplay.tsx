import React from 'react';
import { ItemTag } from '@models/item';
import './TagDisplay.css';

interface TagDisplayProps {
  tag: ItemTag;
  isHidden?: boolean;
  onClick?: () => void;
}

/**
 * 아이템 태그를 표시하는 컴포넌트
 * 태그의 희귀도에 따라 다른 색상으로 표시
 * isHidden이 true이면 물음표로 표시 (미감정 아이템)
 */
const TagDisplay: React.FC<TagDisplayProps> = ({ tag, isHidden = false, onClick }) => {
  return (
    <div 
      className={`tag-display tag-${tag.rarity} ${isHidden ? 'tag-hidden' : ''}`} 
      title={isHidden ? '감정되지 않은 특성' : tag.description}
      onClick={onClick}
    >
      <span className="tag-name">
        {isHidden ? '?' : tag.name}
      </span>
      {!isHidden && tag.valueMultiplier > 1 && (
        <span className="tag-multiplier">×{tag.valueMultiplier.toFixed(1)}</span>
      )}
    </div>
  );
};

export default TagDisplay;