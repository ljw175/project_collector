## project_collector 종합 프로젝트 파일 구조 분석

`project_collector` 프로젝트는 수집, 감정, 경매, 인벤토리 관리, 전문성 및 네트워크, 지도 및 시간 관리 기능을 갖춘 텍스트 기반의 전당포 경영/경매 게임으로 기획되었습니다. React, TypeScript, Vite, Electron을 기반으로 개발되고 있으며, 기능별 모듈화가 명확하게 적용된 아키텍처를 따르고 있습니다.

### 프로젝트 개요

* **기술 스택:** React, TypeScript, Vite, Electron
* **아키텍처:** 기능별 모듈화 (Feature-Sliced Design과 유사)
* **상태 관리:** React Context API를 활용한 전역 상태 관리
* **스타일링:** CSS 모듈 및 전역 스타일, 디자인 토큰 활용

### 주요 폴더 및 파일 분석

프로젝트의 핵심 구조는 `src` 폴더를 중심으로 구성되어 있으며, 각 최상위 폴더는 명확한 역할을 가집니다.

* **`/` (루트 디렉토리):**
    * `package.json`: 프로젝트의 의존성 목록, 스크립트, 메타 정보가 정의되어 있습니다.
    * `vite.config.ts`: Vite 빌드 도구의 설정 파일입니다. 개발 서버, 빌드 최적화 등 Vite 관련 설정을 포함합니다.
    * `tsconfig.*.json`: TypeScript 컴파일러 설정 파일들입니다. 애플리케이션(`.app.json`), Electron 메인 프로세스(`.electron.json`), 노드 환경(`.node.json`) 등 환경별 설정을 분리하여 관리합니다.
    * `electron-main.ts`: Electron 애플리케이션의 메인 프로세스 진입점입니다. 브라우저 창 생성 등 데스크톱 애플리케이션 구동 로직을 담당합니다.
    * `index.html`: 웹 기반 애플리케이션의 진입 HTML 파일입니다.
    * `README.md`: 프로젝트에 대한 설명, 설정 방법, 기획 문서 등을 포함하는 파일입니다.
    * `eslint.config.js`: ESLint 코드 품질 및 스타일 검사 도구의 설정 파일입니다.

* **`public/`:**
    * Vite에 의해 정적으로 제공되는 파일들 (예: `vite.svg`, 파비콘 등)이 위치합니다. 빌드 시 결과물의 루트 경로로 복사됩니다.

