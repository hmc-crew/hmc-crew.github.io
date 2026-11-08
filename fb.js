// Firebase 어댑터 — 페이지 본문은 이 파일의 함수만 호출합니다.
// 여러 산악회(크루)를 한 프로젝트에서 운영: 루트 크루(개설 당시의 크루)는 최상위 컬렉션을 그대로 쓰고,
// 그 밖의 크루는 crews/{크루ID}/… 아래에 같은 구조로 저장합니다.
import { initializeApp, deleteApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, doc, onSnapshot, getDoc, setDoc, updateDoc, deleteDoc, writeBatch, query, where, deleteField } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

export function create(cfg,cid,rootCid){
  const app=initializeApp(cfg);
  const auth=getAuth(app);
  const db=getFirestore(app);
  const isRoot=!!rootCid&&cid===rootCid;
  const pre=c=>isRoot?[]:['crews',c];              // 경로 접두(루트 크루는 없음)
  const preOf=c=>(rootCid&&c===rootCid)?[]:['crews',c];
  const ref=p=>doc(db,...pre(cid),...p.split('/'));          // 'col/id' 또는 'col/id/sub/id'
  const col=c=>collection(db,...pre(cid),...c.split('/')); // 'col' 또는 'col/id/sub'
  const clean=o=>JSON.parse(JSON.stringify(o)); // undefined 제거
  return {
    cid, isRoot,
    onAuth(cb){return onAuthStateChanged(auth,u=>cb(u?{uid:u.uid,email:u.email}:null))},
    uid(){return auth.currentUser?auth.currentUser.uid:''},
    async signIn(email,pw){const r=await signInWithEmailAndPassword(auth,email,pw);return r.user.uid},
    async signUp(email,pw){const r=await createUserWithEmailAndPassword(auth,email,pw);return r.user.uid},
    async signOut(){await signOut(auth)},
    // 운영진이 다른 사람 계정을 만들 때: 현재 로그인은 유지하고 보조 앱으로 생성
    async createUserSecondary(email,pw){const app2=initializeApp(cfg,'secondary-'+Date.now());try{const a2=getAuth(app2);const r=await createUserWithEmailAndPassword(a2,email,pw);const uid=r.user.uid;await signOut(a2);return uid}finally{try{await deleteApp(app2)}catch(e){}}},
    // 개설자가 다른 회원의 비밀번호를 바꿀 때: 현재 로그인은 유지하고 보조 앱으로 그 회원 계정에 들어가 비밀번호만 교체(계정·uid 유지)
    async changePasswordSecondary(email,oldPw,newPw){const app2=initializeApp(cfg,'secondary-'+Date.now());try{const a2=getAuth(app2);const r=await signInWithEmailAndPassword(a2,email,oldPw);await updatePassword(r.user,newPw);await signOut(a2)}finally{try{await deleteApp(app2)}catch(e){}}},
    listenDoc(path,cb,err){return onSnapshot(ref(path),s=>cb(s.exists()?{id:s.id,...s.data()}:null),e=>err&&err(e))},
    listenWhere(c,field,value,cb,err){return onSnapshot(query(col(c),where(field,'==',value)),s=>cb(s.docs.map(d=>({id:d.id,...d.data()}))),e=>err&&err(e))},
    // 한 필드의 범위 조회(복합 색인 불필요) — 채팅 메시지(roomAt = 방ID|시각)에 사용
    listenRange(c,field,from,to,cb,err){return onSnapshot(query(col(c),where(field,'>=',from),where(field,'<',to)),s=>cb(s.docs.map(d=>({id:d.id,...d.data()}))),e=>err&&err(e))},
    deleteField(){return deleteField()},
    listenCol(c,cb,err){return onSnapshot(col(c),s=>cb(s.docs.map(d=>({id:d.id,...d.data()}))),e=>err&&err(e))},
    async get(path){const s=await getDoc(ref(path));return s.exists()?{id:s.id,...s.data()}:null},
    // 다른 크루의 문서 읽기(크루 ID가 비어 있는지 확인할 때)
    async getAt(c,path){const [cc,id]=path.split('/');const s=await getDoc(doc(db,...preOf(c),cc,id));return s.exists()?{id:s.id,...s.data()}:null},
    async set(path,data){await setDoc(ref(path),clean(data))},
    // 지정한 필드만 바꾼다(문서 전체를 덮어쓰지 않음) — 본인 접속 기록처럼 규칙이 특정 필드만 허용할 때 사용
    async update(path,data){const d={};for(const [k,v] of Object.entries(data)){if(v===undefined)continue;d[k]=(v&&typeof v==='object'&&typeof v._methodName==='string')?v:clean(v)}await updateDoc(ref(path),d)},
    async del(path){await deleteDoc(ref(path))},
    async batch(ops){const b=writeBatch(db);for(const o of ops){if(o.type==='del')b.delete(ref(o.path));else b.set(ref(o.path),clean(o.data))}await b.commit()},
  };
}
