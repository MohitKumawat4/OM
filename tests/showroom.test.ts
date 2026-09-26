import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Vector3 } from 'three';
import { createCameraSampler, chapterAt, transformationAt, comparisonAt, smooth } from '../src/lib/showroom/timeline';
import { showroomConfig, siteConfig, experienceCopy, storefrontConfig } from '../src/config/site';
import { buildEnquiryUrl, resolveService } from '../src/lib/enquiry';
const sample=createCameraSampler(showroomConfig.camera);

test('the whole camera route crosses the facade only through the open doorway',()=>{
 const position=new Vector3(),target=new Vector3();let crossings=0;
 for(let i=0;i<=10000;i++){
  const p=i/10000;sample(p,position,target);
  assert.ok(Number.isFinite(position.length())&&position.distanceTo(target)>.5);
  if(Math.abs(position.z)<.2){crossings++;assert.ok(Math.abs(position.x)<1.4,'camera collides with entrance jamb');assert.ok(position.y>.5&&position.y<3.4);}
  if(position.z<0){assert.ok(Math.abs(position.x)<6.5);assert.ok(position.z>-9.5);assert.ok(position.y>.3&&position.y<5.4);}
 }
 assert.ok(crossings>0);
});

test('camera position and direction remain continuous across all seven chapter boundaries',()=>{
 const left=new Vector3(),mid=new Vector3(),right=new Vector3(),t1=new Vector3(),t2=new Vector3(),t3=new Vector3(),epsilon=.00001;
 for(const chapter of showroomConfig.chapters.slice(1)){
  sample(chapter.start-epsilon,left,t1);sample(chapter.start,mid,t2);sample(chapter.start+epsilon,right,t3);
  const incoming=mid.clone().sub(left).divideScalar(epsilon),outgoing=right.clone().sub(mid).divideScalar(epsilon);
  assert.ok(incoming.length()>5&&outgoing.length()>5,`${chapter.id} brakes to a stop`);
  assert.ok(incoming.clone().normalize().dot(outgoing.clone().normalize())>.995,`${chapter.id} changes direction suddenly`);
  assert.ok(Math.abs(incoming.length()/outgoing.length()-1)<.08,`${chapter.id} has a speed discontinuity`);
  assert.ok(t1.distanceTo(t3)<.03,`${chapter.id} look direction jumps`);
 }
});

test('portrait framing is continuous and clears before entering the doorway',()=>{
 const p1=new Vector3(),p2=new Vector3(),t1=new Vector3(),t2=new Vector3();
 sample(.5-.000001,p1,t1);sample(.5+.000001,p2,t2);
 t1.y+=(1-smooth((.5-.000001)/.5))*.8;t2.y+=(1-smooth((.5+.000001)/.5))*.8;
 assert.ok(t1.distanceTo(t2)<.001);assert.equal(1-smooth(.54/.5),0);
});

test('scroll direction does not change the state at a given position',()=>{
 const forward=new Vector3(),reverse=new Vector3(),target=new Vector3();
 for(const p of [.12,.23,.4,.54,.67,.8,.91]){sample(p,forward,target);sample(1,reverse,target);sample(p,reverse,target);assert.deepEqual(forward.toArray(),reverse.toArray());}
 assert.equal(chapterAt(0,showroomConfig.chapters),0);assert.equal(chapterAt(1,showroomConfig.chapters),7);
 assert.ok(transformationAt(.425)<.1);assert.equal(transformationAt(.55),1);
});

test('quote context resolves only configured service names and IDs',()=>{
 assert.equal(resolveService('acp-cladding'),siteConfig.coreServices.find(s=>s.id==='acp-cladding')!.title);
 assert.equal(resolveService('<script>alert(1)</script>'),experienceCopy.fullService);
 const data={name:'A & B',phone:'+91 9799852206',service:'acp-cladding',dimensions:'12 × 4 ft',message:'A sign? & lighting\nPlease call.'};
 const url=new URL(buildEnquiryUrl(data,'whatsapp'));assert.equal(url.origin,'https://wa.me');assert.equal(url.pathname,'/919799852206');assert.ok(url.searchParams.get('text')?.includes(data.name));assert.ok(url.searchParams.get('text')?.includes(data.message));
 assert.ok(buildEnquiryUrl(data,'email').startsWith('mailto:omadvertisingchomu@gmail.com?'));
});

test('a manually bare facade blends back into the tour without a boundary pop',()=>{
 assert.equal(comparisonAt(.45,0),0);
 assert.ok(Math.abs(comparisonAt(.54-.00001,0)-comparisonAt(.54+.00001,0))<.002);
 assert.equal(comparisonAt(.58,0),1);
 assert.equal(comparisonAt(.58,null),1);
});

test('every configured media asset exists locally',()=>{
 const visit=(value:unknown)=>{if(typeof value==='string'&&/^\/(images|fonts)\//.test(value))assert.ok(existsSync(join(process.cwd(),'public',value)),value);else if(value&&typeof value==='object')Object.values(value).forEach(visit);};
 visit(siteConfig);visit(showroomConfig);visit(experienceCopy);visit(storefrontConfig);
});
