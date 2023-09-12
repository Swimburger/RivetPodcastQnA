import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import 'dotenv/config';
import ora from 'ora';
import { globalRivetNodeRegistry, plugins, runGraphInFile } from '@ironclad/rivet-node';

function getAssemblyAiApiKey(){
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if(!apiKey){
    throw new Error('ASSEMBLYAI_API_KEY environment variable is not set');
  }
  return apiKey;
}

(async () => {
  const rl = readline.createInterface({ input, output });
  const spinner = ora({discardStdin: false});

  globalRivetNodeRegistry.registerPlugin(plugins.assemblyAi);
  const pluginSettings = {
    'assemblyAi': {
      'assemblyAiApiKey': getAssemblyAiApiKey(),
    }
  };

  const audioUrl = await rl.question('Provide the URL of your podcast file: ');

  spinner.start('Transcribing');
  const createTranscriptResults = await runGraphInFile('./podcast-qna.rivet-project', {
    graph: 'Create transcript',
    inputs: {
      audio_url: audioUrl,
    },
    openAiKey: null as unknown as string,
    pluginSettings
  });
  const transcriptId = createTranscriptResults.transcript_id.value as string;
  spinner.succeed("Transcribed");

  while(true){
    console.log();
    const answer = await rl.question('Ask a question: ');

    spinner.start("Generating answer");
    const askQuestionResults = await runGraphInFile('/Users/niels/Downloads/Podcast Q&A.rivet-project', {
      graph: 'Ask question',
      inputs: {
        transcript_id: transcriptId,
        question: answer
      },
      openAiKey: null as unknown as string,
      pluginSettings
    });
    spinner.stop();
  
    console.log('Answer:', askQuestionResults.answer.value);
  }

  rl.close();
})();
