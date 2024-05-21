const displayChecklist = (data) => {
  data.forEach((item) => {
    const checklistItem = document.createElement('div')
    const checklistText = document.createElement('h2')
    const checklistDone = document.createElement('button')
    const checklistTrash = document.createElement('button')

    checklistItem.append(checklistText, checklistTrash, checklistDone)
  })
  if (data.length === 0) {
    document.getElementById('no-checklists').hidden = false
  } else {
    document.getElementById('no-checklists').hidden = true
  }
}

export { displayChecklist }
