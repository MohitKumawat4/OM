import { Vector3 } from 'three';

export type CameraPoint = { at: number; position: [number, number, number]; target: [number, number, number] };
export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

// A Hermite path shares derivatives across chapter boundaries. Unlike a chain of
// eased tweens, it never brakes to zero merely because the copy changes.
export function samplePath(points: CameraPoint[], progress: number, field: 'position' | 'target', out: Vector3) {
  const p = clamp(progress);
  let i = points.findIndex((point, index) => index < points.length - 1 && p <= points[index + 1].at);
  if (i < 0) i = points.length - 2;
  const a = points[i], b = points[i + 1];
  const prev = points[Math.max(0, i - 1)], next = points[Math.min(points.length - 1, i + 2)];
  const span = b.at - a.at, t = clamp((p - a.at) / span), t2 = t * t, t3 = t2 * t;
  const result = [0, 1, 2].map(axis => {
    const m1 = (b[field][axis] - prev[field][axis]) / (b.at - prev.at);
    const m2 = (next[field][axis] - a[field][axis]) / (next.at - a.at);
    return (2*t3-3*t2+1)*a[field][axis] + (t3-2*t2+t)*span*m1 + (-2*t3+3*t2)*b[field][axis] + (t3-t2)*span*m2;
  });
  return out.set(result[0], result[1], result[2]);
}

// Distance-remap the curve while retaining the authored chapter landmarks.
// Monotone Hermite interpolation of distance gives a positive shared speed at
// boundaries, including the broad arc before the entrance.
export function createCameraSampler(points: CameraPoint[]) {
  const steps=4000, lengths=[0], previous=new Vector3(), current=new Vector3();
  samplePath(points,0,'position',previous);
  for(let i=1;i<=steps;i++){samplePath(points,i/steps,'position',current);lengths.push(lengths[i-1]+current.distanceTo(previous));previous.copy(current);}
  const distances=points.map(point=>{const x=point.at*steps,j=Math.floor(x);return lengths[j]+(lengths[Math.min(j+1,steps)]-lengths[j])*(x-j);});
  const rates=points.slice(0,-1).map((point,i)=>(distances[i+1]-distances[i])/(points[i+1].at-point.at));
  const slopes=points.map((_,i)=>i===0?rates[0]:i===points.length-1?rates[rates.length-1]:2/(1/rates[i-1]+1/rates[i]));
  return (progress:number, position:Vector3, target:Vector3)=>{
    const p=clamp(progress);let i=points.findIndex((_,j)=>j<points.length-1&&p<=points[j+1].at);if(i<0)i=points.length-2;
    const span=points[i+1].at-points[i].at,t=clamp((p-points[i].at)/span),t2=t*t,t3=t2*t;
    const distance=(2*t3-3*t2+1)*distances[i]+(t3-2*t2+t)*span*slopes[i]+(-2*t3+3*t2)*distances[i+1]+(t3-t2)*span*slopes[i+1];
    let low=0,high=steps;while(high-low>1){const mid=(low+high)>>1;if(lengths[mid]<distance)low=mid;else high=mid;}
    const raw=(low+clamp((distance-lengths[low])/(lengths[high]-lengths[low]||1)))/steps;
    samplePath(points,raw,'position',position);samplePath(points,raw,'target',target);
  };
}

export function chapterAt(progress: number, chapters: { start: number }[]) {
  let index = 0;
  for (let i = 1; i < chapters.length; i++) if (progress >= chapters[i].start) index = i;
  return index;
}

export function transformationAt(progress: number) {
  const revealBare = smooth((progress - .39) / .035);
  const rebuild = smooth((progress - .43) / .105);
  return 1 - revealBare * (1 - rebuild);
}

export function comparisonAt(progress: number, override: number | null) {
  const base=transformationAt(progress);
  if(override===null)return base;
  const weight=smooth((progress-.38)/.025)*(1-smooth((progress-.525)/.045));
  return base+(clamp(override)-base)*weight;
}
