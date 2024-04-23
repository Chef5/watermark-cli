const { createCanvas, Image } = require("canvas");
const fs = require("fs");
const path = require("path");

// 需要匹配的图片文件后缀
const imageExtensions = /\.(bmp|png|gif|jpe?g)$/i;

const canvasTextAutoLine = (str, ctx, initX, initY, lineHeight) => {
  let lineWidth = 0;
  const canvasWidth = 260;
  let lastSubStrIndex = 0;
  const maxLineHeight = 30;
  const srcY = initY;
  for (let i = 0; i < str.length; i++) {
    lineWidth += ctx.measureText(str[i]).width;
    if (lineWidth > canvasWidth) {
      //减去initX,防止边界出现的问题
      ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
      initY += lineHeight;
      lineWidth = 0;
      lastSubStrIndex = i;
    }
    if (i == str.length - 1) {
      ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
    }
  }
};

const getImageFiles = () => {
  const files = fs.readdirSync("./");
  return files.filter((file) => imageExtensions.test(path.extname(file)));
};

const addWaterMark = async (filePath, config) => {
  return new Promise((resolved, rejected) => {
    const img = new Image();
    img.onload = () => {
      try {
        const opt = {
          ...config,
          width: img.width,
          height: img.height,
          image: img,
        };
        const canvas = createCanvas(opt.width, opt.height);
        const ctx = canvas.getContext("2d");
        canvas.width = opt.width;
        canvas.height = opt.height;
        ctx.drawImage(opt.image, 0, 0, opt.width, opt.height);
        ctx.font = `${opt.fontSize}px "Microsoft YaHei blod", sans-serif`;
        ctx.strokeStyle = opt.color;
        ctx.fillStyle = opt.color;
        ctx.strokeWidth = "2px";
        const cc = Math.floor(
          Math.sqrt(opt.width * opt.width + opt.height * opt.height)
        );
        const cellh = 180; //每行间隔
        const cellw = 280 + 20; //每一个的宽度；
        const cn = Math.ceil(cc / cellw),
          tn = Math.ceil(opt.height / cellh);
        ctx.rotate(Math.PI / (180 / opt.deg)); //图片旋转xx度
        ctx.globalAlpha = 10 / 100; //透明度
        const maxWidth = 100;
        for (let i = 0; i < tn; i++) {
          ctx.save();
          ctx.beginPath();
          //const my = cellh * i + 20; //起始位置y方向
          //const mx = Math.floor(Math.random() * 100); //0-100位置 随机;
          const my = 0; //起始位置y方向
          const mx = 0; //0-100位置 随机;
          // const mx=0;
          ctx.translate(-mx, 0); //向左移动。。
          for (let j = 0; j < cn; j++) {
            //ctx.strokeText(text, j * tw, 0);
            //ctx.fillText(text, mx + j * cellw, i * cellh);
            //ctx.strokeText(text, mx + j * cellw, -i * cellh);
            const x = mx + j * cellw;
            const y = i * cellh; // +20;
            const yy = -i * cellh - 180;
            //console.log(y+"-----------");
            canvasTextAutoLine(opt.watermark, ctx, x, y, opt.fontSize * 1.4);
            canvasTextAutoLine(opt.watermark, ctx, x, yy, opt.fontSize * 1.4);
          }
          ctx.closePath();
          ctx.restore();
        }
        const buffer = canvas.toBuffer("image/png");
        resolved(buffer);
      } catch (error) {
        rejected(error);
      }
    };
    img.onerror = (error) => {
      rejected(error);
    };
    img.src = filePath;
  });
};

const watermark = async (config) => {
  const files = getImageFiles();
  if (files.length === 0) {
    console.log("There is no image in the current directory");
    return;
  }
  const results = await Promise.all(
    files.map(
      async (file) => await addWaterMark(file, { ...config, name: file })
    )
  );
  if (!fs.existsSync(config.output)) {
    try {
      fs.mkdirSync(config.output, { recursive: true });
    } catch (error) {
      throw error;
    }
  }
  results.forEach((buffer, index) => {
    fs.writeFileSync(`${config.output}/${files[index]}`, buffer);
  });
  console.log("Success");
};

module.exports = {
  watermark,
};
