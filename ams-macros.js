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
  version: '1.0.0'
};

MathJax.Hub.Register.StartupHook('TeX Jax Ready', function() {
  var MML = MathJax.ElementJax.mml,
    TEX = MathJax.InputJax.TeX

    TEX.Definitions.Add({
      macros: {
      // mcom3229, from accents package
      accentset: 'accentset'
      }
    });
    TEX.Parse.Augment({
            accentset: function(name){
              const accent = this.ParseArg(name);
              const expression = this.ParseArg(name);
              const def = {accent: true, mathsize: 'small'}
              if (this.stack.env.font) {def.mathvariant = this.stack.env.font}
              const mml = this.mmlToken(accent.With(def));
              mml.stretchy = false;
              const mo = (expression.isEmbellished() ? expression.CoreMO() : expression);
              if (mo.isa(MML.mo)) mo.movablelimits = false;
              this.Push(MML.TeXAtom(MML.munderover(expression,null,mml).With({accent: true})));
            }
    });
});

MathJax.Callback.Queue(['loadComplete', MathJax.Ajax, '[ams-macros]/ams-macros.js']);
