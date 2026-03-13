// ─── Hypnotic Craft Model Registry ────────────────────────────────────────────
export type ModelType = 'image' | 'video' | 'audio' | 'voice';
export type ModelTier = 'auto' | 'fast' | 'quality' | 'ultra';
export type ModelProvider = string;

export interface ModelCapability {
  realistic?: boolean; nativeAudio?: boolean; lipSync?: boolean;
  firstFrame?: boolean; lastFrame?: boolean; motionControl?: boolean;
  imageToVideo?: boolean; textToVideo?: boolean; cameraControl?: boolean;
  inpainting?: boolean; multiview?: boolean; upscale?: boolean;
  transparent?: boolean; typographic?: boolean; photoreal?: boolean; cinematic?: boolean;
}

export interface CraftModel {
  id: string; name: string; provider: ModelProvider; type: ModelType;
  tier: ModelTier; description: string;
  maxDuration?: number; resolutions?: string[]; aspectRatios?: string[];
  capabilities: ModelCapability; tags: string[];
  creditsPerUnit: number; recommended?: boolean; new?: boolean;
}

export const IMAGE_MODELS: CraftModel[] = [
  { id:'auto',name:'Auto',provider:'hypnotic',type:'image',tier:'auto',description:'Hypnotic picks the best model for your prompt automatically.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{},tags:['Smart routing','Best result'],creditsPerUnit:3,recommended:true },
  { id:'flux-2-pro',name:'Flux.2 Pro',provider:'flux',type:'image',tier:'ultra',description:'Highest-quality photorealistic outputs. Best for hero imagery, editorial, and campaigns.',resolutions:['2048×2048','4096×2048'],aspectRatios:['1:1','16:9','9:16','4:5','21:9'],capabilities:{photoreal:true,cinematic:true},tags:['Photorealistic','Ultra quality','4K'],creditsPerUnit:8,new:true },
  { id:'flux-2-max',name:'Flux.2 Max',provider:'flux',type:'image',tier:'ultra',description:'Maximum detail. Ideal for product and commercial photography.',resolutions:['1024×1024','2048×2048'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{photoreal:true},tags:['Max detail','Commercial'],creditsPerUnit:6 },
  { id:'flux-2-flex',name:'Flux.2 Flex',provider:'flux',type:'image',tier:'quality',description:'Flexible control with style transfer and reference image support.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{inpainting:true},tags:['Style transfer','Reference input'],creditsPerUnit:4 },
  { id:'flux-1-kontext-max',name:'Flux.1 Kontext Max',provider:'flux',type:'image',tier:'ultra',description:'Context-aware generation preserving brand elements and style consistency.',resolutions:['1024×1024','2048×2048'],aspectRatios:['1:1','16:9','9:16'],capabilities:{},tags:['Context-aware','Brand consistent'],creditsPerUnit:7 },
  { id:'flux-1-kontext-pro',name:'Flux.1 Kontext Pro',provider:'flux',type:'image',tier:'quality',description:'Professional context-aware generation with faster inference.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{},tags:['Context-aware','Fast'],creditsPerUnit:5 },
  { id:'flux-2-klein',name:'Flux.2 Klein',provider:'flux',type:'image',tier:'fast',description:'Rapid generation at high quality. Best for iteration and concept exploration.',resolutions:['1024×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{},tags:['Fast iteration','Concept work'],creditsPerUnit:2 },
  { id:'flux-1',name:'Flux.1',provider:'flux',type:'image',tier:'quality',description:'The original FLUX — reliable, versatile, creative.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{},tags:['Versatile','Creative'],creditsPerUnit:3 },
  { id:'flux-1-fast',name:'Flux.1 Fast',provider:'flux',type:'image',tier:'fast',description:'Fastest FLUX variant. 2–4s generation. Great for bulk production.',resolutions:['1024×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{},tags:['Fastest','Bulk production'],creditsPerUnit:1 },
  { id:'google-nano-banana',name:'Google Nano Banana',provider:'google',type:'image',tier:'fast',description:'Google\'s fast generation model. Natural and photorealistic outputs.',resolutions:['1024×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{photoreal:true},tags:['Google','Natural'],creditsPerUnit:2 },
  { id:'google-nano-banana-pro',name:'Google Nano Banana Pro',provider:'google',type:'image',tier:'quality',description:'Pro-level Google model with enhanced photorealism and detail.',resolutions:['1024×1024','2048×2048'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{photoreal:true},tags:['Google','Pro quality'],creditsPerUnit:4 },
  { id:'google-nano-banana-2',name:'Google Nano Banana 2',provider:'google',type:'image',tier:'quality',description:'Second-generation Google model with improved coherence.',resolutions:['1024×1024','2048×2048'],aspectRatios:['1:1','16:9','9:16'],capabilities:{photoreal:true},tags:['Google v2','Style coherent'],creditsPerUnit:4,new:true },
  { id:'google-imagen-3',name:'Google Imagen 3',provider:'google',type:'image',tier:'quality',description:'Google\'s Imagen 3 — detailed, photorealistic, excellent text rendering.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{photoreal:true,typographic:true},tags:['Photorealistic','Text in image'],creditsPerUnit:4 },
  { id:'google-imagen-4',name:'Google Imagen 4',provider:'google',type:'image',tier:'ultra',description:'Latest Imagen — best photorealism from Google with stunning detail.',resolutions:['1024×1024','2048×2048'],aspectRatios:['1:1','16:9','9:16','4:5','21:9'],capabilities:{photoreal:true,typographic:true,cinematic:true},tags:['Google flagship','Ultra photorealistic'],creditsPerUnit:7,new:true },
  { id:'google-imagen-4-fast',name:'Google Imagen 4 Fast',provider:'google',type:'image',tier:'fast',description:'Imagen 4 speed-optimised for rapid prototyping.',resolutions:['1024×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{photoreal:true},tags:['Fast','Imagen quality'],creditsPerUnit:3,new:true },
  { id:'google-imagen-4-ultra',name:'Google Imagen 4 Ultra',provider:'google',type:'image',tier:'ultra',description:'Maximum quality Imagen 4. Exceptional for print-quality creative work.',resolutions:['2048×2048','4096×4096'],aspectRatios:['1:1','16:9','4:5'],capabilities:{photoreal:true,typographic:true,cinematic:true,upscale:true},tags:['Print quality','4K','Best Google'],creditsPerUnit:10,new:true },
  { id:'gpt-1-hq',name:'GPT 1 — HQ',provider:'openai',type:'image',tier:'quality',description:'OpenAI\'s creative model with strong concept understanding.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{},tags:['OpenAI','Creative coherence'],creditsPerUnit:5 },
  { id:'gpt-1-5',name:'GPT 1.5',provider:'openai',type:'image',tier:'quality',description:'Improved OpenAI model with better instruction following.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{},tags:['OpenAI','Prompt-accurate'],creditsPerUnit:5,new:true },
  { id:'gpt-1-5-high',name:'GPT 1.5 — High',provider:'openai',type:'image',tier:'ultra',description:'Maximum quality OpenAI generation.',resolutions:['1024×1024','2048×2048'],aspectRatios:['1:1','16:9'],capabilities:{},tags:['OpenAI','Max quality'],creditsPerUnit:8,new:true },
  { id:'seedream-4',name:'Seedream 4',provider:'seedream',type:'image',tier:'quality',description:'Excellent for editorial, stylised, and artistic imagery.',resolutions:['1024×1024','2048×2048'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{},tags:['Editorial','Artistic'],creditsPerUnit:3 },
  { id:'seedream-4-4k',name:'Seedream 4 4K',provider:'seedream',type:'image',tier:'ultra',description:'Native 4K outputs for large-format printing and cinema.',resolutions:['4096×4096'],aspectRatios:['1:1','16:9','4:5'],capabilities:{upscale:true},tags:['Native 4K','Large format'],creditsPerUnit:8 },
  { id:'seedream-4-5',name:'Seedream 4.5',provider:'seedream',type:'image',tier:'quality',description:'Latest Seedream with improved lighting and material rendering.',resolutions:['1024×1024','2048×2048'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{},tags:['Latest','Better lighting'],creditsPerUnit:4,new:true },
  { id:'seedream-5-lite',name:'Seedream 5 Lite',provider:'seedream',type:'image',tier:'fast',description:'Fast Seedream generation for concept exploration.',resolutions:['1024×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{},tags:['Fast','Seedream quality'],creditsPerUnit:2,new:true },
  { id:'mystic-2-5',name:'Mystic 2.5',provider:'mystic',type:'image',tier:'ultra',description:'Cinematic quality with deep aesthetic intelligence. Preferred for brand photography.',resolutions:['1024×1024','2048×2048'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{cinematic:true,photoreal:true},tags:['Cinematic','Brand photography'],creditsPerUnit:6,recommended:true },
  { id:'mystic-2-5-flexible',name:'Mystic 2.5 Flexible',provider:'mystic',type:'image',tier:'quality',description:'Versatile Mystic model with style-mixing and multi-reference support.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{cinematic:true,inpainting:true},tags:['Style mixing','Multi-reference'],creditsPerUnit:4 },
  { id:'mystic-2-5-fluid',name:'Mystic 2.5 Fluid',provider:'mystic',type:'image',tier:'quality',description:'Fluid, painterly aesthetics. Excellent for editorial illustration.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{},tags:['Painterly','Editorial illustration'],creditsPerUnit:4 },
  { id:'mystic-1-0',name:'Mystic 1.0',provider:'mystic',type:'image',tier:'quality',description:'Original Mystic model. Reliable and widely supported.',resolutions:['1024×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{},tags:['Stable','Reliable'],creditsPerUnit:3 },
  { id:'ideogram',name:'Ideogram',provider:'ideogram',type:'image',tier:'quality',description:'Best-in-class typography and text-in-image. Essential for social ads and OOH.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{typographic:true},tags:['Best typography','Text in image','OOH-ready'],creditsPerUnit:4,recommended:true },
  { id:'recraft-v4',name:'Recraft V4',provider:'recraft',type:'image',tier:'quality',description:'Design-forward model with SVG support and vector-style outputs.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{typographic:true},tags:['Design-forward','Vector style'],creditsPerUnit:4 },
  { id:'recraft-v4-pro',name:'Recraft V4 Pro',provider:'recraft',type:'image',tier:'ultra',description:'Pro Recraft with brand kit support and style locking.',resolutions:['1024×1024','2048×2048'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{typographic:true},tags:['Brand kit','Style lock'],creditsPerUnit:6 },
  { id:'reve',name:'Reve',provider:'reve',type:'image',tier:'quality',description:'Narrative-driven image generation. Ideal for storyboarding.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{},tags:['Narrative','Storyboard'],creditsPerUnit:3 },
  { id:'zimage',name:'Z-Image',provider:'zimage',type:'image',tier:'fast',description:'Ultra-fast generation for rapid concept iteration.',resolutions:['1024×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{},tags:['Rapid iteration'],creditsPerUnit:1 },
  { id:'qwen',name:'Qwen',provider:'qwen',type:'image',tier:'quality',description:'Alibaba\'s creative model. Strong on cultural aesthetics.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{},tags:['Cultural aesthetics'],creditsPerUnit:3 },
  { id:'grok-img',name:'Grok',provider:'grok',type:'image',tier:'quality',description:'xAI\'s image model. Strong photorealism and concept fidelity.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{photoreal:true},tags:['xAI','Photorealistic'],creditsPerUnit:4,new:true },
  { id:'classic-fast',name:'Classic Fast',provider:'hypnotic',type:'image',tier:'fast',description:'Hypnotic\'s optimised fast pipeline. Great for drafts and thumbnails.',resolutions:['1024×1024'],aspectRatios:['1:1','16:9','9:16'],capabilities:{},tags:['Draft','Thumbnail'],creditsPerUnit:1 },
  { id:'classic',name:'Classic',provider:'hypnotic',type:'image',tier:'quality',description:'Hypnotic\'s balanced quality pipeline.',resolutions:['1024×1024','1792×1024'],aspectRatios:['1:1','16:9','9:16','4:5'],capabilities:{},tags:['Balanced','Reliable'],creditsPerUnit:3 },
];

export const VIDEO_MODELS: CraftModel[] = [
  { id:'auto-video',name:'Auto',provider:'hypnotic',type:'video',tier:'auto',description:'Hypnotic selects the optimal video model based on your scene description.',maxDuration:20,aspectRatios:['16:9','9:16','1:1'],capabilities:{textToVideo:true,imageToVideo:true},tags:['Smart routing','Best result'],creditsPerUnit:10,recommended:true },
  { id:'kling-2-6',name:'Kling 2.6',provider:'kling',type:'video',tier:'ultra',description:'Latest Kling — cinematic motion, native audio, exceptional character coherence.',maxDuration:10,aspectRatios:['16:9','9:16','1:1'],capabilities:{realistic:true,nativeAudio:true,lipSync:true,firstFrame:true,lastFrame:true,motionControl:true,imageToVideo:true,textToVideo:true,cameraControl:true},tags:['Native audio','Lip sync','First/last frame','Camera control'],creditsPerUnit:20,recommended:true,new:true },
  { id:'kling-2-5',name:'Kling 2.5',provider:'kling',type:'video',tier:'ultra',description:'Cinematic-quality video with motion coherence and dual-frame control.',maxDuration:10,aspectRatios:['16:9','9:16','1:1'],capabilities:{realistic:true,lipSync:true,firstFrame:true,lastFrame:true,motionControl:true,imageToVideo:true,textToVideo:true},tags:['Cinematic','Dual-frame','Lip sync'],creditsPerUnit:16 },
  { id:'kling-1-6',name:'Kling 1.6',provider:'kling',type:'video',tier:'quality',description:'Reliable Kling model. Fast, consistent, production-proven.',maxDuration:10,aspectRatios:['16:9','9:16','1:1'],capabilities:{realistic:true,firstFrame:true,imageToVideo:true,textToVideo:true},tags:['Reliable','Fast'],creditsPerUnit:10 },
  { id:'runway-gen4',name:'Runway Gen-4',provider:'runway',type:'video',tier:'ultra',description:'Hollywood-grade AI video generation. Industry standard for branded content.',maxDuration:16,aspectRatios:['16:9','9:16','1:1'],capabilities:{realistic:true,firstFrame:true,lastFrame:true,motionControl:true,imageToVideo:true,textToVideo:true,cameraControl:true},tags:['Hollywood grade','Camera control','First/last frame'],creditsPerUnit:25 },
  { id:'runway-gen3',name:'Runway Gen-3',provider:'runway',type:'video',tier:'quality',description:'Proven Runway model with exceptional motion fidelity.',maxDuration:10,aspectRatios:['16:9','9:16','1:1'],capabilities:{realistic:true,firstFrame:true,imageToVideo:true,textToVideo:true},tags:['Motion fidelity','Cinematic'],creditsPerUnit:15 },
  { id:'wan',name:'Wan',provider:'wan',type:'video',tier:'quality',description:'Strong text-to-video with natural motion and 16:9 specialisation.',maxDuration:8,aspectRatios:['16:9','9:16'],capabilities:{textToVideo:true,imageToVideo:true,motionControl:true},tags:['Natural motion','Text-to-video'],creditsPerUnit:8 },
  { id:'hailuo',name:'Hailuo',provider:'hailuo',type:'video',tier:'quality',description:'Excellent lip sync and talking-head video generation.',maxDuration:6,aspectRatios:['16:9','9:16','1:1'],capabilities:{realistic:true,lipSync:true,firstFrame:true,textToVideo:true,imageToVideo:true},tags:['Lip sync','Talking head'],creditsPerUnit:12 },
  { id:'seedance',name:'Seedance',provider:'seedance',type:'video',tier:'quality',description:'Dance and motion-heavy video. Excellent choreography control.',maxDuration:10,aspectRatios:['16:9','9:16','1:1'],capabilities:{motionControl:true,textToVideo:true,imageToVideo:true},tags:['Motion-heavy','Dance'],creditsPerUnit:10 },
];

export const AUDIO_MODELS: CraftModel[] = [
  { id:'suno-v4',name:'Suno v4',provider:'suno',type:'audio',tier:'ultra',description:'Full music production — lyrics, composition, production. Best for original tracks.',maxDuration:240,capabilities:{},tags:['Full music','Original tracks','Lyrics'],creditsPerUnit:15,recommended:true },
  { id:'udio',name:'Udio',provider:'udio',type:'audio',tier:'quality',description:'High-quality AI music with genre and mood control.',maxDuration:180,capabilities:{},tags:['Genre control','Mood-aware'],creditsPerUnit:10 },
  { id:'elevenlabs-v3',name:'ElevenLabs v3',provider:'elevenlabs',type:'voice',tier:'ultra',description:'Most realistic AI voices. Emotion, pacing, and multilingual support.',maxDuration:600,capabilities:{realistic:true,lipSync:true},tags:['Ultra realistic','Emotion control','30+ languages'],creditsPerUnit:8,recommended:true },
  { id:'elevenlabs-turbo',name:'ElevenLabs Turbo',provider:'elevenlabs',type:'voice',tier:'fast',description:'Fast voiceover for storyboard temp audio.',maxDuration:300,capabilities:{},tags:['Fast voiceover','Storyboard temp'],creditsPerUnit:3 },
];

export function getModelsForType(type: ModelType): CraftModel[] {
  if (type === 'image') return IMAGE_MODELS;
  if (type === 'video') return VIDEO_MODELS;
  return AUDIO_MODELS;
}

export function getTierColor(tier: ModelTier): string {
  return { auto:'#C9A96E', fast:'#7abf8e', quality:'#7aaee0', ultra:'#d48080' }[tier] ?? '#888';
}

export const CAPABILITY_LABELS: Record<keyof Required<ModelCapability>, string> = {
  realistic:'Realistic', nativeAudio:'Native audio', lipSync:'Lip sync',
  firstFrame:'First frame', lastFrame:'Last frame', motionControl:'Motion control',
  imageToVideo:'Image→Video', textToVideo:'Text→Video', cameraControl:'Camera control',
  inpainting:'Inpainting', multiview:'Multi-view', upscale:'Upscale',
  transparent:'Transparent BG', typographic:'Text in image', photoreal:'Photorealistic', cinematic:'Cinematic',
};
