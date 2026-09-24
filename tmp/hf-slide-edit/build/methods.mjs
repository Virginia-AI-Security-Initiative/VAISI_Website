import {FileBlob,PresentationFile} from '@oai/artifact-tool';
const p=await PresentationFile.importPptx(await FileBlob.load('/Users/sethlifland/Downloads/Hugging Face Presentation.pptx'));
const s=p.slides.getItem(7);
console.log('shapes collection',Object.getOwnPropertyNames(Object.getPrototypeOf(s.shapes)));
console.log('shape',Object.getOwnPropertyNames(Object.getPrototypeOf(s.shapes.items[3])));
