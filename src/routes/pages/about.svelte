<h1>About NotesVac</h1>

<p>
	Named after Isaac Asimov's MultiVac, MicroVac, and the remainder of the 'VAC' range, NotesVac aims
	to supercharge note-taking by using artificial intelligence to improve handwriting transcription.
</p>

<p>
	Inspired by <a href="https://paperwebsite.com" rel="external">Paper Website</a>, and frustrated by
	Rocketbook's mediocre transcription efforts, I set about trying to build a notes platform which
	can do a better job of transcribing handwritten notes.
</p>

<p>
	Using OpenAI's exciting GPT-3 software, NotesVac reads the best-attempt OCR and then tries to
	enhance it further by using a neural network to predict what the author <em>probably wrote</em>.
</p>

<p>
	An important caveat is that GPT-3 is <strong>not reading</strong> the original, handwritten note. It's
	only reading the transcriptions. That means it's only as good as the first link in the chain.
</p>

<p>
	For example, if the handwritten note says "I am writing a note" and the transcription says "I am
	swimming in the sea", then the GPT-3 revision will see correct English, and will not know the note
	is not correct. However, if the transcription says "I om wreeting a mote", then GPT-3 might be
	able to correct.
</p>

<p>
	It's also worth noting that because GPT-3 is _guessing_, it won't necessarily be correct, and
	might well actually guess the exact opposite of what the handwritten note says. It also may take
	creative liberties with what it thinks you might have wanted to say, and add in extra words,
	phrases or ideas that you did not actually say.
</p>

<p>
	Currently, you have to provide NotesVac with the transcription. In future versions, NotesVac may
	offer transcription separately, or attempt to add additional 'votes' to the transcription to
	improve results.
</p>
