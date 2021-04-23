import { setup } from './_boilerplate.js'

setup({
  title: 'smoke test',
  transform: ({ source }, { jscodeshift: j }) =>
    j(source).find(j.Identifier).replaceWith('b').toSource(),
  testCases: ({ testChanged, testUnchanged }) => {
    testChanged('var a = 2;', 'var b = 2;')
    testUnchanged('(()=>{})()')
  }
})
