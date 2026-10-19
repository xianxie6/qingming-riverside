"""Compute authored-ground placements; reads pixels for geometry, never edits artwork."""
import json, math
from pathlib import Path
import numpy as np
from PIL import Image

root=Path(__file__).resolve().parent.parent
people=json.loads((root/'docs/people-v2/population.json').read_text())['people']
im=np.array(Image.open(root/'art-source/people-v3/background.png').convert('RGB')).astype(float)
H,W=im.shape[:2];r,g,b=im[:,:,0],im[:,:,1],im[:,:,2]
review=json.loads((root/'docs/people-v3/placement-review.json').read_text())
reviewed_blocks=[q['bounds'] for q in review['keepouts']]
terraces=review['terraceAnchors']
hd=np.array(Image.open(root/'assets/explore/people-v3/background-hd.webp').convert('RGB').resize((W,H))).astype(float)
hr,hg,hb=hd[:,:,0],hd[:,:,1],hd[:,:,2]
hdground=(hr>164)&(hg>142)&(hb>105)&(hr-hg>7)&(hr-hg<42)&(hg-hb>9)&(hg-hb<61)
hp=np.pad(hdground,1)
hdground=np.logical_or.reduce([hp[dy:dy+H,dx:dx+W]for dy in range(3)for dx in range(3)])
# Warm light paving, paths and soil; green vegetation, blue water and gray roofs are excluded.
ground=(r>164)&(g>142)&(b>105)&(r-g>7)&(r-g<42)&(g-b>9)&(g-b<61)
# Close only thin ink joints in pavement, not large furniture/foliage shapes.
padded=np.pad(ground,1)
ground=np.logical_or.reduce([padded[dy:dy+H,dx:dx+W]for dy in range(3)for dx in range(3)])
# Explicit canopy / furniture / title keep-outs on the coordinate-locked map.
blocks=[(.125,.715,.18,.759),(.327,.695,.378,.751),(.488,.655,.54,.711),(.785,.732,.842,.785),
 (.30,.48,.345,.545),(.346,.55,.368,.582),(.407,.501,.447,.567),
 (.589,.526,.62,.584),(.725,.64,.746,.705),(.653,.564,.705,.636),
 (.871,.598,.908,.636),(.937,.677,.968,.73),(.944,.774,.975,.826),
 (.211,.689,.244,.757),(.256,.683,.272,.735),(.276,.729,.303,.773),(.314,.722,.328,.766),(.068,.245,.089,.288)]
blocks += [(a/W,b/H,c/W,d/H)for a,b,c,d in reviewed_blocks]
for x1,y1,x2,y2 in blocks:ground[int(y1*H):int(y2*H)+1,int(x1*W):int(x2*W)+1]=False
# All candidate feet must also lie in deliberately bounded streets/courts/decks.
surfaces={
'mill': [[(.184,.51),(.285,.51),(.289,.70),(.283,.785),(.181,.785)]],
'tea': [[(.244,.54),(.43,.54),(.447,.70),(.416,.775),(.245,.781)]],
'bridge': [[(.431,.59),(.580,.59),(.580,.638),(.431,.638)],[(.414,.57),(.445,.57),(.445,.637),(.414,.653)],[(.578,.566),(.615,.566),(.615,.637),(.578,.638)]],
'gate': [[(.879,.529),(.927,.529),(.946,.621),(.967,.795),(.745,.809),(.744,.744),(.875,.699)]],
'quay': [[(.18,.76),(.414,.737),(.409,.778),(.18,.817)],[(.746,.781),(.979,.790),(.98,.833),(.745,.827)]],
'temple': [[(.663,.145),(.801,.14),(.799,.285),(.67,.303)]],
'fields': [[(.015,.22),(.191,.22),(.199,.424),(.021,.435)]]}
# Continue tea passers into the connected northern lanes instead of overcrowding stalls.
surfaces['tea'] += [[(.249,.42),(.278,.42),(.288,.55),(.258,.61)],[(.326,.39),(.349,.39),(.353,.56),(.326,.60)],[(.272,.2),(.302,.2),(.288,.43),(.268,.43)]]
surfaces['gate'] += [[(.898,.394),(.926,.394),(.929,.552),(.898,.552)]]
# Narrow, reviewed cultivated benches support farmers even where the crop is green.
for x,y in terraces.values():
 surfaces['fields'].append([((x-8)/W,(y-3)/H),((x+8)/W,(y-3)/H),((x+8)/W,(y+3)/H),((x-8)/W,(y+3)/H)])
