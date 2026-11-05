// Firebase 어댑터 — 페이지 본문은 이 파일의 함수만 호출합니다.
import { initializeApp, deleteApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, doc, onSnapshot, getDoc, setDoc, deleteDoc, writeBatch } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

export function create(cfg){
  const app=initializeApp(cfg);
  const auth=getAuth(app);
  const db=getFirestore(app);
  const ref=p=>{const [c,id]=p.split('/');return doc(db,c,id)};
  const clean=o=>JSON.parse(JSON.stringify(o)); // undefined 제거
  return {
    onAuth(cb){return onAuthStateChanged(auth,u=>cb(u?{uid:u.uid,email:u.email}:null))},
    uid(){return auth.currentUser?auth.currentUser.uid:''},
    async signIn(email,pw){const r=await signInWithEmailAndPassword(auth,email,pw);return r.user.uid},
    async signUp(email,pw){const r=await createUserWithEmailAndPassword(auth,email,pw);return r.user.uid},
    async signOut(){await signOut(auth)},
    // 운영진이 다른 사람 계정을 만들 때: 현재 로그인은 유지하고 보조 앱으로 생성
    async createUserSecondary(email,pw){const app2=initializeApp(cfg,'secondary-'+Date.now());try{const a2=getAuth(app2);const r=await createUserWithEmailAndPassword(a2,email,pw);const uid=r.user.uid;await signOut(a2);return uid}finally{try{await deleteApp(app2)}catch(e){}}},
    listenDoc(path,cb,err){return onSnapshot(ref(path),s=>cb(s.exists()?{id:s.id,...s.data()}:null),e=>err&&err(e))},
    listenCol(col,cb,err){return onSnapshot(collection(db,col),s=>cb(s.docs.map(d=>({id:d.id,...d.data()}))),e=>err&&err(e))},
    async get(path){const s=await getDoc(ref(path));return s.exists()?{id:s.id,...s.data()}:null},
    async set(path,data){await setDoc(ref(path),clean(data))},
    async del(path){await deleteDoc(ref(path))},
    async batch(ops){const b=writeBatch(db);for(const o of ops){if(o.type==='del')b.delete(ref(o.path));else b.set(ref(o.path),clean(o.data))}await b.commit()},
  };
}
