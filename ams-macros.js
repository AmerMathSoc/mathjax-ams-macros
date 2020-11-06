/*************************************************************
 *  Copyright (c) 2018 Peter Krautzberger
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

MathJax.Extension['ams-macros'] = {
  version: '2.2.0'
};

MathJax.Hub.Register.StartupHook('TeX Jax Ready', function() {
  var MML = MathJax.ElementJax.mml,
    TEX = MathJax.InputJax.TeX;

  TEX.Definitions.Add(
    {
      macros: {
        // AmerMathSoc/ams-doc-sources#879
        pmod: [
          'Macro',
          '\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}(\\operatorname{mod}\\mkern6mu #1)',
          1
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
        coloneqq: ['Macro', '\\mathrel{≔}'],
        // mcl08
        adots: ['Macro', '⋰'],
        // mcl 01
        overarc: ['Accent', '2312', 1],
        // jams878
        bm: ['Macro', '\\boldsymbol{#1}', 1],
        // jams906
        widecheck: ['Accent', '02C7', 1],
        // mcom3229, from accents package
        accentset: 'accentset',
        // jams 913 NOTE stix.sty
        intbar: ['Macro', '\\mmlToken{mo}{\u2a0d}'],
        // mcom 3375
        bfit: ['SetFont', MML.VARIANT.BOLDITALIC],
        mathbfit: ['Macro', '{\\bfit #1}', 1],
        // mcom 3374
        mathsc: 'smallcaps',
        // mcom 3365
        mathbfcal: ['Macro', '\\boldsymbol{\\mathcal{#1}}', 1],
        // mcom 3507
        sfrac: 'bevelledFraction' // NOTE does not support optional arguments from xfrac package
      },
      delimiter: {
        // mcom1149
        '\\Vvert': '\u2980',
        // mcom 3545
        '\\llbracket': '\u27E6',
        '\\rrbracket': '\u27E7',
        // mcom 3567
        '\\llangle': '\u2989',
        '\\rrangle': '\u298A',
      },
      environment: {
        // mcom3334
        // NOTE this does not match mathtools properly (column alignment is optional)
        // TODO #309 should remove this hack
        'bmatrix*': ['Array', null, '[', ']', 'c'],
        // jams915
        // NOTE from mathtools
        dcases: ['Array', null, '\\{', '.', 'll', null, '.2em', 'D'],
        // NOTE from mathtools
        bsmallmatrix: ['Array', null, '[', ']', 'c', '0.333em', '.2em', 'S', 1],
        // mcom3398
        // NOTE from mathtools
        multlined: ['Array', null, '[', ']', 'c', '0.333em', '.2em', 'S', 1]
      }
    },
    null,
    true
  );
  TEX.Parse.Augment({
    accentset: function(name) {
      const accent = this.ParseArg(name);
      const expression = this.ParseArg(name);
      const def = { accent: true, mathsize: 'small' };
      if (this.stack.env.font) {
        def.mathvariant = this.stack.env.font;
      }
      const mml = this.mmlToken(accent.With(def));
      mml.stretchy = false;
      const mo = expression.isEmbellished() ? expression.CoreMO() : expression;
      if (mo.isa(MML.mo)) mo.movablelimits = false;
      this.Push(
        MML.TeXAtom(
          MML.munderover(
            expression,
            null,
            MML.mpadded(mml).With({ height: 0 })
          ).With({ accent: true })
        )
      );
    },
    smallcaps: function(name) {
      let argument = this.GetArgument(name);
      const def = { mathsize: '1em', mathvariant: MML.VARIANT.NORMAL };
      for (let char of argument) {
        if (char.toLowerCase() === char) {
          def.mathsize = '0.8em';
        } else def.mathsize = '1em';
        this.Push(this.mmlToken(MML.mi(char.toUpperCase()).With(def)));
      }
    },
    bevelledFraction: function (name) {
      var num = this.ParseArg(name),
          den = this.ParseArg(name);
      this.Push(MML.mfrac(num,den).With({bevelled: true}));
    }
  });
});

MathJax.Callback.Queue([
  'loadComplete',
  MathJax.Ajax,
  '[ams-macros]/ams-macros.js'
]);
