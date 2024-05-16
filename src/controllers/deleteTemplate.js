import { loadTemplates } from "./loadTemplates"

const deleteTemplate = (e) => {
  //IDB Options
  const dbName = 'template-data'
  const storeName = 'templates'
  const version = 4

  //keypath selector
  const idKeypath = e.target.id

  //IDB Open Request
  const request = indexedDB.open(dbName, version)

  //Successful IDB Open request logic: open object store, delete using keypath selector, run loadTemplates to update display
  request.addEventListener('success', (e) => {
    const db = e.target.result

    const transaction = db.transaction(storeName, 'readwrite')

    transaction.objectStore(storeName).delete(idKeypath)

    db.close()

    loadTemplates()
  })
}

export { deleteTemplate }
