const assert = require('assert');
const { parse } = require('../lib/parser');

console.log('Running verbose parser tests...');

const xml = `<?xml version="1.0"?>
<players>
  <player>
    <id>76561198000000000</id>
    <name><![CDATA[MyPlayer]]></name>
    <avatar><![CDATA[https://avatars.example/00.jpg]]></avatar>
  </player>
  <player>
    <id>76561198000000001</id>
    <name>Other</name>
    <avatar>https://avatars.example/01.jpg</avatar>
  </player>
</players>`;

// Default parsing (no collapse)
const outDefault = parse(xml, { explicitArray: false, mergeAttrs: true, typeCast: true });
console.log('\nDefault parse output:\n', JSON.stringify(outDefault, null, 2));

// With collapseTextNodes
const outCollapsed = parse(xml, { explicitArray: false, mergeAttrs: true, typeCast: true, collapseTextNodes: true });
console.log('\nCollapsed parse output:\n', JSON.stringify(outCollapsed, null, 2));

// Assertions
try
{
    // default: name is an object/#children or an array depending on settings
    const firstDefaultPlayer = (outDefault.players && outDefault.players.player && outDefault.players.player[0]) || null;
    assert(firstDefaultPlayer, 'first player (default) present');

    // collapsed: name should be a plain string (under players.player[0].name[0])
    const firstCollapsedPlayer = (outCollapsed.players && outCollapsed.players.player && outCollapsed.players.player[0]) || null;
    assert(firstCollapsedPlayer, 'first player (collapsed) present');
    assert.strictEqual(typeof firstCollapsedPlayer.name[0], 'string', 'collapsed name is string');
    assert.strictEqual(firstCollapsedPlayer.name[0], 'MyPlayer');
    assert.strictEqual(firstCollapsedPlayer.avatar[0], 'https://avatars.example/00.jpg');

    console.log('\nVerbose tests passed');
} catch (err)
{
    console.error('Verbose tests failed:', err && err.message ? err.message : err);
    process.exit(2);
}
