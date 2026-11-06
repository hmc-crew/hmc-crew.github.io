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

## 여러 산악회(크루) 운영 — v2.0
- 주소에 `?c=` 가 없으면 루트 크루(하이마운틴크루, `firebase-config.js` 의 `HMC_ROOT_CREW`)가 열리고, 최상위 컬렉션을 그대로 씁니다.
- `https://hmc-crew.github.io/?c=크루ID` 는 다른 크루이며 `crews/{크루ID}/…` 아래에 같은 구조로 저장됩니다(권한도 크루별로 완전히 분리).
- `https://hmc-crew.github.io/?new` 는 새 크루 개설 안내 — 크루 ID를 정하면 `?c=크루ID#apply` 로 이동하고, 첫 가입자가 개설자가 됩니다.
- 개설자는 '크루 정보'에서 크루 이름·약칭·테마색·홈 대표 사진·주제곡(mp3)·뮤직비디오(유튜브 주소)·가입 지역·회칙(템플릿)·소개를 꾸밉니다.
  - 대표 사진: 가로 1280px·350KB 이하로 줄여 `meta/hero` 문서에 저장(크루 문서의 `heroVer` 로 버전 관리, 기기에 캐시)
  - 주제곡: 4MB 이하 mp3를 700KB base64 조각으로 `media/bgm_N` 에 저장. 재생 버튼을 누를 때만 내려받고 기기에 캐시
  - 뮤직비디오: 유튜브 주소(임베드) 또는 mp4 주소. 파일 저장소(Firebase Storage, Blaze 요금제 필요)를 켜면 URL 방식으로 그대로 바꿀 수 있음
- 로그인 계정은 크루별로 분리됩니다(크루 문서 `authNs`). 루트 크루 기존 회원의 계정은 그대로입니다.
- 새 크루는 `icon-generic-*.png` 와 즉석 manifest(크루 이름·시작 주소)를 씁니다.

## 데이터 구조 (Firestore)
- `meta/crew` — 크루 정보, `ownerUid`(개설자)
- `hikes/{id}` — 산행 일정 (attendees: 회원 uid 배열)
- `members/{uid}` — 크루원 (role: owner/staff/member, status: pending/active/rest/out)
- `pins/{uid}` — 4자리 비밀번호 보관 (개설자만 열람)
- `mtx/{mtId}` — 산 도감 덧붙임(크루 메모, 직접 추가한 코스)
- `meta/hero` — 홈 대표 사진(base64), `media/bgm_N` — 주제곡 조각
- 다른 크루는 위 전부가 `crews/{크루ID}/` 아래

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
