"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rivet_node_1 = require("@ironclad/rivet-node");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, rivet_node_1.runGraphInFile)('/Users/niels/Downloads/Podcast Q&A.rivet-project', {
        graph: 'Create transcript',
        inputs: {
            audio_url: 'https://storage.googleapis.com/aai-docs-samples/podcast.mov',
        },
        openAiKey: null,
        pluginSettings: {
            'assemblyAi': {
                'assemblyAiApiKey': '54f6b610676245a4b928f1061fce8d4f'
            }
        }
    });
    console.log(results);
}))();