* **`src/`:** 애플리케이션의 소스 코드 본체가 위치하는 디렉토리입니다.
    * **`assets/`:** 이미지, 아이콘, 폰트 등 애플리케이션 내에서 사용되는 정적 자원들을 담고 있습니다.
    * **`components/`:** 여러 기능에서 재사용될 수 있는 범용 React 컴포넌트들을 모아 놓은 곳입니다.
        * `ui/`: 기본적인 UI 요소 (버튼, 입력 필드 등) 또는 특정 용도의 UI 컴포넌트 (예: `ItemSlot.css`, `StoryPanel.css`, `TagDisplay.css`와 같은 스타일 파일들이 존재).
    * **`data/`:** 게임의 콘텐츠 데이터 및 상수 값들을 정의합니다.
        * `constants/`: 게임 규칙, 설정, 기본값 등 변하지 않는 상수들이 기능별로 분리되어 있습니다 (`appraisal-constants.ts`, `auction-constants.ts`, `game-constants.ts`, `inventory-constants.ts`, `map-constants.ts`).
        * `events/`: 게임 내에서 발생하는 다양한 이벤트 데이터가 정의됩니다 (`collection-events.ts`).
        * `expertise/`: 전문성 및 연락처 시스템 관련 데이터 (예: `contacts.ts`, `events.ts`, `skills.ts`).
        * `items/`: 아이템 관련 데이터 (예: `common-items.ts`, `item-tags.ts`).
        * `locations/`: 지도상의 위치 관련 데이터 (예: `map-locations.ts`).
    * **`features/`:** 애플리케이션의 핵심 기능 단위로 분리된 모듈들이 위치합니다. 각 기능 폴더 (`appraisal`, `auction`, `calendar`, `collection`, `expertise`, `inventory`, `map`, `player`)는 유사한 내부 구조를 가집니다.
        * `*/`: 각 기능별 디렉토리.
            * `*_index.ts`: 해당 기능 모듈의 외부 공개 API (컴포넌트, 훅, 타입 등)를 내보내는 파일입니다 (예: `appraisal_index.ts`, `auction_index.ts`, `calendar_index.ts`, `collection_index.ts`, `expertise_index.ts`, `inventory_index.ts`, `map_index.ts`).
            * `components/`: 해당 기능에 특화된 React 컴포넌트들이 위치합니다.
            * `hooks/`: 해당 기능의 상태 관리 및 비즈니스 로직을 캡슐화한 커스텀 React Hooks가 정의됩니다 (예: `useAppraisal.ts`, `useAuction.ts`, `useCalendar.ts`, `useCollection.ts`, `useExpertise.ts`, `useInventory.ts`, `useMap.ts`).
            * `types/`: 해당 기능에서 사용되는 TypeScript 타입 및 인터페이스 정의 파일입니다 (예: `appraisal_types.ts`, `auction_types.ts`, `calendar_types.ts`, `collection_types.ts`, `expertise_types.ts`, `inventory_types.ts`, `map_types.ts`). 또한, Reducer 패턴을 위한 액션 타입 정의 파일도 포함됩니다 (예: `appraisal_actions.ts`, `calendar_actions.ts`, `expertise_actions.ts`, `inventory_actions.ts`, `map_actions.ts`, `player_actions.ts`).
            * `utils/`: 해당 기능에만 사용되는 유틸리티 함수들이 정의될 수 있습니다.
    * **`models/`:** 애플리케이션 전반에서 사용되는 핵심 데이터 모델들의 TypeScript 타입 및 인터페이스 정의가 포함됩니다 (예: `game.ts`, `item.ts`, `player.ts`). `index.ts`에서 이 모델들을 통합하여 내보냅니다.
    * **`services/`:** 게임의 핵심 비즈니스 로직 및 데이터 처리를 담당하는 서비스 계층입니다. 각 기능별 서비스는 해당 기능 폴더와 유사하게 분리되어 있습니다.
        * `*/`: 각 서비스별 디렉토리.
            * `*.service.ts`: 실제 비즈니스 로직 구현 파일 (예: `appraisal.service.ts`, `auction.service.ts`, `collection.service.ts`, `expertise.service.ts`, `inventory.service.ts`, `map.service.ts`).
            * `*_service_index.ts`: 해당 서비스 모듈의 공개 API를 내보내는 파일입니다 (예: `appraisal_service_index.ts`, `auction_service_index.ts`, `collection_service_index.ts`, `expertise_service_index.ts`, `inventory_service_index.ts`, `map_service_index.ts`).
    * **`store/`:** 애플리케이션의 전역 상태 관리와 관련된 코드입니다.
        * `actionTypes.ts`: 게임의 모든 상태 변경 액션 타입을 통합하여 정의합니다. (Reducer 패턴 사용 가능성).
        * `gameContext.tsx`: 게임의 전역 상태를 제공하는 React Context 및 상태 관리를 위한 Provider가 정의될 것으로 예상됩니다 (파일 내용은 제공되지 않음).
    * **`styles/`:** 애플리케이션의 모든 CSS 스타일 시트가 포함됩니다.
        * `tokens.css`: 디자인 시스템의 기본 변수 (색상, 간격, 폰트 등)를 정의하는 파일입니다.
        * `components.css`: 재사용 가능한 UI 컴포넌트들에 대한 공통 스타일을 정의합니다.
        * `global.css`: HTML 요소의 기본 스타일 재정의, 레이아웃 유틸리티 등 전역 스타일을 포함합니다.
        * `*-test.css`: 각 기능별 테스트 또는 데모 페이지에 특화된 스타일입니다 (예: `appraisal-test.css`, `auction-test.css`, `calendar-test.css`, `collection-test.css`, `expertise-test.css`, `inventory-test.css`, `map-test.css`).

### 결론

