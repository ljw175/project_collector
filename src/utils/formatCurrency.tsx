import React from 'react';
import { Value } from '@models/item';

interface FormatOptions {
  showSymbol?: boolean;
  iconSize?: number;
  gap?: number;
  className?: string;
}

/**
 * 단일 화폐 값을 JSX로 포맷팅
 * @param value - 변환할 화폐 값 객체
 * @param options - 포맷팅 옵션
 */
export function formatCurrencyValue(value: Value, options: FormatOptions = {}) {
  const { showSymbol = true, iconSize = 16, gap = 2, className = '' } = options;
  
  return (
    <span className={`currency-item ${className}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
      {value.currency.icon && (
        <img 
          src={value.currency.icon} 
          alt={value.currency.name}
          style={{ 
            width: `${iconSize}px`, 
            height: `${iconSize}px`, 
            marginRight: `${gap}px`,
            verticalAlign: 'middle' 
          }} 
        />
      )}
      <span style={{ verticalAlign: 'middle' }}>{value.amount}</span>
      {showSymbol && (
        <span style={{ marginLeft: '1px', fontWeight: 600, verticalAlign: 'middle' }}>
          {value.currency.symbol}
        </span>
      )}
    </span>
  );
}

/**
 * 화폐 값 배열을 JSX로 포맷팅
 * @param values - 변환할 화폐 값 배열
 * @param options - 포맷팅 옵션
 */
export function formatCurrencyValues(values: Value[], options: FormatOptions = {}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {values.map((value, index) => (
        <span 
          key={`${value.currency.id}-${index}`} 
          style={{ marginRight: index < values.length - 1 ? '8px' : '0' }}
        >
          {formatCurrencyValue(value, options)}
        </span>
      ))}
    </span>
  );
}