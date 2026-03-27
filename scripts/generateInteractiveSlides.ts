import fs from 'fs';
import path from 'path';

function walkSync(dir: string, filelist: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const stat = fs.statSync(dirFile);
    if (stat.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  }
  return filelist;
}

function generate() {
  const slidesDir = path.resolve('public/slides');
  const files = walkSync(slidesDir);
  const registry: Record<string, any[]> = {};

  for (const file of files) {
    if (!file.endsWith('.png') && !file.endsWith('.jpg')) continue;
    
    // Convert Absolute path to relative URL for public folder
    const relativeToPublic = file.substring(file.indexOf('public' + path.sep) + 7).replace(/\\/g, '/');
    const title = path.basename(file, path.extname(file));
    let slug = title
      .toLowerCase()
      .replace(/[\s–,-]+/g, '-') // Replace spaces and dashes
      .replace(/[^\w-]+/g, '') // remove special chars
      .replace(/^-+|-+$/g, '');
      
    // Handle specific mappings if necessary
    if (slug === 'light-reflection-and-refraction') {
        slug = 'light-reflection-refraction';
    }

    registry[slug] = [
      {
        title: title,
        content: `Detailed interactive view for ${title}.`,
        visual: `/${relativeToPublic}`,
        visual_type: 'image'
      }
    ];
  }

  let fileContent = `import React from 'react';
import { Maximize2, ZoomIn } from 'lucide-react';

export interface InteractiveSlideType {
  title: string;
  content: string;
  visual?: string;
  visual_type?: string;
  component?: React.ReactNode;
}

const MindMapViewer = ({ imageUrl, title }: { imageUrl: string, title: string }) => {
  return (
    <div className="relative group w-full h-full min-h-[500px] rounded-3xl overflow-hidden bg-slate-900 border-4 border-slate-800 shadow-2xl flex flex-col cursor-zoom-in">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Scrollable container for the large mind map */}
      <div className="flex-1 w-full h-full overflow-auto custom-scrollbar p-8">
          <img 
            src={imageUrl} 
            alt={title} 
            className="min-w-full min-h-full object-contain transition-transform duration-300 transform-gpu hover:scale-110" 
            style={{ padding: '2rem' }}
          />
      </div>

      <div className="absolute bottom-6 right-6 bg-slate-800/80 backdrop-blur-md px-5 py-3 rounded-2xl text-white flex items-center space-x-3 text-sm font-bold border border-white/10 shadow-xl group-hover:bg-slate-800 transition-colors">
        <ZoomIn size={18} className="text-blue-400" />
        <span>Hover to zoom & scroll</span>
      </div>
    </div>
  );
};

const interactiveSlidesRegistry: Record<string, InteractiveSlideType[]> = {
`;

  for (const [slug, slides] of Object.entries(registry)) {
    fileContent += `  '${slug}': [\n`;
    for (const slide of slides) {
      fileContent += `    {
      title: '${slide.title.replace(/'/g, "\\'")}',
      content: '${slide.content.replace(/'/g, "\\'")}',
      visual: '${slide.visual}',
      component: <MindMapViewer imageUrl="${slide.visual}" title="${slide.title.replace(/'/g, "\\'")}" />
    },\n`;
    }
    fileContent += `  ],\n`;
  }

  fileContent += `};

export const getInteractiveSlides = (chapterId: string): InteractiveSlideType[] => {
  return interactiveSlidesRegistry[chapterId] || [];
};
`;

  fs.writeFileSync('src/data/interactiveSlides.tsx', fileContent);
  console.log("Generated interactiveSlides.tsx");
}

generate();
