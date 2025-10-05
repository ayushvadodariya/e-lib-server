import { config } from '../config/config';
const NLPCloudClient = require('nlpcloud');

/**
 * Get NLP Cloud client instance
 */
const getNLPClient = () => {
  return new NLPCloudClient({
    model: 'finetuned-llama-3-70b',
    token: config.nlpCloudApiKey,
    gpu: true
  });
};

/**
 * Fix grammar and spelling mistakes in text
 * @param text - Text to correct
 * @returns Corrected text
 */
export const fixGrammarAndSpelling = async (text: string): Promise<string> => {
  try {
    const client = getNLPClient();
    const prompt = `Fix all grammar and spelling mistakes in the following text. Return ONLY the corrected text without any explanations:\n\n${text}`;
    
    const response = await client.generation({
      text: prompt,
      max_length: 2500,
      length_no_input: true,
      temperature: 0.3,
      top_p: 0.9,
      repetition_penalty: 1.2,
    });

    const correctedText = response.data?.generated_text?.trim() 
                       || response.generated_text?.trim() 
                       || response.generatedText?.trim() 
                       || response.generation?.trim()
                       || response.text?.trim()
                       || text;

    return correctedText;

  } catch (error: any) {
    console.error('Error fixing grammar:', error.message);
    throw new Error(`Failed to fix grammar: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Improve book description using NLP Cloud generation
 * @param text - The description text to improve
 * @param customPrompt - Optional custom instruction for how to improve (e.g., "make it more exciting", "add more mystery")
 * @returns Promise<string> - The improved description
 */
export async function improveDescription(text: string, customPrompt?: string): Promise<string> {
    try {
        const client = getNLPClient();
        
        let prompt: string;
        if (customPrompt && customPrompt.trim()) {
            prompt = `Improve the following book description based on this instruction: "${customPrompt}". Keep the same core information but enhance the writing according to the instruction. Do not add fictional details, only improve the existing content:\n\n${text}\n\nImproved description:`;
        } else {
            prompt = `Improve the following book description to make it more engaging, professional, and appealing to readers. Keep the same core information but enhance the writing quality, flow, and impact. Do not add fictional details, only improve the existing content:\n\n${text}\n\nImproved description:`;
        }
        
        const response = await client.generation({
            text: prompt,
            max_length: 2500,
            length_no_input: true,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.2,
        });

        const improvedText = response.data?.generated_text?.trim() 
                          || response.generated_text?.trim() 
                          || response.generatedText?.trim() 
                          || response.generation?.trim()
                          || response.text?.trim()
                          || text;
        
        return improvedText;
    } catch (error: any) {
        console.error('Error improving description:', error.message);
        throw new Error(`Failed to improve description: ${error.message || 'Unknown error'}`);
    }
}