#!/usr/bin/env node
import {Command} from 'commander';
import {createAction} from '@/create';
// 注意：这里读取 package.json 是为了获取 CLI 的版本号
import pkg from '../package.json';

const program = new Command();

program
    .name('chrome-ex')
    .description('现代化的 Chrome 扩展开发工具')
    .version(pkg.version);

program
    .command('create <project-name>') // <project-name> 是必填参数
    .description('从模板创建一个新的 Chrome 插件项目')
    .action((projectName) => {
        // 调用具体的创建逻辑
        createAction(projectName).then();
    });

// 解析命令行参数
program.parse(process.argv);