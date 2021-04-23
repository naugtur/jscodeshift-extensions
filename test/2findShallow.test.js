import { setup } from './_boilerplate.js'

setup({
  title: 'shallow default',
  transform: ({ source }, { jscodeshift: j }) =>
    j(source).findShallow(j.Identifier).replaceWith('b').toSource(),
  testCases: ({ testChanged, testUnchanged }) => {
    testChanged(
      `a.then(() => {
        return {
          result: getResult(that)
        };
      }).then(() => {
        return {
          result: getResult(() => {
            return something;
          })
        };
      });
`,
      `b.b(() => {
        return {
          result: getResult(that)
        };
      }).b(() => {
        return {
          result: getResult(() => {
            return something;
          })
        };
      });
`
    )

    testChanged(
      `
    ()=>{
      ()=>{
        ()=>{
          ()=>{
            ()=>{
              ()=>{
                ()=>{
                  return something;
                }
              }
            }
          }
        }
      } 
    }
    `,
      `
    ()=>{
      ()=>{
        ()=>{
          ()=>{
            ()=>{
              ()=>{
                ()=>{
                  return b;
                }
              }
            }
          }
        }
      } 
    }
    `
    )
  }
})

setup({
  title: 'shallow with depth param',
  transform: ({ source }, { jscodeshift: j }) =>
    j(source).findShallow(j.Identifier, null, 2).replaceWith('b').toSource(),
  testCases: ({ testChanged, testUnchanged }) => {
    testChanged(
      `
    ()=>{
      ()=>{
        return something;
      } 
    }
    `,
      `
    ()=>{
      ()=>{
        return b;
      } 
    }
    `
    )
    testChanged(
      `() => {
      a.then(() => {
        return {
          result: getResult(that)
        };
      }).then(() => {
        return {
          result: getResult(() => {
            return something;
          })
        };
      });
    }
`,
      `() => {
      b.b(() => {
        return {
          b: b(b)
        };
      }).b(() => {
        return {
          b: b(() => {
            return something;
          })
        };
      });
    }
`
    )

    testUnchanged(`
    ()=>{
      ()=>{
        ()=>{
          ()=>{
            ()=>{
              ()=>{
                ()=>{
                  return something
                }
              }
            }
          }
        }
      } 
    }
    `)
  }
})
