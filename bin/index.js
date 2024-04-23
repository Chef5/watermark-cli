#!/usr/bin/env node
const { description, version } = require("../package.json");
const { Command } = require("commander");

// const prompt = require("./prompt");
// const configCommand = require("./command/config");
const { watermark } = require("./watermark");

const log = console.log;
const program = new Command();

program
  .name("watermark")
  .usage("[command]")
  .description(`${description}`)
  .helpOption("-h, --help", "show help")
  .addHelpCommand("help [command]", "show help")
  .version(version, "-V,--version", "show version");

program
  .command("add", { isDefault: true })
  .description("add watermark")
  .option("-t, --text <char>", "watermark text", "watermark-cli")
  .option("-s, --size <char>", "fontsize", "30")
  .option("-c, --color <char>", "color", "#000000")
  .option("-d, --deg <char>", "deg", "45")
  .option("-o, --output <char>", "output dir", "watermark")
  .action(async (options) => {
    const { text, size, color, deg, output } = options;
    const config = {
      id: new Date().getTime(),
      watermark: text || "watermark-cli",
      fontSize: size || 30,
      color: color || "#000000",
      deg: deg || 45,
      output: output || "watermark",
    };
    await watermark(config);
  });

// 解析用户执行命令传入的参数
program.parse(process.argv);
