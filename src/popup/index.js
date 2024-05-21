//<====================IMPORTS=====================>
import { loadTemplates } from '../controllers/loadTemplates'
import { addTemplate } from '../controllers/addTemplate'
import { editTemplate } from '../controllers/editTemplate'
import plugins from 'suneditor/src/plugins'
import suneditor from 'suneditor'
import 'suneditor/dist/css/suneditor.min.css'

//<====================STARTUP LOGIC================>
//init load for display
loadTemplates()
popupEventListeners()

//editor initiation
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
  defaultStyle: 'background-color: #FFFFFF; border-radius: 5px;',
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
  defaultStyle: 'background-color: #FFFFFF; border-radius: 5px;',
})

//<====================EVENT LISTENERS==============>
//element variables
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
