import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const scanRoot = join(root, 'src');
const allowedFiles = new Set([
  'src/config/theme.ts',
  'src/styles/antd.css',
  'src/styles/colors.css',
  'src/styles/effects.css',
  'src/styles/index.css',
  'src/styles/tokens.css',
  'src/styles/typography.css',
  'src/styles/utilities.css',
]);
const allowedPathPrefixes = [
  'src/styles/antd/',
];
const allowedExtensions = new Set(['.ts', '.vue', '.css']);
const problems = [];

const colorUtilityPrefixes = [
  'accent',
  'bg',
  'border',
  'caret',
  'decoration',
  'divide',
  'fill',
  'from',
  'outline',
  'ring',
  'shadow',
  'stroke',
  'text',
  'to',
  'via',
];
const rawTailwindColors = [
  'amber',
  'black',
  'blue',
  'cyan',
  'emerald',
  'fuchsia',
  'gray',
  'green',
  'indigo',
  'lime',
  'neutral',
  'orange',
  'pink',
  'purple',
  'red',
  'rose',
  'sky',
  'slate',
  'stone',
  'teal',
  'violet',
  'white',
  'yellow',
  'zinc',
];
const tokenVariablePrefixes = [
  'Brand',
  'Error',
  'Font',
  'Gray',
  'Purple',
  'Success',
  'Warning',
  'Wh',
  'White',
  'bg',
  'brand',
  'but',
  'color',
  'component',
  'error',
  'font',
  'purple',
  'success',
  'td',
  'warning',
  'white',
];
const colorCssProperties = [
  'background',
  'background-color',
  'background-image',
  'border',
  'border-bottom',
  'border-bottom-color',
  'border-color',
  'border-left',
  'border-left-color',
  'border-right',
  'border-right-color',
  'border-top',
  'border-top-color',
  'caret-color',
  'color',
  'fill',
  'outline',
  'outline-color',
  'scrollbar-color',
  'stroke',
  'text-decoration',
  'text-decoration-color',
];

const colorUtilityPrefixPattern = colorUtilityPrefixes.join('|');
const rawTailwindColorPattern = new RegExp(`\\b(?:${colorUtilityPrefixPattern})-(?:${rawTailwindColors.join('|')})(?:-|\\b)`);
const arbitraryColorUtilityPattern = new RegExp(`\\b(?:${colorUtilityPrefixPattern})-\\[[^\\]]*(?:#|rgba?\\(|hsla?\\(|var\\()`, 'i');
const tokenVariablePrefixPattern = tokenVariablePrefixes.join('|');
const tokenVariableUtilityPattern = new RegExp(`\\b(?:${colorUtilityPrefixPattern})-\\(--(?:${tokenVariablePrefixPattern})-`);
const directTypographyTokenPattern = /(?:^|[;{\s])(?:font-size|line-height)\s*:\s*var\(--font-size/;
const directColorTokenPropertyPattern = new RegExp(
  `(?:^|[;{\\s])(?:${colorCssProperties.join('|')})\\s*:\\s*[^;]*var\\(--(?:${tokenVariablePrefixPattern})-`,
);
const directShadowTokenPropertyPattern = /(?:^|[;{\s])box-shadow\s*:\s*[^;]*var\(--td-shadow-/;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }

    const relativePath = relative(root, fullPath);
    const extension = relativePath.slice(relativePath.lastIndexOf('.'));
    if (
      !allowedExtensions.has(extension)
      || allowedFiles.has(relativePath)
      || allowedPathPrefixes.some((prefix) => relativePath.startsWith(prefix))
    ) {
      continue;
    }

    const source = readFileSync(fullPath, 'utf8');
    const lines = source.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const colorLiteralPattern = /#[0-9A-Fa-f]{3,8}\b|rgba?\(|hsla?\(/;
      const inlineStylePattern = /(?:^|\s)(?::style|style)\s*=|v-bind:style\s*=/;

      if (colorLiteralPattern.test(line)) {
        problems.push(`${relativePath}:${lineNumber} 存在原始颜色值，请使用 src/styles 中定义的语义颜色 token。`);
      }
      if (inlineStylePattern.test(line)) {
        problems.push(`${relativePath}:${lineNumber} 存在 inline style，请改用 class 与 scoped style。`);
      }
      if (rawTailwindColorPattern.test(line)) {
        problems.push(`${relativePath}:${lineNumber} 存在 Tailwind 原生颜色工具类，请使用项目语义颜色类。`);
      }
      if (arbitraryColorUtilityPattern.test(line)) {
        problems.push(`${relativePath}:${lineNumber} 存在 Tailwind 任意颜色值工具类，请改用项目语义颜色类。`);
      }
      if (tokenVariableUtilityPattern.test(line)) {
        problems.push(`${relativePath}:${lineNumber} 存在直接引用 CSS 变量的 Tailwind 工具类，请改用项目语义 token 类，例如 text-font-black-gy2 / bg-container / border-component-border。`);
      }
      if (directTypographyTokenPattern.test(line)) {
        problems.push(`${relativePath}:${lineNumber} 存在直接声明字号或行高 token，请改用语义字号类，例如 text-body-medium / text-body-small / text-title-small。`);
      }
      if (directColorTokenPropertyPattern.test(line)) {
        problems.push(`${relativePath}:${lineNumber} 存在直接声明颜色 token，请改用语义颜色类，例如 text-font-black-gy1 / text-brand-blue / bg-warning-light。`);
      }
      if (directShadowTokenPropertyPattern.test(line)) {
        problems.push(`${relativePath}:${lineNumber} 存在直接声明阴影 token，请改用语义阴影类，例如 shadow-td-shadow-0 / shadow-td-shadow-5。`);
      }
    });
  }
}

walk(scanRoot);

if (problems.length > 0) {
  console.error('设计 token 使用检查失败：');
  problems.forEach((problem) => console.error(`- ${problem}`));
  process.exit(1);
}

console.log('设计 token 使用检查通过。');
