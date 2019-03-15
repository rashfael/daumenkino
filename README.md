# daumenkino
a vuepress based presentation framework

## Usage

### local install in a new folder
```
npm init
npm install vuepress@next vuepress-theme-daumenkino
mkdir .vuepress && echo "module.exports = {theme: 'daumenkino'}" > .vuepress/config.js
npx vuepress dev
...
npx vuepress build
```

`daumenkino` just proxies to vuepress, you can also use vuepress yourself with `vuepress-theme-daumenkino`
