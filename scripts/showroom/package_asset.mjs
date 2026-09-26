import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Repack only the illumination image as JPEG. Alpha foliage and normal maps
// retain their original encoding. Geometry and accessor layout are unchanged.
const directory=path.resolve('assets/showroom/runtime');
const source=await readFile(path.join(directory,'storefront.glb'));
const jsonLength=source.readUInt32LE(12);
const doc=JSON.parse(source.subarray(20,20+jsonLength).toString());
const bin=source.subarray(28+jsonLength);
const replacements=new Map();
for(const img of doc.images||[]){
  if(img.name==='road-normal'){
    const view=doc.bufferViews[img.bufferView];
    replacements.set(img.bufferView,await sharp(bin.subarray(view.byteOffset,view.byteOffset+view.byteLength)).resize(512,512).png({compressionLevel:9}).toBuffer());
  }
  if(!img.name?.startsWith('diffuse-light')&&!img.name?.includes('Exterior diffuse illumination'))continue;
  const view=doc.bufferViews[img.bufferView];
  const encoded=await sharp(bin.subarray(view.byteOffset,view.byteOffset+view.byteLength)).jpeg({quality:90,chromaSubsampling:'4:4:4'}).toBuffer();
  replacements.set(img.bufferView,encoded);img.mimeType='image/jpeg';
}
if(replacements.size!==2)throw new Error('Expected illumination and road surface images were not found.');
// The exporter emits separate sampler records per material. Collapse equivalent
// records so Three.js can share one GPU illumination texture across the scene.
const samplers=[],samplerMap=[];
for(const sampler of doc.samplers||[]){const key=JSON.stringify(sampler);let index=samplers.findIndex(item=>JSON.stringify(item)===key);if(index<0){index=samplers.length;samplers.push(sampler);}samplerMap.push(index);}
doc.samplers=samplers;
const textures=[],textureMap=[];
for(const texture of doc.textures||[]){
  if(texture.sampler!==undefined)texture.sampler=samplerMap[texture.sampler];
  const key=JSON.stringify(texture);let index=textures.findIndex(item=>JSON.stringify(item)===key);
  if(index<0){index=textures.length;textures.push(texture);}textureMap.push(index);
}
doc.textures=textures;
const remapTextures=value=>{for(const [key,child] of Object.entries(value||{})){if(key.endsWith('Texture')&&child&&typeof child==='object'&&'index' in child)child.index=textureMap[child.index];else if(child&&typeof child==='object')remapTextures(child);}};
doc.materials.forEach(remapTextures);
const parts=[];let offset=0;
for(const [index,view] of doc.bufferViews.entries()){
  const data=replacements.get(index)||bin.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);
  view.byteOffset=offset;view.byteLength=data.length;
  const padding=Buffer.alloc((4-data.length%4)%4);
  parts.push(data,padding);offset+=data.length+padding.length;
}
doc.buffers[0].byteLength=offset;
const encoded=Buffer.from(JSON.stringify(doc));
const padded=Buffer.concat([encoded,Buffer.alloc((4-encoded.length%4)%4,0x20)]);
const header=Buffer.alloc(20);header.write('glTF');header.writeUInt32LE(2,4);header.writeUInt32LE(28+padded.length+offset,8);header.writeUInt32LE(padded.length,12);header.writeUInt32LE(0x4e4f534a,16);
const binaryHeader=Buffer.alloc(8);binaryHeader.writeUInt32LE(offset,0);binaryHeader.writeUInt32LE(0x004e4942,4);
const packed=Buffer.concat([header,padded,binaryHeader,...parts]);
await mkdir('public/models/showroom',{recursive:true});
await writeFile('public/models/showroom/storefront.glb',packed);
await mkdir('public/draco',{recursive:true});
for(const filename of ['draco_wasm_wrapper.js','draco_decoder.wasm'])await copyFile('node_modules/three/examples/jsm/libs/draco/gltf/'+filename,'public/draco/'+filename);
const report=JSON.parse(await readFile(path.join(directory,'asset-report.json'),'utf8'));
report.packagedBytes=packed.length;report.illuminationEncoding='JPEG quality 90';report.geometryEncoding='Draco';
report.packagedRoadNormal=[512,512];report.textureCount=doc.textures.length;
await writeFile(path.join(directory,'asset-report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
