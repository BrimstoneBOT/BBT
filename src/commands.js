const about = require('./commands/utility/about');
const clean = require('./commands/moderation/clean');
const help = require('./commands/utility/help');
const ping = require('./commands/utility/ping');
const eightball = require('./commands/fun/eightball');
const kiss = require('./commands/fun/kiss');
const snipe = require('./commands/fun/snipe');
const audit = require('./commands/moderation/audit');
const toggleFilter = require('./commands/moderation/toggleFilter');

module.exports = [
  about,
  clean,
  help,
  ping,
  eightball,
  kiss,
  snipe,
  audit,
  toggleFilter,
];