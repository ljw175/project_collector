import React from 'react';
import { Item, isAppraised, ItemTag } from '@models/item';
import TagDisplay from '@components/ui/TagDisplay';
import CurrencyDisplay from '@components/ui/CurrencyDisplay';
import './TagPopup.css';

interface TagPopupProps {
  item: Item;
  itemTag?: ItemTag; // 태그 정보 (선택적)
  onClose: () => void;
  onAppraise?: () => void;
  onRepair?: () => void;
  onStore?: () => void;
}

/**
 * 아이템 클릭 시 표시되는 태그 팝업 컴포넌트
 * 아이템의 태그를 보여주고 감정/수선/보관 등의 액션 제공
 */
const TagPopup: React.FC<TagPopupProps> = ({ 
  item, 
  onClose,
  onAppraise,
  onRepair,
  onStore
}) => {
  const appraised = isAppraised(item);
  
  // 아이템이 감정되었으면 태그 표시, 아니면 히든 태그 표시
  // Provide a default empty array if tags/hiddenTags are undefined
  const tags = (appraised ? item.tags : item.hiddenTags) ?? [];

  return (
    <div className="tag-popup-overlay" onClick={onClose}>
      <div className="tag-popup" onClick={(e) => e.stopPropagation()}>
        <div className="tag-popup-header">
          <h3>{item.name}</h3>
          <button className="tag-popup-close" onClick={onClose}>×</button>
        </div>
        
        <div className="tag-popup-body">
          <div className="tag-info">
            <div className="tag-category">{item.category}</div>
            <div className="tag-value">
              {appraised 
                ? <CurrencyDisplay values={item.actualValue} size="medium" /> 
                : <>
                    <CurrencyDisplay values={item.baseValue} size="medium" />
                    <span className="not-appraised"> (미감정)</span>
                  </>
              }
            </div>
          </div>
          
          <p className="tag-description">{item.description}</p>
          
          <div className="tag-list">
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <TagDisplay
                  key={`${item.id}-tag-${index}`}
                  tag={tag}
                  isHidden={!appraised}
                />
              ))
            ) : (
              <p className="no-tags">알려진 특성이 없습니다.</p>
            )}
          </div>
          
          {/* 아이템 상태 정보 (감정된 경우만) */}
          {appraised && (
            <div className="item-condition">
              <div className="condition-label">상태</div>
              <div className="condition-bar">
                <div 
                  className={`condition-fill ${
                    item.condition > 75 ? 'excellent' : 
                    item.condition > 50 ? 'good' : 
                    item.condition > 25 ? 'fair' : 'poor'
                  }`}
                  style={{ width: `${item.condition}%` }}
                ></div>
              </div>
              <div className="condition-value">{item.condition}/100</div>
            </div>
          )}
          
          {/* 아이템 이력 정보 (감정된 경우만) */}
          {appraised && item.history && (
            <div className="item-history">
              <h4>아이템 이력</h4>
              <p>{item.history}</p>
            </div>
          )}
        </div>
        
        <div className="tag-popup-footer">
          {!appraised && onAppraise && (
            <button 
              className="btn btn-primary tag-action-btn" 
              onClick={onAppraise}
            >
              감정하기
            </button>
          )}
          
          {appraised && item.condition < 100 && onRepair && (
            <button 
              className="btn tag-action-btn" 
              onClick={onRepair}
            >
              수선하기
            </button>
          )}
          
          {onStore && (
            <button 
              className="btn tag-action-btn" 
              onClick={onStore}
            >
              보관하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagPopup;