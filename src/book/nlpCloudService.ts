import { config } from '../config/config';
const NLPCloudClient = require('nlpcloud');

const getNLPClient = () => {
  console.log('🔑 NLP Cloud API Key exists:', !!config.nlpCloudApiKey);
  console.log('🔑 API Key first 10 chars:', config.nlpCloudApiKey?.substring(0, 10) + '...');
  
  return new NLPCloudClient({
    model: 'finetuned-llama-3-70b',
    token: config.nlpCloudApiKey,
    gpu: true
  });
};


export const fixGrammarAndSpelling = async (text: string): Promise<string> => {
  try {
    console.log('🚀 Starting grammar correction for text:', text.substring(0, 100) + '...');
    
    const client = getNLPClient();
    
    console.log('📤 Sending gsCorrection request to NLP Cloud...');
    const response = await client.gsCorrection({
      text: text
    });

    const correctedText = response.data?.correction?.trim() || text;

    return correctedText;

  } catch (error: any) {
    console.error('❌ Error fixing grammar:', error);
    console.error('❌ Error details:', error.message);
    throw new Error(`Failed to fix grammar: ${error.message || 'Unknown error'}`);
  }
};
