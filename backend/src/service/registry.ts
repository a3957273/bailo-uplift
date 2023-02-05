class Registry {
  constructor() {}

  someFunc(branch: boolean, notUsed: string) {
    if (branch) {
      return true
    } else {
      return false
    }
  }
}

export default Registry
