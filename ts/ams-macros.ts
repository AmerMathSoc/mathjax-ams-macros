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
import { ParseMethod } from 'mathjax-full/js/input/tex/Types.js';
import { TexConstant } from 'mathjax-full/js/input/tex/TexConstants.js';
import ParseMethods from 'mathjax-full/js/input/tex/ParseMethods.js';
import BaseMethods from 'mathjax-full/js/input/tex/base/BaseMethods.js';
import TexParser from 'mathjax-full/js/input/tex/TexParser';

let AmsMacrosMethods: Record<string, ParseMethod> = {};

AmsMacrosMethods.accentset = function (parser: TexParser, name: string) {
    const accent = parser.ParseArg(name);
    const expression = parser.ParseArg(name);
    if (accent.isKind('mo')) NodeUtil.setAttribute(accent, 'accent', true);
    NodeUtil.setAttribute(accent, 'mathsize', 'small');
    if (parser.stack.env.font) {
        NodeUtil.setAttribute(accent, 'mathvariant', parser.stack.env.font);
    }
    const mpadded = parser.create('node', 'mpadded', [accent], { height: 0 });
    const mover = parser.create('node', 'mover', [expression, mpadded]);
    const texatom = parser.create('node', 'TeXAtom', [mover]);
    parser.Push(texatom);
};

AmsMacrosMethods.smallcaps = function (parser: TexParser, name: string) {
    let argument = parser.GetArgument(name);
    const def = {
        mathsize: '1em',
        mathvariant: 'normal', // TODO why does TexConstants.TexConstant.VARIANT.NORMAL throw?
    };
    for (let char of argument) {
        if (char.toLowerCase() === char) {
            def.mathsize = '0.8em';
        } else def.mathsize = '1em';
        parser.Push(parser.create('token', 'mi', def, char.toUpperCase()));
    }
};

AmsMacrosMethods.bevelledFraction = function (parser: TexParser, name: string) {
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

new CommandMap(
    'ams-macros-macros',
    {
        // AmerMathSoc/ams-doc-sources#879
        pmod: [
            'Macro',
            '\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}(\\operatorname{mod}\\mkern6mu #1)',
            1,
        ], // TODO switch to mathjax version?
        // btran 8
        bigsqcap: ['Macro', '\\mmlToken{mo}{\u2a05}'], // unicode-math
        // mcom 3381
        lefteqn: ['Macro', '\\rlap{\\displaystyle{#1}}', 1], // TODO
        // jams887
        sslash: ['Macro', '\u2AFD'], // unicode-math
        // Cf. #136
        square: ['Macro', '◻'], // TODO switch to mathjax version? (we have u25FB, they have u25A1)
        // Cf. #136
        Box: ['Macro', '◻'], // TODO switch to mathjax version? (same u25FB)
        // jams889
        mathds: ['Macro', '\\mathbb{#1}', 1], // TODO suggest alias for mathjax? (dsfont package)
        // jams898
        blacktriangle: ['Macro', '▴'], // unicode-math
        // mcom 1463
        coloneq: ['Macro', '\\mathrel{≔}'], // unicode-math
        // mcl08
        adots: ['Macro', '⋰'], // unicode-math
        // mcl 01
        overarc: ['Accent', '2312', 1], // TODO
        // jams906
        widecheck: ['Accent', '02C7', 1], // unicode-math
        // mcom3329, from accents package
        accentset: 'accentset', // TODO
        // jams 913 NOTE stix.sty
        intbar: ['Macro', '\\mmlToken{mo}{\u2a0d}'],  // unicode-math
        // mcom 3375
        bfit: ['SetFont', TexConstant.Variant.BOLDITALIC], // TODO suggest for mathjax?
        mathbfit: ['Macro', '{\\bfit #1}', 1], // TODO ditto
        // mcom 3374
        mathsc: 'smallcaps', // TODO suggest for mathjax?
        // mcom 3365
        mathbfcal: ['Macro', '\\boldsymbol{\\mathcal{#1}}', 1], // TODO suggest for mathjax?
        // mcom 3507
        sfrac: 'bevelledFraction', // NOTE does not support optional arguments from xfrac package // TODO
        // some Cyrrillic
        Sha: ['Macro','\\mathrm{\u0428}'], // TODO
        Shcha: ['Macro','\\mathrm{\u0429}'], // TODO
        De: ['Macro','\\mathrm{\u0434}'], // TODO
        txt: ['Macro', '\\vcenter{\\makebox{#1}}', 1], // TODO
    },
    AmsMacrosMethods
);

new DelimiterMap('ams-macros-delimiters', ParseMethods.delimiter, {
    // mcom1149
    '\\Vvert': '\u2980', // unicode-math
    // mcom 3545 (originally macro for btran18)
    '\\llbracket': '\u27E6', // stmaryrd (no longer present)
    '\\rrbracket': '\u27E7', // stmaryrd (no longer present)
    // mcom 3567
    '\\llangle': '\u2989', // unicode-math
    '\\rrangle': '\u298A', // unicode-math
    // btran 54
    '\\lAngle': '\u27EA', // unicode-math
    '\\rAngle': '\u27EB', // unicode-math
});

export const configuration = Configuration.create('ams-macros', {
    handler: {
        delimiter: ['ams-macros-delimiters'],
        macro: ['ams-macros-macros', 'ams-macros-delimiters'],
    },
});
