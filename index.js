// @ts-check

/**
* @mixin
*/
const extensions = {
  /**
   * Like closest, but will only go up via types from the list
   *
   * @param {*} type
   * @param {Array} viaTypes
   * @return {import('jscodeshift').Collection}
   * @this {import('jscodeshift').Collection}
   */
  closestButOnlyVia (type, viaTypes) {
    return this.map((path) => {
      let parent = path.parent
      while (parent && !type.check(parent.value)) {
        if (viaTypes.some((type) => type.check(parent.value))) {
          parent = parent.parent
        } else {
          parent = null
        }
      }
      return parent || null
    })
  },
  /**
   * Like find, but will only go down to a certain depth - the most shallow it finds or depth provided as argument
   *
   * @param {*} type
   * @param {*} filter
   * @param {Number} depth
   * @return {import('jscodeshift').Collection}
   * @this {import('jscodeshift').Collection}
   */
  findShallow (type, filter, depth) {
    const originallyFound = this.find(type, filter)
    // NOTE: there's room for optimization here by rewriting instead of reusing find.
    if (!depth) {
      depth = Infinity
      // this is likely to be much closer to O(n) than O(2n)
      return originallyFound.filter((p) => {
        if (p.scope.depth < depth) {
          depth = p.scope.depth
        }
        return p.scope.depth <= depth
      }).filter((p) => p.scope.depth <= depth)
    } else {
      return originallyFound.filter((p) => p.scope.depth <= depth)
    }
  }
}
/**
 * Runs registerMethods to add the extensions to your jscodeshift
 *
 * @param {import('jscodeshift')} jscodeshift
 */
export const installExtensions = (jscodeshift) => {
  jscodeshift.registerMethods(
    extensions,
    jscodeshift.types.namedTypes.Node
  )
}
