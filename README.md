# molex-xml

[![npm version](https://img.shields.io/npm/v/molex-xml.svg)](https://www.npmjs.com/package/molex-xml)
[![npm downloads](https://img.shields.io/npm/dm/molex-xml.svg)](https://www.npmjs.com/package/molex-xml)
[![GitHub](https://img.shields.io/badge/GitHub-molex--xml-blue.svg)](https://github.com/tonywied17/molex-xml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)

> Zero-dependency XML parser and builder with preserved order, CDATA & comment support, attribute merging, and optional type-casting. Designed as a drop-in friendly alternative to `xml2js`.

## Features

- **Zero dependencies** — Pure Node.js implementation
- **xml2js-compatible API** — `parseString` + `Builder` for easy migration
- **Preserves child order & mixed content** — `#children` preserves interleaved text and elements
- **CDATA and comments** — Parses and emits CDATA sections and comments
- **Attribute merging** — Attributes are available under the `$` key
- **Optional basic type-casting** — Numbers and booleans can be auto-cast

## Installation

```bash
npm install molex-xml
```

## Quick Start

```javascript
const { parseString, Builder } = require('molex-xml');

const xml = `<?xml version="1.0"?>
<note importance="high" logged="true">
  <!-- a comment -->
  <to>My Dad</to>
  <from>molex</from>
  <heading><![CDATA[Reminder <with> brackets]]></heading>
  <body>Don't forget me this weekend!</body>
</note>`;

parseString(xml, { explicitArray: false }, (err, result) => {
  if (err) throw err;
  console.log(result);

  const builder = new Builder({ headless: false });
  const built = builder.buildObject(result);
  console.log(built);
});
```

## Options

- `explicitArray` (boolean, default: `true`) — when `false` single-element arrays are collapsed
- `mergeAttrs` (boolean, default: `true`) — when `true` attributes are placed under `$`
- `typeCast` (boolean, default: `true`) — enable basic casting of booleans/numbers for text and attributes
- `headless` (Builder option) — omit `<?xml ...?>` prolog when building

`typeCast` can also be an options object with fine-grained control:

- `parseJSON` (boolean, default: `true`) — attempt to parse JSON objects/arrays
- `parseDates` (boolean, default: `true`) — attempt ISO-8601 date parsing into `Date`
- `coerceNull` (boolean, default: `true`) — convert the string `null` to `null` value

### New: `collapseTextNodes` (boolean, default: `false`)

- `collapseTextNodes` (boolean, default: `false`) — when `true`, elements that contain only a single text or CDATA child and have no attributes will be returned as a plain string instead of an object. This option is opt-in to preserve backwards compatibility with code that expects the full object shape.

Example where `collapseTextNodes` is useful:

```xml
<player>
  <id>76561198000000000</id>
  <name><![CDATA[MyName]]></name>
  <avatar>https://avatars.example/00.jpg</avatar>
</player>
```

With default options the parsed shape for `<name>` is an object that preserves children/mixed content. With `collapseTextNodes: true` the parser will return `name: "MyName"` and `avatar: "https://..."`, which is convenient when your application expects string values for simple elements.

Use it like this:

```javascript
const { parse } = require('molex-xml');
const out = parse(xml, { explicitArray: false, collapseTextNodes: true });
// out.player.name === 'MyName'
```

Example enabling granular casting:

```javascript
parseString(xml, { typeCast: { parseJSON: true, parseDates: false } }, (err, out) => {});
```

## API

### `parseString(xml, [opts], cb)`

Parse XML using callback style. `opts` accepts the options listed above.

Callback signature: `cb(err, result)`.

### `parse(xml, opts)`

Synchronously parse and return the object.

### `new Builder(opts).buildObject(obj)`

Build XML from an object previously produced by `parse`/`parseString`. `opts.headless` controls the prolog.

The parser preserves ordered/mixed children in `#children` arrays. Element attributes are stored under `$`.


## File layout

The implementation uses a small `lib/` layout so internals are easy to maintain:

- `lib/parser.js` — synchronous parsing entrypoints `parse` and `parseString`
- `lib/builder.js` — `Builder` class for serializing objects back to XML
- `lib/utils.js` — helper functions and the `typeCast` implementation
- `index.js` — lightweight exporter re-exporting the public API

## Example

See `test/example.js` for a runnable example that parses and rebuilds XML, including CDATA and comments.

## Tests

Run the included basic tests with:

```bash
node test/test.js
```

Verbose tests and examples:

```bash
node test/test-verbose.js
node test/example-verbose.js
```

## Repository

https://github.com/tonywied17/molex-xml

## License

MIT