`project_collector` 프로젝트는 TypeScript 기반의 React 애플리케이션으로, Electron을 통해 데스크톱 환경을 지원합니다. Feature-Sliced Design과 유사한 기능별 모듈화 아키텍처를 채택하여 코드의 응집도를 높이고 관심사를 분리했습니다. 데이터, 비즈니스 로직 (Service), 상태 관리 (Store), UI (Components, Features) 레이어가 명확하게 구분되어 있으며, 재사용 가능한 컴포넌트와 디자인 토큰을 활용하여 일관성 있는 UI/UX를 제공하려는 구조로 파악됩니다. 테스트 페이지와 관련된 스타일 파일들이 다수 존재하는 것으로 보아 기능별 개발 및 테스트가 활발히 이루어지고 있음을 알 수 있습니다.

이 분석이 프로젝트 구조를 이해하시고 README.md를 업데이트하는 데 도움이 되기를 바랍니다.

### 텍스트 기반 익스트랙션 + 전당포 경영/경매 게임 ― 핵심 기획 정리

Persona: 너는 내가 진행하는 "Collector" 프로젝트 팀의 핵심적인 전문 개발자로 나의 기획을 바탕으로 프로그램을 구현해야한다.

Context: 팀의 목표 달성을 위해서는 서사적 피드백을 극한으로 끌어올리는 것이 진정으로 재미를 수반하는지에 대한 검증이 필요하다. 따라서 지금 프로젝트를 통해 플레이어의 선택을 트리거로 시간/공간부터 시작해서 다양한 상태 변화가 일어나고 그러한 상태 조건으로 이벤트 흐름과 발생 여부가 결정되는 다층적 TextRPG를 개발해야한다. 이는 기존 노드식 텍스트 어드벤처에서 분기하는 선택지의 지수적 증가량을 고려하였을때는 불가능한 기획이지만, 사용자 경험을 Text 중심의 UI/UX로 제한하고 오직 상태 변화로 인해 트리거된 조건에 따라서만 이벤트가 발생하도록 하면 부분적일지라도 구현 가능하다.


| 단계 | 핵심 시스템 | 요약 |
|------|-------------|------|
| **1. 수집** | **대량 아이템 스택**<br>· 같은 이름·상태의 미감정 아이템은 `[나사] ×8`처럼 수량으로만 표시<br>· 플레이어 행동 → 개별 감정 시 스택에서 빠져나오며 고유 아이템化 | 불필요한 텍스트 범람을 막고 ‘잡동사니 한더미’ 느낌 유지 |
| **2. 감정** | **태그(Tag) 시스템**<br>· 아이템 이름을 `[ ]`로 표시, 클릭/터치 시 태그 팝업<br>· 태그 조합(예: 빛나는·고대의)이 가치 결정 키워드<br>· 미감정 상태에선 태그 ? 또는 잠김 표시 | 서술 과잉 없이도 ‘미묘한 차이 찾기’ 학습 유도 |
| **3. 인벤토리 관리** | **필터·정렬·검색** (미감정/감정/태그/가치 등)<br>**폴더·카테고리** (자동 + 사용자 지정)<br>**심볼·색상**으로 상태·희귀도 요약<br>**일괄 처리** (저가 일괄 판매·분해 등) | 다품목 감정 뒤에도 UI 난잡해지지 않게 구조화 |
| **4. 전문성·연줄(네트워크)** | **6대 카테고리**: 무기·보석/귀금속·예술/골동·서적·생활용품·희귀 재료<br>· 시작 시 1~2개 전문기술 선택 → 감정 정보 추가, 수선/가공으로 가치 상승<br>· 해당 분야 상인/조합과 친밀도 → 빠른·고가 판매 | 현실의 ‘잘 아는 물건에 더 과감히 베팅’ 심리 구현 |
| **5. 경매** | **적응형 시간 제한**<br>  – 튜토리얼에서 읽기·반응 속도 측정 → 개인화 타이머<br>  – 옵션: 여유·보통·도전 난이도 (보상 차등)<br>**라운드 기반 ‘준실시간’**<br>  – 라운드마다 15–30초 (개인화) 내 결정 → 다음 입찰<br>  – 핵심 정보 하이라이트·타이머/사운드 알림<br>  – 사전 아이템 목록 공개·자동입찰 한도 설정으로 읽기 부담 완화 | 시간 압박이 있지만 ‘읽는 속도 격차’는 시스템이 보정 |

