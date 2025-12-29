#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const create_1 = require("../src/create");
const package_json_1 = __importDefault(require("../package.json"));
const program = new commander_1.Command();
program
    .name('chrome-ex')
    .description('现代化的 Chrome 扩展开发工具')
    .version(package_json_1.default.version);
program
    .command('create <project-name>')
    .description('从模板创建一个新的 Chrome 插件项目')
    .action((projectName) => {
    (0, create_1.createAction)(projectName).then();
});
program.parse(process.argv);
