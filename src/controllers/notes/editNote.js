import { loadNotes } from './loadNotes'

const editNote = (e, title, contents) => {
  //IDB Options
  const dbName = 'note-data'
  const storeName = 'notes'
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
    const note = objectStore.get(idKeypath)

    note.addEventListener('success', (e) => {
      const note = e.target.result
      console.log(e)

      note.title = title
      note.content = contents

      objectStore.put(note)
    })

    db.close()

    loadNotes()
  })
}

export { editNote }
