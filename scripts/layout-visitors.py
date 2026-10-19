"""Read artwork pixels to place unique visitor duos on clear, authored paths."""
import json, math
from pathlib import Path
import numpy as np
from PIL import Image

root=Path(__file__).resolve().parent.parent
layout=json.loads((root/'docs/people-v3/layout.json').read_text())
W,H=layout['size']
review=json.loads((root/'docs/people-v3/placement-review.json').read_text())
reviewed_blocks=[q['bounds']for q in review['keepouts']]
im=np.array(Image.open(root/'assets/explore/people-v3/background.webp').convert('RGB')).astype(float)
r,g,b=im[:,:,0],im[:,:,1],im[:,:,2]
ground=(r>164)&(g>142)&(b>105)&(r-g>7)&(r-g<42)&(g-b>9)&(g-b<61)
pad=np.pad(ground,1)
ground=np.logical_or.reduce([pad[dy:dy+H,dx:dx+W]for dy in range(3)for dx in range(3)])
for x1,y1,x2,y2 in layout['blocks']:
 ground[int(y1*H):int(y2*H)+1,int(x1*W):int(x2*W)+1]=False

hd=np.array(Image.open(root/'assets/explore/people-v3/background-hd.webp').convert('RGB').resize((W,H))).astype(float)
hr,hg,hb=hd[:,:,0],hd[:,:,1],hd[:,:,2]
hdground=(hr>164)&(hg>142)&(hb>110)&(hr-hg>7)&(hr-hg<42)&(hg-hb>9)&(hg-hb<53)
hp=np.pad(hdground,1)
hdground=np.logical_or.reduce([hp[dy:dy+H,dx:dx+W]for dy in range(3)for dx in range(3)])
# Additional northern awnings and furniture visible in the HD painting.
for a,b,c,d in [(.795,.515,.816,.565),(.876,.50,.891,.557),(.884,.656,.905,.709),(.845,.523,.864,.562)]:
 ground[int(b*H):int(d*H)+1,int(a*W):int(c*W)+1]=False

def box(x,y,w,h,pad=0):return (x-w/2-pad,y-h*.92-pad,x+w/2+pad,y+h*.08+pad)
def overlaps(a,b):return min(a[2],b[2])>max(a[0],b[0]) and min(a[3],b[3])>max(a[1],b[1])
def coverage(b,mask=ground):
 x1,y1,x2,y2=map(int,b)
 if min(x1,y1)<0 or x2>=W or y2>=H:return 0
 return float(mask[y1:y2+1,x1:x2+1].mean())
def inside(x,y,poly):
 yes=False
 for i,(ax,ay) in enumerate(poly):
  bx,by=poly[i-1]
  if (ay>y)!=(by>y) and x<(bx-ax)*(y-ay)/(by-ay)+ax:yes=not yes
 return yes

# Enlarge residents only where both scenery and neighbouring silhouettes allow it.
occupied={id:box(p['position'][0]*W,p['position'][1]*H,p['scale']*.75,p['scale']) for id,p in layout['people'].items()}
scales={}
for id,p in layout['people'].items():
 if id.startswith('boats') or p['surfaceId']=='terrace-reviewed-bench':continue
 x,y=p['position'][0]*W,p['position'][1]*H
 for factor in [1.24,1.16,1.08]:
  h=round(p['scale']*factor,2);bb=box(x,y,h*.75,h,.25)
  if coverage(bb)>=.93 and coverage(bb,hdground)>=.8 and not any(overlaps(bb,q)for q in reviewed_blocks) and not any(overlaps(bb,q) for key,q in occupied.items() if key!=id):
   occupied[id]=bb;scales[id]=h;break

