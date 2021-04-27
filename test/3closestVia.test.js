import { setup } from "./_boilerplate.js";

setup({
  title: "closest via for grabbing chains",
  /**
   *
   * @param {input}
   * @param {import('jscodeshift').API} api
   */
  transform: ({ source }, { jscodeshift: j }) =>
    j(source)
      .find(j.Identifier, { name: "START" })
      .closestOnlyVia(j.Node, [j.MemberExpression, j.CallExpression])
      .replaceWith("MARK")
      .toSource(),
  testCases: ({ testChanged, testUnchanged }) => {
    testChanged(`q.w.e.r.t.y.START.call();`, `MARK.call();`);
    testChanged(`q.w.e.r.t.y.call(START);`, `MARK;`);
    testChanged(`q.w[e].r.t.y.call(START);`, `MARK;`);
    testChanged(
      `async () => {
        await q.w[e].r.t.y.call(START);
      }`,
      `async () => {
        await MARK;
      }`
    );
    testChanged(`var START = 1;`, `var MARK;`);
    testChanged(`var a = b(START);`, `var a = MARK;`);
  },
});
