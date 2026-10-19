// The pipa singer's song, synthesised so it stays on the beat of her painted
// poses: she plucks and begins, sings, plucks again, sings, rolls a tremolo
// under a held note with her eyes closed, then smiles and rests (6.8 s).
// Pipa: plucked-string model with a wooden body. Voice: a female formant
// voice with glides and vibrato. Volume follows the boat into and out of view.
import {SONG_STEPS} from './river-boats.js?v=8';

const PHRASE=SONG_STEPS.reduce((sum,[,d])=>sum+d,0);
const N={D4:293.66,E4:329.63,'F#4':369.99,A4:440,B4:493.88,D5:587.33,E5:659.26,'F#5':739.99};
// Four lines in D gong pentatonic, each: two short sung lines and a held
// cadence over the tremolo. Notes are [offset, pitch, length, vowel].
const LINES=[
  [[[.3,'A4',.45,'a'],[.75,'B4',.35,'o'],[1.1,'D5',.85,'a']],[[2.75,'E5',.4,'a'],[3.15,'D5',.35,'e'],[3.5,'B4',.45,'o']],[[4.0,'A4',.5,'a'],[4.5,'B4',1.15,'a']]],
  [[[.3,'D5',.45,'a'],[.75,'E5',.35,'a'],[1.1,'F#5',.85,'o']],[[2.75,'E5',.4,'e'],[3.15,'D5',.35,'a'],[3.5,'B4',.45,'a']],[[4.0,'A4',.5,'o'],[4.5,'D5',1.15,'a']]],
  [[[.3,'B4',.45,'o'],[.75,'A4',.35,'a'],[1.1,'F#4',.85,'a']],[[2.75,'A4',.4,'a'],[3.15,'B4',.35,'e'],[3.5,'D5',.45,'a']],[[4.0,'E5',.5,'a'],[4.5,'D5',1.15,'o']]],
  [[[.3,'A4',.45,'a'],[.75,'D5',.35,'a'],[1.1,'E5',.85,'e']],[[2.75,'D5',.4,'o'],[3.15,'B4',.35,'a'],[3.5,'A4',.45,'a']],[[4.0,'E5',.5,'a'],[4.5,'D5',1.15,'a']]]
];
// Female vowel formants (frequency, relative gain).
const VOWELS={a:[[850,1],[1220,.5],[2810,.22]],o:[[560,1],[900,.42],[2830,.16]],e:[[600,1],[1700,.36],[2900,.18]]};
const LOOKAHEAD=.35;

function events(phrase){
  const lines=LINES[((phrase%LINES.length)+LINES.length)%LINES.length],list=[];
  const strum=(at,notes,level=1)=>notes.forEach((n,i)=>list.push({at:at+i*.022,kind:'pluck',f:N[n],level:level*(1-i*.08)}));
  strum(0,['D5','A4','D4']);strum(2.0,['A4','E4','D4'],.85);
  // Single plucks double the sung notes an octave below.
  for(const note of [...lines[0],...lines[1]])list.push({at:note[0]-.02,kind:'pluck',f:N[note[1]]/2,level:.55});
  // Lun zhi tremolo under the held cadence: fast, swelling, then easing off.
  const [first,held]=lines[2];
  for(let at=4.0,i=0;at<5.62;at+=1/13,i++){
    const f=at<held[0]?N[first[1]]:N[held[1]],swell=Math.sin(Math.min(1,(at-4.0)/1.62)*Math.PI);
    list.push({at,kind:'pluck',f,level:.28+.38*swell,short:true});
  }
  list.push({at:5.85,kind:'pluck',f:N.D4,level:.5},{at:5.9,kind:'pluck',f:N.A4,level:.35});
  for(const line of lines)list.push({at:line[0][0],kind:'voice',notes:line});
  return list.sort((a,b)=>a.at-b.at);
}

