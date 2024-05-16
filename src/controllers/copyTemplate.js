import { htmlToText } from "html-to-text"

const copyTemplate = (e) => {
  //IDB Options
  const dbName = 'template-data'
  const storeName = 'templates'
  const version = 4

  //keypath selector
  const idKeypath = e.target.id

  //Open IDB Request
  const request = indexedDB.open(dbName, version)

  //Successful Open IDB Request logic: open object store, retrieve template with keypath selector, create html and text blobs for clipboard, copy to clipboard
  request.addEventListener('success', (e) => {
    const db = e.target.result

    const transaction = db.transaction(storeName)

    const objectStore = transaction.objectStore(storeName)
    const template = objectStore.get(idKeypath)

    template.addEventListener('success', (e) => {
      const template = e.target.result
      const contents = template.content

      const contentsBlob = new Blob([contents], { type: 'text/html' })
      const contentsText = new Blob([htmlToText(contents)], { type: 'text/plain' })
      const data = new ClipboardItem({
        ['text/html']: contentsBlob,
        ['text/plain']: contentsText,
      })

      navigator.clipboard.write([data])

      db.close()
    })
  })
}

export { copyTemplate }