---
1. **복잡성 최소화 vs. 깊이 유지**  
   *대량 아이템*-*태그*-*카테고리*-*적응형 경매* 흐름은 “글이 길어지면 난잡, 짧으면 정보 부족”이라는 텍스트 게임의 딜레마를 완화하면서 핵심 재미(발견·판단·흥정·긴장)를 보존합니다.

2. **사용자 경험(UX) 우선**  
   읽기 속도·정보 과부하 문제를 UI 구조(스택·필터·타이머 개인화)로 해결해, 타깃 유저가 ‘텍스트’라는 형식 때문에 스트레스를 받지 않게 설계했습니다.

3. **현실-유사 경제 심리 반영**  
   전문성·연줄·경매 심리 등 실제 중고·경매 시장의 행동 패턴을 축약해, 플레이어가 자연스럽게 “내가 아는 물건에 더 베팅”하는 경험을 얻도록 했습니다.


아래는 새로 제공해주신 와이어프레임/목업(5종류)을 앞서 정리한 시스템 구조에 맵핑하여 ‘최종 UI‐플로우 사양’으로 반영한 내용입니다.  


---

## 1. 게임 메인 플레이 화면  
**(이미지: 기본 게임 플레이 화면)**  

| 영역 | 기능 | 시스템 연결 |
|------|------|-------------|
| **상단 퀵바(5개 아이콘)** | 자금 · 평판 · 체력 · 정신 · 추가메뉴(+) | 플레이어 자원/상태 HUD |
| **본문 텍스트 패널** | 내러티브, 행동 후 결과 로깅 | “수집 단계” 플레이 |
| **아이템 링크** `[금속 호리병] [담뱃대] [권총]` | 클릭 → 태그/세부정보 팝업 | 태그 시스템·감정 |
| **행동 리스트** | 가격·재화 아이콘 포함 “구매/떠남” | 선택형 결과 트리거 |

### TAG 팝업  
**(이미지: 아이템 선택 시 태그 공개)**  
- 클릭 즉시 슬롯형 오버레이 출현 → 태그 아이콘(3~5개) + 툴팁  
- 팝업 하단에 “감정/수선/보관” 버튼 배치  
- 감정을 통해 태그가 갱신되면, 해당 아이템의 인벤토리 아이콘이 색상/심볼로 업데이트

---

## 2. 인벤토리 화면  
**(이미지: 게임 내 기능 – 인벤토리)**  

| 요소 | 설명 | 시스템 연결 |
|------|------|-------------|
| **가방 슬롯** | 스택표시 `×19` / 감정완료 개별아이콘 | 스택→개별 분리 메커니즘 |
| **태그 칩** | 아이템 우측 작은 색상칩 = 주요태그 1~2개 | 필터·정렬 키 |
| **3단 필터** (버튼) | 🔍 검색 / 🗺️ 맵 / 🗓️ 달력 | 빠른 탭간 이동 |

- **일괄 처리**: 항목 다중선택 → 하단 “일괄 판매/분해/이동” 버튼  
- **도구업그레이드**: 가방 하단 空 슬롯에 ‘감정렌즈’ 등을 장착해 자동태그 해금

---

## 3. 지도 이동 화면  
**(이미지: 게임 내 기능 – 맵 이동)**  

- 마을 POI(아이콘+뱃지 수치) = 신규 이벤트/물품 리젠 알림  
- 클릭 → 해당 로케이션 씬(=메인 플레이 화면 템플릿)으로 진입  
- 퀵 플로트 버튼 3종: 🛄 인벤토리 / 🗓️ 달력 / 🔍 탐색

---

## 4. 달력 화면  
**(이미지: 게임 내 기능 – 달력)**  

