# daumenkino

a vuepress based presentation framework · [Demo](https://daumenkino.rash.codes)

`daumenkino` proxies to vuepress, so you can either use the setup described below, or use vuepress directly with
the theme package `vuepress-theme-daumenkino`.

## Usage

### Local development

Run these commands a directory for your presentation:

```
npm init
npm install vuepress@next vuepress-theme-daumenkino
mkdir .vuepress && echo "module.exports = {theme: 'daumenkino'}" > .vuepress/config.js
npx vuepress dev
```

Now create a `README.md` file and put your presentation content in there. You may want to look at the [vuepress example
presentation file](https://raw.githubusercontent.com/rashfael/daumenkino/master/docs/README.md) for inspiration.

The `npx vuepress dev` command will provide you with a server, making the presentation available locally. It will reload
the web page when it detects changes to the markdown file.


### Deployment

Once (or if) you want to move your presentation to a static website, run

```
npx vuepress build
```

The command output will tell you where the static pages are located, typically `.vuepress/dist`. If you copy this
directory to the web host of your choice, and point a server (like nginx, Apache, …) at it, it will provide your
presentation.
