const { md2kbb } = require('./md2kbb.js');

function testConversion(markdown, expected) {
    const result = md2kbb.convert(markdown);
    const sanitizedExpected = expected.replace(/\r?\n|\r/g, '');
    const sanitizedResult = result.replace(/\r?\n|\r/g, '');

    console.log(`Testing: ${markdown}`);
    console.assert(sanitizedResult === sanitizedExpected, `FAILED: Expected: ${sanitizedExpected}, Got: ${sanitizedResult}`);
}

//? Test cases
//  Basic formatting
console.log("Testing basic formatting...");
testConversion('**Bold**', '[b]Bold[/b]');
testConversion('*Italic*', '[i]Italic[/i]');
testConversion('__Underlined text__', '[u]Underlined text[/u]');
testConversion('~~Struck-through~~', '[s]Struck-through[/s]');
testConversion('# Heading 1', '[h1]Heading 1[/h1]');
testConversion('## Heading 2', '[h2]Heading 2[/h2]');

//  Advanced formatting
console.log("Testing advanced formatting...");
testConversion('||Spoiler||', '[spoiler]Spoiler[/spoiler]');
testConversion('`Inline code`', '[code inline]Inline code[/code]');
testConversion('```\nBlock\ncode\n```', '[code]\nBlock\ncode\n[/code]');
testConversion('> Quote', '[quote]Quote[/quote]');
testConversion('>> Blockquote', '[blockquote]Blockquote[/blockquote]');

//  Lists
console.log("Testing lists...");
testConversion('- List item 1\n- List item 2', '[ul][li]List item 1[/li]\n[li]List item 2[/li][/ul]');
testConversion('\n1. Ordered item 1\n2. Ordered item 2', '[ol][li]Ordered item 1[/li]\n[li]Ordered item 2[/li][/ol]');
testConversion('- Item 1\n  - Subitem 1.1\n- Item 2', '[ul][li]Item 1[/li]\n[ul][li]Subitem 1.1[/li][/ul]\n[li]Item 2[/li]\n[/ul]');


//  Links
console.log("Testing links...");
testConversion('[Knockout!](https://knockout.chat)', '[url href="https://knockout.chat"]Knockout![/url]');
testConversion('![thumbnail](https://example.com/img.png)', '[img thumb]https://example.com/img.png[/img]');
testConversion('![no thumbnail](https://example.com/img.png)', '[img]https://example.com/img.png[/img]');
testConversion('[Link](https://example.com?param=value)', '[url href="https://example.com?param=value"]Link[/url]');


//  Domain-specific syntax
console.log("Testing domain-specific syntax...");
testConversion('[Twitter Post](https://twitter.com/Mor/1)', '[twitter]https://twitter.com/Mor/1[/twitter]');
testConversion('[YouTube Video](https://www.youtube.com/watch?v=dQw4w9WgXcQ)', '[youtube]https://www.youtube.com/watch?v=dQw4w9WgXcQ[/youtube]');

//  Gotchas
console.log("Testing gotchas...");
testConversion('**Bold and *Italic* Text**', '[b]Bold and [i]Italic[/i] Text[/b]');
testConversion('***Bold and Italic Text***', '[b][i]Bold and Italic Text[/i][/b]');
testConversion('`**Bold** text`', '[code inline]**Bold** text[/code]');
testConversion('```\n**Bold**\n```', '[code]\n**Bold**\n[/code]');

console.log("Testing complete.\n");
console.log("As always, find fixes for all errors. Then, incorporate the fixes into md2kbb.js.");
