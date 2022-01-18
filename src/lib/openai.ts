import OpenAI from 'openai-nodejs';
let OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY + '';
if (process.env.CF_PAGES) {
  OPENAI_API_KEY = process.env.OPENAI_API_KEY + '';
}
// Load your key from an environment variable or secret management service
// (do not include your key directly in your code)
const openai = new OpenAI(OPENAI_API_KEY);
export default openai;