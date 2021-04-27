import { setup } from './_boilerplate.js'

setup({
  title: 'shallow default',
  transform: ({ source }, { jscodeshift: j }) =>
    j(source).findShallow(j.Identifier).replaceWith('MARK').toSource(),
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
      `MARK.MARK(() => {
        return {
          result: getResult(that)
        };
      }).MARK(() => {
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
                  return MARK;
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
    j(source).findShallow(j.Identifier, null, 2).replaceWith('MARK').toSource(),
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
        return MARK;
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
      MARK.MARK(() => {
        return {
          MARK: MARK(MARK)
        };
      }).MARK(() => {
        return {
          MARK: MARK(() => {
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