- ❌ = 휴식·이동 소요일, 🏛️ = 경매 스케줄  
- 날짜 선택 → 경매 정보·참가(예약) 창  
- **경매 타이머**: 개인화 설정(여유/보통/도전) = 아이콘 색 변경으로 표시

---

## 5. 경매 진행(라운드) UI  
*모크업은 없지만 구현 정의*  

| 화면 분할 | 내용 |
|-----------|------|
| 좌측 상단 | 현재 최고가 + 타이머(프로그레스 바) |
| 중앙 로그 | NPC 입찰 텍스트 스트림 |
| 우측 버튼 | ▲ +Δ 재입찰 / ▶ 최대가 자동 / ✕ 포기 |
| 라운드 AI | 개인화 제한시간(15~30초) 후 자동 턴진행 |

---

## 6. 전체 게임 루프 & 화면 전환 매핑

1. **지도(탐색)** → POI 선택  
2. **메인 플레이**: 수집·거래·미션  
3. 아이템 획득 → **인벤토리** 스택으로  
4. **감정**(태그 해금) → 전문기술/도구 적용  
5. 달력 경매일/경매 장소 → **경매 라운드**  
6. 결과 정산 → 자금·평판 갱신 → 지도 귀환(루프)

---
- **와이어프레임 레이아웃**을 기존 시스템(태그·스택·전문성·경매) 흐름에 정확히 대응시켜 UI 혼선을 제거했습니다.  
- 상단 통합 HUD, 하단 퀵액션 3종, 오버레이 팝업으로 **모바일 환경에서의 최소 터치 동선**을 확보했습니다.  
- 달력/지도/인벤토리 “삼각 내비게이션”으로 **시공·시간 개념**(사용자 목표였던 부분)을 직관적으로 노출했습니다.

아래 예시는 **“목업 → CSS”** 전환의 감(感)을 잡기 위한 **기본 구조·네이밍·주석** 중심의 스타일 시트입니다.  
(모바일 375 × 667 안드로이드/IOS 뷰포트 기준, 단순화된 HTML 레이아웃을 가정)

> ⚠️ 실제 프로젝트에선 디자인 시스템(폰트·컬러 토큰·다크모드 등)을 먼저 선언한 뒤, 여기 제시한 클래스들을 **컴포넌트화**해 재사용하시길 권장합니다.

---

## 0. 공통 토큰 & 리셋

```css
/* --------- reset + 공통 변수 --------- */
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg-app:#fff;
  --bg-panel:#f5f5f5;
  --bg-card:#e9e9e9;
  --clr-text:#222;
  --clr-muted:#666;
  --clr-accent:#ffc400;      /* 아이콘 강조 */
  --clr-border:#d0d0d0;
  --radius:6px;
  --shadow:0 0 4px 0 rgba(0,0,0,.15);
  --trans: .25s ease;
  font-family:'Pretendard',system-ui,AppleSDGothicNeo,'Noto Sans KR',sans-serif;
}
body{background:var(--bg-app);color:var(--clr-text);line-height:1.45;}
button{background:none;border:none;color:inherit;font:inherit;cursor:pointer;}
```

---

## 1. **기본 게임 플레이 화면** (`기본 게임 플레이 화면.png`)

```css
/* --------- page shell --------- */
.app-header{
  height:56px;display:flex;align-items:center;
  padding:0 12px;border-bottom:1px solid var(--clr-border);
}
.header-back{margin-right:6px;font-size:20px;}
.header-title{flex:1;text-align:center;font-weight:600;}
.header-menu{font-size:20px;}

.hud{display:flex;gap:16px;margin:8px 0;}
.hud i{font-size:20px;color:var(--clr-muted);}

.story{
  background:var(--bg-panel);
  padding:12px;border-radius:var(--radius);
  max-height:260px;overflow-y:auto;
  margin-bottom:8px;
}
.story b{color:var(--clr-text);}   /* 아이템 하이라이트 */

.action-list{list-style:none;}
.action-list li{
  display:flex;justify-content:space-between;
  padding:10px;border-bottom:1px solid var(--clr-border);
}
.action-list li:last-child{border-bottom:none;}
.price{display:flex;align-items:center;gap:4px;}
.price i{font-size:14px;}
```