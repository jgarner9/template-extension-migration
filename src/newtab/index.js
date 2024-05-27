//<==================IMPORTS===================>
import './index.css'
import { loadTimezones } from '../controllers/loadTimezones.js'
import { loadChecklist } from '../controllers/checklist/loadChecklist'
import { addChecklist } from '../controllers/checklist/addChecklist'
import { loadNotes } from '../controllers/notes/loadNotes'
import plugins from 'suneditor/src/plugins'
import suneditor from 'suneditor'
import 'suneditor/dist/css/suneditor.min.css'
import { addNote } from '../controllers/notes/addNote'
import { editNote } from '../controllers/notes/editNote'

//<===============STARTUP LOGIC================>
//load up current time and timezones, set update interval
loadTimezones()
setInterval(loadTimezones, 1000)

//load checklist items in dashboard
loadChecklist()
loadNotes()

const suneditorAddElement = suneditor.create('note-text-area', {
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
const suneditorEditElement = suneditor.create('note-edit-text-area', {
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

export { suneditorEditElement }

//<==============EVENT LISTENERS==============>
const addChecklistModal = document.getElementById('add-checklist-modal')
const addButton = document.getElementById('add-checklist-button')
const closeAddChecklistButton = document.getElementById('close-add-button')
const addChecklistButton = document.getElementById('add-button')
const checklistInput = document.getElementById('checklist-text')
const addNoteButton = document.getElementById('add-note-button')
const addNoteModal = document.getElementById('add-note-modal')
const addNoteTitleInput = document.getElementById('note-title-input')
const closeAddNoteModal = document.getElementById('close-button')
const saveNoteButton = document.getElementById('save-add-button')
const missingTitleError = document.getElementById('missing-title-error')
const saveEditNoteButton = document.querySelector('.note-save-edit-button')
const closeEditNoteButton = document.getElementById('note-close-edit-button')
const editNoteTitleInput = document.getElementById('edit-note-title-input')
const editNoteModal = document.getElementById('edit-note-modal')
const missingTitleEditError = document.getElementById('missing-title-edit-error')

addButton.addEventListener('click', () => {
  addChecklistModal.showModal()
  checklistInput.value = ''
})

closeAddChecklistButton.addEventListener('click', () => {
  addChecklistModal.close()
  checklistInput.value = ''
})

addChecklistButton.addEventListener('click', () => {
  addChecklist(checklistInput.value)
  addChecklistModal.close()
  checklistInput.value = ''
  loadChecklist()
})

addNoteButton.addEventListener('click', () => {
  addNoteModal.showModal()
  addNoteTitleInput.value = ''
  suneditorAddElement.setContents('')
})

closeAddNoteModal.addEventListener('click', () => {
  addNoteModal.close()
  addNoteTitleInput.value = ''
  suneditorAddElement.setContents('')
})

closeEditNoteButton.addEventListener('click', () => {
  editNoteModal.close()
  addNoteTitleInput.value = ''
  suneditorEditElement.setContents('')
})

saveNoteButton.addEventListener('click', () => {
  if (addNoteTitleInput.value !== '') {
    addNote(suneditorAddElement.getContents(), addNoteTitleInput.value)
    addNoteModal.close()

    //reset modal contents
    addNoteTitleInput.value = ''
    suneditorAddElement.setContents('')
    loadNotes()
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

saveEditNoteButton.addEventListener('click', (e) => {
  if (editNoteTitleInput.value !== '') {
    editNote(e, editNoteTitleInput.value, suneditorEditElement.getContents())
    editNoteModal.close()

    //reset modal contents
    editNoteTitleInput.value = ''
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