import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import 'dotenv/config';
import ora from 'ora';
import { globalRivetNodeRegistry, plugins, loadProjectFromFile, runGraph } from '@ironclad/rivet-node';

const rivetProjectFile = './podcast-qna.rivet-project';
const aaiPluginSettings = {
  'assemblyAi': {
    'assemblyAiApiKey': getAssemblyAiApiKey(),
  }
};

function getAssemblyAiApiKey() {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    throw new Error('ASSEMBLYAI_API_KEY environment variable is not set');
  }
  return apiKey;
}

(async () => {
  const rl = readline.createInterface({ input, output });
  const spinner = ora({ discardStdin: false });
  globalRivetNodeRegistry.registerPlugin(plugins.assemblyAi);

  const project = await loadProjectFromFile(rivetProjectFile);
  const audioUrl = await rl.question('Provide the URL of your podcast file: ');

  spinner.start('Transcribing');
  const createTranscriptResults = await runGraph(project, {
    graph: 'Create transcript',
    inputs: {
      audio_url: audioUrl,
    },
    pluginSettings: aaiPluginSettings
  });
  spinner.succeed("Transcribed");

  // console.debug(createTranscriptResults);
  const transcriptId = createTranscriptResults.transcript_id.value as string;

  while (true) {
    console.log();
    const answer = await rl.question('Ask a question: ');

    spinner.start("Generating answer");
    const askQuestionResults = await runGraph(project, {
      graph: 'Ask question',
      inputs: {
        transcript_id: transcriptId,
        question: answer
      },
      pluginSettings: aaiPluginSettings
    });
    spinner.stop();

    // console.debug(askQuestionResults);
    console.log('Answer:', askQuestionResults.answer.value);
  }

  rl.close();
})();
