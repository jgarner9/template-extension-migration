import { loadTemplates } from "./loadTemplates"

const editTemplate = (e, title, contents) => {
  //IDB Options
  const dbName = 'template-data'
  const storeName = 'templates'
  const version = 4

  //keypath selector
  const idKeypath = e.target.id

  //Open IDB Request
  const request = indexedDB.open(dbName, version)

  //Successful IDB Open Request logic: open objectStore, get the template with keypath selector, make the change, and overwrite using 'put', run loadTemplates
  request.addEventListener('success', (e) => {
    const db = e.target.result

    const transaction = db.transaction(storeName, 'readwrite')

    const objectStore = transaction.objectStore(storeName)
    const template = objectStore.get(idKeypath)

    template.addEventListener('success', (e) => {
      const template = e.target.result

      template.title = title
      template.content = contents

      objectStore.put(template)
    })

    db.close()

    loadTemplates()
  })
}

export { editTemplate }
