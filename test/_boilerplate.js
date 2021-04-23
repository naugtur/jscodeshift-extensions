import test from 'ava'
import jscodeshift from 'jscodeshift'
import testCodemod from 'jscodeshift-ava-tester'
import { installExtensions } from '../index.js'

installExtensions(jscodeshift)

export function setup ({ title, transform, testCases }) {
  const addTitle = (text) => `${title}: ${text}`
  const { testChanged, testUnchanged } = testCodemod(
    jscodeshift,
    test,
    transform
  )
  return testCases({
    testChanged: (a, b) => testChanged(addTitle(a), a, b),
    testUnchanged: (a) => testUnchanged(addTitle(a), a)
  })
}
