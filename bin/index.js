#!/usr/bin/env node
const { description, version } = require("../package.json");
const { Command } = require("commander");
const { watermark } = require("./watermark");

const defaultConfig = {
  watermark: "Watermark Test",
  fontSize: 30,
  color: "#000000",
  deg: 45,
  alpha: 10,
  output: "watermark",
};

const program = new Command();

program
  .name("watermark")
  .description(`${description}`)
  .helpOption("-h, --help", "show help")
  .option("-t, --text <char>", "watermark text", defaultConfig.watermark)
  .option("-s, --size <number>", "fontsize", defaultConfig.fontSize)
  .option("-c, --color <char>", "color", defaultConfig.color)
  .option("-d, --deg <number>", "deg", defaultConfig.deg)
  .option("-a, --alpha <number>", "alpha: 0-100", defaultConfig.alpha)
  .option("-o, --output <char>", "output dir", defaultConfig.output)
  .action(async (options) => {
    const { text, size, color, deg, alpha, output } = options;
    const config = {
      id: new Date().getTime(),
      watermark: text,
      fontSize: size,
      color: color,
      deg: deg,
      alpha: alpha,
      output: output,
    };
    await watermark(config);
  })
  .addHelpText("before", `watermark-cli v${version}\n`)
  .addHelpText(
    "after",
    `\nExamples: 
  watermark --text 'Your watermark text' --size 30 --color red --output watermark`
  )
  .version(version, "-V, --version", "show version");

// 解析用户执行命令传入的参数
program.parse(process.argv);
