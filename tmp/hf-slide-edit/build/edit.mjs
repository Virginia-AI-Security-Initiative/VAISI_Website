import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { FileBlob, PresentationFile } from '@oai/artifact-tool';

const skillDir='/Users/sethlifland/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const workspaceDir='/Users/sethlifland/dev/VAISI_Website';
const sourcePath='/Users/sethlifland/Downloads/Hugging Face Presentation.pptx';
const finalPath=path.join(workspaceDir,'outputs','Hugging Face Presentation - Timeline.pptx');
const buildDir=path.join(workspaceDir,'tmp','hf-slide-edit','build');
const { finalizePresentation }=await import(pathToFileURL(path.join(skillDir,'container_tools/artifact_tool_utils.mjs')).href);
const p=await PresentationFile.importPptx(await FileBlob.load(sourcePath));
const s=p.slides.getItem(7);
const original=s.shapes.items.find(sh=>sh.name==='Google Shape;147;p21');
if(!original) throw new Error('Slide 8 bullet list not found');
original.delete();

const navy='#053464';
const gray='#55585C';
const blue='#378BD5';
const events=[
  {date:'July 16',body:'Hugging Face announces agents hacked its site'},
  {date:'July 21',body:'OpenAI says its models were responsible'},
  {date:'August 5',body:'OpenAI shares more details at Black Hat'},
  {date:'August 26',body:'METR/Redwood and OpenAI reports reveal the wider scale'},
];
const centers=[138,366,594,822];
function shape(geometry,name,left,top,width,height,fill='none'){
  return s.shapes.add({geometry,name,position:{left,top,width,height},fill,line:{fill:'none',width:0}});
}
shape('rect','Timeline line',138,257,684,3,navy);
for(let i=0;i<events.length;i++){
  const x=centers[i];
  const date=shape('textbox',`Timeline date ${i+1}`,x-92,200,184,40);
  date.text=events[i].date;
  date.text.style={typeface:'Arial',fontSize:27,bold:true,color:navy,alignment:'center',verticalAlignment:'middle',autoFit:'none',insets:{left:0,right:0,top:0,bottom:0}};
  shape('ellipse',`Timeline marker ${i+1}`,x-9,250,18,18,blue);
  const body=shape('textbox',`Timeline event ${i+1}`,x-102,288,204,124);
  body.text=events[i].body;
  body.text.style={typeface:'Arial',fontSize:22,color:gray,alignment:'center',verticalAlignment:'top',autoFit:'none',insets:{left:2,right:2,top:0,bottom:0}};
}
await fs.mkdir(path.dirname(finalPath),{recursive:true});
const candidatePath=path.join(buildDir,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidatePath);
execFileSync('/Users/sethlifland/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3', [path.join(buildDir,'restore_hidden.py'),candidatePath]);
const preview=await s.export({format:'png',scale:1.5});
await fs.writeFile(path.join(buildDir,'slide8-artifact.png'),new Uint8Array(await preview.arrayBuffer()));
await fs.rm(finalPath,{force:true});
const result=await finalizePresentation({
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable:'/Users/sethlifland/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',
  integrityValidatorPath:path.join(skillDir,'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath:path.join(skillDir,'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs:['--expected-slide-size-emu','9144000,5143500','--validate-bullet-geometry','--validate-heading-fit'],
  explicitTotalSlideCount:17,
  requiredNativeTableOwnerSlides:[],
  requiredNativeChartOwnerSlides:[],
  fontPolicy:{basis:'reference',families:['Arial','Play'],referencePath:sourcePath,referenceSha256:'50e53b7d0878814d8d9aa560c60a5dfadfa2b67672b9458080887b2472b0e93e'},
  verifyArtifactToolImport:true,
  receiptPath:path.join(buildDir,'timeline-hidden.validation.json'),
});
console.log(JSON.stringify(result));
console.log(finalPath);
