import type { CanvasState } from "@/lib/projects";
import type { BlockId, BlockPropsMap, HeroProps, StatsProps, WorkflowProps, CtaProps, FormProps } from "@/app/dashboard/projects/block-config";

export type ExportFormat = "html" | "react" | "nextjs";

export type ExportResult = {
  files: ExportFile[];
  format: ExportFormat;
};

export type ExportFile = {
  path: string;
  content: string;
};

/**
 * Main export function that generates code from canvas state
 */
export function exportCanvasToCode(
  canvasState: CanvasState,
  format: ExportFormat = "html",
  projectName: string = "My Project"
): ExportResult {
  switch (format) {
    case "html":
      return exportToStaticHTML(canvasState, projectName);
    case "react":
      return exportToReact(canvasState, projectName);
    case "nextjs":
      return exportToNextJS(canvasState, projectName);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Export to static HTML/CSS
 */
function exportToStaticHTML(canvasState: CanvasState, projectName: string): ExportResult {
  const blocksHTML = canvasState.blocks
    .map((block) => generateBlockHTML(block.blockId as BlockId, (block.props ?? {}) as BlockPropsMap[BlockId]))
    .join("\n\n");

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(projectName)}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
${indent(blocksHTML, 4)}
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = generateCSS();
  const js = generateJS();

  return {
    format: "html",
    files: [
      { path: "index.html", content: html },
      { path: "styles.css", content: css },
      { path: "script.js", content: js },
      { path: "README.md", content: generateReadme(projectName, "html") },
    ],
  };
}

/**
 * Export to React components
 */
function exportToReact(canvasState: CanvasState, projectName: string): ExportResult {
  const components = canvasState.blocks
    .map((block, index) => {
      const componentName = `${capitalize(block.blockId)}Block${index + 1}`;
      return generateReactComponent(block.blockId as BlockId, (block.props ?? {}) as BlockPropsMap[BlockId], componentName);
    });

  const appComponent = `import React from 'react';
import './App.css';
${components.map((c) => `import ${c.name} from './components/${c.name}';`).join("\n")}

function App() {
  return (
    <div className="container">
${components.map((c) => `      <${c.name} />`).join("\n")}
    </div>
  );
}

export default App;`;

  const componentFiles = components.map((c) => ({
    path: `src/components/${c.name}.tsx`,
    content: c.code,
  }));

  return {
    format: "react",
    files: [
      { path: "src/App.tsx", content: appComponent },
      { path: "src/index.tsx", content: generateReactIndex() },
      ...componentFiles,
      { path: "src/App.css", content: generateCSS() },
      { path: "public/index.html", content: generateReactHTML(projectName) },
      { path: "package.json", content: generateReactPackageJson(projectName) },
      { path: "tsconfig.json", content: generateReactTSConfig() },
      { path: ".gitignore", content: generateGitignore() },
      { path: "README.md", content: generateReadme(projectName, "react") },
    ],
  };
}

/**
 * Export to Next.js project
 */
function exportToNextJS(canvasState: CanvasState, projectName: string): ExportResult {
  const components = canvasState.blocks
    .map((block, index) => {
      const componentName = `${capitalize(block.blockId)}Block${index + 1}`;
      return generateReactComponent(block.blockId as BlockId, (block.props ?? {}) as BlockPropsMap[BlockId], componentName);
    });

  const pageComponent = `import React from 'react';
${components.map((c) => `import ${c.name} from '../components/${c.name}';`).join("\n")}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 p-8">
      <div className="mx-auto max-w-7xl space-y-6">
${components.map((c) => `        <${c.name} />`).join("\n")}
      </div>
    </main>
  );
}`;

  const componentFiles = components.map((c) => ({
    path: `src/components/${c.name}.tsx`,
    content: c.code,
  }));

  const uiComponents = generateUIComponents();

  return {
    format: "nextjs",
    files: [
      { path: "src/app/page.tsx", content: pageComponent },
      ...componentFiles,
      ...uiComponents,
      { path: "src/lib/utils.ts", content: generateUtilsFile() },
      { path: "src/app/globals.css", content: generateCSS() },
      { path: "src/app/layout.tsx", content: generateNextJSLayout(projectName) },
      { path: "tailwind.config.ts", content: generateTailwindConfig() },
      { path: "postcss.config.mjs", content: generatePostCSSConfig() },
      { path: "package.json", content: generateNextJSPackageJson(projectName) },
      { path: "next.config.js", content: generateNextConfig() },
      { path: "tsconfig.json", content: generateTSConfig() },
      { path: ".gitignore", content: generateGitignore() },
      { path: "README.md", content: generateReadme(projectName, "nextjs") },
    ],
  };
}

/**
 * Generate HTML for a specific block
 */
function generateBlockHTML(blockId: BlockId, props: BlockPropsMap[BlockId]): string {
  switch (blockId) {
    case "hero":
      return generateHeroHTML(props as HeroProps);
    case "stats":
      return generateStatsHTML(props as StatsProps);
    case "workflow":
      return generateWorkflowHTML(props as WorkflowProps);
    case "cta":
      return generateCtaHTML(props as CtaProps);
    case "form":
      return generateFormHTML(props as FormProps);
    default:
      return `<!-- Unknown block type: ${blockId} -->`;
  }
}

function generateHeroHTML(props: HeroProps): string {
  return `<section class="hero-block">
  <div class="badge">${escapeHTML(props.badge)}</div>
  <h1 class="hero-title">${escapeHTML(props.title)}</h1>
  <p class="hero-description">${escapeHTML(props.description)}</p>
  <div class="hero-actions">
    <button class="btn btn-primary">${escapeHTML(props.primaryLabel)}</button>
    <button class="btn btn-secondary">${escapeHTML(props.secondaryLabel)}</button>
  </div>
</section>`;
}

function generateStatsHTML(props: StatsProps): string {
  const metricsHTML = props.metrics
    .map(
      (metric) => `    <div class="stat-card">
      <div class="stat-label">${escapeHTML(metric.label)}</div>
      <div class="stat-value">${escapeHTML(metric.value)}</div>
      <div class="stat-detail">${escapeHTML(metric.detail)}</div>
    </div>`
    )
    .join("\n");

  return `<section class="stats-block">
  <div class="stats-grid">
${metricsHTML}
  </div>
</section>`;
}

function generateWorkflowHTML(props: WorkflowProps): string {
  const stagesHTML = props.stages
    .map(
      (stage) => `    <div class="workflow-stage" data-stage-id="${escapeHTML(stage.id)}">
      <h3 class="stage-title">${escapeHTML(stage.title)}</h3>
      <p class="stage-description">${escapeHTML(stage.description)}</p>
      <div class="stage-tags">
${stage.tags.map((tag) => `        <span class="tag">${escapeHTML(tag)}</span>`).join("\n")}
      </div>
    </div>`
    )
    .join("\n");

  const tabsHTML = props.stages
    .map((stage, index) => `      <button class="tab${index === 0 ? " active" : ""}" data-tab="${escapeHTML(stage.id)}">${escapeHTML(stage.label)}</button>`)
    .join("\n");

  return `<section class="workflow-block">
  <div class="tabs">
${tabsHTML}
  </div>
  <div class="workflow-stages">
${stagesHTML}
  </div>
</section>`;
}

function generateCtaHTML(props: CtaProps): string {
  return `<section class="cta-block">
  <div class="badge badge-blue">${escapeHTML(props.badge)}</div>
  <h2 class="cta-title">${escapeHTML(props.title)}</h2>
  <p class="cta-description">${escapeHTML(props.description)}</p>
  <div class="cta-actions">
    <button class="btn btn-primary">${escapeHTML(props.primaryLabel)}</button>
    <button class="btn btn-secondary">${escapeHTML(props.secondaryLabel)}</button>
  </div>
</section>`;
}

function generateFormHTML(props: FormProps): string {
  return `<section class="form-block">
  <h2 class="form-title">${escapeHTML(props.title)}</h2>
  <p class="form-description">${escapeHTML(props.description)}</p>
  <form class="feedback-form">
    <div class="form-field">
      <label for="email">${escapeHTML(props.emailLabel)}</label>
      <input type="email" id="email" name="email" placeholder="team@yourcompany.com" required>
    </div>
    <div class="form-field">
      <label for="comment">${escapeHTML(props.commentLabel)}</label>
      <textarea id="comment" name="comment" rows="4" placeholder="Опишите, что нужно проверить или собрать."></textarea>
    </div>
    <button type="submit" class="btn btn-primary">${escapeHTML(props.submitLabel)}</button>
  </form>
</section>`;
}

/**
 * Generate React component for a block
 */
function generateReactComponent(
  blockId: BlockId,
  props: BlockPropsMap[BlockId],
  componentName: string
): { name: string; code: string } {
  let jsx = "";

  switch (blockId) {
    case "hero":
      jsx = generateHeroReact(props as HeroProps);
      break;
    case "stats":
      jsx = generateStatsReact(props as StatsProps);
      break;
    case "workflow":
      jsx = generateWorkflowReact(props as WorkflowProps);
      break;
    case "cta":
      jsx = generateCtaReact(props as CtaProps);
      break;
    case "form":
      jsx = generateFormReact(props as FormProps);
      break;
  }

  const code = `import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ${componentName}() {
  return (
${indent(jsx, 4)}
  );
}`;

  return { name: componentName, code };
}

function generateHeroReact(props: HeroProps): string {
  return `<Card className="border-emerald-500/20 bg-slate-950/80">
  <CardHeader className="gap-2">
    <Badge className="w-fit border border-emerald-500/40 bg-emerald-500/10 text-emerald-200">
      ${escapeHTML(props.badge)}
    </Badge>
    <CardTitle className="text-2xl text-white">${escapeHTML(props.title)}</CardTitle>
    <CardDescription className="max-w-2xl text-base text-slate-300">
      ${escapeHTML(props.description)}
    </CardDescription>
  </CardHeader>
  <CardContent className="flex flex-wrap items-center gap-3">
    <Button className="bg-emerald-500 text-slate-950 hover:bg-emerald-400">
      ${escapeHTML(props.primaryLabel)}
    </Button>
    <Button variant="ghost" className="text-slate-200 hover:text-white">
      ${escapeHTML(props.secondaryLabel)}
    </Button>
  </CardContent>
</Card>`;
}

function generateStatsReact(props: StatsProps): string {
  return `<div className="grid gap-3 md:grid-cols-3">
  {${JSON.stringify(props.metrics)}.map((metric, index) => (
    <Card key={index} className="border-slate-800/60 bg-slate-950/75">
      <CardHeader className="space-y-1">
        <CardDescription className="text-xs uppercase tracking-wide text-slate-400">
          {metric.label}
        </CardDescription>
        <CardTitle className="text-3xl text-white">{metric.value}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-400">{metric.detail}</CardContent>
    </Card>
  ))}
</div>`;
}

function generateWorkflowReact(props: WorkflowProps): string {
  const stages = props.stages;
  const initialStageId = stages[0]?.id ?? "stage-0";
  return `<Tabs defaultValue="${initialStageId}" className="w-full">
  <TabsList>
    {${JSON.stringify(stages)}.map((stage) => (
      <TabsTrigger key={stage.id} value={stage.id}>
        {stage.label}
      </TabsTrigger>
    ))}
  </TabsList>
  {${JSON.stringify(stages)}.map((stage) => (
    <TabsContent key={stage.id} value={stage.id}>
      <div className="space-y-3 text-slate-300">
        <h3 className="text-xl font-semibold text-white">{stage.title}</h3>
        <p>{stage.description}</p>
        <Separator className="border-slate-800/60" />
        <div className="flex flex-wrap gap-2">
          {stage.tags.map((tag, tagIndex) => (
            <Badge key={tagIndex} className="border border-slate-700 bg-slate-800/70 text-slate-200">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </TabsContent>
  ))}
</Tabs>`;
}

function generateCtaReact(props: CtaProps): string {
  return `<Card className="border-blue-500/30 bg-slate-950/75">
  <CardHeader className="space-y-2">
    <Badge className="w-fit border border-blue-400/40 bg-blue-500/10 text-blue-200">
      ${escapeHTML(props.badge)}
    </Badge>
    <CardTitle className="text-2xl text-white">${escapeHTML(props.title)}</CardTitle>
    <CardDescription className="text-base text-slate-300">
      ${escapeHTML(props.description)}
    </CardDescription>
  </CardHeader>
  <CardContent className="flex items-center gap-3">
    <Button className="bg-blue-500 text-white hover:bg-blue-400">
      ${escapeHTML(props.primaryLabel)}
    </Button>
    <Button variant="ghost" className="text-slate-200 hover:text-white">
      ${escapeHTML(props.secondaryLabel)}
    </Button>
  </CardContent>
</Card>`;
}

function generateFormReact(props: FormProps): string {
  return `<Card className="border-slate-800/60 bg-slate-950/80">
  <CardHeader>
    <CardTitle className="text-white">${escapeHTML(props.title)}</CardTitle>
    <CardDescription className="text-slate-400">${escapeHTML(props.description)}</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <Label className="text-slate-200">${escapeHTML(props.emailLabel)}</Label>
      <Input placeholder="team@yourcompany.com" className="border-slate-800 bg-slate-950 text-white" />
    </div>
    <div className="space-y-2">
      <Label className="text-slate-200">${escapeHTML(props.commentLabel)}</Label>
      <textarea
        placeholder="Опишите, что нужно проверить или собрать."
        className="min-h-[96px] w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
      />
    </div>
    <Button className="bg-emerald-500 text-slate-950 hover:bg-emerald-400">
      ${escapeHTML(props.submitLabel)}
    </Button>
  </CardContent>
</Card>`;
}

/**
 * Generate CSS styles
 */
function generateCSS(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    --card: 222 47% 11%;
    --card-foreground: 210 40% 98%;
    --popover: 222 47% 15%;
    --popover-foreground: 210 40% 98%;
    --primary: 142 76% 36%;
    --primary-foreground: 222 47% 11%;
    --secondary: 217 91% 60%;
    --secondary-foreground: 222 47% 11%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 98%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 142 76% 36%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}`;
}

/**
 * Generate minimal JavaScript
 */
function generateJS(): string {
  return `// WebFlow Studio - Generated Code
// Add your custom interactions here

// Example: Tab switching for workflow blocks
document.addEventListener('DOMContentLoaded', () => {
  const workflowBlocks = document.querySelectorAll('.workflow-block');

  workflowBlocks.forEach(block => {
    const tabs = block.querySelectorAll('.tab');
    const stages = block.querySelectorAll('.workflow-stage');

    // Initially show only the first stage
    stages.forEach((stage, index) => {
      stage.style.display = index === 0 ? 'block' : 'none';
    });

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        // Hide all stages
        stages.forEach(s => s.style.display = 'none');
        // Show corresponding stage
        if (stages[index]) {
          stages[index].style.display = 'block';
        }
      });
    });
  });

  console.log('WebFlow Studio - Page loaded successfully');
});`;
}

/**
 * Generate package.json for React project
 */
function generateReactPackageJson(projectName: string): string {
  return JSON.stringify(
    {
      name: slugify(projectName),
      version: "0.1.0",
      private: true,
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "react-scripts": "^5.0.1",
      },
      devDependencies: {
        typescript: "^5.0.0",
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
      },
      scripts: {
        start: "react-scripts start",
        build: "react-scripts build",
        test: "react-scripts test",
        eject: "react-scripts eject",
      },
      browserslist: {
        production: [">0.2%", "not dead", "not op_mini all"],
        development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"],
      },
    },
    null,
    2
  );
}

/**
 * Generate package.json for Next.js project
 */
function generateNextJSPackageJson(projectName: string): string {
  return JSON.stringify(
    {
      name: slugify(projectName),
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        next: "^14.0.0",
        "@radix-ui/react-tabs": "^1.0.4",
        "@radix-ui/react-separator": "^1.0.3",
        "@radix-ui/react-label": "^2.0.2",
      },
      devDependencies: {
        typescript: "^5.0.0",
        "@types/node": "^20.0.0",
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        tailwindcss: "^3.4.0",
        autoprefixer: "^10.4.16",
        postcss: "^8.4.32",
      },
    },
    null,
    2
  );
}

/**
 * Generate README file
 */
function generateReadme(projectName: string, format: ExportFormat): string {
  const formatName = format === "html" ? "Static HTML" : format === "react" ? "React" : "Next.js";

  let instructions = "";
  if (format === "html") {
    instructions = `## How to Use

