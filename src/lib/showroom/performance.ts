import { storefrontConfig } from '@/config/site';

export type Quality = keyof typeof storefrontConfig.quality;

export function drawingRatio(width:number,height:number,deviceRatio:number,quality:Quality) {
  const limits=storefrontConfig.quality[quality];
  return Math.min(Math.max(.5,deviceRatio),limits.maxDpr,Math.sqrt(limits.maxPixels/Math.max(1,width*height)));
}

export function needsSceneFrame(visible:boolean,hidden:boolean,current:number,target:number) {
  return visible && !hidden && Math.abs(current-target)>.00002;
}
