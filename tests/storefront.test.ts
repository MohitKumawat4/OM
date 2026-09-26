import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { Vector3 } from 'three';
import { storefrontConfig } from '../src/config/site';
import { createCameraSampler } from '../src/lib/showroom/timeline';
import { drawingRatio, needsSceneFrame } from '../src/lib/showroom/performance';

const sample=createCameraSampler(storefrontConfig.camera);

test('the revised journey approaches the board and returns without entering the building',()=>{
  const position=new Vector3(),target=new Vector3();
  let closest=Infinity,first=0,last=0;
  for(let i=0;i<=10000;i++){
    sample(i/10000,position,target);
    assert.ok(Number.isFinite(position.length()));
    assert.ok(position.z>6,'camera enters the facade or clips the board');
    assert.ok(position.distanceTo(target)>5);
    const distance=position.distanceTo(new Vector3(0,4.5,.5));
    closest=Math.min(closest,distance);
    if(i===0)first=distance;
    if(i===10000)last=distance;
  }
  assert.ok(closest<first*.4&&closest<last*.4,'sign inspection must be appreciably closer than both wide views');
});

test('the three hero chapters preserve camera velocity at their shared boundaries',()=>{
  const a=new Vector3(),b=new Vector3(),c=new Vector3(),ta=new Vector3(),tb=new Vector3(),tc=new Vector3();
  for(const p of storefrontConfig.chapterStarts.slice(1)){
    sample(p-.00001,a,ta);sample(p,b,tb);sample(p+.00001,c,tc);
    const incoming=b.clone().sub(a),outgoing=c.clone().sub(b);
    assert.ok(incoming.length()>.00005&&outgoing.length()>.00005);
    assert.ok(incoming.clone().normalize().dot(outgoing.clone().normalize())>.999);
    assert.ok(Math.abs(incoming.length()/outgoing.length()-1)<.02);
    assert.ok(ta.distanceTo(tc)<.01);
  }
});

test('high-DPI phones, laptops and 4K/ultrawide displays stay inside their drawing budgets',()=>{
  for(const [width,height,dpr] of [[320,568,2],[390,844,3],[768,1024,2],[1440,900,2],[3840,2160,2],[5120,1440,2]]){
    for(const quality of ['compact','balanced','low'] as const){
      const ratio=drawingRatio(width,height,dpr,quality),budget=storefrontConfig.quality[quality];
      assert.ok(ratio>0&&ratio<=budget.maxDpr);
      assert.ok(width*height*ratio*ratio<=budget.maxPixels+1);
    }
    assert.ok(drawingRatio(width,height,dpr,'low')<=drawingRatio(width,height,dpr,'compact'));
  }
});

test('settled, hidden and offscreen states never request another animation frame',()=>{
  assert.equal(needsSceneFrame(true,false,.4,.8),true);
  assert.equal(needsSceneFrame(true,false,.8,.4),true);
  assert.equal(needsSceneFrame(true,false,.8,.8),false);
  assert.equal(needsSceneFrame(false,false,0,1),false);
  assert.equal(needsSceneFrame(true,true,0,1),false);
});

test('the packaged scene keeps internal resources valid and meets the exterior asset budgets',()=>{
  const bytes=readFileSync('public'+storefrontConfig.model);
  assert.equal(bytes.toString('utf8',0,4),'glTF');
  assert.equal(bytes.readUInt32LE(8),bytes.length);
  assert.ok(bytes.length<8*1024*1024,'model exceeds the 8 MiB transfer budget');
  const jsonLength=bytes.readUInt32LE(12);
  const doc=JSON.parse(bytes.toString('utf8',20,20+jsonLength));
  const binary=bytes.subarray(28+jsonLength);
  assert.equal(doc.buffers.length,1);assert.equal(doc.buffers[0].uri,undefined);
  assert.equal(doc.buffers[0].byteLength,binary.length);
  assert.ok(doc.meshes.length<=48);
  let triangles=0;
  for(const mesh of doc.meshes)for(const primitive of mesh.primitives){
    assert.ok(primitive.extensions.KHR_draco_mesh_compression);
    triangles+=doc.accessors[primitive.indices].count/3;
  }
  assert.ok(triangles<450000,'background geometry exceeds the exterior budget');
  for(const view of doc.bufferViews){assert.equal(view.byteOffset%4,0);assert.ok(view.byteOffset+view.byteLength<=binary.length);}
  for(const image of doc.images){
    const view=doc.bufferViews[image.bufferView];
    assert.ok(image.mimeType==='image/jpeg'||image.mimeType==='image/png');
    assert.equal(binary[view.byteOffset],image.mimeType==='image/jpeg'?0xff:0x89);
  }
  const baked=doc.materials.filter((m:{extras?:{bakedDiffuse?:boolean}})=>m.extras?.bakedDiffuse);
  assert.ok(baked.length>10);
  assert.equal(new Set(baked.map((m:{emissiveTexture:{index:number}})=>m.emissiveTexture.index)).size,1,'lighting must share one GPU texture');
  assert.ok(existsSync('public'+storefrontConfig.decoder+'draco_decoder.wasm'));
});