# Visible uncovered bow/stern areas, not the boats' woven roofs.
decks=[(.178,.908,.194,.942),(.226,.912,.242,.944),(.275,.819,.285,.851),(.319,.831,.335,.854),(.376,.849,.389,.872),(.42,.839,.435,.864),(.485,.720,.492,.741),(.482,.803,.496,.835),(.454,.90,.470,.933),(.482,.94,.5,.969),(.551,.847,.567,.880),(.58,.900,.597,.938),(.651,.825,.673,.859),(.708,.852,.725,.88),(.79,.883,.809,.927),(.849,.887,.868,.925),(.935,.883,.95,.916),(.974,.941,.993,.981),(.076,.86,.087,.895),(.152,.845,.167,.875),(.431,.784,.439,.799)]
surfaces['boats']=[[(a,b),(c,b),(c,d),(a,d)]for a,b,c,d in decks]
def inside(x,y,poly):
 yes=False;j=len(poly)-1
 for i,(ax,ay) in enumerate(poly):
  bx,by=poly[j]
  if (ay>y)!=(by>y) and x<(bx-ax)*(y-ay)/(by-ay)+ax:yes=not yes
  j=i
 return yes
def intersects(a,b):return min(a[2],b[2])>max(a[0],b[0]) and min(a[3],b[3])>max(a[1],b[1])
sizes={'tea':12,'mill':13,'bridge':13,'gate':13,'quay':12,'boats':9.5,'temple':13,'fields':14}
# Place the tightly constrained decks/bridge first. Group members remain near their authored anchors.
order={k:i for i,k in enumerate(['boats','bridge','quay','temple','fields','mill','tea','gate'])}
target_config=json.loads((root/'docs/people-v2/collection-targets-v31.json').read_text())
priority=set(i for t in target_config for i in t['sceneEntityIds'])
group_for={i:t['sceneEntityIds']for t in target_config if len(t['sceneEntityIds'])>1 for i in t['sceneEntityIds']}
people.sort(key=lambda p:(p['id'] not in terraces,order[p['regionId']],p['id'] not in priority,p['groupId'].find('passing')>=0,p['id']))
placed=[];out={};stats={};candidate_cache={}
for p in people:
 region=p['regionId'];h=sizes[region];w=h*.75;ox,oy=p['position'][0]*W,p['position'][1]*H
 if p['id'] in terraces:
  x,y=terraces[p['id']];h=12;w=h*.75
  box=(x-w/2-1,y-h*.92-1,x+w/2+1,y+h*.08+1)
  if any(intersects(box,q)for q in placed+reviewed_blocks):raise RuntimeError('Unsafe terrace '+p['id'])
  placed.append(box);out[p['id']]={'position':[round(x/W,7),round(y/H,7)],'scale':h,'surfaceId':'terrace-reviewed-bench'}
  stats[region]=stats.get(region,0)+1
  continue
 if region not in candidate_cache:
  candidates=[]
  for y in range(math.ceil(h),H-2,2):
   for x in range(math.ceil(w/2)+1,W-2,2):
    if not any(inside(x/W,y/H,poly)for poly in surfaces[region]):continue
    box=(x-w/2-1,y-h*.92-1,x+w/2+1,y+h*.08+1)
    if any(intersects(box,q)for q in reviewed_blocks):continue
    x1,y1,x2,y2=map(int,box)
    # Whole sprite rectangle must be on clear ground, not just its anchor point.
    frac=float(ground[y1:y2+1,x1:x2+1].mean())
    if region=='boats':
     # Deck polygons were manually traced. Require feet to avoid blue water too.
     if im[y,x,0]<im[y,x,2]+15 or im[y,x,0]<90:continue
    elif frac<.93 or hdground[y1:y2+1,x1:x2+1].mean()<.8 or hdground[y-2:y+2,int(x-w*.4):int(x+w*.4)+1].mean()<.85:continue
    candidates.append((x,y,box,frac))
  candidate_cache[region]=candidates
  print(region,'valid candidate anchors',len(candidates),flush=True)
 options=[( (x-ox)**2+(y-oy)**2*1.8,x,y,box,frac)for x,y,box,frac in candidate_cache[region]if not any(intersects(box,q)for q in placed)]
 if not options:raise RuntimeError('No safe ground for '+p['id'])
 related=[out[i]for i in group_for.get(p['id'],[])if i in out]
 if related:
  cx=sum(q['position'][0]*W for q in related)/len(related);cy=sum(q['position'][1]*H for q in related)/len(related)
  close=[q for q in options if math.hypot(q[1]-cx,q[2]-cy)<42]
  if close:options=close
 _,x,y,box,frac=min(options)
 placed.append(box);out[p['id']]={'position':[round(x/W,7),round(y/H,7)],'scale':h,'groundCoverage':round(frac,3),'surfaceId':region+'-verified-ground'}
 stats[region]=stats.get(region,0)+1
(root/'docs/people-v3/layout.json').write_text(json.dumps({'size':[W,H],'people':out,'surfaces':surfaces,'blocks':blocks,'stats':stats},ensure_ascii=False,indent=2))
print('Placed',len(out),stats)
