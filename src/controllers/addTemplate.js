import { generateUID } from "./generateUID"

const addTemplate = (data, title) => {
  //IDB options
  const dbName = 'template-data'
  const storeName = 'templates'
  const version = 4

  //Open IDB Request
  const request = indexedDB.open(dbName, version)

  //Successful IDB Request logic: open store, add template with UID
  request.addEventListener('success', (e) => {
    const db = e.target.result

    const templateObjectStore = db.transaction(storeName, 'readwrite').objectStore(storeName)

    templateObjectStore.add({
      title: title,
      content: data,
      id: generateUID(),
    })

    db.close()
  })

  //Upgrade IDB Request logic: create store, open it, add template with UID
  request.addEventListener('upgradeneeded', (e) => {
    const db = e.target.result

    const objectStore = db.createObjectStore(storeName, { keyPath: 'id' })

    objectStore.transaction.oncomplete = (e) => {
      const templateObjectStore = db.transaction(storeName, 'readwrite').objectStore(storeName)

      templateObjectStore.add({
        title: title,
        content: data,
        id: generateUID(),
      })

      db.close()
    }
  })
}

export { addTemplate }