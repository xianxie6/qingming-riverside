import {readFileSync} from 'node:fs';

// The spring scroll (extension-preview.html), entered from the homepage card.
// Its painted panels, figure atlases and installed key poses are public assets.
const publicAssets=JSON.parse(readFileSync(new URL('./public-assets.json',import.meta.url),'utf8')).files;
const springAssets=[
  ...publicAssets.filter(file=>file.startsWith('assets/extension-preview/')),
  ...publicAssets.filter(file=>/^assets\/explore\/(?:people-v2\/(?:bridge|fields|gate|mill|quay|tea|temple)|people-v3\/sprites-\d+|visitors\/duos)\.webp$/.test(file)),
  'assets/boat-singer-v1.webp','assets/fonts/sunyang-brush.woff2'
];
const springFiles=[
  'extension-preview.html','styles/extension-preview.css','styles/extension-flower-shop.css',
  ...['extension-preview','extension-people','extension-people-data','extension-people-layout','extension-puppet',
    'extension-motion','extension-walkers','extension-limited-animation','extension-workshop','extension-workshop-state',
    'extension-flower-shop','extension-flower-state','extension-flower-street','extension-flower-customers',
    'river-boats','boat-song'].map(name=>`src/${name}.js`),
  ...springAssets
];

// Release the crossing journey, the playable street it enters and the spring
// scroll. The repository entry remains a full local playground.
export const crossingFiles=[...new Set([
  'index.html','.nojekyll',
  ...['style','buttons','atlas-layout','crossing','seasons'].map(name=>`styles/${name}.css`),
  ...['atlas','visits','dynamic-loader','crossing','crossing-audio','crossing-three',
    'crossing-world','crossing-water','crossing-traces','crossing-courtyard',
    'crossing-motion','crossing-quality','crossing-hero','crossing-details',
    'scene','scene-backdrop','seasons','world','bridge-railing','night','weather',
    'sound','water','water-three','mill-wheel','movement','population','street-life','street-details',
    'bridge-event','bridge-art','people-frames','people-masks','wardrobe','inhabitants',
    'featured-characters','districts','workshop-actors'].map(name=>`src/${name}.js`),
  'assets/atlas-draft.json','assets/qingming-panorama-v1.webp','assets/seasons/workshop-actors-v1.webp',
  'assets/street-empty-fast.webp','assets/people-ink.webp','assets/featured-characters-v7.webp',
  'assets/district-west-fast.webp','assets/district-east-fast.webp','assets/boat.webp','assets/boat-passenger-clear.webp',
  'assets/crossing-river-forward-v1.webp','assets/crossing-river-summer.webp',
  'assets/crossing-courtyard-painted-v2.webp','assets/crossing-painter-v2.webp',
  'assets/audio/crossing-background.mp3','assets/audio/day-ambience.mp3','assets/audio/night-music.mp3',
  ...['summer','autumn','winter'].flatMap(season=>['west','center','east'].flatMap(part=>['png','webp'].map(ext=>`assets/seasons/${season}-${part}.${ext}`))),
  // Retain legacy URLs for visitors with an already-open older page.
  'assets/seasons/featured-summer.png','assets/seasons/featured-autumn-v2.png',
  'assets/seasons/featured-winter.png','assets/seasons/workshop-actors-v1.png','assets/seasons/people-autumn-v1.png','assets/seasons/people-winter-v1.png',
  'assets/seasons/featured-summer.webp','assets/seasons/featured-autumn-v2.webp',
  'assets/seasons/featured-winter.webp','assets/seasons/people-autumn-v1.webp','assets/seasons/people-winter-v1.webp',
  'vendor/three.module.js','vendor/three.core.js','vendor/THREE-LICENSE.txt',
  'styles/entries.css','assets/entries/crossing-thumb.webp','assets/entries/spring-thumb.webp',
  ...springFiles
])];

function replaceRequired(source,pattern,replacement,label){
  if(!pattern.test(source))throw new Error(`Crossing release cannot locate ${label}`);
  return source.replace(pattern,replacement);
}

export function crossingSource(file,source){
  if(file==='index.html'){
    source=replaceRequired(source,/<body\b/, '<body data-release="crossing"','page body');
    source=replaceRequired(source,/<a href="explore\.html"[^>]*>[\s\S]*?<\/a>/,'','explore entry');
    for(const id of ['midautumnEntry']){
      source=replaceRequired(source,new RegExp(`<button id="${id}"[^>]*>[\\s\\S]*?<\\/button>`),'',id);
    }
    source=replaceRequired(source,/<a id="sunyang"[\s\S]*?<\/a>/,'','restaurant entry');
    source=replaceRequired(source,/<dialog id="midautumnWelcome"[\s\S]*?<\/dialog>/,'','festival dialog');
    source=source.replace(/^.*<link[^>]+href="styles\/(?:midautumn|atlas-festival)\.css[^>]*>.*\n/gm,'');
    source=source.replace(/^.*<script[^>]+src="src\/(?:festival-lighting|festival-street|atlas-festival|atlas-atmosphere)\.js[^>]*><\/script>.*\n/gm,'');
    source=source.replace(/<!-- 中秋赏灯街道[\s\S]*?-->/,'');
    source=source.replace(/<!-- 国庆烟花表演[\s\S]*?-->/,'');
    if(/古城烟火|sunyang\.html|assets\/midautumn\//.test(source))throw new Error('Excluded module survived crossing release entry');
    if(!/href="extension-preview\.html"/.test(source))throw new Error('Crossing release lost the spring scroll entry');
  }
  if(file==='src/scene.js'){
    // Compile out optional festival artwork; the street's hooks stay inert.
    source=replaceRequired(source,/import \{drawFestivalGate,drawFestivalLights,festivalGate,festivalEnabled\} from '[^']+';/,
      'const festivalEnabled=false,festivalGate={x:0,y:0};\nconst drawFestivalGate=()=>{},drawFestivalLights=()=>{};','festival import');
    source=replaceRequired(source,/if\(shopHost\)shopArt\.src='assets\/sunyang-host-v2\.webp';/,'','restaurant artwork');
  }
  if(file==='src/sound.js'){
    // Keep the shared sound controller shape without distributing festival music.
    source=replaceRequired(source,/'assets\/audio\/midautumn-music\.mp3'/,"'assets/audio/day-ambience.mp3'",'festival music');
  }
  if(file==='src/crossing.js'){
    source=source.replace('便去孙羊店歇歇脚','便去临河茶铺歇歇脚');
  }
  return source;
}
