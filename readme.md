# watermark-cli

Quickly add text watermarks to local images.

```sh
watermark -t "The Hulk ~ ~" -c red -s 32 -a 25
```

![examples](https://img.cdn.1zdz.cn/github/readme/watermark-cli-example.png)

## Install

```sh
npm install -g watermark-cli
```

## Usage

```sh
watermark --text 'Your watermark text'
```

## Options

```sh
  -t, --text <char>    watermark text (default: "Watermark Test")
  -s, --size <char>    fontsize (default: 30)
  -c, --color <char>   color (default: "#000000")
  -d, --deg <char>     deg (default: 45)
  -a, --alpha <char>   alpha: 0-100 (default: 10)
  -o, --output <char>  output dir (default: "watermark")
  -V, --version        show version
  -h, --help           show help
```

## License

[MIT](./LICENSE)
