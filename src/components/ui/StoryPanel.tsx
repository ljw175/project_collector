import React, { useRef, useEffect } from 'react';
import './StoryPanel.css';

interface StoryPanelProps {
  messages: Array<{
    id: string;
    text: string;
    type?: 'normal' | 'success' | 'warning' | 'error';
    timestamp: number;
  }>;
  onItemClick?: (itemId: string, itemName: string) => void;
}

/**
 * 메인 게임 화면의 스토리 텍스트 패널 컴포넌트
 * 게임 내러티브와 행동 결과를 표시하고 아이템 링크를 클릭 가능하게 함
 */
const StoryPanel: React.FC<StoryPanelProps> = ({ messages, onItemClick }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가될 때 스크롤을 아래로 이동
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [messages]);

  // 텍스트 내 아이템 링크 처리
  const processItemLinks = (text: string) => {
    // [아이템명] 형식의 링크를 찾아 클릭 가능한 요소로 변환
    const itemRegex = /\[([^\]]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = itemRegex.exec(text)) !== null) {
      // 링크 앞의 일반 텍스트 추가
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // 아이템 링크 추가
      const itemName = match[1];
      // 간단한 예로 아이템 ID를 이름에서 생성
      const itemId = `item-${itemName.toLowerCase().replace(/\s+/g, '-')}`;
      
      parts.push(
        <span 
          key={`${itemId}-${match.index}`}
          className="item-link"
          onClick={() => onItemClick && onItemClick(itemId, itemName)}
        >
          [{itemName}]
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    // 나머지 텍스트 추가
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="story-panel" ref={panelRef}>
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`story-message ${message.type || 'normal'}`}
        >
          {processItemLinks(message.text)}
        </div>
      ))}
    </div>
  );
};

export default StoryPanel;