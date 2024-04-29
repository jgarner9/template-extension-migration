import './index.css'
import 'suneditor/dist/css/suneditor.min.css'
import suneditor from 'suneditor'
import plugins from 'suneditor/src/plugins'

const templateOptionsElement = document.getElementById('template-options')
const emptyTemplatesElement = document.getElementById('no-templates')
const addTemplateButton = document.getElementById('add-template-button')
const addTemplateModal = document.getElementById('add-template-modal')
const closeTemplateModalButton = document.getElementById('close-button')

const addTemplate = () => {
  addTemplateModal.showModal()
}

suneditor.create('template-text-area', {
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
  height: 200,
})

if (templateOptionsElement.children.length === 0) {
  emptyTemplatesElement.hidden = false
} else {
  emptyTemplatesElement.hidden = true
}

addTemplateButton.addEventListener('click', () => addTemplate())
closeTemplateModalButton.addEventListener('click', () => addTemplateModal.close())