1. Open \`index.html\` in your web browser
2. Edit the HTML, CSS, and JS files as needed
3. Deploy to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)`;
  } else if (format === "react") {
    instructions = `## How to Use

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`

3. Build for production:
   \`\`\`bash
   npm run build
   \`\`\``;
  } else {
    instructions = `## How to Use

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Build for production:
   \`\`\`bash
   npm run build
   \`\`\``;
  }

  return `# ${projectName}

Exported from **WebFlow Studio** as ${formatName} project.

${instructions}

## Project Structure

${
  format === "html"
    ? `- \`index.html\` - Main HTML file
- \`styles.css\` - Stylesheet
- \`script.js\` - JavaScript interactions`
    : format === "react"
    ? `- \`src/App.tsx\` - Main app component
- \`src/components/\` - Individual block components
- \`src/App.css\` - Stylesheet`
    : `- \`src/app/page.tsx\` - Home page
- \`src/components/\` - Individual block components
- \`src/app/globals.css\` - Global styles`
}

## Generated by WebFlow Studio

This project was generated by [WebFlow Studio](https://github.com/yourusername/webflowstudio) - a visual website builder with code export.

---

Made with WebFlow Studio by Biveki`;
}

/**
 * Generate Next.js layout component
 */
function generateNextJSLayout(projectName: string): string {
  return `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${projectName}',
  description: 'Generated by WebFlow Studio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}`;
}

