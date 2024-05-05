//<====================IMPORTS=====================>
import './index.css'
import 'suneditor/dist/css/suneditor.min.css'
import suneditor from 'suneditor'
import plugins, { template } from 'suneditor/src/plugins'

//<====================DOM OBJECTS==================>
const templateOptionsElement = document.getElementById('template-options')
const emptyTemplatesElement = document.getElementById('no-templates')
const addTemplateButton = document.getElementById('add-template-button')
const addTemplateModal = document.getElementById('add-template-modal')
const closeTemplateModalButton = document.getElementById('close-button')
const addTemplateModalButton = document.getElementById('add-button')
const templateTitleInput = document.getElementById('template-title-input')
const missingTitleError = document.getElementById('missing-title-error')

//<====================FUNCTIONS=====================>
const addTemplate = (data, title) => {
  const dbName = 'template-data'
  const storeName = 'templates'
  const version = 4

  const request = indexedDB.open(dbName, version)
  console.log('Open IDB Request made')

  request.addEventListener('error', (e) => console.warn('IDB Request has an error: ' + e))

  request.addEventListener('blocked', (e) => console.warn('IDB Request was blocked: ' + e))

  console.log('Add Template Controller Initiated')
  console.log(request)
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

const displayData = (data) => {
  templateOptionsElement.replaceChildren([])
  data.forEach((template) => {
    console.log(template)
    const templateElement = document.createElement('div')
    const templateTitleElement = document.createElement('h2')
    const templateTextElement = document.createElement('div')

    templateElement.setAttribute('class', 'template')

    templateTitleElement.textContent = template.title
    templateTitleElement.setAttribute('class', 'template-title')

    templateTextElement.innerHTML = template.content
    templateTextElement.setAttribute('class', 'template-text')

    templateOptionsElement.append(templateElement)
    templateElement.append(templateTitleElement, templateTextElement)
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

//<====================BUSINESS LOGIC================>
const suneditorElement = suneditor.create('template-text-area', {
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
  suneditorElement.setContents('')
})
addTemplateModalButton.addEventListener('click', () => {
  console.log('hello')
  if (templateTitleInput.value !== '') {
    console.log('Adding template')
    addTemplate(suneditorElement.getContents(), templateTitleInput.value)
    addTemplateModal.close()
    templateTitleInput.value = ''
    suneditorElement.setContents('')
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
