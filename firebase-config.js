// Firebase 콘솔 > 프로젝트 설정 > 내 앱 > 웹 앱(hmc)의 firebaseConfig 값 (공개용 식별자 — 보안은 Firestore 규칙이 담당)
window.HMC_FIREBASE = {
  apiKey: "AIzaSyBQlgqsghvuA35ugPDw3CzEXjb-sIU0vu0",
  authDomain: "hmc-crew.firebaseapp.com",
  projectId: "hmc-crew",
  storageBucket: "hmc-crew.firebasestorage.app",
  messagingSenderId: "171096713252",
  appId: "1:171096713252:web:4a8a06e0382b4b0d8c90b1"
};
window.HMC_KAKAO_KEY = "8311370f626a9a58016f1e84f0a54348"; // 카카오디벨로퍼스 앱 "하이마운틴크루"(ID 1638810) REST API 키 — 길찾기(거리·시간·통행료)용
window.HMC_VERSION = "2.3.10";
// 루트 크루 ID — 주소에 ?c= 가 없을 때 열리는 크루(최상위 컬렉션 사용). 다른 크루는 ?c=크루ID 로 열리며 crews/{크루ID}/ 아래에 저장됩니다.
// 이 앱을 통째로 복사해 새 Firebase 프로젝트로 배포한다면 ""(빈 값)으로 두면 첫 화면이 '새 산악회 만들기' 안내가 됩니다.
window.HMC_ROOT_CREW = "hmc";
