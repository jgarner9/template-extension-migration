//<==================IMPORTS===================>
import './index.css'
import { loadTimezones } from '../controllers/loadTimezones.js'
import { loadChecklist } from '../controllers/loadChecklist'
import { addChecklist } from '../controllers/addChecklist'

//<===============STARTUP LOGIC================>
//load up current time and timezones, set update interval
loadTimezones()
setInterval(loadTimezones, 1000)

//load checklist items in dashboard
loadChecklist()

//<==============EVENT LISTENERS==============>
const addChecklistModal = document.getElementById('add-checklist-modal')
const addButton = document.getElementById('add-checklist-button')
const closeAddChecklistButton = document.getElementById('close-add-button')
const addChecklistButton = document.getElementById('add-button')
const checklistInput = document.getElementById('checklist-text')

addButton.addEventListener('click', () => {
  addChecklistModal.showModal()
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
