import React from 'react';
import { Value } from '@models/item';
import './CurrencyDisplay.css';

interface CurrencyDisplayProps {
  value?: Value; // 단일 화폐 값
  values?: Value[]; // 화폐 값 배열
  showSymbol?: boolean; // 화폐 심볼(G, S, C) 표시 여부
  size?: 'small' | 'medium' | 'large'; // 크기 옵션
  gap?: number; // 아이콘과 텍스트 사이 간격
  theme?: 'light' | 'dark'; // 테마 옵션
  className?: string; // 추가 CSS 클래스
}

/**
 * 화폐 및 자원 표시 컴포넌트
 * 단일 화폐값이나 화폐값 배열을 아이콘과 함께 표시
 */
const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  value,
  values,
  showSymbol = false,
  size = 'medium',
  gap = 4,
  theme = 'light',
  className = ''
}) => {
  // 단일 값이 있으면 배열로 변환
  const valueArray = value ? [value] : values || [];

  // 사이즈에 따른 아이콘 크기
  const iconSize = {
    small: 12,
    medium: 16,
    large: 20
  }[size];

  return (
    <div className={`currency-display ${size} ${theme} ${className}`}>
      {valueArray.map((currValue, index) => (
        <span 
          key={`${currValue.currency.id}-${index}`}
          className="currency-item"
          style={{ marginRight: index < valueArray.length - 1 ? '8px' : '0' }}
        >
          {currValue.currency.icon && (
            <img 
              src={currValue.currency.icon} 
              alt={currValue.currency.name}
              className="currency-icon" 
              style={{ width: `${iconSize}px`, height: `${iconSize}px`, marginRight: `${gap}px` }}
            />
          )}
          <span className="currency-amount">{currValue.amount}</span>
          {showSymbol && (
            <span className="currency-symbol">{currValue.currency.symbol}</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default CurrencyDisplay;