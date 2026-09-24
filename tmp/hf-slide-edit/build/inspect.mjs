import { FileBlob, PresentationFile } from '@oai/artifact-tool';
const p=await PresentationFile.importPptx(await FileBlob.load('/Users/sethlifland/Downloads/Hugging Face Presentation.pptx'));
console.log('slides',p.slides.items.length);
const snap=await p.inspect({kind:'slide,textbox,shape,image,notes,layout',maxChars:50000});
console.log(snap.ndjson.split('\n').filter(x=>{try{return JSON.parse(x).slide===8}catch{return false}}).join('\n'));
const s=p.slides.getItem(7);
console.log('slide frame',s.frame,'shape count',s.shapes.items.length,'images',s.images.items.length);
for(const sh of s.shapes.items){console.log('shape',sh.id,sh.name,sh.geometry,sh.position,JSON.stringify(sh.text?.toString?.()??''));}
