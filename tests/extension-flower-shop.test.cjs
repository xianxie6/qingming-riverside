const test=require('node:test');
const assert=require('node:assert/strict');
const flowers=import('../src/extension-flower-state.js');
test('buying flowers uses trial coins and rejects unknown or unaffordable purchases',async()=>{
 const {createFlowerState,buyFlower}=await flowers,s=createFlowerState();
 assert(buyFlower(s,'peony'));assert.equal(s.coins,96);assert.equal(s.bag.peony,1);
 const saved=structuredClone(s);assert.equal(buyFlower(s,'unknown'),false);assert.deepEqual(s,saved);
 s.coins=0;assert.equal(buyFlower(s,'plum'),false);assert.equal(s.bag.plum,0);
});
test('arranging, moving, swapping and removing preserves every purchased stem',async()=>{
 const {createFlowerState,buyFlower,arrangeFlower,removeFlower}=await flowers,s=createFlowerState();
 buyFlower(s,'peony');buyFlower(s,'plum');
 assert(arrangeFlower(s,'peony',0));assert.equal(s.bag.peony,0);
 assert(arrangeFlower(s,'plum',0));assert.equal(s.bag.peony,1);assert.equal(s.bag.plum,0);
 assert(arrangeFlower(s,'plum',2));assert.deepEqual(s.slots,[null,null,'plum']);
 assert(removeFlower(s,2));assert.equal(removeFlower(s,2),false);assert.equal(s.bag.plum,1);
 assert.equal(arrangeFlower(s,'orchid',0),false);assert.equal(arrangeFlower(s,'peony',3),false);
 assert.equal(s.bag.peony+s.bag.plum+s.slots.filter(Boolean).length,2);
});
test('refreshing retains the vase arrangement, rotation, inventory and coins',async()=>{
 const {createFlowerState,buyFlower,arrangeFlower}=await flowers,s=createFlowerState();
 buyFlower(s,'orchid');arrangeFlower(s,'orchid',1);s.rotations[1]=16;
 assert.deepEqual(createFlowerState(JSON.parse(JSON.stringify(s))),s);
});
test('malformed saved data cannot introduce flowers, nonfinite values or invalid vase slots',async()=>{
 const {createFlowerState}=await flowers;
 const s=createFlowerState({coins:Infinity,bag:{peony:-10,plum:4.6,orchid:10000},slots:['unknown','orchid','peony','plum'],rotations:[NaN,-999,999]});
 assert.deepEqual(s.slots,[null,'orchid','peony']);assert.deepEqual(s.rotations,[0,-24,24]);assert.equal(s.coins,0);
 assert.equal(s.bag.peony,0);assert.equal(s.bag.plum,4);assert.equal(s.bag.orchid,98);
});
