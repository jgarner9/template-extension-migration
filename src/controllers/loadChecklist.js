import { displayChecklist } from './displayChecklist'

const loadChecklist = () => {
  //IDB Options
  const dbName = 'checklist-data'
  const storeName = 'checklists'
  const version = 4

  //Open IDB Request
  const request = indexedDB.open(dbName, version)

  //Successful Open IDB request logic
  request.addEventListener('success', (e) => {
    const db = e.target.result
    const transaction = db.transaction(storeName)

    const objectStore = transaction.objectStore(storeName)

    let data = objectStore.getAll()

    data.transaction.addEventListener('complete', (e) => {
      data = data.result

      db.close()

      console.log(data)
      displayChecklist(data)
    })
  })

  request.addEventListener('upgradeneeded', (e) => {
    const db = e.target.result
    db.createObjectStore(storeName, { keyPath: 'id' })

    db.close()
  })
}

export { loadChecklist }
