class Registry {
  someFunc(branch: boolean, _notUsed: string) {
    if (branch) {
      return true
    } else {
      return false
    }
  }
}

export default Registry
