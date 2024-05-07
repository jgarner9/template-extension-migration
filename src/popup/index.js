//<====================IMPORTS=====================>
import './index.css'
import 'suneditor/dist/css/suneditor.min.css'
import suneditor from 'suneditor'
import plugins from 'suneditor/src/plugins'
import { htmlToText } from 'html-to-text'

//<====================DOM OBJECTS==================>
const templateOptionsElement = document.getElementById('template-options')
const emptyTemplatesElement = document.getElementById('no-templates')
const addTemplateButton = document.getElementById('add-template-button')
const addTemplateModal = document.getElementById('add-template-modal')
const closeTemplateModalButton = document.getElementById('close-button')
const addTemplateModalButton = document.getElementById('add-button')
const templateTitleInput = document.getElementById('template-title-input')
const missingTitleError = document.getElementById('missing-title-error')
const missingTitleEditError = document.getElementById('missing-title-edit-error')
const editTemplateModal = document.getElementById('edit-template-modal')
const closeEditButton = document.getElementById('close-edit-button')
const editTemplateTitleInput = document.getElementById('edit-template-title-input')
const saveButton = document.querySelector('.save-edit-button')
const searchElement = document.getElementById('template-search')

//<====================FUNCTIONS=====================>
const addTemplate = (data, title) => {
  const dbName = 'template-data'
  const storeName = 'templates'
  const version = 4

  const request = indexedDB.open(dbName, version)
  console.log('Open IDB Request made')

  request.addEventListener('error', (e) => console.warn('IDB Request has an error: ' + e))

  request.addEventListener('blocked', (e) => console.warn('IDB Request was blocked: ' + e))

  request.addEventListener('success', (e) => {
    console.log('Open IDB Request Successful')
    const db = e.target.result

    console.log('IDB Transaction Initiated')
    const templateObjectStore = db.transaction(storeName, 'readwrite').objectStore(storeName)

    console.log('IDB Transaction: Adding Data')
    templateObjectStore.add({
      title: title,
      content: data,
      id: generateUID(),
    })
    console.log('IDB Transaction: Complete!')

    db.close()
  })

  request.addEventListener('upgradeneeded', (e) => {
    const db = e.target.result
    console.log('Open IDB Request Made, Upgrade Needed')

    const objectStore = db.createObjectStore(storeName, { keyPath: 'id' })
    console.log('IDB Object Store Created: ' + objectStore)

    objectStore.transaction.oncomplete = (e) => {
      const templateObjectStore = db.transaction(storeName, 'readwrite').objectStore(storeName)
      console.log('IDB Transaction Initiated')

      console.log('IDB Transaction: Adding Data')
      templateObjectStore.add({
        title: title,
        content: data,
        id: generateUID(),
      })
      console.log('IDB Transaction: Complete!')

      db.close()
    }
  })
}

const loadTemplates = () => {
  const dbName = 'template-data'
  const storeName = 'templates'
  const version = 4

  const request = indexedDB.open(dbName, version)
  console.log('Open IDB Request made')

  request.addEventListener('error', (e) => {
    console.warn('IDB Request has an error: ' + e)
    console.log(e)
  })

  request.addEventListener('blocked', (e) => console.warn('IDB Request was blocked: ' + e))
  request.addEventListener('success', (e) => {
    const db = e.target.result
    const transaction = db.transaction(storeName)

    const objectStore = transaction.objectStore(storeName)
    console.log('IDB Transaction Initiated')

    console.log('IDB Transaction: Retrieving Data...')

    let data = objectStore.getAll()

    data.transaction.addEventListener('complete', (e) => {
      data = data.result

      console.log('IDB Transaction Complete:')
      console.log(data)

      db.close()

      console.log('Displaying Data')
      displayData(data)
    })
  })

  request.addEventListener('upgradeneeded', (e) => {
    const db = e.target.result
    db.createObjectStore(storeName, { keyPath: 'id' })

    db.close()
  })
}

