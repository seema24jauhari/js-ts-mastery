function analyzeHoisting(sourceCode) {
    // Remove comments
    let code = sourceCode
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');

    // Remove string literals
    code = code
        .replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '');

    const lines = code.split('\n');

    const declarations = new Map();
    const warnings = [];

    // Pass 1: collect var declarations
    lines.forEach((line, index) => {
        const matches = [...line.matchAll(/\bvar\s+([a-zA-Z_$][\w$]*)/g)];

        for (const match of matches) {
            declarations.set(match[1], index + 1);
        }
    });

    // Pass 2: find usages before declaration
    lines.forEach((line, index) => {
        const lineNo = index + 1;

        for (const [name, declLine] of declarations) {
            const usageRegex = new RegExp(`\\b${name}\\b`, 'g');

            if (
                usageRegex.test(line) &&
                !new RegExp(`\\bvar\\s+${name}\\b`).test(line) &&
                lineNo < declLine
            ) {
                warnings.push({
                    variable: name,
                    usedAt: lineNo,
                    declaredAt: declLine
                });
            }
        }
    });

    // return warnings;
}


const source = `
console.log(a);
console.log(b);

var a = 10;

var b = 20;

console.log(a);
`;

console.log(analyzeHoisting(source));


var i=0

console.log(i++, i+4,i--)