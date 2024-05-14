//<====================IMPORTS=====================>
import './index.css'
import 'suneditor/dist/css/suneditor.min.css'
import suneditor from 'suneditor'
import plugins from 'suneditor/src/plugins'
import trash_icon from '/Users/jgarner/Desktop/Programming/template-extension-migration/src/assets/trash_icon.png'
import edit_icon from '/Users/jgarner/Desktop/Programming/template-extension-migration/src/assets/edit_button.png'
import copy_icon from '/Users/jgarner/Desktop/Programming/template-extension-migration/src/assets/copy_button.png'
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

const loadTemplates = () => {
  //IDB Options
  const dbName = 'template-data'
  const storeName = 'templates'
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

      displayData(data)
    })
  })

  //Upgrade Needed IDB Request logic: createObjectStore with keypath as the id
  request.addEventListener('upgradeneeded', (e) => {
    const db = e.target.result
    db.createObjectStore(storeName, { keyPath: 'id' })

    db.close()
  })
}

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

const displayData = (data) => {
  //empties the templateOptions object to be repopulated
  templateOptionsElement.replaceChildren([])

  //get current search
  const search = searchElement.value

  //iterate through data argument, create template elements, append to templateOptions
  data.forEach((template) => {
    //check if search is populated, or if it's included in title or editor contents
    if (template.content.includes(search) || template.title.includes(search) || search === '') {
      //create elements for template model
      const templateElement = document.createElement('div')
      const templateTitleElement = document.createElement('h2')
      const templateTextElement = document.createElement('p')
      const deleteTemplateButton = document.createElement('button')
      const deleteTemplateButtonIcon = document.createElement('img')
      const editTemplateButton = document.createElement('button')
      const editTemplateButtonIcon = document.createElement('img')
      const copyTemplateButton = document.createElement('button')
      const copyTemplateButtonIcon = document.createElement('img')

      //main template model set up
      templateElement.setAttribute('class', 'template')

      //template title element set up
      templateTitleElement.textContent = template.title
      templateTitleElement.setAttribute('class', 'template-title')

      //template text element set up
      templateTextElement.innerHTML = template.content
      templateTextElement.setAttribute('class', 'template-text')

      //delete button set up
      deleteTemplateButton.setAttribute('class', 'delete-button')
      deleteTemplateButton.setAttribute('id', template.id)
      deleteTemplateButtonIcon.setAttribute('src', trash_icon)
      deleteTemplateButtonIcon.setAttribute('id', template.id)
      deleteTemplateButton.append(deleteTemplateButtonIcon)
      deleteTemplateButton.addEventListener('click', (e) => {
        deleteTemplate(e)
      })

      //edit button set up
      editTemplateButton.setAttribute('class', 'edit-button')
      editTemplateButton.setAttribute('id', template.id)
      editTemplateButton.addEventListener('click', () => {
        editTemplateModal.showModal()
        saveButton.id = template.id
        editTemplateTitleInput.value = template.title
        suneditorEditElement.setContents(template.content)
      })
      editTemplateButtonIcon.setAttribute('src', edit_icon)
      editTemplateButton.append(editTemplateButtonIcon)

      //copy button set up
      copyTemplateButton.setAttribute('class', 'copy-button')
      copyTemplateButton.setAttribute('id', template.id)
      copyTemplateButton.addEventListener('click', (e) => {
        copyTemplate(e)
      })
      copyTemplateButtonIcon.setAttribute('src', copy_icon)
      copyTemplateButtonIcon.setAttribute('id', template.id)
      copyTemplateButton.append(copyTemplateButtonIcon)

      //append elements to template model, append to template options
      templateOptionsElement.append(templateElement)
      templateElement.append(
        deleteTemplateButton,
        editTemplateButton,
        copyTemplateButton,
        templateTitleElement,
        templateTextElement,
      )
    }
  })

  //if there are no templates, display the 'No Templates' message
  if (templateOptionsElement.children.length === 0) {
    emptyTemplatesElement.hidden = false
  } else {
    emptyTemplatesElement.hidden = true
  }
}

const generateUID = () => {
  //generate UID based on current date and a random number
  return Date.now().toString(36) + Math.random().toString(36)
}

//<====================STARTUP LOGIC================>
//create editor for adding template
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
  height: 370,
  defaultStyle: 'background-color: #FDDEB7; border-radius: 5px;',
})

//create editor for editing template
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
  height: 370,
  defaultStyle: 'background-color: #FDDEB7; border-radius: 5px;',
})

//init load for display
loadTemplates()

//<===================EVENT LISTENERS================>
//shows add template modal
addTemplateButton.addEventListener('click', () => addTemplateModal.showModal())

//close add template modal
closeTemplateModalButton.addEventListener('click', () => {
  addTemplateModal.close()

  //reset modal contents
  templateTitleInput.value = ''
  suneditorAddElement.setContents('')
})

//adds template to IDB
addTemplateModalButton.addEventListener('click', () => {
  if (templateTitleInput.value !== '') {
    addTemplate(suneditorAddElement.getContents(), templateTitleInput.value)
    addTemplateModal.close()

    //reset modal contents
    templateTitleInput.value = ''
    suneditorAddElement.setContents('')
    loadTemplates()
  } else {
    //animate the missing title error if title is empty
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

//saves template after edit
saveButton.addEventListener('click', (e) => {
  if (editTemplateTitleInput.value !== '') {
    editTemplate(e, editTemplateTitleInput.value, suneditorEditElement.getContents())
    editTemplateModal.close()

    //reset modal contents
    editTemplateTitleInput.value = ''
    suneditorEditElement.setContents('')
  } else {
    //animate the missing title error if title is empty
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

//close edit modal
closeEditButton.addEventListener('click', () => {
  editTemplateModal.close()

  //reset modal contents
  editTemplateTitleInput.value = ''
  suneditorEditElement.setContents('')
})

//filter through list to display
searchElement.addEventListener('keydown', () => {
  loadTemplates()
})
