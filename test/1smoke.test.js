import { setup } from './_boilerplate.js'

setup({
  title: 'smoke test',
  transform: ({ source }, { jscodeshift: j }) =>
    j(source).find(j.Identifier).replaceWith('MARK').toSource(),
  testCases: ({ testChanged, testUnchanged }) => {
    testChanged('var a = 2;', 'var MARK = 2;')
    testUnchanged('(()=>{})()')
  }
})
