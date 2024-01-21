import appCtrl from '../controllers/app.js';
import templateRepo from '../repositories/template.js';

class TemplateEditor {
  constructor(props) { this.props = props }
  get id() { return this.props.id }

  onAttach = () => {
    let editor = ace.edit(this.root);
    editor.setTheme('ace/theme/monokai');
    editor.setFontSize('16px');
    editor.session.setMode(`ace/mode/html`);
    editor.session.setValue(templateRepo.loadTemplate(this.id).html || '');
    editor.session.on('change', () => {
      let data = templateRepo.loadTemplate(this.id);
      data.html = editor.session.getValue();
      appCtrl.post('saveTemplate', this.id, data);
    });
  };

  render = () => this.root = d.html`<div class="flex-1" ${{ onAttach: this.onAttach }}>`;
}

export default TemplateEditor;