+++
title = "md2kbb"
description = "Convert Markdown to KnockoutBB"
authors = ["Wolfgang"]
weight = 1
date =  2023-12-09
updated = 2023-12-12
+++
# md2kbb
## The Markdown to KnockoutBB Converter
<figure>
    <textarea
        id="mdIn"
        cols="40"
        rows="12"
        placeholder="Enter Markdown here"
        autofocus>
# md2kbb
## The Markdown to KnockoutBB Converter
**Instructions:**
1. Paste your Markdown input into the input textbox.
    - Works great with lists!
2. Click the *Convert* button.
3. Copy the KnockoutBB output from the output textbox.
4. [Enjoy!](https://www.youtube.com/watch?t=4&v=J_fNY6uLlF0)</textarea>
    <figcaption>Markdown Input</figcaption>
</figure>

<button type="button" id="convert">Convert</button>

<figure>
    <textarea
        id="kbbOut"
        cols="40"
        rows="12"
        readonly
        ></textarea>
    <figcaption>KnockoutBB Output</figcaption>
</figure>

----
### Notes
***Report all bugs and formatting degredations to Wolfgang.***

_KnockoutBB_ has no headers beyond Header 2.\
You may lose this information in conversion.

| Header | Replacement |
| ------ | ----------- |
|      3 | **Bold**    |
|      4 | Quote       |
|      5 | *Italics*   |
|      6 | Underline   |

----
### Source Code
`MIT Licensed`
- [md2kbb.js](./md2kbb.js) *"Almost ready"* -Wolfgang
    - [Tests](./md2kbb.test.js)
- [kbb2md.js](./kbb2md.js) *"Soon..."* -Wolfgang
    - [Tests](./kbb2md.test.js)
<!--
- [kbb2md.js](./kbb2md.js) Definitely not ready; fails at nested lists.
  - [Tests](./kbb2md.test.js)
-->

<script src="./md2kbb.js"></script>
<script>
    document.getElementById('convert').addEventListener('click', function() {
        var markdownText = document.getElementById('mdIn').value;
        var kbbText = md2kbb.convert(markdownText); // Use the imported md2kbb function
        document.getElementById('kbbOut').value = kbbText;
    });
</script>
