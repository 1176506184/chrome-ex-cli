import path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import chalk from 'chalk';

export async function createAction(projectName: string) {
    // 1. 确定目标路径（用户当前执行命令的目录 + 项目名）
    const targetDir = path.resolve(process.cwd(), projectName);

    // 2. 确定模板路径（CLI 源码下的 templates/default）
    // 注意：__dirname 在打包后可能指向 dist 目录，需要根据实际结构调整路径
    const templateDir = path.resolve(__dirname, '../templates/default');

    // 3. 检查目录是否已存在
    if (fs.existsSync(targetDir)) {
        console.log(chalk.red(`\n❌ 目录 ${projectName} 已存在！`));
        return;
    }

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'version',
            message: '请输入项目版本号:',
            default: '1.0.0',
            validate: (val) => {
                // 简单的版本号正则校验 (x.x.x)
                if (/^\d+\.\d+\.\d+$/.test(val)) return true;
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

    console.log(chalk.cyan(`\n🚀 正在创建项目：${projectName}...`));

    try {
        // 4. 复制模板文件夹
        // fs-extra 的 copy 会自动递归复制所有文件
        await fs.copy(templateDir, targetDir, {
            filter: (src) => {
                const relativePath = path.relative(templateDir, src);
                // 如果不开启监听，proxy.js 根本不需要复制过去
                if (!!answers.monitorApi && relativePath.endsWith('proxy.ts')) return false;

                return !relativePath.includes('node_modules') && !relativePath.includes('dist');
            }
        });

        // 3. 修改 init.ts 内部的代码
        const initPath = path.join(targetDir, 'src/scripts/init.ts');
        if (fs.existsSync(initPath)) {
            let content = fs.readFileSync(initPath, 'utf-8');
            if (answers.monitorApi) {
                // 保持原样，或者去掉注释占位符
                console.log(chalk.gray('  已保留接口监听逻辑'));
            } else {
                // 使用正则把那段 chrome.storage.local.get 的代码删掉
                // 或者简单粗暴地用占位符替换
                content = content.replace(/chrome\.storage\.local\.get\('open'[\s\S]*?}\)\s*}\)/g, '// 接口监听已关闭');
                await fs.writeFile(initPath, content);
            }
        }

        const viteConfigPath = path.join(targetDir, 'vite.config.ts');
        if (fs.existsSync(viteConfigPath)) {
            let viteContent = fs.readFileSync(viteConfigPath, 'utf-8');
            // 如果用户开启了自动打包（Watch 模式），我们通常希望去掉 zipBundle 插件
            // 这样在开发期间每次保存代码，不会浪费时间去生成 zip 包
            if (!answers.zipBundle) {
                // 使用正则移除 zipBundle() 及其前后的逗号（如果存在）
                // 匹配 plugins 数组里的 zipBundle()
                viteContent = viteContent.replace(/,?\s*zipBundle\(\)/g, '');
                await fs.writeFile(viteConfigPath, viteContent);
                console.log(chalk.gray('  已从 Vite 配置中移除 zipBundle 插件（自动打包模式不需要压缩）'));
            }
        }

        // --- 3. 处理自动打包相关的清理工作 (如果开启自动打包) ---
        if (!answers.zipBundle) {
            // A. 修改 vite.config.ts：移除 zipBundle() 调用
            const vitePath = path.join(targetDir, 'vite.config.ts');
            if (fs.existsSync(vitePath)) {
                let content = fs.readFileSync(vitePath, 'utf-8');
                content = content.replace(/,?\s*zipBundle\(\)/g, '');
                await fs.writeFile(vitePath, content);
            }

            // B. 修改 utils/index.ts：移除 import 和 zipBundle 函数定义
            const utilsPath = path.join(targetDir, 'utils/index.ts');
            if (fs.existsSync(utilsPath)) {
                let content = fs.readFileSync(utilsPath, 'utf-8');
                // 移除 archiver 的导入
                content = content.replace(/import\s+archiver\s+from\s+['"]archiver['"];?\n?/g, '');
                // 移除整个 zipBundle 函数定义 (假设函数名为 zipBundle)
                // 这里建议在模板中使用特定的注释标记以便更精准地删除
                const zipFunctionRegex = /export\s+const\s+zipBundle\s*=\s*\(\)\s*=>\s*\{[\s\S]*?\}\n?/g;
                content = content.replace(zipFunctionRegex, '');
                await fs.writeFile(utilsPath, content);
            }
        }


        // 5. 动态修改生成的 package.json
        const pkgPath = path.join(targetDir, 'package.json');
        if (fs.existsSync(pkgPath)) {
            const pkg = await fs.readJson(pkgPath);
            const removeDevDep = (name: string) => pkg.devDependencies && delete pkg.devDependencies[name];
            const removeDep = (name: string) => pkg.dependencies && delete pkg.dependencies[name];
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
            pkg.name = projectName; // 修改为用户输入的项目名
            pkg.version = answers.version;
            await fs.writeJson(pkgPath, pkg, {spaces: 2});
        }

        // --- 关键调试代码 ---
        console.log('--- 路径调试信息 ---');
        console.log('模板来源:', templateDir);
        console.log('生成目标:', targetDir);
        console.log('--------------------');

        // 6. 成功提示
        console.log(chalk.green('\n✨ 项目创建成功！'));
        console.log('----------------------------');
        console.log(`  cd ${projectName}`);
        console.log(chalk.yellow('  npm install'));
        console.log(chalk.yellow('  npm run dev'));
        console.log('----------------------------\n');

    } catch (err) {
        console.error(chalk.red('\n❌ 创建失败：'), err);
    }
}