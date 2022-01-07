# Notesvac

# What it does

Notesvac receives notes from Rocketbook in PDF form, with OCR transcriptions, and stores them in a searchable database.

That's not groundbreaking.

The USP for Notesvac is that it can take the OCR transcriptions and improve them using the GPT-3 engine to try to reconstruct the original text.

## Caveats

An important caveat is that GPT-3 is _not reading_ the original, handwritten note. It's only reading the transcriptions and using AI to try to correct the transcriptions.

For example, if the handwritten note says "I am writing a note" and the transcription says "I am swimming in the sea", then the GPT-3 revision will see correct English, and will not know the note is not correct. However, if the transcription says "I om wreeting a mole", then GPT-3 should be able to correct.

It's also worth noting that because GPT-3 is _guessing_, it won't necessarily be correct, and might well actually guess the exact opposite of what the handwritten note says. It also may take creative liberties with what it thinks you might have wanted to say, and add in extra words, phrases or ideas that you did not actually say.

# Roadmap

v1.0.0

- [ ] Log in
- [ ] Display notes stored in database (show transcribed notes)
- [ ] Allow manual correction of notes
- [ ] Allow manual submission to OpenAI to improve the transcription
- [ ] Display handwritten notes in preview pane
- [ ] Search notes (full text search)

v2.0.0

- [ ] Allow manual correction of notes to be submitted to train a custom AI model
- [ ] Billing system implementation and enable registration

# Etymology

Name is inspired by the Multi-/Micro-vac computers created by Isaac Asimov.

# Disclaimer

No warranty is provided. This software is provided "as is". Use at your own risk. The author is not responsible for any damages caused by this software. No guarantees are provided about the accuracy, functionality, security, or interoperability of this software.

By using this software, you agree to the above disclaimer, and to the maximum extent permissible by law, you indemnify the author for any and all damages, inconveniences, other costs incurred which result from the use of this software.

You agree not to use this software to do anything illegal, and you agree not to use this software to do anything that could harm the author or any other person. If you violate these rules, your rights to use this software cease immediately, and you must destroy all copies of this software.

Where this software is provided as a service, you agree that you and you alone are responsible for use of this software, and the service provider is not responsible for the confidentiality, integrity, availability, or the content of any files or other information by you or anyone else into the service.