export function createBoatSong(){
  let context=null,enabled=false,master,bus,pan,reverb,cursor=null,strings=new Map();
  function prepare(){
    if(context)return true;
    try{context=new (globalThis.AudioContext||globalThis.webkitAudioContext)();}catch{return false;}
    master=context.createGain();master.gain.value=0;
    pan=context.createStereoPanner?context.createStereoPanner():context.createGain();
    bus=context.createGain();bus.gain.value=1.5;
    // A short river-bank reverb: decaying noise as the impulse.
    reverb=context.createConvolver();
    const length=Math.floor(context.sampleRate*1.8),impulse=context.createBuffer(2,length,context.sampleRate);
    for(let c=0;c<2;c++){const d=impulse.getChannelData(c);for(let i=0;i<length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/length,3.2);}
    reverb.buffer=impulse;const wet=context.createGain();wet.gain.value=.22;
    // A gentle limiter keeps the louder mix from clipping on strums.
    const limiter=context.createDynamicsCompressor();limiter.threshold.value=-14;limiter.knee.value=10;limiter.ratio.value=6;limiter.attack.value=.004;limiter.release.value=.2;
    bus.connect(pan);bus.connect(reverb).connect(wet).connect(pan);pan.connect(master).connect(limiter).connect(context.destination);
    return true;
  }
  // Karplus-Strong string, cached per pitch: bright attack, quick pipa decay.
  function string(f){
    const key=Math.round(f*10);if(strings.has(key))return strings.get(key);
    const rate=context.sampleRate,period=Math.max(2,Math.round(rate/f-.5)),length=Math.floor(rate*1.5);
    const buffer=context.createBuffer(1,length,rate),d=buffer.getChannelData(0);
    for(let i=0;i<period;i++)d[i]=(Math.random()*2-1)*(.6+.4*Math.sin(i/period*Math.PI));
    const decay=.9965-Math.min(.006,f/120000);
    // Averaging two neighbours adds half a sample: hence `- .5` above.
    d[period]=decay*d[0];
    for(let i=period+1;i<length;i++)d[i]=decay*.5*(d[i-period]+d[i-period-1]);
    strings.set(key,buffer);return buffer;
  }
  function pluck(at,{f,level,short}){
    const source=context.createBufferSource();source.buffer=string(f);
    const body=context.createBiquadFilter();body.type='peaking';body.frequency.value=780;body.Q.value=1.4;body.gain.value=7;
    const tone=context.createBiquadFilter();tone.type='lowpass';tone.frequency.value=short?3200:4600;
    const gain=context.createGain(),peak=.32*level,end=at+(short?.16:1.4);
    gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(peak,at+.004);gain.gain.exponentialRampToValueAtTime(.0001,end);
    // A pipa note bends up a touch as the string is pressed.
    source.playbackRate.setValueAtTime(.994,at);source.playbackRate.linearRampToValueAtTime(1,at+.06);
    source.connect(body).connect(tone).connect(gain).connect(bus);source.start(at);source.stop(end+.02);
    source.onended=()=>{source.disconnect();body.disconnect();tone.disconnect();gain.disconnect();};
  }
  function sing(start,notes,clock){
    const first=notes[0],last=notes[notes.length-1],end=clock(last[0]+last[2]);
    const a=context.createOscillator(),b=context.createOscillator();a.type=b.type='sawtooth';b.detune.value=7;
    const vibrato=context.createOscillator(),depth=context.createGain();vibrato.frequency.value=5.3;depth.gain.value=0;
    vibrato.connect(depth);depth.connect(a.frequency);depth.connect(b.frequency);
    const source=context.createGain();source.gain.value=.5;a.connect(source);b.connect(source);
    const voice=context.createGain();voice.gain.setValueAtTime(.0001,start);
    const formants=[0,1,2].map(()=>{const f=context.createBiquadFilter();f.type='bandpass';f.Q.value=9;const g=context.createGain();source.connect(f).connect(g).connect(voice);return [f,g];});
    const soft=context.createBiquadFilter();soft.type='lowpass';soft.frequency.value=3600;
    voice.connect(soft).connect(bus);
    notes.forEach(([offset,pitch,length,vowel],i)=>{
      const t=clock(offset),f=N[pitch],held=length>.7;
      // Glide into each note, then let vibrato bloom on the longer ones.
      for(const osc of [a,b]){if(i)osc.frequency.setTargetAtTime(f,t,.035);else osc.frequency.setValueAtTime(f*.97,t),osc.frequency.setTargetAtTime(f,t,.05);}
      depth.gain.setValueAtTime(0,t);depth.gain.linearRampToValueAtTime(f*(held?.018:.008),t+Math.min(.45,length*.6));
      VOWELS[vowel].forEach(([freq,level],k)=>{formants[k][0].frequency.setTargetAtTime(freq,t,.04);formants[k][1].gain.setTargetAtTime(level,t,.04);});
      const level=held?.3:.26;
      if(!i){voice.gain.exponentialRampToValueAtTime(level,t+.09);}
      else{voice.gain.setTargetAtTime(level*.72,t-.03,.02);voice.gain.setTargetAtTime(level,t+.02,.03);}
    });
    voice.gain.setTargetAtTime(.0001,end-.12,.09);
    for(const osc of [a,b,vibrato]){osc.start(start-.01);osc.stop(end+.5);}
    a.onended=()=>{for(const node of [a,b,vibrato,depth,source,voice,soft,...formants.flat()])node.disconnect();};
  }
  return {
    set(on){
      enabled=Boolean(on)&&prepare();
      if(enabled)context.resume().catch(()=>{});
      else if(context)master.gain.setTargetAtTime(0,context.currentTime,.08);
      cursor=null;return enabled;
    },
    // Called each painted frame with the boat's own clock and the view.
    update({boat,left,right,playing}){
      if(!enabled||!context)return;
      const now=context.currentTime;
      if(!boat||!playing){master.gain.setTargetAtTime(0,now,.25);cursor=null;return;}
      if(context.state==='suspended')context.resume().catch(()=>{});
      const half=(right-left)/2,center=left+half,offset=(boat.x-center)/half;
      // Full inside the middle of the view, fading past its edges; still
      // faintly heard about two view-widths away, as across water.
      const distance=Math.abs(offset),near=Math.pow(1-Math.min(1,Math.max(0,(distance-.6)/4.4)),2.2);
      const zoom=Math.min(1.25,Math.max(.75,1100/(right-left)));
      master.gain.setTargetAtTime(near*zoom,now,.35);
      if(pan.pan)pan.pan.setTargetAtTime(Math.max(-.85,Math.min(.85,offset*.75)),now,.3);
      if(near<=.001){cursor=null;return;}
      // Schedule everything in the next look-ahead window, on the boat's clock.
      const t=boat.time,clock=x=>now+(x-t);
      if(cursor===null||cursor<t-.1||cursor>t+LOOKAHEAD+.1)cursor=t;
      const until=t+LOOKAHEAD;
      for(let phrase=Math.floor(cursor/PHRASE);phrase*PHRASE<until;phrase++){
        const base=phrase*PHRASE;
        for(const e of events(phrase)){
          const at=base+e.at;if(at<cursor||at>=until)continue;
          if(e.kind==='pluck')pluck(clock(at),e);
          else sing(clock(at),e.notes.map(([o,...rest])=>[base+o,...rest]),clock);
        }
      }
      cursor=until;
    },
    suspend(){context?.suspend().catch(()=>{});cursor=null;}
  };
}
