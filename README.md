# 하이마운틴크루(HMC) 산행 앱

평일 산행 크루 하이마운틴크루의 일정·크루원·산 도감(블랙야크 명산100 / 100+) 앱입니다.
정적 페이지(GitHub Pages) + Firebase(Authentication, Firestore)로 동작합니다.

## 구성
- `index.html` — 앱 본체 (단일 페이지)
- `fb.js` — Firebase 연결 어댑터
- `firebase-config.js` — Firebase 프로젝트 설정값 (콘솔의 firebaseConfig)
- `firestore.rules` — Firestore 보안 규칙 (콘솔 > Firestore > 규칙에 붙여넣어 게시)
- `mountains.json` — 산 도감 자료 (BAC 213곳 + 코스)
- `manifest.webmanifest`, `icon-*.png` — 홈 화면 추가(PWA)
- `mascot.jpg`, `bgm.mp3`, `mv.mp4`, `poster.jpg` — 홈 화면 미디어

## 데이터 구조 (Firestore)
- `meta/crew` — 크루 정보, `ownerUid`(개설자)
- `hikes/{id}` — 산행 일정 (attendees: 회원 uid 배열)
- `members/{uid}` — 크루원 (role: owner/staff/member, status: pending/active/rest/out)
- `pins/{uid}` — 4자리 비밀번호 보관 (개설자만 열람)
- `mtx/{mtId}` — 산 도감 덧붙임(크루 메모, 직접 추가한 코스)

## 권한
- 비로그인: 홈·일정·회칙·도감 열람
- 가입 신청: 닉네임+4자리 비밀번호로 계정 생성 → `가입 대기`
- 회원(승인됨): 일정 등록(본인 주관), 본인 참석 체크
- 운영진: 가입 승인/거절, 회원 추가·수정·탈퇴, 모든 일정 수정·삭제, 산 메모·코스 편집
- 개설자: 운영진 지정, 비밀번호 열람 (최초 가입자가 자동으로 개설자)

## 비밀번호를 잊은 회원
클라이언트에서 다른 사람의 비밀번호를 바꿀 수 없습니다. Firebase 콘솔 > Authentication > 사용자에서
해당 계정(이메일이 `u…@hmc.local` 형태)을 삭제한 뒤, 운영진이 앱의 `+ 회원 추가`로 같은 닉네임·새 비밀번호로 다시 만들어 주세요.

© 하이마운틴크루(HMC). 무단 복제·배포 금지.
