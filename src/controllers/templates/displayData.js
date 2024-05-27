import { copyTemplate } from './copyTemplate'
import { deleteTemplate } from './deleteTemplate'
import trash_icon from '/Users/jgarner/Desktop/Programming/template-extension-migration/src/assets/trash_icon.png'
import edit_icon from '/Users/jgarner/Desktop/Programming/template-extension-migration/src/assets/edit_button.png'
import copy_icon from '/Users/jgarner/Desktop/Programming/template-extension-migration/src/assets/copy_button.png'
import { suneditorEditTemplateElement } from '../../popup'

const displayData = (data) => {
  //element variables
  const templateOptionsElement = document.getElementById('template-options')
  const editTemplateModal = document.getElementById('edit-template-modal')
  const emptyTemplatesElement = document.getElementById('no-templates')
  const searchElement = document.getElementById('template-search')
  const saveButton = document.querySelector('.save-edit-button')
  const editTemplateTitleInput = document.getElementById('edit-template-title-input')

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
        suneditorEditTemplateElement.setContents(template.content)
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

export { displayData }
