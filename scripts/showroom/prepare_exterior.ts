import { writeFileSync } from 'node:fs';
import { storefrontConfig } from '../../src/config/site';

const at=(index:number,name:string,width:number,height:number)=>({
  ...storefrontConfig.camera[index],name,width,height,fov:43,
});
const shots=[at(0,'wide',1600,1000),at(3,'detail',1600,1000),at(6,'pullback',1600,1000)];
const first=storefrontConfig.camera[0];
shots.push({...at(0,'portrait',780,1688),position:[first.position[0],first.position[1],first.position[2]+11],target:[first.target[0],first.target[1]-2.3,first.target[2]],fov:52});
writeFileSync('assets/showroom/runtime/cameras.json',JSON.stringify(shots,null,2));
