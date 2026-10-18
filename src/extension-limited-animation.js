// Limited animation: a few drawn key poses per figure, held and switched like
// traditional animation, instead of warping one painting. Each sheet is one row
// of equal cells. Missing sheets fall back to the original still figure.
export const LIMITED_DIR='assets/extension-preview/limited';
export const LIMITED={
 // Work cycles hold the rest pose, then play the action on a few drawn poses.
 // `soles`: the planted front shoe in each cell (cell pixels), read off the
 // generated sheet. Generated cells drift; dangling weeds or tools fool any
 // automatic lowest-pixel guess, so marked soles take precedence.
 'fields-02':{file:'fields-02-weed',cols:3,anchor:'feet',soles:[[450,575],[435,580],[405,625]],activity:['俯身寻草','伸手拔草','起身甩草'],
  timeline:[[0,1.9],[1,.45],[2,.7],[1,.35],[0,1.2],[1,.45],[2,.6]]},
 'fields-04':{file:'fields-04-hoe',cols:3,anchor:'feet',soles:[[355,742],[315,742],[383,742]],label:'锄地人 · 田埂边松土',activity:['扶锄站定','举锄过肩','落锄入土'],
  timeline:[[0,1.4],[1,.5],[2,.55],[0,.45],[1,.5],[2,.55],[0,1.8]]},
 'fields-01':{file:'fields-01-harvest',cols:3,anchor:'feet',soles:[[230,520],[238,520],[238,524]],activity:['拢住麦穗','拉镰收割','收拢麦束'],
  timeline:[[0,1.6],[1,.55],[2,.8],[0,.5],[1,.55],[2,1.1]]},
 'temple-04':{file:'temple-04-sweep',cols:3,anchor:'feet',soles:[[430,710],[430,714],[446,706]],activity:['扶帚站定','落帚向外扫','收帚回身'],
  timeline:[[0,1.5],[1,.5],[2,.45],[1,.5],[2,.45],[0,.9]]},
 // Second batch (2026-10-17): the warehouse beside the crane and the default
 // garden view. `soles` are added once each generated sheet has been read.
 'mill-16':{file:'mill-16-pour',cols:3,anchor:'feet',soles:[[520,632],[476,632],[428,632]],activity:['倾袋倒粮','抬袋抖粮','放低抖净'],
  timeline:[[0,1.7],[1,.6],[2,.55],[1,.45],[0,1.3],[2,.6]]},
 'mill-14':{file:'mill-14-grain',cols:3,anchor:'feet',soles:[[495,615],[451,615],[407,615]],activity:['扶筐看粮','双手捧粮','让粮流回筐里'],
  timeline:[[0,1.8],[1,.6],[2,.9],[1,.4],[2,.7],[0,1.1]]},
 'bridge-17':{file:'bridge-17-cakes',cols:3,anchor:'feet',soles:[[348,650],[296,650],[304,650]],activity:['端盘候客','托盘招呼','拈饼递出'],
  timeline:[[0,2],[1,.8],[2,1],[1,.5],[0,1.4]]},
 // The v2 sheet keeps the blade attached in every pose; soles mark its 2043x770 pixels.
 'fields-13':{file:'fields-13-tools',cols:3,anchor:'feet',soles:[[370,730],[360,730],[360,730]],activity:['端详农具','缠绳加固','举起看刃'],
  timeline:[[0,1.6],[1,.6],[0,.4],[1,.7],[2,1.2],[0,1.3]]},
 // Cell 0 stands; cells 1-4 are one two-step walk cycle advanced by distance.
 // `cycle`: ground covered per cycle in figure heights, matched to the painted
 // stride so the feet do not skate; `pace`: walking speed in heights per second.
 'bridge-23':{file:'bridge-23-walk',cols:5,anchor:'head',walk:true,cycle:.95,pace:.5,activity:['停步看看','沿路慢行']},
 // `cycle` measured from each sheet's drawn stride (two steps per cycle).
 'bridge-20':{file:'bridge-20-walk',cols:5,anchor:'head',walk:true,cycle:.8,pace:.3,activity:['拄杖歇脚','拄杖缓行']},
 'bridge-24':{file:'bridge-24-walk',cols:5,anchor:'head',walk:true,cycle:.85,pace:.45,activity:['停步看看','抱箱赶路']},
 // Third batch (2026-10-17): travellers on the field road. Their original art is
 // seen from behind or from above; the drawn cycles are eye-level side views.
 // `cycle` measured from each sheet's drawn stride; pairs use the mean of both walkers.
 'fields-07':{file:'fields-07-walk',cols:5,anchor:'head',walk:true,cycle:.82,pace:.45,activity:['放下禾束歇口气','肩扛禾束回家']},
 'fields-15':{file:'fields-15-walk',cols:5,anchor:'head',walk:true,cycle:.93,pace:.32,activity:['扶着禾束歇脚','背着禾束慢行']},
 'fields-12':{file:'fields-12-walk',cols:5,anchor:'head',walk:true,cycle:.88,pace:.42,activity:['扛锄站定','负锄下田']},
 'fields-08':{file:'fields-08-walk',cols:5,anchor:'head',walk:true,cycle:.85,pace:.38,activity:['哄哄背上的娃','背着娃赶路']},
 'visitors-02':{file:'visitors-02-walk',cols:5,anchor:'head',walk:true,cycle:.6,pace:.35,activity:['撑伞停步','母女撑伞同行']},
 'visitors-04':{file:'visitors-04-walk',cols:5,anchor:'head',walk:true,cycle:.85,pace:.4,activity:['停步问路','背包结伴赶路']},
 // Fourth batch (2026-10-17): figures standing on the field road. Their original
 // art is seen from above; the drawn poses are eye-level, feet planted.
 // Soles come from matching the lower body of each cell against cell 1; the
 // father and daughter drift apart in cell 3, so their soles split the difference.
 'fields-03':{file:'fields-03-basket',cols:3,anchor:'feet',soles:[[469,704],[441,703],[403,705]],activity:['端篮看菜','递出菜篮','拈菜给人看'],
  timeline:[[0,1.8],[1,.7],[2,1],[1,.5],[0,1.3]]},
 'fields-11':{file:'fields-11-basket',cols:3,anchor:'feet',soles:[[423,695],[339,695],[311,694]],label:'提篮村妇 · 采菜招呼',activity:['挎篮站定','从篮中取菜','举菜招呼'],
  timeline:[[0,2],[1,.7],[2,1.1],[1,.4],[0,1.4]]},
 'visitors-01':{file:'visitors-01-point',cols:3,anchor:'feet',soles:[[488,661],[431,657],[383,661]],label:'父女 · 指看田景',activity:['并肩站定','抬手远指','俯身讲给女儿'],
  timeline:[[0,1.8],[1,1.4],[2,1.2],[0,1.6],[2,.8]]},
 'visitors-03':{file:'visitors-03-scroll',cols:3,anchor:'feet',soles:[[433,654],[401,655],[387,654]],label:'文士 · 持卷论文',activity:['持卷候听','展卷诵读','摊手作答'],
  timeline:[[0,1.8],[1,1.2],[0,.6],[2,1.2],[1,.6]]},
 // Fifth batch (2026-10-17): the city-gate market. Soles start from the automatic
 // foot measure, then each cell's shoes are matched against cell 1 to remove drift.
 'gate-01':{file:'gate-01-cloth',cols:3,anchor:'feet',soles:[[317,714],[207,714],[239,714]],activity:['托布候客','展开布匹','递布给人摸'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-02':{file:'gate-02-feel',cols:3,anchor:'feet',soles:[[437,708],[337,707],[402,706]],activity:['打量布匹','伸手摸布','点头问价'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-03':{file:'gate-03-cloth',cols:3,anchor:'feet',soles:[[267,682],[280,681],[284,679]],activity:['展开布匹','对折布匹','压平叠好'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-04':{file:'gate-04-jar',cols:3,anchor:'feet',soles:[[262,704],[278,703],[290,705]],activity:['俯身看瓮','伸手敲瓮','端详瓮口'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-05':{file:'gate-05-greens',cols:3,anchor:'feet',soles:[[545,694],[510,695],[507,692]],activity:['俯身理菜','捧菜入筐','理齐菜筐'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-06':{file:'gate-06-scale',cols:3,anchor:'feet',soles:[[413,716],[351,716],[348,717]],activity:['提秤','拨动秤砣','看秤点头'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-07':{file:'gate-07-jar',cols:3,anchor:'feet',soles:[[390,703],[343,703],[298,703]],activity:['俯身看瓮','伸手敲瓮','端详瓮口'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-08':{file:'gate-08-ask',cols:3,anchor:'feet',soles:[[485,718],[534,718],[581,718]],activity:['停步问路','抬手指路','摊手问询'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-09':{file:'gate-09-greens',cols:3,anchor:'feet',soles:[[405,700],[376,700],[384,700]],activity:['俯身理菜','捧菜入筐','理齐菜筐'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-10':{file:'gate-10-feel',cols:3,anchor:'feet',soles:[[380,708],[293,708],[278,709]],activity:['打量布匹','伸手摸布','点头问价'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-11':{file:'gate-11-cloth',cols:3,anchor:'feet',soles:[[448,714],[413,714],[393,714]],activity:['托布候客','展开布匹','递布给人摸'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-12':{file:'gate-12-feel',cols:3,anchor:'feet',soles:[[502,708],[478,708],[484,708]],activity:['打量布匹','伸手摸布','点头问价'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-13':{file:'gate-13-cloth',cols:3,anchor:'feet',soles:[[489,700],[526,698],[529,698]],activity:['展开布匹','对折布匹','压平叠好'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-14':{file:'gate-14-jar',cols:3,anchor:'feet',soles:[[403,687],[403,688],[404,687]],activity:['俯身看瓮','伸手敲瓮','端详瓮口'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-15':{file:'gate-15-greens',cols:3,anchor:'feet',soles:[[470,701],[414,697],[371,700]],activity:['俯身理菜','捧菜入筐','理齐菜筐'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-16':{file:'gate-16-scale',cols:3,anchor:'feet',soles:[[375,704],[315,705],[304,705]],activity:['提秤','拨动秤砣','看秤点头'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-17':{file:'gate-17-jar',cols:3,anchor:'feet',soles:[[416,681],[363,680],[351,681]],activity:['俯身看瓮','伸手敲瓮','端详瓮口'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-18':{file:'gate-18-ask',cols:3,anchor:'feet',soles:[[365,708],[306,706],[300,707]],activity:['停步问路','抬手指路','摊手问询'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-19':{file:'gate-19-greens',cols:3,anchor:'feet',soles:[[386,689],[371,688],[363,689]],activity:['俯身理菜','捧菜入筐','理齐菜筐'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-20':{file:'gate-20-feel',cols:3,anchor:'feet',soles:[[406,705],[334,707],[323,708]],activity:['打量布匹','伸手摸布','点头问价'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-21':{file:'gate-21-cloth',cols:3,anchor:'feet',soles:[[470,713],[456,714],[435,710]],activity:['托布候客','展开布匹','递布给人摸'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-22':{file:'gate-22-feel',cols:3,anchor:'feet',soles:[[350,695],[306,692],[321,693]],activity:['打量布匹','伸手摸布','点头问价'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-23':{file:'gate-23-cloth',cols:3,anchor:'feet',soles:[[340,692],[339,692],[337,693]],activity:['展开布匹','对折布匹','压平叠好'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-24':{file:'gate-24-jar',cols:3,anchor:'feet',soles:[[397,709],[378,709],[360,710]],activity:['俯身看瓮','伸手敲瓮','端详瓮口'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-25':{file:'gate-25-greens',cols:3,anchor:'feet',soles:[[440,696],[426,696],[438,696]],activity:['俯身理菜','捧菜入筐','理齐菜筐'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-26':{file:'gate-26-scale',cols:3,anchor:'feet',soles:[[453,709],[417,708],[405,709]],activity:['提秤','拨动秤砣','看秤点头'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-27':{file:'gate-27-jar',cols:3,anchor:'feet',soles:[[394,682],[360,683],[371,684]],activity:['俯身看瓮','伸手敲瓮','端详瓮口'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-28':{file:'gate-28-ask',cols:3,anchor:'feet',soles:[[443,703],[303,703],[266,703]],activity:['停步问路','抬手指路','摊手问询'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-29':{file:'gate-29-greens',cols:3,anchor:'feet',soles:[[417,689],[389,688],[329,689]],activity:['俯身理菜','捧菜入筐','理齐菜筐'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-30':{file:'gate-30-feel',cols:3,anchor:'feet',soles:[[359,688],[317,688],[301,695]],activity:['打量布匹','伸手摸布','点头问价'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'gate-31':{file:'gate-31-cloth',cols:3,anchor:'feet',soles:[[490,705],[417,709],[374,708]],activity:['托布候客','展开布匹','递布给人摸'],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 // Sixth batch (2026-10-17): paired visitors on the road and by the inns. Walk
 // sheets keep the prepared stride; standing pairs match each cell's shoes against cell 1.
 'visitors-05':{file:"visitors-05-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[400,639],[420,640],[397,640]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-06':{file:"visitors-06-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[413,646],[419,645],[397,646]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-07':{file:"visitors-07-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[455,663],[407,665],[434,666]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-08':{file:"visitors-08-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[470,638],[417,637],[440,635]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-09':{file:"visitors-09-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[360,651],[337,657],[347,658]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-10':{file:"visitors-10-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[288,630],[297,627],[275,630]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-11':{file:"visitors-11-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.38,activity:["停步看看","沿路慢行"]},
 'visitors-12':{file:"visitors-12-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[414,656],[407,665],[353,658]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-13':{file:"visitors-13-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.38,activity:["停步看看","沿路慢行"]},
 'visitors-14':{file:"visitors-14-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[513,665],[425,664],[424,666]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-15':{file:"visitors-15-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[302,667],[319,670],[298,670]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-16':{file:"visitors-16-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.38,activity:["停步看看","沿路慢行"]},
 'visitors-17':{file:"visitors-17-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[391,665],[382,662],[389,665]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-18':{file:"visitors-18-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[433,629],[399,630],[367,632]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-19':{file:"visitors-19-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[422,631],[428,631],[426,631]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-20':{file:"visitors-20-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[466,649],[421,648],[355,650]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-21':{file:"visitors-21-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.38,activity:["停步看看","沿路慢行"]},
 'visitors-22':{file:"visitors-22-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.38,activity:["停步看看","沿路慢行"]},
 'visitors-23':{file:"visitors-23-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[245,662],[267,662],[235,665]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-24':{file:"visitors-24-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[391,665],[327,666],[324,664]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-25':{file:"visitors-25-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[341,619],[351,620],[339,624]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-26':{file:"visitors-26-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[455,640],[419,649],[385,648]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-27':{file:"visitors-27-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.38,activity:["停步看看","沿路慢行"]},
 'visitors-28':{file:"visitors-28-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[420,644],[423,649],[408,646]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-29':{file:"visitors-29-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[384,638],[388,642],[358,636]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-30':{file:"visitors-30-play",cols:3,anchor:"feet",activity:["拍手嬉戏","蹦跳笑闹","并肩站定"],soles:[[375,663],[493,679],[341,668]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-31':{file:"visitors-31-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[360,623],[378,623],[330,620]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-32':{file:"visitors-32-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[375,632],[359,636],[358,631]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-33':{file:"visitors-33-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.38,activity:["停步看看","沿路慢行"]},
 'visitors-34':{file:"visitors-34-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[291,636],[299,636],[294,636]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-35':{file:"visitors-35-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[450,648],[383,649],[352,649]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-36':{file:"visitors-36-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.38,activity:["停步看看","沿路慢行"]},
 'visitors-37':{file:"visitors-37-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.38,activity:["停步看看","沿路慢行"]},
 'visitors-38':{file:"visitors-38-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[465,668],[433,667],[376,668]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-39':{file:"visitors-39-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[438,619],[386,620],[360,619]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-40':{file:"visitors-40-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[378,644],[347,649],[291,647]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-41':{file:"visitors-41-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.38,activity:["停步看看","沿路慢行"]},
 'visitors-42':{file:"visitors-42-play",cols:3,anchor:"feet",activity:["拍手嬉戏","蹦跳笑闹","并肩站定"],soles:[[371,663],[350,672],[364,665]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-43':{file:"visitors-43-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[404,654],[393,655],[359,653]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-44':{file:"visitors-44-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.38,activity:["停步看看","沿路慢行"]},
 'visitors-45':{file:"visitors-45-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.38,activity:["停步看看","沿路慢行"]},
 'visitors-51':{file:"visitors-51-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[390,646],[365,650],[371,650]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'visitors-52':{file:"visitors-52-chat",cols:3,anchor:"feet",activity:["并肩站定","抬手指点","相视交谈"],soles:[[426,644],[401,645],[392,646]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 // Seventh batch (2026-10-17): walkers on the bridge and the garden road, with the prepared stride.
 'bridge-26':{file:"bridge-26-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.45,activity:["停步看看","沿路慢行"]},
 'bridge-27':{file:"bridge-27-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.4,activity:["停步看看","沿路慢行"]},
 'bridge-28':{file:"bridge-28-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.4,activity:["停步看看","沿路慢行"]},
 'bridge-29':{file:"bridge-29-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.45,activity:["停步看看","沿路慢行"]},
 'bridge-30':{file:"bridge-30-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.4,activity:["停步看看","沿路慢行"]},
 'bridge-31':{file:"bridge-31-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.3,activity:["停步看看","沿路慢行"]},
 'bridge-32':{file:"bridge-32-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.4,activity:["停步看看","沿路慢行"]},
 'bridge-36':{file:"bridge-36-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.4,activity:["停步看看","沿路慢行"]},
 'bridge-37':{file:"bridge-37-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.45,activity:["停步看看","沿路慢行"]},
 // Eighth batch (2026-10-17): the rest of the bridge road, the mill yard and three field workers.
 // Walks keep the prepared stride; work poses match each cell's shoes against cell 1.
 // Weeds, grain piles and sacks reach below the shoes, so fields-10 and mill-07/08/09
 // mark the shoes themselves.
 'bridge-02':{file:"bridge-02-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.45,activity:["停步看看","沿路慢行"]},
 'bridge-03':{file:"bridge-03-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.45,activity:["停步看看","沿路慢行"]},
 'bridge-04':{file:"bridge-04-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.3,activity:["停步看看","沿路慢行"]},
 'bridge-07':{file:"bridge-07-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.4,activity:["停步看看","沿路慢行"]},
 'bridge-08':{file:"bridge-08-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.45,activity:["停步看看","沿路慢行"]},
 'bridge-09':{file:"bridge-09-cakes",cols:3,anchor:"feet",activity:["端盘候客","托盘招呼","拈饼递出"],soles:[[449,843],[415,843],[397,844]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'bridge-10':{file:"bridge-10-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.45,activity:["停步看看","沿路慢行"]},
 'bridge-11':{file:"bridge-11-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.45,activity:["停步看看","沿路慢行"]},
 'bridge-12':{file:"bridge-12-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.3,activity:["停步看看","沿路慢行"]},
 'bridge-15':{file:"bridge-15-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.4,activity:["停步看看","沿路慢行"]},
 'bridge-16':{file:"bridge-16-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.45,activity:["停步看看","沿路慢行"]},
 'bridge-18':{file:"bridge-18-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.45,activity:["停步看看","沿路慢行"]},
 'bridge-19':{file:"bridge-19-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.45,activity:["停步看看","沿路慢行"]},
 'mill-03':{file:"mill-03-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.4,activity:["停步看看","沿路慢行"]},
 'mill-04':{file:"mill-04-cart",cols:3,anchor:"feet",activity:["扶稳车把","直身擦汗","回头看粮袋"],soles:[[303,691],[257,691],[211,691]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-05':{file:"mill-05-ledger",cols:3,anchor:"feet",activity:["低头看簿","提笔记账","停笔抬头"],soles:[[456,649],[408,649],[410,649]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-06':{file:"mill-06-grain",cols:3,anchor:"feet",activity:["掀开筐盖","捧粮查看","让粮流回筐里"],soles:[[474,675],[409,674],[368,675]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-07':{file:"mill-07-flour",cols:3,anchor:"feet",activity:["托袋候粉","接住粮粉","扎紧袋口"],soles:[[539,690],[479,689],[450,688]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-08':{file:"mill-08-pour",cols:3,anchor:"feet",activity:["倾袋倒粮","抬袋抖粮","放低抖净"],soles:[[585,638],[541,638],[525,638]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-09':{file:"mill-09-pour",cols:3,anchor:"feet",activity:["倾袋倒粮","抬袋抖粮","放低抖净"],soles:[[570,616],[582,618],[555,625]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-10':{file:"mill-10-grain",cols:3,anchor:"feet",activity:["掀开筐盖","捧粮查看","让粮流回筐里"],soles:[[444,696],[379,697],[365,697]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-11':{file:"mill-11-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.4,activity:["停步看看","沿路慢行"]},
 'mill-12':{file:"mill-12-cart",cols:3,anchor:"feet",activity:["扶稳车把","直身擦汗","回头看粮袋"],soles:[[472,675],[471,675],[464,675]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'fields-06':{file:"fields-06-basket",cols:3,anchor:"feet",activity:["低头看篮","拨弄篮中物","抬头张望"],soles:[[362,697],[363,698],[365,697]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'fields-10':{file:"fields-10-weed",cols:3,anchor:"feet",activity:["俯身寻草","伸手拔草","起身甩草"],soles:[[334,593],[334,593],[335,592]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'fields-17':{file:"fields-17-weed",cols:3,anchor:"feet",activity:["俯身寻草","伸手拔草","起身甩草"],soles:[[261,619],[264,621],[263,620]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-13':{file:"mill-13-ledger",cols:3,anchor:"feet",activity:["低头看簿","提笔记账","停笔抬头"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-17':{file:"mill-17-pour",cols:3,anchor:"feet",activity:["倾袋倒粮","抬袋抖粮","放低抖净"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-18':{file:"mill-18-grain",cols:3,anchor:"feet",activity:["掀开筐盖","捧粮查看","让粮流回筐里"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-19':{file:"mill-19-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.4,activity:["停步看看","沿路慢行"]},
 'mill-20':{file:"mill-20-cart",cols:3,anchor:"feet",activity:["扶稳车把","直身擦汗","回头看粮袋"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-21':{file:"mill-21-ledger",cols:3,anchor:"feet",activity:["低头看簿","提笔记账","停笔抬头"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-22':{file:"mill-22-grain",cols:3,anchor:"feet",activity:["掀开筐盖","捧粮查看","让粮流回筐里"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-23':{file:"mill-23-flour",cols:3,anchor:"feet",activity:["托袋候粉","接住粮粉","扎紧袋口"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-24':{file:"mill-24-pour",cols:3,anchor:"feet",activity:["倾袋倒粮","抬袋抖粮","放低抖净"],soles:[[250,672],[253,672],[195,676]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-25':{file:"mill-25-mend",cols:3,anchor:"feet",activity:["扶稳工具","抬手敲修","敲紧榫头"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'mill-26':{file:"mill-26-gourd",cols:3,anchor:"feet",activity:["捧着葫芦歇脚","仰头喝水","放下葫芦擦汗"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'tea-01':{file:"tea-01-pour",cols:3,anchor:"feet",activity:["提壶靠近","倾壶添茶","扶正茶壶"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'tea-02':{file:"tea-02-tea",cols:3,anchor:"feet",activity:["端盏歇坐","举杯饮一口","放低杯盏"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'tea-03':{file:"tea-03-listen",cols:3,anchor:"feet",activity:["坐着听人","侧身插话","点头回应"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'tea-04':{file:"tea-04-bowl",cols:3,anchor:"feet",activity:["端碗候客","双手递碗","收手示意"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'tea-05':{file:"tea-05-pay",cols:3,anchor:"feet",activity:["看看吃食","伸手递钱","接过吃食"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'tea-06':{file:"tea-06-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.55,activity:["停步看看","沿路慢行"]},
 'tea-07':{file:"tea-07-tell",cols:3,anchor:"feet",activity:["举扇开讲","挥扇比画","收扇停顿"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'tea-08':{file:"tea-08-listen",cols:3,anchor:"feet",activity:["侧耳听书","抬手捋须","点头称是"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'tea-09':{file:"tea-09-listen",cols:3,anchor:"feet",activity:["坐着听人","侧身插话","点头回应"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'tea-10':{file:"tea-10-tea",cols:3,anchor:"feet",activity:["端盏歇坐","举杯饮一口","放低杯盏"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'tea-11':{file:"tea-11-pour",cols:3,anchor:"feet",activity:["提壶靠近","倾壶添茶","扶正茶壶"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'tea-12':{file:"tea-12-walk",cols:5,anchor:"head",walk:true,cycle:0.85,pace:0.55,activity:["停步看看","沿路慢行"]},
 'tea-13':{file:"tea-13-bowl",cols:3,anchor:"feet",activity:["端碗候客","双手递碗","收手示意"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'tea-14':{file:"tea-14-pay",cols:3,anchor:"feet",activity:["看看吃食","伸手递钱","接过吃食"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'fields-05':{file:"fields-05-rake",cols:3,anchor:"feet",activity:["扶住农耙","抬手敲修","敲紧耙齿"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'fields-09':{file:"fields-09-harvest",cols:3,anchor:"feet",activity:["拢住麦穗","拉镰收割","收拢麦束"],soles:[[269,662],[251,663],[262,664]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'fields-14':{file:"fields-14-basket",cols:3,anchor:"feet",activity:["低头看篮","拨弄篮中物","抬头张望"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'quay-01':{file:"quay-01-bundle",cols:3,anchor:"feet",activity:["抱着货包","侧身递包","收手站稳"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'quay-02':{file:"quay-02-receive",cols:3,anchor:"feet",activity:["俯身伸手","接住货包","抱货起身"],soles:[[275,676],[252,678],[242,679]],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'quay-03':{file:"quay-03-ledger",cols:3,anchor:"feet",activity:["低头看簿","提笔记账","停笔抬头"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'quay-04':{file:"quay-04-rope",cols:3,anchor:"feet",activity:["理顺缆绳","绕绳成圈","压紧绳圈"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
 'quay-05':{file:"quay-05-water",cols:3,anchor:"feet",activity:["端碗候人","递碗送水","收碗示意"],
  timeline:[[0,1.8],[1,0.6],[2,0.9],[1,0.4],[0,1.3]]},
};
export const limitedSource=(id,dir=LIMITED_DIR)=>LIMITED[id]&&`${dir}/${LIMITED[id].file}.webp`;

// Which cell to show. Work cycles follow their own clock with a per-figure offset;
// walk cycles advance one cell per quarter stride, so the feet keep pace with the ground.
export function limitedFrame(spec,pose,time,offset=0){
 if(time===null)return 0;
 if(spec.walk){
  if(!(pose.gaitWeight>0))return 0;
  return 1+Math.floor(((pose.walked||0)/(spec.stride||1))*4)%4;
 }
 const total=spec.timeline.reduce((s,[,d])=>s+d,0);
 let t=((time+offset*total)%total+total)%total;
 for(const [frame,duration] of spec.timeline){if(t<duration)return frame;t-=duration;}
 return spec.timeline[0][0];
}

// Painted bounds and anchors of each cell. `feet` anchors the soles (work poses
// keep their footing while the body moves); `head` anchors the head (a walk
// keeps a steady head while the legs swing).
export function measureCell(alpha,width,height,x0,cellWidth){
 let left=cellWidth,right=-1,top=height,bottom=-1;
 for(let y=0;y<height;y++)for(let x=0;x<cellWidth;x++)if(alpha(x0+x,y)>24){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 if(right<0)return null;
 const centroid=(y0,y1,threshold)=>{let sum=0,weight=0;for(let y=y0;y<=y1;y++)for(let x=0;x<cellWidth;x++){const a=alpha(x0+x,y);if(a>threshold){sum+=x*a;weight+=a;}}return weight?sum/weight:(left+right)/2;};
 const span=bottom-top+1;
 return{left,right,top,bottom,
  feet:centroid(Math.max(top,bottom-Math.ceil(span*.06)),bottom,96),
  head:centroid(top,top+Math.ceil(span*.2),160)};
}
// Measure every cell of a sheet; marked soles replace the automatic foot guess.
export function measureSheet(alpha,width,height,spec){
 const cellWidth=Math.floor(width/spec.cols);
 return Array.from({length:spec.cols},(_,i)=>{
  const c=measureCell(alpha,width,height,i*cellWidth,cellWidth);
  return c&&spec.soles?.[i]?{...c,feet:spec.soles[i][0],sole:spec.soles[i][1]}:c;
 });
}
// Offsets that put every cell's anchor and sole line on cell 0's.
export function alignCells(cells,anchor){
 const base=cells[0],sole=c=>c.sole??c.bottom;
 return cells.map(c=>({x:Math.round(base[anchor]-c[anchor]),y:Math.round(sole(base)-sole(c))}));
}

export function createLimitedAnimation(invalidate,{dir=LIMITED_DIR}={}){
 const sheets=new Map();
 async function load(id){
  const spec=LIMITED[id],image=new Image();image.decoding='async';image.src=limitedSource(id,dir);
  try{await image.decode();}catch{return;} // No drawn sheet yet: keep the still figure.
  const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
  const t=canvas.getContext('2d',{willReadFrequently:true});t.drawImage(image,0,0);
  const data=t.getImageData(0,0,canvas.width,canvas.height).data,cellWidth=Math.floor(image.width/spec.cols);
  const alpha=(x,y)=>data[(y*canvas.width+x)*4+3];
  const cells=measureSheet(alpha,canvas.width,canvas.height,spec);
  if(cells.some(c=>!c)){console.warn('Limited animation has an empty cell',id);return;}
  const shifts=alignCells(cells,spec.anchor);
  // One shared crop for all cells, so switching poses never rescales the figure.
  const left=Math.min(...cells.map((c,i)=>c.left+shifts[i].x)),right=Math.max(...cells.map((c,i)=>c.right+shifts[i].x));
  const top=Math.min(...cells.map((c,i)=>c.top+shifts[i].y)),bottom=Math.max(...cells.map((c,i)=>c.bottom+shifts[i].y));
  const frames=cells.map((c,i)=>{
   const f=document.createElement('canvas');f.width=right-left+1;f.height=bottom-top+1;
   // Same muted palette as the original figures baked in extension-people.js.
   const g=f.getContext('2d');g.filter='saturate(.78)';
   g.drawImage(canvas,i*cellWidth,0,cellWidth,canvas.height,shifts[i].x-left,shifts[i].y-top,cellWidth,canvas.height);
   return f;
  });
  // Figure height of the rest pose maps to the original figure's height.
  const rest=cells[0];
  sheets.set(id,{spec,frames,restHeight:rest.bottom-rest.top+1,restLeft:rest.left-left,restWidth:rest.right-rest.left+1,top:rest.top-top});
  invalidate();
 }
 // Only sheets listed in the folder's manifest are requested, so figures without
 // drawn poses yet cause no failed downloads.
 const ready=fetch(`${dir}/manifest.json`,{cache:'no-cache'}).then(r=>r.ok?r.json():{installed:[]}).catch(()=>({installed:[]}))
  .then(m=>Promise.all(Object.keys(LIMITED).filter(id=>m.installed?.includes(LIMITED[id].file)).map(load)));
 return{
  ready,
  has:id=>sheets.has(id),
  activity(p,pose,time){const s=sheets.get(p.id);if(!s)return null;const f=limitedFrame({...s.spec,stride:p.h*(s.spec.cycle||.35)},pose,time,phase(p.id));return s.spec.activity[s.spec.walk?(f?1:0):f];},
  frame(p,pose,time){const s=sheets.get(p.id);return s?.frames[limitedFrame({...s.spec,stride:p.h*(s.spec.cycle||.35)},pose,time,phase(p.id))];},
  // Draw in the person's local frame: origin at the feet, already flipped.
  draw(ctx,p,pose,time){
   const s=sheets.get(p.id);if(!s)return false;
   const f=s.frames[limitedFrame({...s.spec,stride:p.h*(s.spec.cycle||.35)},pose,time,phase(p.id))];
   const k=p.h/s.restHeight,restCenter=s.restLeft+s.restWidth/2;
   ctx.drawImage(f,-restCenter*k,-(s.top+s.restHeight)*k,f.width*k,f.height*k);return true;
  },
  get loaded(){return sheets.size;}
 };
}
function phase(id){let h=7;for(const c of id)h=(h*31+c.charCodeAt(0))>>>0;return (h%997)/997;}