# Authored routes continue through the previously empty northern streets.
routes=[[(.03,.129),(.128,.21),(.20,.247),(.264,.257),(.28,.217),(.35,.22),(.413,.192),(.455,.209)],
 [(.243,.02),(.223,.107),(.218,.177),(.197,.246)],
 [(.257,.277),(.255,.331),(.239,.445),(.252,.529)],
 [(.602,.095),(.585,.233),(.587,.336),(.618,.454),(.629,.569),(.62,.624)],
 [(.769,.302),(.801,.387),(.871,.414),(.908,.369)],
 [(.677,.397),(.684,.472),(.720,.492),(.77,.52),(.813,.56),(.869,.568)],
 [(.143,.164),(.164,.166),(.179,.142),(.194,.074),(.19,.025)],
 [(.253,.19),(.263,.161),(.294,.139),(.327,.078),(.353,.069),(.383,.018)],
 [(.781,.071),(.796,.139),(.822,.17),(.853,.218),(.879,.277),(.91,.296)],
 [(.048,.552),(.054,.603),(.037,.674),(.052,.72),(.095,.756),(.178,.785)]]
def near_route(x,y):
 for route in routes:
  for a,b in zip(route,route[1:]):
   ax,ay=a[0]*W,a[1]*H;bx,by=b[0]*W,b[1]*H
   t=max(0,min(1,((x-ax)*(bx-ax)+(y-ay)*(by-ay))/max(1,(bx-ax)**2+(by-ay)**2)))
   if math.hypot(x-ax-t*(bx-ax),y-ay-t*(by-ay))<15:return True
 return False

budgets={'tea':1,'gate':2,'quay':2,'bridge':1,'mill':1,'temple':3,'fields':3,'lanes':51}
occupied=list(occupied.values());duos=[];stats={}
for region,count in budgets.items():
 candidates=[]
 for y in range(18,H-8,3):
  for x in range(14,W-14,3):
   permitted=near_route(x,y) if region=='lanes' else any(inside(x/W,y/H,p)for p in layout['surfaces'][region])
   if not permitted:continue
   # Uniform pair height matches residents; a small distance adjustment on northern paths.
   h=18 if region in ['tea','gate','quay','mill'] else 17
   if region=='lanes':h=18
   bb=box(x,y,h,h,.7)
   if any(overlaps(bb,q)for q in reviewed_blocks):continue
   frac=coverage(bb)
   if frac<.78 or coverage(bb,hdground)<.7 or coverage((x-h*.4,y-3,x+h*.4,y+1),hdground)<.85 or coverage((x-h*.4,y-3,x+h*.4,y+1))<.95 or any(overlaps(bb,q)for q in occupied):continue
   candidates.append((x,y,h,bb,frac))
 print(region, len(candidates), 'candidate positions',flush=True)
 for i in range(count):
  options=[c for c in candidates if not any(overlaps(c[3],q)for q in occupied)]
  if not options:
   if region=='lanes':raise RuntimeError(f'No clear ground for {region} pair {i}')
   budgets['lanes']+=count-i
   break
  # Spread vignettes along paths instead of filling a rectangular grid.
  previous=[p for p in duos if p['regionId']==region]
  def score(c):
   x,y=c[:2]
   distance=min((math.hypot(x-p['position'][0]*W,y-p['position'][1]*H)for p in previous),default=50)
   jitter=math.sin(x*12.9898+y*78.233)*.5+.5
   return min(distance,95)+jitter*14
  x,y,h,bb,frac=max(options,key=score)
  occupied.append(bb)
  duos.append({'id':f'visitors-{len(duos)+1:02}','regionId':region,'position':[round(x/W,7),round(y/H,7)],'scale':h,'sprite':len(duos),'members':2,'groundCoverage':round(frac,3),'footCoverage':round(coverage((x-h*.4,y-3,x+h*.4,y+1)),3),'hdFootCoverage':round(coverage((x-h*.4,y-3,x+h*.4,y+1),hdground),3)})
 stats[region]=sum(p['regionId']==region for p in duos)
data={'residentScales':scales,'visitors':duos,'stats':stats,'routes':routes}
(root/'docs/visitors/layout.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
(root/'src/visitors-data.js').write_text('// Generated by scripts/layout-visitors.py; each duo is used exactly once.\nexport const residentScales='+json.dumps(scales)+';\nexport const visitors='+json.dumps(duos)+';\n')
print(f'Placed {len(duos)} duos / {len(duos)*2} visitors; enlarged {len(scales)} residents.',stats)
