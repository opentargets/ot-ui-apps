import inquirer from "inquirer";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";

const PACKAGES_DIR = path.join(process.cwd(), "packages");

interface PackageAnswers {
  name: string;
  description: string;
  type: "ui" | "util" | "config" | "section";
  typescript: boolean;
  testing: boolean;
}

async function createPackage() {
  const answers = await inquirer.prompt<PackageAnswers>([
    {
      type: "input",
      name: "name",
      message: "Package name (without @open-targets/):",
      validate: input => input.length > 0,
    },
    {
      type: "input",
      name: "description",
      message: "Package description:",
    },
    {
      type: "list",
      name: "type",
      message: "Package type:",
      choices: ["ui", "util", "config", "section"],
    },
    {
      type: "confirm",
      name: "typescript",
      message: "Use TypeScript?",
      default: true,
    },
    {
      type: "confirm",
      name: "testing",
      message: "Include testing setup?",
      default: true,
    },
  ]);

  const packageDir = path.join(PACKAGES_DIR, answers.name);

  // Create package directory
  await fs.ensureDir(packageDir);

  // Create package.json
  const packageJson = {
    name: `@open-targets/${answers.name}`,
    version: "0.0.0",
    private: true,
    description: answers.description,
    main: answers.typescript ? "dist/index.js" : "src/index.js",
    types: answers.typescript ? "dist/index.d.ts" : undefined,
    scripts: {
      build: answers.typescript ? "tsc" : 'echo "No build step"',
      dev: answers.typescript ? "tsc --watch" : 'echo "No watch step"',
      ...(answers.testing ? { test: "jest" } : {}),
    },
    dependencies: {
      "@open-targets/config": "workspace:*", // Use workspace protocol for yarn
    },
    devDependencies: {
      ...(answers.typescript
        ? {
            typescript: "^5.0.0",
            "@types/node": "^18.0.0",
          }
        : {}),
      ...(answers.testing
        ? {
            jest: "^29.0.0",
            "@types/jest": "^29.0.0",
          }
        : {}),
    },
  };

  await fs.writeJSON(path.join(packageDir, "package.json"), packageJson, { spaces: 2 });

  // Create tsconfig.json if using TypeScript
  if (answers.typescript) {
    const tsConfig = {
      extends: "@open-targets/config/typescript-preset.json",
      compilerOptions: {
        outDir: "./dist",
        rootDir: "./src",
      },
      include: ["src"],
      exclude: ["node_modules", "dist", "**/*.test.ts"],
    };
    await fs.writeJSON(path.join(packageDir, "tsconfig.json"), tsConfig, { spaces: 2 });
  }

  // Create source directory and index file
  const srcDir = path.join(packageDir, "src");
  await fs.ensureDir(srcDir);
  await fs.writeFile(
    path.join(srcDir, `index.${answers.typescript ? "ts" : "js"}`),
    `// Add your code here\n`
  );

  // Create test setup if requested
  if (answers.testing) {
    const testDir = path.join(packageDir, "__tests__");
    await fs.ensureDir(testDir);
    await fs.writeFile(
      path.join(testDir, `index.test.${answers.typescript ? "ts" : "js"}`),
      `describe('${answers.name}', () => {\n  it('should work', () => {\n    expect(true).toBeTruthy();\n  });\n});\n`
    );
  }

  // Update root turbo.json if needed
  const turboConfigPath = path.join(process.cwd(), "turbo.json");
  if (await fs.pathExists(turboConfigPath)) {
    const turboConfig = await fs.readJSON(turboConfigPath);
    turboConfig.pipeline[`@open-targets/${answers.name}#build`] = {
      dependsOn: ["^build"],
    };
    await fs.writeJSON(turboConfigPath, turboConfig, { spaces: 2 });
  }

  console.log(chalk.green(`\n✨ Package @open-targets/${answers.name} created successfully!\n`));
  console.log("Next steps:");
  console.log(`1. cd packages/${answers.name}`);
  console.log("2. Add your package code in src/");
  console.log('3. Run "yarn install" in the root directory');
  console.log('4. Run "yarn build" to build all packages\n');
}

createPackage().catch(console.error);
