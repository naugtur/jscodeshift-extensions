import test from "ava";
import jscodeshift from "jscodeshift";
import testCodemod from "jscodeshift-ava-tester";
import { installExtensions } from "../index.js";

installExtensions(jscodeshift);

export function setup({ title, transform }) {
    const drawTitle = (text) => `+-------------------
| ${title}
+-------------------
${text}
--------------------`
  const { testChanged, testUnchanged } = testCodemod(
    jscodeshift,
    test,
    transform
  );
  return {
    testChanged: (a, b) => testChanged(drawTitle(a), a, b),
    testUnchanged: (a) => testUnchanged(drawTitle(a), a),
  };
}
