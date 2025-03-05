//
//! md2kbb.js
//? Converts Markdown to KnockoutBB
//  Welcome to Regex Replace heaven.
//? By Wolfgang de Groot
//? Version 2.1.0 (2024-09-28-d)
//      * Expect {class}.convert
//  MIT License
//

class md2kbb {
    /**
     * Converts Markdown text to KnockoutBB.
     *
     * @param {string} markdownText - The Markdown text to be converted.
     * @returns {string} The converted KnockoutBB text.
     */
    static convert(markdownText) {
        let [draft, codeBlocks] = this.#stashCodeBlocks(markdownText);

        draft = this.#convertFirstPass(draft);
        draft = this.#convertImages(draft);
        draft = this.#convertHeadings(draft);
        draft = this.#convertHyperlinks(draft);
        draft = this.#convertQuotes(draft);
        draft = this.#convertLists(draft);
        draft = this.#convertDomainSpecificSyntax(draft);

        return this.#restoreCodeBlocks(draft, codeBlocks);
    }

    static #convertFirstPass(text) {
        // Handle nested bold and italic
        text = text
            .replace(/\*\*\*(.*?)\*\*\*/g, '[b][i]$1[/i][/b]')
            .replace(/\*\*(.*?)\*\*/g, '[b]$1[/b]')
            .replace(/\*(.*?)\*/g, '[i]$1[/i]')
            .replace(/__(.*?)__/g, '[u]$1[/u]')
            .replace(/_(.*?)_/g, '[i]$1[/i]')
            .replace(/~~(.*?)~~/g, '[s]$1[/s]')
            .replace(/\|\|(.*?)\|\|/g, '[spoiler]$1[/spoiler]');
        return text;
    }

    static #convertHeadings(text) {
        text = text
            .replace(/^# (.*?)$/gm, '[h1]$1[/h1]')
            .replace(/^## (.*?)$/gm, '[h2]$1[/h2]')
            .replace(/^### (.*?)$/gm, '[b]$1[/b]')
            .replace(/^#### (.*?)$/gm, '[q]$1[/q]')
            .replace(/^##### (.*?)$/gm, '[i]$1[/i]')
            .replace(/^###### (.*?)$/gm, '[u]$1[/u]');
        return text;
    }

    static #convertHyperlinks(text) {
        text = text.replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, '[url href="$2"]$1[/url]');
        // Convert raw links without markdown formatting if they are on their own line
        text = text.replace(/(?:^|\n)(https?:\/\/\S+)(?=\n|$)/g, (match, url) => {
            return `\n[url smart href="${url}"]${url}[/url]`;
        });

        return text;
    }

    static #convertQuotes(text) {
        text = text
            .replace(/^> (.*?)$/gm, '[quote]$1[/quote]')
            .replace(/^>> (.*?)$/gm, '[blockquote]$1[/blockquote]');
        return text;
    }

    static #convertImages(text) {
        return text.replace(/!\[((?:thumbnail)?[^[\]]*)]\(([^)]+)\)/g, (match, alt, url) => {
            const isThumbnail = alt.toLowerCase().trim() === 'thumbnail';
            return isThumbnail ? `[img thumb]${url}[/img]` : `[img]${url}[/img]`;
        });
    }

    static #convertLists(text) {
        function processListItems(items) {
            let currentDepth = 0;
            let listStack = [[]];

            items.forEach(item => {
                // Calculate depth based on the number of spaces (assuming 2 spaces per level of indentation)
                const depth = Math.floor(item.depth / 2);
                const content = `[li]${item.content.trim()}[/li]`;

                while (depth < currentDepth) {
                    let nestedList = listStack.pop();
                    let wrappedList = wrapListItems(nestedList, listStack[listStack.length - 1].isOrdered);
                    listStack[listStack.length - 1].push(wrappedList);
                    currentDepth--;
                }

                while (depth > currentDepth) {
                    listStack.push([]);
                    currentDepth++;
                }

                listStack[listStack.length - 1].push(content);
            });

            while (listStack.length > 1) {
                let nestedList = listStack.pop();
                let wrappedList = wrapListItems(nestedList, listStack[listStack.length - 1].isOrdered);
                listStack[listStack.length - 1].push(wrappedList);
            }

            return wrapListItems(listStack[0], items[0].isOrdered);
        }

        function wrapListItems(items, isOrdered) {
            const listTag = isOrdered ? 'ol' : 'ul';
            return `[${listTag}]${items.join('\n')}[/${listTag}]`;
        }

        const listItemRegex = /^(\s*)(([*+-])|(\d+\.) )(.*)$/;
        let lines = text.split('\n');
        let listItems = [];
        let convertedLines = [];

        lines.forEach(line => {
            let match = line.match(listItemRegex);
            if (match) {
                let depth = match[1].length;
                let isOrdered = match[4] !== undefined;
                listItems.push({ depth, isOrdered, content: match[5] });
            } else {
                if (listItems.length > 0) {
                    convertedLines.push(processListItems(listItems));
                    listItems = [];
                }
                convertedLines.push(line);
            }
        });

        if (listItems.length > 0) {
            convertedLines.push(processListItems(listItems));
        }

        convertedLines = convertedLines.join('\n');

        //TODO: Fix need for this hack to prevent dumb nested lists
        while (convertedLines.match(/\[(ul|ol)\]\[(ul|ol)\]/)) {
            convertedLines = convertedLines.replace(/\[(ul|ol)\]\[(ul|ol)\]([\s\S]*?)\[\/\2\]\[\/\1\]/g, (match, outerListType, innerListType, innerListContent) => {
                return `[${outerListType}]${innerListContent}[/${outerListType}]`;
            });
        }

        return convertedLines;
    }

    static #convertDomainSpecificSyntax(text) {
        const domainSpecificMap = new Map([
            ['twitter.com', (url) => `[twitter]${url}[/twitter]`],
            ['youtube.com', (url) => `[youtube]${url}[/youtube]`],
            ['youtu.be', (url) => `[youtube]${url}[/youtube]`],
            ['twitch.tv', (url) => `[twitch]${url}[/twitch]`],
            ['reddit.com', (url) => `[reddit]${url}[/reddit]`],
            ['streamable.com', (url) => `[streamable]${url}[/streamable]`],
            ['soundcloud.com', (url) => `[soundcloud]${url}[/soundcloud]`],
            ['vimeo.com', (url) => `[vimeo]${url}[/vimeo]`],
            ['tiktok.com', (url) => `[tiktok]${url}[/tiktok]`],
            ['tumblr.com', (url) => `[tumblr]${url}[/tumblr]`],
            ['instagram.com', (url) => `[instagram]${url}[/instagram]`],
            ['vocaroo.com', (url) => `[vocaroo]${url}[/vocaroo]`],
            ['spotify.com', (url) => `[spotify]${url}[/spotify]`],
            ['x.com', (url) => `[twitter]${url}[/twitter]`],
        ]);

        return text.replace(/(?:^|\n)\[url href="(https?:\/\/.*?)"\].*[/url]./g, (match, url) => {
            const domain = url.match(/:\/\/(www\.)?(.[^/]+)/)[2];
            if (domainSpecificMap.has(domain)) {
                const domainFunction = domainSpecificMap.get(domain);
                return `\n${domainFunction(url)}`;
            }
            return match; // Return the original match if no domain-specific replacement is found
        });
    }


    //? Code Stashing
    static #stashCodeBlocks(text) {
        const codeRegex = /(```[\s\S]*?```)|(`[^`]*`)/g;
        const codeBlocksMap = new Map();

        const newText = text.replace(codeRegex, (match) => {
            const uuid = 'xxxx-xxxx-xxxx-xxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16));
            // Remove backticks from the matched code block and store it in the map
            const codeContent = match.startsWith('```') ? match.slice(3, -3) : match.slice(1, -1);
            codeBlocksMap.set(uuid, codeContent);
            return uuid;
        });

        return [newText, codeBlocksMap];
    }

    static #restoreCodeBlocks(text, codeBlocksMap) {
        // Iterate over the map entries
        codeBlocksMap.forEach((code, uuid) => {
            const codeLines = code.split('\n');
            if (codeLines.length > 1 && codeLines[0].match(/^[\w]{0,36}$/)) {
                const language = codeLines.shift().trim();
                const restOfCode = codeLines.join('\n');
                const restoredCode = language
                    ? `[code language="${language}"]${restOfCode}[/code]`
                    : `[code]${restOfCode}[/code]`;
                text = text.replace(uuid, restoredCode);
            } else {
                // Directly restore the code block in the desired BBCode format
                const restoredCode = code.includes('\n') ? `[code]${code}[/code]` : `[code inline]${code}[/code]`;
                text = text.replace(uuid, restoredCode);
            }
        });

        return text;
    }
}

module.exports = { md2kbb };