"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
var NodeUtil_js_1 = require("mathjax-full/js/input/tex/NodeUtil.js");
var Configuration_js_1 = require("mathjax-full/js/input/tex/Configuration.js");
var SymbolMap_js_1 = require("mathjax-full/js/input/tex/SymbolMap.js");
var TexConstants_js_1 = require("mathjax-full/js/input/tex/TexConstants.js");
var ParseMethods_js_1 = require("mathjax-full/js/input/tex/ParseMethods.js");
var BaseMethods_js_1 = require("mathjax-full/js/input/tex/base/BaseMethods.js");
var AmsMacrosMethods = {};
AmsMacrosMethods.accentset = function (parser, name) {
    var accent = parser.ParseArg(name);
    var expression = parser.ParseArg(name);
    NodeUtil_js_1.default.setAttribute(accent, 'accent', true);
    NodeUtil_js_1.default.setAttribute(accent, 'mathsize', 'small');
    if (parser.stack.env.font) {
        NodeUtil_js_1.default.setAttribute(accent, 'mathvariant', parser.stack.env.font);
    }
    var mpadded = parser.create('node', 'mpadded', [accent], { height: 0 });
    var mover = parser.create('node', 'mover', [expression, mpadded]);
    var texatom = parser.create('node', 'TeXAtom', [mover]);
    parser.Push(texatom);
};
AmsMacrosMethods.smallcaps = function (parser, name) {
    var e_1, _a;
    var argument = parser.GetArgument(name);
    var def = {
        mathsize: '1em',
        mathvariant: 'normal',
    };
    try {
        for (var argument_1 = __values(argument), argument_1_1 = argument_1.next(); !argument_1_1.done; argument_1_1 = argument_1.next()) {
            var char = argument_1_1.value;
            if (char.toLowerCase() === char) {
                def.mathsize = '0.8em';
            }
            else
                def.mathsize = '1em';
            parser.Push(parser.create('token', 'mi', def, char.toUpperCase()));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (argument_1_1 && !argument_1_1.done && (_a = argument_1.return)) _a.call(argument_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
AmsMacrosMethods.bevelledFraction = function (parser, name) {
    var num = parser.ParseArg(name);
    var den = parser.ParseArg(name);
    var frac = parser.create('node', 'mfrac', [num, den], {
        bevelled: true,
    });
    parser.Push(frac);
};
AmsMacrosMethods.Macro = BaseMethods_js_1.default.Macro;
AmsMacrosMethods.Accent = BaseMethods_js_1.default.Accent;
AmsMacrosMethods.SetFont = BaseMethods_js_1.default.SetFont;
new SymbolMap_js_1.CommandMap('ams-macros-macros', {
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
    bfit: ['SetFont', TexConstants_js_1.TexConstant.Variant.BOLDITALIC],
    mathbfit: ['Macro', '{\\bfit #1}', 1],
    mathsc: 'smallcaps',
    mathbfcal: ['Macro', '\\boldsymbol{\\mathcal{#1}}', 1],
    sfrac: 'bevelledFraction',
}, AmsMacrosMethods);
new SymbolMap_js_1.DelimiterMap('ams-macros-delimiters', ParseMethods_js_1.default.delimiter, {
    '\\Vvert': '\u2980',
    '\\llbracket': '\u27E6',
    '\\rrbracket': '\u27E7',
    '\\llangle': '\u2989',
    '\\rrangle': '\u298A',
    '\\lAngle': '\u27EA',
    '\\rAngle': '\u27EB',
});
new SymbolMap_js_1.EnvironmentMap('ams-macros-environments', ParseMethods_js_1.default.environment, {
    dcases: ['Array', null, '\\{', '.', 'll', null, '.2em', 'D'],
    bsmallmatrix: ['Array', null, '[', ']', 'c', '0.333em', '.2em', 'S', 1],
    multlined: ['Array', null, '[', ']', 'c', '0.333em', '.2em', 'S', 1],
}, {
    Array: BaseMethods_js_1.default.Array,
});
exports.configuration = Configuration_js_1.Configuration.create('ams-macros', {
    handler: {
        delimiter: ['ams-macros-delimiters'],
        macro: ['ams-macros-macros', 'ams-macros-delimiters'],
        environment: ['ams-macros-environments'],
    },
});
//# sourceMappingURL=ams-macros.js.map