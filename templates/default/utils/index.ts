import {copySync} from 'fs-extra';
import {resolve} from "path";
import glob from 'fast-glob';
import path from "node:path";
import fs from 'fs';
import archiver from 'archiver';

const copyManifest = () => {
    return {
        name: 'copy-manifest',
        // 在构建结束时执行
        closeBundle() {
            const root = process.cwd();
            const manifestPath = resolve(root, 'manifest.json');
            const distPath = resolve(root, 'dist/manifest.json');
            copySync(manifestPath, distPath);
            console.log('\n✅ manifest.json copied to dist!');
        }
    };
};

// 获取 src/scripts 目录下所有的 .ts 或 .js 文件
const getScriptEntries = () => {
    const root = process.cwd();
    // 扫描 src/scripts 目录下的所有 ts/js 文件
    const files = glob.sync('src/scripts/**/*.{ts,js}', {cwd: root});

    const entries: Record<string, string> = {};

    files.forEach(file => {
        // file 示例: 'src/scripts/background.ts'

        // 1. 获取相对于 src 的路径 (注意这里改成了 src)
        // path.relative('src', 'src/scripts/background.ts') => 'scripts/background.ts'
        const relativePath = path.relative('src', file);

        // 2. 去掉文件后缀
        // 'scripts/background.ts' => 'scripts/background'
        const entryKey = relativePath.replace(/\.[^/.]+$/, "");

        // 3. 赋值给 entries
        // 结果: { "scripts/background": "绝对路径", "scripts/tools/helper": "..." }
        entries[entryKey] = resolve(root, file);
    });

    return entries;
};

const htmlPathFixer = () => {
    return {
        name: 'html-path-fixer',
        //@ts-ignore
        generateBundle(_, bundle) {
            for (const key in bundle) {
                // 如果发现路径里包含 src/，就把它删掉
                if (key.includes('src/')) {
                    bundle[key].fileName = key.replace('src/', '');
                }
            }
        }
    };
};

// --- 自定义 ZIP 打包插件 ---
const zipBundle = () => {
    return {
        name: 'zip-bundle',
        // closeBundle 钩子在打包完全结束并关闭文件流后触发
        async closeBundle() {
            // 只有在生产环境（build模式）下执行
            if (process.env.NODE_ENV !== 'production') return;
            const root = process.cwd();
            const distPath = resolve(root, 'dist');
            const manifestPath = resolve(root, 'manifest.json');
            // 1. 读取 manifest.json 获取版本号
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            const version = manifest.version || '0.0.1';
            const fileName = `chromeEx_v${version}.zip`;
            const outPath = resolve(root, fileName);

            // 2. 创建文件输出流
            const output = fs.createWriteStream(outPath);
            const archive = archiver('zip', {zlib: {level: 9}});

            console.log(`\n🚀 准备生成压缩包: ${fileName}...`);

            output.on('close', () => {
                const size = (archive.pointer() / 1024 / 1024).toFixed(2);
                console.log(`✅ 压缩完成! 总大小: ${size} MB`);
                console.log(`📂 路径: ${outPath}\n`);
            });

            archive.on('error', (err) => {
                throw err;
            });

            archive.pipe(output);
            // 3. 将整个 dist 文件夹内容加入压缩包
            archive.directory(distPath, false);
            await archive.finalize();
        }
    };
};

export {copyManifest, getScriptEntries, htmlPathFixer, zipBundle}