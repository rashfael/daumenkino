# daumenkino

a vuepress based presentation framework · [Demo](https://daumenkino.rash.codes)

`daumenkino` uses `vuepress` to generate static pages. It does this by providing a vuepress theme: `vuepress-theme-daumenkino`.

Right now the only way to use `daumenkino` is to use `vuepress` directly.
If you are interested in a more streamlined method, drop a :+1: on [issue #5](../../issues/5).

## Usage

### Local development

Run these commands a directory for your presentation:

```
npm init
npm install vuepress@next vuepress-theme-daumenkino
mkdir .vuepress && echo "module.exports = {theme: 'daumenkino'}" > .vuepress/config.js
npx vuepress dev
```

This will install `vuepress` and the daumenkino theme and configure vuepress to use the daumenkino theme.

Now create a `index.md` file and put your presentation content in there. You may want to look at the [vuepress example
presentation file](https://raw.githubusercontent.com/rashfael/daumenkino/master/docs/index.md) for inspiration.

The `npx vuepress dev` command will provide you with a server, making the presentation available locally. It will reload
the web page when it detects changes to the markdown file.

You can also create multiple markdown files and directories, for more information see the [vuepress docs](https://v1.vuepress.vuejs.org/)


### Deployment

Once (or if) you want to move your presentation to a static website, run

```
npx vuepress build
```

The command output will tell you where the static pages are located, typically `.vuepress/dist`. If you copy this
directory to the web host of your choice, and point a server (like nginx, Apache, …) at it, it will provide your
presentation.

If you want to host your presentation on github pages you'll need to set `base` to the repository name in `.vuepress/config.js` ([see vuepress docs](https://v1.vuepress.vuejs.org/config/#base)).
