import { setup } from './_boilerplate.js'

const { testChanged, testUnchanged } = setup({
  title: 'smoke test',
  transform: ({ source }, { jscodeshift: j }) =>
    j(source).find(j.Identifier).replaceWith('b').toSource()
})

testChanged('var a = 2;', 'var b = 2;')
testUnchanged('(()=>{})()')
