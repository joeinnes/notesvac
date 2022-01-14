import OpenAI from 'openai-nodejs';
if (!process.env.CF_PAGES) {
  import('dotenv/config');
}
// Load your key from an environment variable or secret management service
// (do not include your key directly in your code)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY + '';
const openai = new OpenAI(OPENAI_API_KEY);
export default openai;