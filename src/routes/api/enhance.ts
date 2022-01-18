import type { RequestHandler } from "@sveltejs/kit";
import openai from "../../lib/openai";
const defaultPromptInitial = `Make the original syntactically correct.
Original: 
I'LL BE DOING SOME HOUSEKEEPING CCANCELLINO & RESCHEDULING CALLS, ETC.) IN THE NEXT weak or so. IF ANYONE WANTS TO CHANGE TIMESLOT, PLEASE LET ME Know
Syntactically correct: 
I'll be doing some housekeeping (cancelling & rescheduling calls, etc.) in the next week or so. If anyone wants to change timeslot, please let me know
---
Original:
`
const defaultPromptEnd = `
Syntactically correct:`;
const options = {
  engine: 'curie-instruct-beta-v2',
  max_tokens: 200,
  temperature: 0,
  top_p: 0,
  presence_penalty: 0,
  frequency_penalty: 0,
  best_of: 1,
  n: 1,
  stream: false,
  stop: ['Incorrect:', '---', 'Syntactically correct.']
};
export const post: RequestHandler = async function (request) {
  try {
    const access_token = request.body.access_token;
    if (!access_token) throw { code: 401, message: 'No access token provided' };
    const userResp = await fetch(import.meta.env.VITE_API_URL + '/users/me', {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    })
    const { data } = await userResp.json();
    if (!data) throw { code: 404, message: 'No user data found' };
    const { id } = data;
    if (!request.body.content) throw { code: 400, message: 'No content provided' };
    const contentArr = prepareText(request.body.content);
    const corrected: string[] = [];
    let tokenCount = 0;
    for (const item of contentArr) {
      const prompt = defaultPromptInitial + item + defaultPromptEnd;
      if (!prompt) continue;
      tokenCount += openai.tokens(prompt);
      const completion = await openai.complete(prompt, options);
      const selected = completion.choices[0].text;
      corrected.push(selected);
      tokenCount += openai.tokens(selected);
    }
    await fetch(import.meta.env.VITE_API_URL + `/items/tokens_used`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${process.env.TOKEN_MANAGER_TOKEN}`,
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        user: id,
        count: tokenCount
      })
    })
    return ({
      status: 200,
      body: { data: corrected.join(''), tokensUsed: tokenCount }
    });
  } catch ({ code = 500, message = 'Internal Server Error' }) {
    console.log(code, message);
    return ({ status: code, body: message });
  }
}

function prepareText(input: string) {
  const removePageNumbers = input.replace(/^Page [0-9]*$\n\n/gm, '');
  const removePageSeparators = removePageNumbers.replace(/^----*$\n/gm, '');
  const removedTitle = removePageSeparators.replace(/^##(.*?)##$\n/gm, '');
  const punctuateEndOfBullets = removedTitle.replace(/^- (.*)^-/gm, '- $1.');
  const removeDoublePunct = punctuateEndOfBullets.replace(/([.?!])[.?!]/g, "$1")
  const mergeOntoLines = removeDoublePunct.replace(/([A-Za-z])\s*\n([A-Za-z])/gm, "$1 $2");
  const breakdownSentences = mergeOntoLines.split('\n');

  const readyToSend: string[] = [];
  let previousPhrase = '';
  breakdownSentences.forEach(sentence => {
    if (!sentence && !previousPhrase) return;
    previousPhrase = sentence.trim();
    readyToSend.push(sentence.trim());
  })
  return readyToSend;
}

