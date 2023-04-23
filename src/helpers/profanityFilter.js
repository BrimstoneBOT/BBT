const badWordsList = require('../data/profanityWords.json');

class ProfanityFilter {
  constructor() {
    this.badWords = badWordsList;
  }

  hasProfanity(text) {
    const words = text.split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");

      if (this.badWords.includes(word)) {
        return true;
      }
    }

    return false;
  }
}

module.exports = ProfanityFilter;
