import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';

// 개발 모드인지 확인
const isDevelopment = process.env.NODE_ENV === 'development';

// 윈도우 객체에 대한 전역 참조 유지
// 가비지 컬렉션이 객체를 파괴하는 것을 방지
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // 브라우저 창 생성
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 앱의 index.html 로드
  if (isDevelopment) {
    // 개발 모드에서는 로컬 서버에서 로드
    mainWindow.loadURL('http://localhost:5173');
    // 개발자 도구 열기
    mainWindow.webContents.openDevTools();
  } else {
    // 프로덕션 모드에서는 빌드된 파일 로드
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  // 창이 닫힐 때 발생하는 이벤트
  mainWindow.on('closed', () => {
    // 참조 삭제
    mainWindow = null;
  });
}

// Electron이 초기화를 완료하고 
// 브라우저 창을 생성할 준비가 되면 호출됨
app.whenReady().then(createWindow);

// 모든 창이 닫히면 종료
app.on('window-all-closed', () => {
  // macOS에서는 사용자가 Cmd + Q로 명시적으로
  // 종료하기 전까지 애플리케이션을 활성 상태로 유지하는 것이 일반적
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // macOS에서는 창이 닫혀도 애플리케이션이 계속 실행됨
  // dock 아이콘을 클릭하면 앱에서 새 창 생성
  if (mainWindow === null) {
    createWindow();
  }
});

// 이 파일에서 앱 특정 메인 프로세스 코드를 포함할 수 있음
// 별도의 파일에 넣고 여기서 require 할 수도 있음