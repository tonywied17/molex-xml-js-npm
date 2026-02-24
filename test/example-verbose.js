const fs = require('fs');
const { parse } = require('../lib/parser');

const xml = `<?xml version="1.0"?>
<server>
  <name>Test Server</name>
  <admin>
    <steamID>76561198000000000</steamID>
    <name><![CDATA[AdminUser]]></name>
    <avatar>https://avatars.example/00.jpg</avatar>
  </admin>
</server>`;

console.log('Example (no collapse):');
const out1 = parse(xml, { explicitArray: false });
console.log(JSON.stringify(out1, null, 2));

console.log('\nExample (collapseTextNodes: true):');
const out2 = parse(xml, { explicitArray: false, collapseTextNodes: true });
console.log(JSON.stringify(out2, null, 2));

// Write outputs for manual inspection
fs.writeFileSync('example-verbose-default.json', JSON.stringify(out1, null, 2));
fs.writeFileSync('example-verbose-collapsed.json', JSON.stringify(out2, null, 2));

console.log('\nWrote example-verbose-default.json and example-verbose-collapsed.json');
