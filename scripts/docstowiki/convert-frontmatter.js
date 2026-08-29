const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function convertFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: body } = matter(content);

    if (Object.keys(data).length === 0) {
      return;
    }

    const yamlLines = Object.entries(data).map(
      ([key, value]) => `${key}: ${JSON.stringify(value)}`
    );

    const htmlComment = `<!--\n${yamlLines.join('\n')}\n-->\n`;
    const newContent = htmlComment + body;

    fs.writeFileSync(filePath, newContent, 'utf8');

    console.log(`Converted: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    process.exitCode = 1;
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath, {
    withFileTypes: true,
  });

  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);

    if (file.isDirectory()) {
      processDirectory(fullPath);
      continue;
    }

    if (file.name.endsWith('.md')) {
      convertFile(fullPath);
    }
  }
}

if (fs.existsSync('./docs')) {
  processDirectory('./docs');
}

if (fs.existsSync('./README.md')) {
  convertFile('./README.md');
}