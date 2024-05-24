import { completeChecklist } from './completeChecklist'

const displayChecklist = (data) => {
  const checklistOptions = document.getElementById('checklist-options')

  checklistOptions.replaceChildren([])

  data.forEach((item) => {
    const checklistItem = document.createElement('div')
    const checklistText = document.createElement('h2')
    const checklistDone = document.createElement('button')

    checklistText.textContent = item.content

    checklistDone.textContent = 'Done'
    checklistDone.id = item.id
    checklistDone.addEventListener('click', (e) => completeChecklist(e))

    checklistItem.append(checklistText, checklistDone)
    checklistOptions.append(checklistItem)
  })
  if (data.length === 0) {
    document.getElementById('no-checklists').hidden = false
  } else {
    document.getElementById('no-checklists').hidden = true
  }
}

export { displayChecklist }
