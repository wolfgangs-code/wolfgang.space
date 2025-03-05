//
//! kbb2md.js
//? Converts Markdown to KnockoutBB
//  Welcome to Regex Replace heaven.
//? By Wolfgang de Groot
//? Version 2.1.0 (2024-09-28-d)
//      * Expect {class}.convert
//  MIT License
//

class kbb2md {
    /**
    * Converts KnockoutBB text to markdown.
    *
    * @param {string} knockoutBBText - The Markdown text to be converted.
    * @returns {string} The converted KnockoutBB text.
    */
    static convert(knockoutBBText) {
        let [draft, codeBlocks] = stashCodeBlocks(knockoutBBText);

        draft = this.#convertFirstPass(draft);
        draft = this.#convertHeadings(draft);
        draft = this.#convertQuotes(draft);
        draft = this.#convertLists(draft);
        draft = this.#convertImages(draft);
        draft = this.#convertDomainSpecificSyntax(draft);

        return restoreCodeBlocks(draft, codeBlocks);
    }

    static #convertFirstPass(text) {
        // Convert bold, italic, underline, strikethrough, and spoilers
        text = text
            .replace(/\[b\](.*?)\[\/b\]/g, '**$1**')
            .replace(/\[i\](.*?)\[\/i\]/g, '*$1*')
            .replace(/\[u\](.*?)\[\/u\]/g, '__$1__')
            .replace(/\[s\](.*?)\[\/s\]/g, '~~$1~~')
            .replace(/\[spoiler\](.*?)\[\/spoiler\]/g, '||$1||');
        return text;
    }

    static #convertHeadings(text) {
        // Convert headings
        text = text
            .replace(/\[h1\](.*?)\[\/h1\]/g, '\n# $1')
            .replace(/\[h2\](.*?)\[\/h2\]/g, '\n## $1')
            .replace(/\[h3\](.*?)\[\/h3\]/g, '\n### $1')
            .replace(/\[h4\](.*?)\[\/h4\]/g, '\n#### $1')
            .replace(/\[h5\](.*?)\[\/h5\]/g, '\n##### $1')
            .replace(/\[h6\](.*?)\[\/h6\]/g, '\n###### $1');
        return text;
    }

    static #convertQuotes(text) {
        // Convert quotes and blockquotes
        text = text
            .replace(/\[quote\](.*?)\[\/quote\]/g, '> $1')
            .replace(/\[blockquote\](.*?)\[\/blockquote\]/g, '>> $1');
        return text;
    }

    static #convertImages(text) {
        // Convert image URLs with and without thumbnail
        text = text.replace(/\[img thumb\](.*?)\[\/img\]/g, '![thumbnail]($1)');
        text = text.replace(/\[img\](.*?)\[\/img\]/g, '![no thumbnail]($1)');
        return text;
    }

    static #convertLists(text) {
        function processListItems(items, depth = 0) {
            return items.map(item => {
                const prefix = '  '.repeat(depth) + (item.isOrdered ? `${item.index}. ` : '- ');
                let result = prefix + item.content;
                if (item.children.length > 0) {
                    result += '\n' + processListItems(item.children, depth + 1);
                }
                return result;
            }).join('\n');
        }

        function parseList(text, isOrdered = false, depth = 0) {
            const listRegex = new RegExp(`(\\[li\\](.*?)\\[\\/li\\])(?:\\n\\[${isOrdered ? 'ol' : 'ul'}\\]\\n([\\s\\S]*?)\\n\\[\\/${isOrdered ? 'ol' : 'ul'}\\]\\n)?`, 'g');
            let match;
            let items = [];
            let lastIndex = 0;

            while ((match = listRegex.exec(text)) !== null) {
                const [fullMatch, itemMatch, content, subList] = match;
                let children = [];
                if (subList) {
                    children = parseList(subList, isOrdered, depth + 1);
                }
                items.push({ content, children, isOrdered, index: items.length + 1 });
                lastIndex = match.index + fullMatch.length;
            }

            return items;
        }

        // Replace unordered lists
        text = text.replace(/\[ul\]\n([\s\S]*?)\n\[\/ul\]/g, (match, listContent) => {
            const items = parseList(listContent);
            return processListItems(items);
        });

        // Replace ordered lists
        text = text.replace(/\[ol\]\n([\s\S]*?)\n\[\/ol\]/g, (match, listContent) => {
            const items = parseList(listContent, true);
            return processListItems(items);
        });

        return text;
    }


    static #convertDomainSpecificSyntax(text) {
        // Convert standard and domain-specific URLs
        text = text.replace(/\[url href="(.*?)"\](.*?)\[\/url\]/g, '[$2]($1)');
        text = text.replace(/\[(twitter|youtube|twitch|reddit|streamable|soundcloud|vimeo|tiktok|tumblr|instagram|vocaroo|spotify|mastodon)\](.*?)\[\/\1\]/g, '[$1]($2)');
        return text;
    }

    static #stashCodeBlocks(text) {
        // Stash code blocks during conversion
        const codeBlocksMap = new Map();
        text = text.replace(/\[code( inline)?\](.*?)\[\/code\]/gs, (match, inline, code) => {
            const uuid = `code-${Math.random().toString(16).slice(2, 10)}`;
            // Trim newlines from the code content
            code = code.trim();
            codeBlocksMap.set(uuid, inline ? `\`${code}\`` : `\`\`\`\n${code}\n\`\`\``);
            return uuid;
        });
        return [text, codeBlocksMap];
    }


    static #restoreCodeBlocks(text, codeBlocksMap) {
        // Restore code blocks after conversion
        codeBlocksMap.forEach((code, uuid) => {
            text = text.replace(new RegExp(uuid, 'g'), code);
        });
        return text;
    }

    /**
     * Converts KnockoutBB text to Markdown.
     *
     * @param {string} knockoutBBText - The KnockoutBB text to be converted.
     * @returns {string} The converted Markdown text.
     */
    static convert(knockoutBBText) {
        let [draft, codeBlocks] = this.#stashCodeBlocks(knockoutBBText);

        draft = this.#convertFirstPass(draft);
        draft = this.#convertHeadings(draft);
        draft = this.#convertQuotes(draft);
        draft = this.#convertLists(draft);
        draft = this.#convertImages(draft);
        draft = this.#convertDomainSpecificSyntax(draft);

        return this.#restoreCodeBlocks(draft, codeBlocks);
    }
}

module.exports = { kbb2md };