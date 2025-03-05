const { kbb2md } = require('./kbb2md.js');

function testConversion(markdown, expected) {
    const result = kbb2md.convert(markdown);
    const sanitizedExpected = expected.replace(/\r?\n|\r/g, '');
    const sanitizedResult = result.replace(/\r?\n|\r/g, '');

    console.log(`Testing: ${markdown}`);
    console.assert(sanitizedResult === sanitizedExpected, `FAILED: Expected: ${sanitizedExpected}, Got: ${sanitizedResult}`);
}

//? Test cases
//  Basic formatting
console.log("Testing basic formatting...");
testConversion('[b]Bold[/b]', '**Bold**');
testConversion('[i]Italic[/i]', '*Italic*');
testConversion('[u]Underlined text[/u]', '__Underlined text__');
testConversion('[s]Struck-through[/s]', '~~Struck-through~~');
testConversion('[h1]Heading 1[/h1]', '\n# Heading 1');
testConversion('[h2]Heading 2[/h2]', '\n## Heading 2');

//  Advanced formatting
console.log("Testing advanced formatting...");
testConversion('[spoiler]Spoiler[/spoiler]', '||Spoiler||');
testConversion('[code inline]Inline code[/code]', '`Inline code`');
testConversion('[code]\nBlock\ncode\n[/code]', '```\nBlock\ncode\n```');
testConversion('[quote]Quote[/quote]', '> Quote');
testConversion('[blockquote]Blockquote[/blockquote]', '>> Blockquote');

//  Lists
console.log("Testing lists...");
testConversion('[ul]\n[li]List item 1[/li]\n[li]List item 2[/li]\n[/ul]', '- List item 1\n- List item 2');
testConversion('[ol]\n[li]Ordered item 1[/li]\n[li]Ordered item 2[/li]\n[/ol]', '1. Ordered item 1\n2. Ordered item 2');
testConversion('[ul]\n[li]Item 1[/li]\n[ul]\n[li]Subitem 1.1[/li]\n[/ul]\n[li]Item 2[/li]\n[/ul]', '- Item 1\n  - Subitem 1.1\n- Item 2');

//  Links
console.log("Testing links...");
testConversion('[url href="https://knockout.chat"]Knockout![/url]', '[Knockout!](https://knockout.chat)');
testConversion('[img thumb]https://example.com/img.png[/img]', '![thumbnail](https://example.com/img.png)');
testConversion('[img]https://example.com/img.png[/img]', '![no thumbnail](https://example.com/img.png)');
testConversion('[url href="https://example.com?param=value"]Link[/url]', '[Link](https://example.com?param=value)');

//  Domain-specific syntax
console.log("Testing domain-specific syntax...");
testConversion('[twitter]https://twitter.com/Mor/1[/twitter]', '[twitter](https://twitter.com/Mor/1)');
testConversion('[youtube]https://www.youtube.com/watch?v=dQw4w9WgXcQ[/youtube]', '[youtube](https://www.youtube.com/watch?v=dQw4w9WgXcQ)');

//  Gotchas
console.log("Testing gotchas...");
testConversion('[b]Bold and [i]Italic[/i] Text[/b]', '**Bold and *Italic* Text**');
testConversion('[b][i]Bold and Italic Text[/i][/b]', '***Bold and Italic Text***');
testConversion('[code inline]**Bold** text[/code]', '`**Bold** text`');
testConversion('[code]\n**Bold**\n[/code]', '```\n**Bold**\n```');

console.log("Testing complete.\n");
console.log("As always, find fixes for all errors. Then, incorporate the fixes into kbb2md.js.");
