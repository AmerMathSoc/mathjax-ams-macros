# mathjax-ams-macros

MathJax extension to provide MathJax macros for AMS production.

## MathJax Extension: `ams-macros.js`

This extension implements several TeX macros and environments used in AMS production.

These are re-implementations of macros in existing TeX packages, often in a simplified form.

This extension is meant to become obsolete over time by spawning dedicated extensions (e.g. [mathjax-unicode-math](https://github.com/AmerMathSoc/mathjax-unicode-math), [mathjax-dbnsymb](https://github.com/AmerMathSoc/mathjax-dbnsymb)).

## Using NodeJS

For example, install `@mathjax/src` and `@amermathsoc/mathjax-ams-macros` and use something like

```js
import { TeX } from '@mathjax/src/js/input/tex.js';
import { configuration as ams-macros } from 'mathjax-ams-macros';
const tex = new TeX({
    packages: [ams-macros.name]
});
```

## Using a browser

For client-side use, you need load `browser/ams-macros.js`, e.g., from a CDN.

Follow the instructions from the MathJax documentation on [loading a third-party extensions](http://docs.mathjax.org/en/latest/web/webpack.html#loading-the-extension), e.g.,

```js
MathJax = {
    loader: {
        load: ['[ams-macros]/ams-macros.js'],
        paths: {ams-macros: 'https://cdn.jsdelivr.net/npm/@amermathsoc/mathjax-ams-macros@5/browser'}
    },
    tex: {
        packages: {'[+]': ['ams-macros']}
    }
};
```