/**
 * Generate next.config.js
 */
function generateNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;`;
}

/**
 * Generate tsconfig.json
 */
function generateTSConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [
          {
            name: "next",
          },
        ],
        paths: {
          "@/*": ["./src/*"],
        },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2
  );
}

/**
 * Generate .gitignore
 */
function generateGitignore(): string {
  return `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts`;
}

/**
 * Generate React index.tsx
 */
function generateReactIndex(): string {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
}

/**
 * Generate React HTML template
 */
function generateReactHTML(projectName: string): string {
  return `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Generated by WebFlow Studio"
    />
    <title>${escapeHTML(projectName)}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;
}

/**
 * Generate React tsconfig.json
 */
function generateReactTSConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noFallthroughCasesInSwitch: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
      },
      include: ["src"],
    },
    null,
    2
  );
}

/**
 * Generate UI components for shadcn/ui
 */
function generateUIComponents(): ExportFile[] {
  return [
    {
      path: "src/components/ui/card.tsx",
      content: `import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
`,
    },
    {
      path: "src/components/ui/button.tsx",
      content: `import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
          variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
          variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          "h-10 px-4 py-2",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
`,
    },
    {
      path: "src/components/ui/badge.tsx",
      content: `import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

function Badge({ className, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
`,
    },
    {
      path: "src/components/ui/tabs.tsx",
      content: `"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
`,
    },
    {
      path: "src/components/ui/separator.tsx",
      content: `"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
`,
    },
    {
      path: "src/components/ui/label.tsx",
      content: `"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
`,
    },
    {
      path: "src/components/ui/input.tsx",
      content: `import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
`,
    },
  ];
}

/**
 * Generate utils.ts file
 */
function generateUtilsFile(): string {
  return `export function cn(
  ...inputs: Array<string | false | null | undefined | Record<string, boolean>>
) {
  const classes: string[] = [];

  inputs.forEach((input) => {
    if (!input) return;

    if (typeof input === "string") {
      classes.push(input);
      return;
    }

    if (typeof input === "object") {
      Object.entries(input).forEach(([key, value]) => {
        if (value) classes.push(key);
      });
    }
  });

  return classes.join(" ");
}
`;
}

/**
 * Generate Tailwind config
 */
function generateTailwindConfig(): string {
  return `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
`;
}

/**
 * Generate PostCSS config
 */
function generatePostCSSConfig(): string {
  return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
}

/**
 * Utility functions
 */
function escapeHTML(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

function indent(text: string, spaces: number): string {
  const indentation = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.trim() ? indentation + line : line))
    .join("\n");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
