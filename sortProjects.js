const { Project, SyntaxKind } = require("ts-morph");

const project = new Project();
project.addSourceFileAtPath("src/data/portfolio.ts");
const sourceFile = project.getSourceFileOrThrow("src/data/portfolio.ts");

const objects = ["portfolioDataID", "portfolioDataEN"];

objects.forEach(objName => {
  const objDeclaration = sourceFile.getVariableDeclarationOrThrow(objName);
  const objLiteral = objDeclaration.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  const projectsProp = objLiteral.getPropertyOrThrow("projects");
  const projectsArray = projectsProp.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
  
  const elements = projectsArray.getElements();
  
  const parsedElements = elements.map(el => {
    const obj = el.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    const idProp = obj.getPropertyOrThrow("id");
    const idVal = idProp.getInitializerIfKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue();
    const yearProp = obj.getPropertyOrThrow("year");
    const yearVal = yearProp.getInitializerIfKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue();
    
    return {
      node: el,
      text: el.getText(),
      id: idVal,
      year: parseInt(yearVal, 10),
      originalIndex: elements.indexOf(el)
    };
  });
  
  // Update wantutri-ai year to 2026 and category to Array
  parsedElements.forEach(pe => {
    if (pe.id === "wantutri-ai") {
      pe.year = 2026;
      pe.text = pe.text.replace(/year:\s*["']2025["']/, 'year: "2026"');
      pe.text = pe.text.replace(/category:\s*["']Data & AI Solution["']/, 'category: ["Data & AI Solution", "Web Development"]');
    }
  });
  
  // Sort by year descending. If same year, keep original order (stable sort)
  // multitask-plant-disease and wantutri-ai will both be 2026.
  parsedElements.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return a.originalIndex - b.originalIndex;
  });
  
  // Replace the elements in the array
  const newArrayText = `[\n${parsedElements.map(pe => pe.text).join(",\n    ")}\n  ]`;
  projectsProp.setInitializer(newArrayText);
});

sourceFile.saveSync();
console.log("Done sorting projects!");
