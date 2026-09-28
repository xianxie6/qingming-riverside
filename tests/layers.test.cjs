const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const population=require('../src/population.js');
const world=require('../src/world.js');
const {Director}=require('../src/street-life.js');

function load(name,globals={}){
  const scope={window:{ScrollPopulation:population,PEOPLE_FRAMES:[]},Image:class{},...globals};
  vm.runInNewContext(fs.readFileSync(`${__dirname}/../src/${name}.js`,'utf8'),scope);
  return scope.window;
}

test('a passerby crossing a dining position stays in front of the table, including while stopped',()=>{
  const Inhabitants=load('inhabitants').Inhabitants;
  for(const moving of [true,false])for(const ready of [true,false]){
    const crowd=new Inhabitants(),order=[];
    crowd.ready=ready;
    crowd.sprite=(_ctx,item)=>order.push(item.p.id);
    const range=[580,700];
    const visibleResidents=population.residents.filter(p=>p.x>=range[0]-60&&p.x<=range[1]+60);
    const fallback=()=>order.push(order.includes('table')?'walker-fallback':'resident-fallback');
    // Every walker crosses x=620, the same position as the seated diner.
    crowd.draw({},12,range,world.streetY,()=>({x:620,phase:1,direction:1,moving}),fallback,()=>order.push('table'));
    const table=order.indexOf('table');
    assert.equal(table,visibleResidents.length,'all shop occupants render behind the furniture');
    assert.equal(order.length-table-1,population.walkers.length,'walking and waiting traffic both render in front');
    if(ready){
      assert.ok(order.indexOf(population.residents.find(p=>p.x===620).id)<table);
      assert.ok(population.walkers.every(p=>order.indexOf(p.id)>table));
    }
    assert.equal(crowd.visible,visibleResidents.length+population.walkers.length);
  }
});

test('table masks never run in the final foreground pass and remain opaque over diners',()=>{
  const Districts=load('districts').Districts;
  const districts=new Districts(),original={},calls=[];
  const ctx={globalAlpha:.91,save(){this.saved=this.globalAlpha;},restore(){this.globalAlpha=this.saved;},
    drawImage(...args){calls.push({args,alpha:this.globalAlpha});}};
  districts.furniture(ctx,original,580,830);
  assert.ok(calls.some(({args})=>args[1]===585&&args[2]===440),'central dining table is masked');
  assert.ok(calls.every(({alpha})=>alpha===1),'no translucent torso shows through the table');
  assert.equal(ctx.globalAlpha,.91);
  calls.length=0;
  districts.foreground(ctx,original,580,830);
  assert.equal(calls.length,0,'the late foreground must not paint tables over street traffic');
});

test('the tea server stays in front of the dining furniture both walking and pouring',()=>{
  const Inhabitants=load('inhabitants',{window:{ScrollPopulation:population,ScrollMovement:require('../src/movement.js'),PEOPLE_FRAMES:[]}}).Inhabitants;
  const life=new Director(population),server=population.residents.find(p=>p.x===823);
  for(const time of [4,7,10,15]){
    const crowd=new Inhabitants(),order=[];crowd.ready=true;
    crowd.sprite=(_ctx,item)=>{order.push(item.p.id);return {hand:{x:item.x,y:item.y-30}};};
    crowd.draw({},time,[700,860],world.streetY,world.pedestrianAt,()=>{},()=>order.push('table'),life.sample(time));
    assert.ok(order.indexOf(server.id)>order.indexOf('table'));
    assert.equal(crowd.hits.find(hit=>hit.p.id===server.id).x,life.sample(time).actors[823].x);
  }
});

test('clicking a moved working resident adds a reply without changing the route or handoff',()=>{
  const Inhabitants=load('inhabitants',{window:{ScrollPopulation:population,ScrollMovement:require('../src/movement.js'),PEOPLE_FRAMES:[]}}).Inhabitants;
  const life=new Director(population),crowd=new Inhabitants(),server=population.residents.find(p=>p.x===823);
  let item;crowd.ready=true;crowd.sprite=(_ctx,p)=>{if(p.p.id===server.id)item=p;};
  const draw=time=>crowd.draw({},time,[700,860],world.streetY,world.pedestrianAt,()=>{},()=>{},life.sample(time));
  draw(7);
  assert.equal(crowd.react(item.x,item.y-30,7,world.streetY).id,server.id);
  draw(7.35);const responding=item;
  crowd.attention.clear();draw(7.35);
  assert.ok(Math.abs(responding.pose.nod-item.pose.nod)>.02);
  assert.equal(responding.x,item.x);assert.equal(responding.y,item.y);
  assert.equal(responding.pose.handX,item.pose.handX);assert.equal(responding.pose.phase,item.pose.phase);
});
