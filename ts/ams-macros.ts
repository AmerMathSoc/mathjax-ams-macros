/*************************************************************
 *  Copyright (c) 2020 Peter Krautzberger
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
import { CommandMap, EnvironmentMap, DelimiterMap } from 'mathjax-full/js/input/tex/SymbolMap.js';
import { ParseMethod } from 'mathjax-full/js/input/tex/Types.js';
import { TexConstant } from 'mathjax-full/js/input/tex/TexConstants.js';
import ParseMethods from 'mathjax-full/js/input/tex/ParseMethods.js';
import BaseMethods from 'mathjax-full/js/input/tex/base/BaseMethods.js';
import TexParser from 'mathjax-full/js/input/tex/TexParser';

let AmsMacrosMethods: Record<string, ParseMethod> = {};

AmsMacrosMethods.accentset = function (parser: TexParser, name: string) {
    const accent = parser.ParseArg(name);
    const expression = parser.ParseArg(name);
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
        ],
        // btran 8
        bigsqcap: ['Macro', '\\mmlToken{mo}{\u2a05}'],
        // btran18
        llbracket: ['Macro', '\\mathopen{\u27E6}'],
        rrbracket: ['Macro', '\\mathclose{\u27E7}'],
        // mcom 3381
        lefteqn: ['Macro', '\\rlap{\\displaystyle{#1}}', 1],
        // jams887
        sslash: ['Macro', '\u2AFD'],
        // Cf. #136
        square: ['Macro', '◻'],
        // Cf. #136
        Box: ['Macro', '◻'],
        // jams889
        mathds: ['Macro', '\\mathbb{#1}', 1],
        // jams898
        blacktriangle: ['Macro', '▴'],
        // mcom 1463
        coloneq: ['Macro', '\\mathrel{≔}'],
        // btran27, mathtools
        // coloneqq: ['Macro', '\\mathrel{≔}'],
        // mcl08
        adots: ['Macro', '⋰'],
        // mcl 01
        overarc: ['Accent', '2312', 1],
        // jams878
        // bm: ['Macro', '\\boldsymbol{#1}', 1], // TODO cf. #15
        // jams906
        widecheck: ['Accent', '02C7', 1],
        // mcom3329, from accents package
        accentset: 'accentset',
        // jams 913 NOTE stix.sty
        intbar: ['Macro', '\\mmlToken{mo}{\u2a0d}'],
        // mcom 3375
        bfit: ['SetFont', TexConstant.Variant.BOLDITALIC],
        mathbfit: ['Macro', '{\\bfit #1}', 1],
        // mcom 3374
        mathsc: 'smallcaps',
        // mcom 3365
        mathbfcal: ['Macro', '\\boldsymbol{\\mathcal{#1}}', 1],
        // mcom 3507
        sfrac: 'bevelledFraction', // NOTE does not support optional arguments from xfrac package
    },
    AmsMacrosMethods
);

new DelimiterMap('ams-macros-delimiters', ParseMethods.delimiter, {
    // mcom1149
    '\\Vvert': '\u2980',
    // mcom 3545
    '\\llbracket': '\u27E6',
    '\\rrbracket': '\u27E7',
});

new EnvironmentMap(
    'ams-macros-environments',
    ParseMethods.environment,
    {
        // mcom3334
        // NOTE this does not match mathtools properly (column alignment is optional)
        // TODO #309 should remove this hack
        // 'bmatrix*': ['Array', null, '[', ']', 'c'], // TODO mathtools now exists
        // jams915
        // NOTE from mathtools
        dcases: ['Array', null, '\\{', '.', 'll', null, '.2em', 'D'],
        // NOTE from mathtools
        bsmallmatrix: ['Array', null, '[', ']', 'c', '0.333em', '.2em', 'S', 1],
        // mcom3398
        // NOTE from mathtools
        multlined: ['Array', null, '[', ']', 'c', '0.333em', '.2em', 'S', 1],
    },
    {
        Array: BaseMethods.Array,
    }
);

export const configuration = Configuration.create('ams-macros', {
    handler: {
        delimiter: ['ams-macros-delimiters'],
        macro: ['ams-macros-macros'],
        environment: ['ams-macros-environments'],
    },
});
