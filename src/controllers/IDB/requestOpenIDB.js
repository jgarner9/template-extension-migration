const requestOpenIDB = (dbName, version) => {
  return indexedDB.open(dbName, version)
}

export { requestOpenIDB }
