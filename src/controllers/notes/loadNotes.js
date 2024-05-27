import { displayNotes } from './displayNotes'

const loadNotes = () => {
  //IDB Options
  const dbName = 'note-data'
  const storeName = 'notes'
  const version = 4

  //Open IDB Request
  const request = indexedDB.open(dbName, version)

  //Successful Open IDB Request logic: get all data from object store, run displayData with data
  request.addEventListener('success', (e) => {
    const db = e.target.result
    const transaction = db.transaction(storeName)

    const objectStore = transaction.objectStore(storeName)

    let data = objectStore.getAll()

    data.transaction.addEventListener('complete', (e) => {
      data = data.result

      db.close()

      displayNotes(data)
    })
  })

  //Upgrade Needed IDB Request logic: createObjectStore with keypath as the id
  request.addEventListener('upgradeneeded', (e) => {
    const db = e.target.result
    db.createObjectStore(storeName, { keyPath: 'id' })

    db.close()
  })
}

export { loadNotes }
