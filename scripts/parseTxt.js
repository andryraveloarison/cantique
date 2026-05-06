import fs from 'fs';
import path from 'path';

const categoryMap = {
  "FFPM 1": "louange",
  "FFPM 3": "louange",
  "FFPM 5": "confiance",
  "FFPM 9": "louange",
  "FFPM 10": "louange",
  "FFPM 50": "louange",
  "FFPM 58": "noel",
  "FFPM 75": "noel",
  "FFPM 141": "paques",
  "FFPM 146": "paques",
  "FFPM 252": "combat",
  "FFPM 440": "confiance",
  "FFPM 469": "enfants",
  "FFPM 480": "assurance",
  "FFPM 500": "combat",
  "FFPM 617": "confiance"
};

async function parse() {
  const txtPath = path.resolve('./cantiques_ffpm.txt');
  const text = fs.readFileSync(txtPath, 'utf8');
  
  // Clean up text
  // Replace weird page break characters and multiple newlines
  const cleanedText = text.replace(/\f/g, '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n');
  
  const hymnsMatches = cleanedText.split(/(?=FFPM \d+)/g);
  
  const hymns = [];
  let idCounter = 1;
  
  for (const match of hymnsMatches) {
    if (!match.trim().startsWith('FFPM')) continue;
    
    // Extract FFPM number
    const firstLineEnd = match.indexOf('\n');
    if (firstLineEnd === -1) continue;
    
    let number = match.substring(0, firstLineEnd).trim();
    let content = match.substring(firstLineEnd).trim();
    
    if (!number.match(/^FFPM \d+$/)) {
      // In case there is extra text on the line
      const matchNum = number.match(/^(FFPM \d+)/);
      if (matchNum) {
        content = number.substring(matchNum[0].length) + '\n' + content;
        number = matchNum[1];
      } else {
        continue;
      }
    }
    
    // Split into Refrain and Verses
    // A refrain is often denoted by "Refrain" or "Refrain :"
    let refrain = "";
    
    const refrainMatch = content.match(/Refrain\s*:?([\s\S]*?)(?=(?:\n\d+[\-\.]|\n$|$))/);
    if (refrainMatch) {
      refrain = refrainMatch[1].trim();
      // Remove refrain text from content to parse verses easier
      content = content.replace(refrainMatch[0], '');
    }
    
    // Extract verses
    const verseRegex = /(?:^|\n)\s*(\d+)[\-\.]\s*([\s\S]*?)(?=(?:\n\s*\d+[\-\.]\s*|$))/g;
    const verses = [];
    let title = "";
    
    let vMatch;
    while ((vMatch = verseRegex.exec(content)) !== null) {
      const vNum = parseInt(vMatch[1], 10);
      let vText = vMatch[2].trim();
      
      if (verses.length === 0) {
        // Title is the first line of the first verse
        const firstNewline = vText.indexOf('\n');
        if (firstNewline !== -1) {
          title = vText.substring(0, firstNewline).trim();
        } else {
          title = vText;
        }
      }
      
      verses.push({
        num: vNum,
        text: vText
      });
    }
    
    if (verses.length > 0) {
      const category = categoryMap[number] || "louange";
      
      hymns.push({
        id: idCounter++,
        number,
        title,
        verses,
        ...(refrain ? { refrain } : {}),
        category
      });
    }
  }
  
  const outPath = path.resolve('./src/data/hymns.json');
  fs.writeFileSync(outPath, JSON.stringify(hymns, null, 2));
  console.log(`Parsed ${hymns.length} hymns and saved to src/data/hymns.json`);
}

parse().catch(console.error);
