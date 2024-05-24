const displayChecklist = (data) => {
  data.forEach((item) => {
    const checklistOptions = document.getElementById('checklist-options')
    const checklistItem = document.createElement('div')
    const checklistText = document.createElement('h2')
    const checklistDone = document.createElement('button')

    checklistText.textContent = item.content

    checklistDone.textContent = "Done"

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
