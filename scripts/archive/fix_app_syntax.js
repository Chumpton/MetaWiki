const fs = require('fs');

let code = fs.readFileSync('app.js', 'utf8');

// Fix line 534 extra });
code = code.replace('        });\n      }\n    }\n  });\n  }', '        });\n      }\n    }\n  }');

fs.writeFileSync('app.js', code, 'utf-8');
console.log('Fixed extra }); in app.js');
