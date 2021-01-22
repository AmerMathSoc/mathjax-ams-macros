const mj = require('./mj');

const theBigString =
  '' +
  '\\( a \\pmod b\\)' +
  '$$ a \\pmod b$$' +
  '$$ \\bigsqcap$$' +
  '$$\\begin{eqnarray}   \\lefteqn{f(a,b,c,d,e,...)} \\\\  &amp; = &amp; lefteqn \\end{eqnarray}$$' +
  '$$ \\sslash$$' +
  '$$ \\square$$' +
  '$$ \\Box$$' +
  '$$ \\mathds{x}$$' +
  '$$ \\blacktriangle$$' +
  '$$ \\coloneq$$' +
  '$$ \\adots$$' +
  '$$ \\overarc{xyzzyx}$$' +
  '$$ \\widecheck{xyz}$$' +
  '$$ \\accentset{x}{u}$$' +
  '$$ \\intbar_x^\\infty$$' +
  '$$ \\bfit{bolditalic}$$' +
  '$$ \\mathsc{Small Caps}$$' +
  '$$ \\mathbfcal{bold caligraphic}$$' +
  '$$ \\sfrac{n}{k}$$' +
  '$$ \\left \\Vvert\\frac{n}{k} \\right \\Vvert$$' +
  '$$ \\left \\llbracket\\frac{n}{k} \\right \\rrbracket$$' +
  '$$ \\left \\llangle\\frac{n}{k} \\right \\rrangle$$' +
  '$$ \\left \\lAngle\\frac{n}{k} \\right \\rAngle$$' +
  '';

console.log(mj(theBigString, true));
