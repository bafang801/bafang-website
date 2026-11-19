const jsonHeaders={"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"};
const respond=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:jsonHeaders});
const authorized=(req,env)=>{const h=req.headers.get('Authorization')||'';const token=h.startsWith('Bearer ')?h.slice(7):'';return !!env.ADMIN_PASSWORD&&!!token&&token===env.ADMIN_PASSWORD};
export async function onRequestGet({env}){try{const saved=await env.MENU_KV.get('menu');return new Response(saved||JSON.stringify({categories:[]}),{headers:jsonHeaders})}catch(e){return respond({error:'Menu storage not configured'},503)}}
export async function onRequestPut({request,env}){
 if(!authorized(request,env))return respond({error:'Invalid password'},401);
 const len=Number(request.headers.get('content-length')||0);if(len>15000000)return respond({error:'Menu too large'},413);
 let obj;try{obj=await request.json()}catch{return respond({error:'Invalid JSON'},400)}
 if(!obj||!Array.isArray(obj.categories)||obj.categories.length>30)return respond({error:'Invalid menu'},400);
 for(const c of obj.categories){if(typeof c.zh!=='string'||typeof c.en!=='string'||!Array.isArray(c.items)||c.items.length>150)return respond({error:'Invalid category'},400);
 for(const i of c.items){if(typeof i.zh!=='string'||typeof i.en!=='string'||typeof i.price!=='string'||typeof i.image!=='string'||i.image.length>350000|| (i.image&&!/^data:image\/(jpeg|png|webp);base64,/.test(i.image)))return respond({error:'Invalid item or image'},400)}}
 const body=JSON.stringify(obj);if(body.length>15000000)return respond({error:'Menu too large'},413);
 try{await env.MENU_KV.put('menu',body);return respond({ok:true})}catch{return respond({error:'Storage error'},503)}
}
