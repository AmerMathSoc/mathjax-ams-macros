import {combineWithMathJax} from '../../node_modules/mathjax-full/mjs/components/global.js';
import {VERSION} from '../../node_modules/mathjax-full/mjs/components/version.js';

import * as module1 from '../../js/ams-macros.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[ams]/ams-macros', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  "ams-macros": module1
}});
