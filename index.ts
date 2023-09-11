import 'dotenv/config';
import { runGraphInFile } from '@ironclad/rivet-node';

(async () => {
  const results = await runGraphInFile('/Users/niels/Downloads/Podcast Q&A.rivet-project', {
    graph: 'Create transcript',
    inputs: {
      audio_url: 'https://storage.googleapis.com/aai-docs-samples/podcast.mov',
    },
    openAiKey: null as unknown as string,
    pluginSettings: {
      'assemblyAi': {
        'assemblyAiApiKey': process.env.ASSEMBLY_AI_API_KEY,
      }
    }
  });
  console.log(results);
})(); 