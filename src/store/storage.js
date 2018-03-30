export default (options) => (store) => {
  if (localStorage.state) {
    store.replaceState(JSON.parse(localStorage.state))
  }

  return store.subscribe((mutation, state) => {
    if (options.destroyOn && options.destroyOn.indexOf(mutation.type) !== -1) {
      return localStorage.removeItem('state')
    }

    const newState = options.storedKeys.reduce((map, key) => {
      map[key] = state[key]
      return map
    }, {})

    localStorage.state = JSON.stringify(newState)
  })
}
