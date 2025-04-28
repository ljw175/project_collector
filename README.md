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

### **아이템 태그 팝업** (`아이템 선택 시 태그 공개.png`)

```css
.tag-popup{
  position:absolute;bottom:90px;left:50%;transform:translateX(-50%);
  background:var(--bg-card);padding:8px 10px;border-radius:var(--radius);
  display:flex;gap:6px;box-shadow:var(--shadow);
  animation:fadeIn .2s;
}
.tag-popup i{
  width:28px;height:28px;border:1px solid var(--clr-border);
  border-radius:4px;background:#333 center/70% no-repeat;
}
.tag-popup small{position:absolute;top:100%;left:0;margin-top:4px;
  font-size:12px;color:var(--clr-muted);}
@keyframes fadeIn{from{opacity:0;transform:translate(-50%,6px);}to{opacity:1;}}
```

---

## 2. **달력 화면** (`게임 내 기능 (달력).png`)

```css
.calendar{
  background:var(--bg-panel);padding:12px;border-radius:var(--radius);
  display:grid;grid-template-columns:repeat(7,1fr);gap:2px;font-size:13px;
}
.calendar div{
  aspect-ratio:1/1;display:flex;justify-content:center;align-items:center;
  border:1px solid var(--clr-border);border-radius:4px;position:relative;
}
.calendar .closed{background:#ffdada url(close.svg) center/70% no-repeat;}
.calendar .auction{
  border:2px solid var(--clr-accent);font-weight:600;
  background:url(auction.svg) center/72% no-repeat;
}
.calendar .today{box-shadow:0 0 0 1.5px var(--clr-text) inset;}
```

---

## 3. **맵 이동 화면** (`게임 내 기능 (맵 이동).png`)

```css
.map-wrapper{
  background:var(--bg-panel);padding:8px;border-radius:var(--radius);
}
.city-map{
  width:100%;aspect-ratio:1/1;position:relative;
  background:url(city_map_placeholder.jpg) center/cover no-repeat;
  border:1px solid var(--clr-border);border-radius:var(--radius);
}

/* POI 아이콘 */
.poi{
  position:absolute;width:36px;height:36px;border-radius:50%;
  background:#000 center/70% no-repeat;cursor:pointer;
}
.poi[data-type="market"]{background-image:url(market.svg);}
.poi .badge{
  position:absolute;top:-4px;right:-4px;
  width:18px;height:18px;border-radius:50%;background:var(--clr-accent);
  color:#000;font-size:11px;display:flex;justify-content:center;align-items:center;
}
```

---

## 4. **인벤토리 화면** (`게임 내 기능 (인벤토리).png`)

```css
.inventory{
  background:url(suitcase.svg) center/contain no-repeat;
  padding:76px 24px 24px;   /* 상단 뚜껑 여백 고려 */
  height:calc(100vh - 56px);overflow-y:auto;
}
.item-grid{
  display:grid;grid-template-columns:repeat(6,1fr);
  gap:6px;min-height:240px;
}

/* 아이템 칸 */
.slot{
  width:100%;aspect-ratio:1/1;border:1px solid var(--clr-border);
  border-radius:4px;position:relative;background:#fff;
}
.slot[data-state="stack"]::after{
  content:attr(data-count);position:absolute;bottom:4px;right:4px;
  font-size:11px;background:rgba(0,0,0,.6);color:#fff;padding:0 3px;border-radius:2px;
}
.slot[data-state="appraised"]{
  outline:2px solid var(--clr-accent);
}
.slot .tag-chip{
  position:absolute;top:4px;left:4px;
  width:10px;height:10px;border-radius:2px;background:purple;
}
```

---

## 5. **경매 라운드 모달** *(사양)*

```css
.auction-modal{
  position:fixed;inset:0;background:rgba(0,0,0,.4);
  display:flex;justify-content:center;align-items:center;
}
.auction-card{
  width:320px;background:#fff;padding:16px;border-radius:var(--radius);
  box-shadow:var(--shadow);display:flex;flex-direction:column;gap:12px;
}
.auction-header{display:flex;justify-content:space-between;align-items:center;}
.timer-bar{
  height:6px;border-radius:3px;background:var(--bg-card);overflow:hidden;
}
.timer-bar span{display:block;height:100%;background:var(--clr-accent);
  width:100%;animation:countdown var(--dur) linear forwards;}
@keyframes countdown{to{width:0;}}
.bid-log{flex:1;overflow-y:auto;background:var(--bg-panel);padding:8px;font-size:13px;}
.bid-actions{display:flex;gap:8px;}
.bid-actions button{
  flex:1;padding:10px;border-radius:var(--radius);border:1px solid var(--clr-border);
  transition:background var(--trans);
}
.bid-actions button.primary{background:var(--clr-accent);color:#000;font-weight:600;}
.bid-actions button:hover{background:var(--bg-card);}
```

`--dur` 커스텀 프로퍼티 값(예: `15s`, `25s`)을 JS에서 플레이어 맞춤형으로 주입하면 **적응형 타이머**를 쉽게 만들 수 있습니다.