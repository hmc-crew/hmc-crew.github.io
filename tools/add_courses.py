#!/usr/bin/env python3
"""app/mountains.json에 인터넷 교차확인 코스를 넣는다.
사용: python3 -I data/add_courses.py data/courses_batch.json
batch 형식: {"산이름": [{"name","sec","dist","min","lvl","start","desc","src","tier"}...], ...}
같은 산에 기존 코스가 있으면 교체(산림청 OCR 코스가 있는 산은 뒤에 추가)."""
import json,sys
MJ='mountains.json'
arr=json.load(open(MJ,encoding='utf-8'))
batch=json.load(open(sys.argv[1],encoding='utf-8'))
byname={m['name']:m for m in arr}
for name,courses in batch.items():
    m=byname.get(name)
    if not m: print('NOT FOUND',name); continue
    keep=[k for k in m.get('courses',[]) if '산림청' in (k.get('src') or '')]
    out=[]
    for i,k in enumerate(courses):
        k=dict(k); k.setdefault('startAddr',''); k.setdefault('park',''); k.setdefault('parkAddr',''); k.setdefault('note',''); k.setdefault('tier',3)
        k['dist']=float(k.get('dist') or 0); k['min']=int(k.get('min') or 0); k['lvl']=k.get('lvl') or '중'
        out.append(k)
    allc=out+keep
    for i,k in enumerate(allc): k['no']=i+1; k.pop('shortest',None)
    c=[k for k in allc if k['dist']>0]
    if c: min(c,key=lambda k:k['dist'])['shortest']=True
    m['courses']=allc
    print('OK',name,len(allc))
json.dump(arr,open(MJ,'w',encoding='utf-8'),ensure_ascii=False)
left=[m['name'] for m in arr if not m.get('courses')]
print('remaining without courses:',len(left))
