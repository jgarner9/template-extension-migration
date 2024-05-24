//<==================IMPORTS===================>
import './index.css'
import { loadTimezones } from '../controllers/loadTimezones.js'
import { loadChecklist } from '../controllers/loadChecklist'

//<===============STARTUP LOGIC================>
//load up current time and timezones, set update interval
loadTimezones()
setInterval(loadTimezones, 1000)

//load checklist items in dashboard
loadChecklist()

//<==============EVENT LISTENERS==============>
const addChecklistModal = document.getElementById('add-checklist-modal')
const addChecklistButton = document.getElementById('add-checklist-button')
const closeAddChecklistButton = document.getElementById('close-add-button')

addChecklistButton.addEventListener('click', () => {
  addChecklistModal.showModal()
})

closeAddChecklistButton.addEventListener('click', () => {
  addChecklistModal.close()
})
