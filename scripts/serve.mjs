import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('out');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.ico':'image/x-icon','.glb':'model/gltf-binary','.wasm':'application/wasm'};
const port=Number(process.env.PORT||3000);
http.createServer(async(req,res)=>{try{const url=new URL(req.url||'/',`http://localhost:${port}`);let file=resolve(root,'.'+decodeURIComponent(url.pathname));if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}if((await stat(file)).isDirectory())file=resolve(file,'index.html');const data=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:data);}catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(resolve(root,'404.html')).catch(()=>'Not found'));}}).listen(port,'127.0.0.1',()=>console.log(`OM Advertising preview: http://127.0.0.1:${port}`));