const deleteTemplate = (e) => {
  const dbName = 'template-data'
  const storeName = 'templates'
  const version = 4

  const idKeypath = e.target.id

  const request = indexedDB.open(dbName, version)
  console.log('Open IDB Request made')

  request.addEventListener('error', (e) => {
    console.warn('IDB Request has an error: ' + e)
    console.log(e)
  })

  request.addEventListener('blocked', (e) => console.warn('IDB Request was blocked: ' + e))

  request.addEventListener('success', (e) => {
    const db = e.target.result

    const transaction = db.transaction(storeName, 'readwrite')
    console.log('IDB Transaction Initiated')

    const request = transaction.objectStore(storeName).delete(idKeypath)

    request.addEventListener('success', () => console.log('IDB Transaction Completed'))

    db.close()

    loadTemplates()
  })
}

const editTemplate = (e, title, contents) => {
  const dbName = 'template-data'
  const storeName = 'templates'
  const version = 4

  const idKeypath = e.target.id

  const request = indexedDB.open(dbName, version)
  console.log('Open IDB Request made')

  request.addEventListener('error', (e) => {
    console.warn('IDB Request has an error: ' + e)
    console.log(e)
  })

  request.addEventListener('blocked', (e) => console.warn('IDB Request was blocked: ' + e))

  request.addEventListener('success', (e) => {
    const db = e.target.result

    const transaction = db.transaction(storeName, 'readwrite')
    console.log('IDB Transaction Initiated')

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

const copyTemplate = (e) => {
  const dbName = 'template-data'
  const storeName = 'templates'
  const version = 4

  const idKeypath = e.target.id

  const request = indexedDB.open(dbName, version)
  console.log('Open IDB Request made')

  request.addEventListener('error', (e) => {
    console.warn('IDB Request has an error: ' + e)
    console.log(e)
  })

  request.addEventListener('blocked', (e) => console.warn('IDB Request was blocked: ' + e))

  request.addEventListener('success', (e) => {
    const db = e.target.result

    const transaction = db.transaction(storeName)
    console.log('IDB Transaction Initiated')

    const objectStore = transaction.objectStore(storeName)
    const template = objectStore.get(idKeypath)

    template.addEventListener('success', (e) => {
      const template = e.target.result
      const contents = template.content

      const contentsBlob = new Blob([contents], { type: 'text/html' })
      const data = new ClipboardItem({
        ['text/html']: contentsBlob,
      })

      navigator.clipboard.write(data)
      console.log('Copied! ' + contents)

      db.close()
    })
  })
}

const displayData = (data) => {
  templateOptionsElement.replaceChildren([])
  const search = searchElement.value

  data.forEach((template) => {
    console.log(template)

    if (template.content.includes(search) || template.title.includes(search) || search === '') {
      const templateElement = document.createElement('div')
      const templateTitleElement = document.createElement('h2')
      const templateTextElement = document.createElement('div')
      const deleteTemplateButton = document.createElement('button')
      const editTemplateButton = document.createElement('button')
      const copyTemplateButton = document.createElement('button')

      templateElement.setAttribute('class', 'template')

      templateTitleElement.textContent = template.title
      templateTitleElement.setAttribute('class', 'template-title')

      templateTextElement.innerHTML = template.content
      templateTextElement.setAttribute('class', 'template-text')

      deleteTemplateButton.textContent = 'Delete'
      deleteTemplateButton.setAttribute('class', 'delete-button')
      deleteTemplateButton.setAttribute('id', template.id)
      deleteTemplateButton.addEventListener('click', (e) => {
        deleteTemplate(e)
      })

      editTemplateButton.textContent = 'Edit'
      editTemplateButton.setAttribute('class', 'edit-button')
      editTemplateButton.setAttribute('id', template.id)
      editTemplateButton.addEventListener('click', () => {
        editTemplateModal.showModal()
        saveButton.id = template.id
        editTemplateTitleInput.value = template.title
        suneditorEditElement.setContents(template.content)
      })

      copyTemplateButton.textContent = 'Copy'
      copyTemplateButton.setAttribute('class', 'copy-button')
      copyTemplateButton.setAttribute('id', template.id)
      copyTemplateButton.addEventListener('click', (e) => {
        copyTemplate(e)
      })

      templateOptionsElement.append(templateElement)
      templateElement.append(
        templateTitleElement,
        templateTextElement,
        deleteTemplateButton,
        editTemplateButton,
        copyTemplateButton,
      )
    }
  })

  if (templateOptionsElement.children.length === 0) {
    emptyTemplatesElement.hidden = false
  } else {
    emptyTemplatesElement.hidden = true
  }
}

const generateUID = () => {
  return Date.now().toString(36) + Math.random().toString(36)
}

//<====================STARTUP LOGIC================>
const suneditorAddElement = suneditor.create('template-text-area', {
  plugins: plugins,
  buttonList: [
    ['font', 'fontSize', 'formatBlock'],
    ['paragraphStyle', 'blockquote'],
    ['bold', 'underline', 'italic', 'strike'],
    ['fontColor', 'hiliteColor', 'textStyle'],
    ['removeFormat'],
    ['align', 'horizontalRule', 'list', 'lineHeight'],
    ['table', 'link', 'image', 'video'],
    ['fullScreen', 'showBlocks'],
    ['preview', 'print'],
  ],
  height: 340,
})

const suneditorEditElement = suneditor.create('template-edit-text-area', {
  plugins: plugins,
  buttonList: [
    ['font', 'fontSize', 'formatBlock'],
    ['paragraphStyle', 'blockquote'],
    ['bold', 'underline', 'italic', 'strike'],
    ['fontColor', 'hiliteColor', 'textStyle'],
    ['removeFormat'],
    ['align', 'horizontalRule', 'list', 'lineHeight'],
    ['table', 'link', 'image', 'video'],
    ['fullScreen', 'showBlocks'],
    ['preview', 'print'],
  ],
  height: 340,
})

loadTemplates()

//<===================EVENT LISTENERS================>
addTemplateButton.addEventListener('click', () => addTemplateModal.showModal())
closeTemplateModalButton.addEventListener('click', () => {
  addTemplateModal.close()
  templateTitleInput.value = ''
  suneditorAddElement.setContents('')
})
addTemplateModalButton.addEventListener('click', () => {
  if (templateTitleInput.value !== '') {
    addTemplate(suneditorAddElement.getContents(), templateTitleInput.value)
    addTemplateModal.close()
    templateTitleInput.value = ''
    suneditorAddElement.setContents('')
    loadTemplates()
  } else {
    missingTitleError.animate([{ opacity: '0%' }, { opacity: '100%' }], {
      duration: 100,
      fill: 'forwards',
    })
    setTimeout(() => {
      missingTitleError.animate([{ opacity: '100%' }, { opacity: '0%' }], {
        duration: 100,
        fill: 'forwards',
      })
    }, 2000)
  }
})
saveButton.addEventListener('click', (e) => {
  if (editTemplateTitleInput.value !== '') {
    editTemplate(e, editTemplateTitleInput.value, suneditorEditElement.getContents())
    editTemplateModal.close()
    editTemplateTitleInput.value = ''
    suneditorEditElement.setContents('')
  } else {
    missingTitleEditError.animate([{ opacity: '0%' }, { opacity: '100%' }], {
      duration: 100,
      fill: 'forwards',
    })
    setTimeout(() => {
      missingTitleEditError.animate([{ opacity: '100%' }, { opacity: '0%' }], {
        duration: 100,
        fill: 'forwards',
      })
    }, 2000)
  }
})
closeEditButton.addEventListener('click', () => {
  editTemplateModal.close()
  editTemplateTitleInput.value = ''
  suneditorEditElement.setContents('')
})
searchElement.addEventListener('keydown', () => {
  console.log("Herro")
  loadTemplates()
})
