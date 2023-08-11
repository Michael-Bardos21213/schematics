import { chain } from '@angular-devkit/schematics';
import { execSync } from 'child_process';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { join } from 'path';
export function createOpshubSchematic(options) {
    return chain([
        (tree, context) => {
            const projectName = options.name;
            const workspacePath = `C:/users/Public/${projectName}`;
            // Create React workspace using create-react-app
            execSync(`npx create-react-app ${workspacePath}`);
            // Navigate into the newly created workspace directory
            process.chdir(workspacePath);
            // Copy the file to the src folder
            const srcPath = join('src', projectName);
            const filePath = options['file-path'];
            const fileContents = tree.read(filePath);
            if (fileContents) {
                tree.create(join(srcPath, 'enquiry-screen.ts'), fileContents);
            }
            // Update the package.json file to include package versions
            const packageJsonPath = 'package.json';
            const packageJsonBuffer = tree.read(packageJsonPath);
            if (packageJsonBuffer) {
                const packageJson = JSON.parse(packageJsonBuffer.toString());
                packageJson.dependencies = {
                    ...packageJson.dependencies,
                    axios: '^0.21.4',
                    '@mui/material': '^5.0.0'
                };
                tree.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));
            }
            // Install required packages using NodePackageInstallTask
            context.addTask(new NodePackageInstallTask());
            return tree;
        }
    ]);
}
