import { deleteNote } from './deleteNote'
import trash_icon from '../../assets/trash_icon.png'
import edit_icon from '../../assets/edit_button.png'

const displayNotes = (data) => {
  //element variables
  const noteOptionsElement = document.getElementById('note-options')
  const editNoteModal = document.getElementById('edit-note-modal')
  const emptyNotesElement = document.getElementById('no-notes')
  const searchElement = document.getElementById('note-search')

  //empties the noteOptions object to be repopulated
  noteOptionsElement.replaceChildren([])

  //get current search
  const search = searchElement.value

  //iterate through data argument, create note elements, append to noteOptions
  data.forEach((note) => {
    //check if search is populated, or if it's included in title or editor contents
    if (note.content.includes(search) || note.title.includes(search) || search === '') {
      //create elements for note model
      const noteElement = document.createElement('div')
      const noteTitleElement = document.createElement('h2')
      const noteTextElement = document.createElement('p')
      const deleteNoteButton = document.createElement('button')
      const deleteNoteButtonIcon = document.createElement('img')
      const editNoteButton = document.createElement('button')
      const editNoteButtonIcon = document.createElement('img')

      //main note model set up
      noteElement.setAttribute('class', 'note')

      //note title element set up
      noteTitleElement.textContent = note.title
      noteTitleElement.setAttribute('class', 'note-title')

      //note text element set up
      noteTextElement.innerHTML = note.content
      noteTextElement.setAttribute('class', 'note-text')

      //delete button set up
      deleteNoteButton.setAttribute('class', 'delete-button')
      deleteNoteButton.setAttribute('id', note.id)
      deleteNoteButtonIcon.setAttribute('src', trash_icon)
      deleteNoteButtonIcon.setAttribute('id', note.id)
      deleteNoteButton.append(deleteNoteButtonIcon)
      deleteNoteButton.addEventListener('click', (e) => {
        deleteNote(e)
      })

      //edit button set up
      editNoteButton.setAttribute('class', 'edit-button')
      editNoteButton.setAttribute('id', note.id)
      editNoteButton.addEventListener('click', () => {
        editNoteModal.showModal()
        saveButton.id = note.id
        editnoteTitleInput.value = note.title
        suneditorEditElement.setContents(note.content)
      })
      editNoteButtonIcon.setAttribute('src', edit_icon)
      editNoteButton.append(editNoteButtonIcon)

      //append elements to note model, append to note options
      noteOptionsElement.append(noteElement)
      noteElement.append(
        deleteNoteButton,
        editNoteButton,
        copynoteButton,
        noteTitleElement,
        noteTextElement,
      )
    }
  })

  //if there are no notes, display the 'No notes' message
  if (noteOptionsElement.children.length === 0) {
    emptyNotesElement.hidden = false
  } else {
    emptyNotesElement.hidden = true
  }
}

export { displayNotes }
