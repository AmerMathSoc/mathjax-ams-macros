/*!
 *  Copyright (c) 2020 American Mathematical Society
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import NodeUtil from 'mathjax-full/js/input/tex/NodeUtil.js';
import { Configuration } from 'mathjax-full/js/input/tex/Configuration.js';
import { CommandMap, DelimiterMap } from 'mathjax-full/js/input/tex/SymbolMap.js';
import { TexConstant } from 'mathjax-full/js/input/tex/TexConstants.js';
import ParseMethods from 'mathjax-full/js/input/tex/ParseMethods.js';
import BaseMethods from 'mathjax-full/js/input/tex/base/BaseMethods.js';
let AmsMacrosMethods = {};
AmsMacrosMethods.accentset = function (parser, name) {
    const accent = parser.ParseArg(name);
    const expression = parser.ParseArg(name);
    if (accent.isKind('mo'))
        NodeUtil.setAttribute(accent, 'accent', true);
    NodeUtil.setAttribute(accent, 'mathsize', 'small');
    if (parser.stack.env.font) {
        NodeUtil.setAttribute(accent, 'mathvariant', parser.stack.env.font);
    }
    const mpadded = parser.create('node', 'mpadded', [accent], { height: 0 });
    const mover = parser.create('node', 'mover', [expression, mpadded]);
    const texatom = parser.create('node', 'TeXAtom', [mover]);
    parser.Push(texatom);
};
AmsMacrosMethods.smallcaps = function (parser, name) {
    let argument = parser.GetArgument(name);
    const def = {
        mathsize: '1em',
        mathvariant: 'normal',
    };
    for (let char of argument) {
        if (char.toLowerCase() === char) {
            def.mathsize = '0.8em';
        }
        else
            def.mathsize = '1em';
        parser.Push(parser.create('token', 'mi', def, char.toUpperCase()));
    }
};
AmsMacrosMethods.bevelledFraction = function (parser, name) {
    const num = parser.ParseArg(name);
    const den = parser.ParseArg(name);
    const frac = parser.create('node', 'mfrac', [num, den], {
        bevelled: true,
    });
    parser.Push(frac);
};
AmsMacrosMethods.Macro = BaseMethods.Macro;
AmsMacrosMethods.Accent = BaseMethods.Accent;
AmsMacrosMethods.SetFont = BaseMethods.SetFont;
new CommandMap('ams-macros-macros', {
    pmod: [
        'Macro',
        '\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}(\\operatorname{mod}\\mkern6mu #1)',
        1,
    ],
    bigsqcap: ['Macro', '\\mmlToken{mo}{\u2a05}'],
    lefteqn: ['Macro', '\\rlap{\\displaystyle{#1}}', 1],
    sslash: ['Macro', '\u2AFD'],
    square: ['Macro', '◻'],
    Box: ['Macro', '◻'],
    mathds: ['Macro', '\\mathbb{#1}', 1],
    blacktriangle: ['Macro', '▴'],
    coloneq: ['Macro', '\\mathrel{≔}'],
    adots: ['Macro', '⋰'],
    overarc: ['Accent', '2312', 1],
    widecheck: ['Accent', '02C7', 1],
    accentset: 'accentset',
    intbar: ['Macro', '\\mmlToken{mo}{\u2a0d}'],
    bfit: ['SetFont', TexConstant.Variant.BOLDITALIC],
    mathbfit: ['Macro', '{\\bfit #1}', 1],
    mathsc: 'smallcaps',
    mathbfcal: ['Macro', '\\boldsymbol{\\mathcal{#1}}', 1],
    sfrac: 'bevelledFraction',
    Sha: ['Macro', '\\mathrm{\u0428}'],
    Shcha: ['Macro', '\\mathrm{\u0429}'],
    De: ['Macro', '\\mathrm{\u0434}'],
    txt: ['Macro', '\\vcenter{\\makebox{#1}}', 1],
}, AmsMacrosMethods);
new DelimiterMap('ams-macros-delimiters', ParseMethods.delimiter, {
    '\\Vvert': '\u2980',
    '\\llbracket': '\u27E6',
    '\\rrbracket': '\u27E7',
    '\\llangle': '\u2989',
    '\\rrangle': '\u298A',
    '\\lAngle': '\u27EA',
    '\\rAngle': '\u27EB',
});
export const configuration = Configuration.create('ams-macros', {
    handler: {
        delimiter: ['ams-macros-delimiters'],
        macro: ['ams-macros-macros', 'ams-macros-delimiters'],
    },
});
//# sourceMappingURL=ams-macros.js.map