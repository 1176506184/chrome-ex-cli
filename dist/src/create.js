"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAction = createAction;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
async function createAction(projectName) {
    const targetDir = path_1.default.resolve(process.cwd(), projectName);
    const templateDir = path_1.default.resolve(__dirname, '../templates/default');
    if (fs_extra_1.default.existsSync(targetDir)) {
        console.log(chalk_1.default.red(`\n❌ 目录 ${projectName} 已存在！`));
        return;
    }
    const answers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'version',
            message: '请输入项目版本号:',
            default: '1.0.0',
            validate: (val) => {
                if (/^\d+\.\d+\.\d+$/.test(val))
                    return true;
                return '请输入有效的版本号格式 (例如: 1.0.0)';
            }
        },
        {
            type: 'confirm',
            name: 'monitorApi',
            message: '是否开启接口监听？(开启可能导致部分网页功能失效)',
            default: false
        },
        {
            type: 'confirm',
            name: 'zipBundle',
            message: '是否开启自动压缩？',
            default: true
        }
    ]);
    console.log(chalk_1.default.cyan(`\n🚀 正在创建项目：${projectName}...`));
    try {
        await fs_extra_1.default.copy(templateDir, targetDir, {
            filter: (src) => {
                const relativePath = path_1.default.relative(templateDir, src);
                if (!!answers.monitorApi && relativePath.endsWith('proxy.ts'))
                    return false;
                return !relativePath.includes('node_modules') && !relativePath.includes('dist');
            }
        });
        const initPath = path_1.default.join(targetDir, 'src/scripts/init.ts');
        if (fs_extra_1.default.existsSync(initPath)) {
            let content = fs_extra_1.default.readFileSync(initPath, 'utf-8');
            if (answers.monitorApi) {
                console.log(chalk_1.default.gray('  已保留接口监听逻辑'));
            }
            else {
                content = content.replace(/chrome\.storage\.local\.get\('open'[\s\S]*?}\)\s*}\)/g, '// 接口监听已关闭');
                await fs_extra_1.default.writeFile(initPath, content);
            }
        }
        const viteConfigPath = path_1.default.join(targetDir, 'vite.config.ts');
        if (fs_extra_1.default.existsSync(viteConfigPath)) {
            let viteContent = fs_extra_1.default.readFileSync(viteConfigPath, 'utf-8');
            if (!answers.zipBundle) {
                viteContent = viteContent.replace(/,?\s*zipBundle\(\)/g, '');
                await fs_extra_1.default.writeFile(viteConfigPath, viteContent);
                console.log(chalk_1.default.gray('  已从 Vite 配置中移除 zipBundle 插件（自动打包模式不需要压缩）'));
            }
        }
        if (!answers.zipBundle) {
            const vitePath = path_1.default.join(targetDir, 'vite.config.ts');
            if (fs_extra_1.default.existsSync(vitePath)) {
                let content = fs_extra_1.default.readFileSync(vitePath, 'utf-8');
                content = content.replace(/,?\s*zipBundle\(\)/g, '');
                await fs_extra_1.default.writeFile(vitePath, content);
            }
            const utilsPath = path_1.default.join(targetDir, 'utils/index.ts');
            if (fs_extra_1.default.existsSync(utilsPath)) {
                let content = fs_extra_1.default.readFileSync(utilsPath, 'utf-8');
                content = content.replace(/import\s+archiver\s+from\s+['"]archiver['"];?\n?/g, '');
                const zipFunctionRegex = /export\s+const\s+zipBundle\s*=\s*\(\)\s*=>\s*\{[\s\S]*?\}\n?/g;
                content = content.replace(zipFunctionRegex, '');
                await fs_extra_1.default.writeFile(utilsPath, content);
            }
        }
        const pkgPath = path_1.default.join(targetDir, 'package.json');
        if (fs_extra_1.default.existsSync(pkgPath)) {
            const pkg = await fs_extra_1.default.readJson(pkgPath);
            const removeDevDep = (name) => pkg.devDependencies && delete pkg.devDependencies[name];
            const removeDep = (name) => pkg.dependencies && delete pkg.dependencies[name];
            if (!answers.monitorApi && pkg.dependencies) {
                removeDep('ajax-hook');
                removeDevDep('ajax-hook');
            }
            if (!answers.zipBundle) {
                removeDep('archiver');
                removeDevDep('archiver');
                removeDep('@types/archiver');
                removeDevDep('@types/archiver');
            }
            pkg.name = projectName;
            pkg.version = answers.version;
            await fs_extra_1.default.writeJson(pkgPath, pkg, { spaces: 2 });
        }
        console.log('--- 路径调试信息 ---');
        console.log('模板来源:', templateDir);
        console.log('生成目标:', targetDir);
        console.log('--------------------');
        console.log(chalk_1.default.green('\n✨ 项目创建成功！'));
        console.log('----------------------------');
        console.log(`  cd ${projectName}`);
        console.log(chalk_1.default.yellow('  npm install'));
        console.log(chalk_1.default.yellow('  npm run dev'));
        console.log('----------------------------\n');
    }
    catch (err) {
        console.error(chalk_1.default.red('\n❌ 创建失败：'), err);
    }
}
