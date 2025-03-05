+++
title = "Bleeper"
description = "A character-for-character self-censoring tool with grawlix support"
authors = ["Wolfgang"]
weight = 1
date =  2024-11-21
updated = 2024-11-21
+++
# Bleeper
## A character-for-character self-censoring tool
Sometimes, you want to say something you _know_ you shouldn't,
but want to *infer* it. \
So, just censor yourself and let people fill in the blanks.
<!-- This tool uses JavaScript and is useless in plaintext. -->

*"Say what you mean, post what you can!"*
<input
    type="text"
    id="input"
    placeholder="Enter text here"
    style="
        width: 100%;
        margin-top: 1em;
        "/>
<fieldset id="settings">
    <legend>Settings</legend>
    <label>
        <input type="checkbox" id="grawlixBox" />
        Grawlix&nbsp;Mode
    </label>
        &mdash;
    <label>
        <input type="checkbox" id="asciiBox" />
        ASCII&nbsp;Output
    </label>
        &mdash;
    <label>
        <input type="checkbox" id="whitespaceBox" />
        Censor&nbsp;Whitespace
    </label>
        &mdash;
    <label>
        <input type="checkbox" id="punctuationBox" />
        Allow&nbsp;Punctuation
    </label>
</fieldset>
<hr>
<output
    type="text" readonly
    id="output"
    style="
        user-select: all;
        color: #eee;
        background-color: #000;
        text-shadow: 0 0 1px #eee;
        padding: 0.25em 0.5em;
    ">
</output>
<hr>

### Tips:
* To 'reroll' your grawlixing, spam toggle *'`ASCII Output`'*.
* Remember, the censor is one-to-one,
    even if different glyphs have different widths.
* Due to being one-to-one,
    It may be possible to infer what you really said;
    *e.g.* You know what *"Oh \*\*\*\* this"* really says.
    *"Darn"*.
    * *Do not use this for secure or confidential purposes.*
        *This gizmo is a toy.*

<script>
const input = document.getElementById('input');
const output = document.getElementById('output');

const grawlixBox = document.getElementById('grawlixBox');
const asciiBox = document.getElementById('asciiBox');
const whitespaceBox = document.getElementById('whitespaceBox');
const checkboxes = document.querySelectorAll('#settings input');

const bleepChar = '\u2588';
const asciiChar = '*';
const grawlixMap = '@$#&%*';

function bleep(text) {
    return text.replace(
        // Are you ready for this?
        whitespaceBox.checked
            ? punctuationBox.checked
                ? /[^\p{P}]/gu //   Allow punctuation
                : /./g //           Censor it all
            : punctuationBox.checked
                ? /[^\s\p{P}]/gu // Allow whitespace + punctuation
                : /\S/g, //         Allow whitespace
        asciiBox.checked ? asciiChar : bleepChar
    );
}

function grawlix(text) {
    let lastChar = null;
    return text.replace(
        // If you liked that, you'll love this.
        whitespaceBox.checked
            ? punctuationBox.checked
                ? /[^\p{P}]/gu // Allow punctuation
                : /./g         // Censor it all
            : punctuationBox.checked
                ? /[^\s\p{P}]/gu // Allow punctuation + whitespace
                : /\S/g,          // Allow whitespace
        () => { // Inline function wizardry
            let newChar;
            do {
                // Pick a random character from the grawlixMap
                newChar = grawlixMap[
                    Math.floor(Math.random() * grawlixMap.length)
                ];
            } while (newChar === lastChar); // Avoid repeats
            lastChar = newChar;
            return newChar;
        }
    );
}

input.addEventListener('input', () => {
    if (grawlixBox.checked) {
        output.innerHTML = grawlix(input.value);
    } else {
        output.innerHTML = bleep(input.value);
    };
});

// Fire input event when any checkbox is changed
for (const checkbox of checkboxes) {
    checkbox.addEventListener('change', () => {
        input.dispatchEvent(new Event('input'));
    });
}
// Run on load in case of cached input
input.dispatchEvent(new Event('input'));
</script>