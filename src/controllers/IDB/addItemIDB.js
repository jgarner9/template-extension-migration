const addItemIDB = (request, storeName, data) => {
  request.addEventListener('success', (e) => {
    const db = e.target.result

    const objectStore = db.transaction(storeName, 'readwrite').objectStore(storeName)

    objectStore.add(data)

    db.close()
  })

  request.addEventListener('upgradeneeded', (e) => {
    const db = e.target.result

    const objectStore = db.createObjectStore(storeName, { keyPath: 'id' })

    objectStore.transaction.oncomplete = () => {
      const objectStore = db.transaction(storeName, 'readwrite').objectStore(storeName)

      objectStore.add(data)

      db.close()
    }
  })
}

export { addItemIDB }
