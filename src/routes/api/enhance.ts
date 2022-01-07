import openai from "../../lib/openai";

const defaultPromptText = `Make correct English.

Original:
The quck Brown fox lstened to its Ist procast when it wolce up in new York.
Corrected:
The quick brown fox listened to its 1st podcast when it woke up in New York.
Original: 
the Man called BEN. wh was quite anrgry. decided not to goon His jowney
Corrected:
The man called Ben, who was quite angry, decided not to go on his journey
Original:
## YORKSHIRE PUDDINGS ##
1. HEAT OVEN TO 230°
OR 210° FAN
? Para al INTO TUS
& WEAT
3. Tip Flour INTO BOWL
B BEAT IN EGGS UNTIL SMOOTH
4 ADD MILK GRADUALLY UNTIL ALL ADDED 3
MIXTURE is LUMP-FREE
5 Pour BATTER INTO TINS CAREFULLY TO
AUDIO HOT OIL SPLASHES
6. PLACE TINS IN OVEN FOR 20-25 mins

INGREDIENTS
- 140g flour
- 4 EGES
- 200m2 Mill
-OIL
Corrected:
## Yorkshire Puddings ##
1. Heat oven to 230° or 210° fan
2. Pour oil into tins & heat
3. Tip flour into bowl & beat in eggs until smooth
4. Add milk gradually untill all added & mixture is lump-free
5. Pour batter into tins carefully to avoid hot oil splashes
6. Place tins in oven for 20-25 mins

Ingredients
- 140g flour
- 4 eggs
- 200ml milk
- oil
Original:
`

export async function post(request) {
  const gptResponse = await openai.complete({
    engine: 'davinci-instruct-beta-v3',
    prompt: defaultPromptText + request.body.text,
    maxTokens: 512,
    temperature: 1,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
    bestOf: 1,
    n: 1,
    stream: false,
    stop: ['Original:']
  });
  console.log(gptResponse.data);
  return ({ status: 200, body: { data: gptResponse.data.choices[0].text } });
}
