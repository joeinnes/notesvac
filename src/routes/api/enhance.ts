import type { RequestHandler } from "@sveltejs/kit";
import openai from "../../lib/openai";

const defaultPromptText = `Correct the sentences.

Incorrect:
I think WE GOT AWAY WITH IT BUT PLEASE Makes Sure UPDATES ARE TIMELY IN 2022.
Correct:
I think we got away with it but please make sure updates are timely in 2022.
---
Incorrect:
I'LL BE DOING SOME HOUSEKEEPING CCANCELLINO & RESCHEDULING CALLS, ETC.) IN THE NEXT weak or so. IF ANYONE WANTS TO CHANGE TIMESLOT, PLEASE LET ME Know
Correct:
I'll be doing some housekeeping (cancelling & rescheduling calls, etc.) in the next week or so. If anyone wants to change timeslot please let me know.
---
Incorrect:
`

export const post: RequestHandler = async function (request) {

  // User will have a refresh token
  // Request a new access token from Directus
  // Validate user may use OpenAI
  // Request OpenAI to enhance the text
  // Return the enhanced text
  // Add the tokens used to the user's token count

  try {
    const uploaded = request.body.content;
    const removePageNumbers = uploaded.replace(/^Page ([0-9]*)\n\n/, ' ');
    const removePageSeperators = removePageNumbers.replace(/^------*\n/, '\n');
    const removedTitle = removePageSeperators.replace(/^##(.*?)##\n\n/, ' ');
    const punctuateEndOfBullets = stripLines.replaceAll('\n\n-', ".\n-");
    const stripLines = removedTitle.replaceAll('\n\n', " ");
    const breakdownSentences = punctuateEndOfBullets.replace(/([^-]|[.?!])\s*(?=[A-Z])/g, "$1|").split("|");
    let parsed = '';
    let tokenCount = 0;
    for (const sentence of breakdownSentences) {
      const { data } = await openai.complete({
        engine: 'davinci-instruct-beta-v3',
        prompt: defaultPromptText + sentence.trim() + `
      Correct:`,
        maxTokens: 200,
        temperature: 0,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: ['Correct:', 'Incorrect:', '---', 'Corrected Version']
      });
      console.log(sentence, '-->', data.choices[0].text);
      tokenCount = tokenCount + 160 + Math.ceil(sentence.trim().length / 4) + Math.ceil(data.choices[0].text.length / 4);
      parsed = parsed + ' ' + data.choices[0].text;
    }
    // TODO: Save token count used by this user for billing purposes
    return ({
      status: 200,
      body: { data: parsed }
    });
  } catch (e) {
    return ({ status: 500, body: e });
  }
}
