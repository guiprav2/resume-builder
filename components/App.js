import CandidateEditor from './CandidateEditor.js';
import ConfirmationDialog from './ConfirmationDialog.js';
import PromptDialog from './PromptDialog.js';
import d from '../other/dominant.js';
import hrTemplate from '../builtins/hrTemplate.js';
import warehouseTemplate from '../builtins/warehouseTemplate.js';
import { nanoid } from 'https://cdn.skypack.dev/nanoid';
import { showModal } from '../other/util.js';

class App {
  constructor() {
    this.createBuiltins();
    this.loadTemplates();
    this.loadCandidates();
  }

  createBuiltins() {
    let keys = [...Object.keys(localStorage)];
    let templates = keys.filter(x => x.startsWith('mrb:template:')).length;
    if (!templates) {
      localStorage.setItem(`mrb:template:builtin-1`, JSON.stringify(hrTemplate))
      localStorage.setItem(`mrb:template:builtin-2`, JSON.stringify(warehouseTemplate))
    }
  }

  loadTemplates() {
    let keys = [...Object.keys(localStorage)];
    this.templates = keys.filter(x => x.startsWith('mrb:template:')).map(x => x.split(':')[2]);
    d.update();
  }

  loadCandidates() {
    let keys = [...Object.keys(localStorage)];
    this.candidates = keys.filter(x => x.startsWith('mrb:candidate:')).map(x => x.split(':')[2]);
    d.update();
  }

  templateName = id => {
    let data = JSON.parse(localStorage.getItem(`mrb:template:${id}`), '{}');
    return data.name || null;
  };

  candidateName = id => {
    let data = JSON.parse(localStorage.getItem(`mrb:candidate:${id}`) || '{}');
    return [data.firstName, data.lastName].filter(Boolean).join(' ') || 'Unnamed Candidate';
  };

  async newTemplate() {
    let [btn, detail] = await showModal(d.el(PromptDialog, { prompt: 'Template name:' }));
    if (btn !== 'ok') { return }
    localStorage.setItem(`mrb:template:${nanoid()}`, JSON.stringify({ name: detail }));
    this.loadTemplates();
  }

  async renameTemplate(x) {
    let [btn, detail] = await showModal(d.el(PromptDialog, { prompt: 'Template name:', initialValue: this.templateName(x) }));
    if (btn !== 'ok') { return }
    let data = JSON.parse(localStorage.getItem(`mrb:template:${x}`) || '{}');
    data.name = detail;
    localStorage.setItem(`mrb:template:${x}`, JSON.stringify(data));
    this.loadTemplates();
  }

  async deleteTemplate(x) {
    let [btn] = await showModal(d.el(ConfirmationDialog, { prompt: 'Delete template?' }));
    if (btn !== 'ok') { return }
    localStorage.removeItem(`mrb:template:${x}`);
    if (this.openEntity === `template:${x}`) { this.content = this.openEntity = null }
    this.loadTemplates();
  }

  newCandidate() {
    let id = nanoid();
    localStorage.setItem(`mrb:candidate:${id}`, '{}');
    this.loadCandidates();
    this.openCandidate(id)
  }

  async deleteCandidate(x) {
    let [btn] = await showModal(d.el(ConfirmationDialog, { prompt: 'Delete candidate?' }));
    if (btn !== 'ok') { return }
    localStorage.removeItem(`mrb:candidate:${x}`);
    if (this.openEntity === `candidate:${x}`) { this.content = this.openEntity = null }
    this.loadCandidates();
  }

  onTemplateClick(ev, x) {
    if (ev.target.closest('button')) { return }
    this.openTemplate(x);
  }

  openTemplate(x) {
    this.content = d.html`<div class="flex-1">`;
    let editor = ace.edit(this.content);
    editor.setTheme('ace/theme/monokai');
    editor.setFontSize('16px');
    editor.session.setMode(`ace/mode/html`);
    let data = JSON.parse(localStorage.getItem(`mrb:template:${x}`) || '{}');
    editor.session.setValue(data.html || '');
    editor.session.on('change', () => {
      let data = JSON.parse(localStorage.getItem(`mrb:template:${x}`) || '{}');
      data.html = editor.session.getValue();
      localStorage.setItem(`mrb:template:${x}`, JSON.stringify(data));
    });
    this.openEntity = `template:${x}`;
  }

  onCandidateClick(ev, x) {
    if (ev.target.closest('button')) { return }
    this.openCandidate(x);
  }

  openCandidate(x) {
    this.content = d.el(CandidateEditor, { app: this, id: x });
    this.openEntity = `candidate:${x}`;
  }

  render = () => d.html`
    <div class="flex">
      ${this.renderSidebar()}
      ${d.portal(() => this.content)}
    </div>
  `;

  renderSidebar = () => d.html`
    <div class="w-80 h-screen shrink-0 flex flex-col bg-[#2b2d31] text-[#949ba4] shadow-2xl">
      <div class="border-b border-[#1f2124] px-5 py-3">
        <div class="text-center text-gray-100">The Resume Builder</div>
      </div>
      <div class="flex-1 overflow-auto">
        <div class="flex flex-col gap-1 p-3 text-sm">
          <div class="flex gap-2 justify-between items-center rounded px-3 py-1">
            <div class="flex gap-2 items-center">
              <i class="nf nf-fa-folder"></i> Templates
            </div>
            <div class="relative top-[-1px] flex gap-2">
              <button class="nf nf-fa-plus" ${{ onClick: () => this.newTemplate() }}></button>
            </div>
          </div>
          ${d.map(() => this.templates, x => d.html`
            <a href="#" ${{
              class: ['flex gap-2 justify-between items-center ml-3 px-3 py-1 rounded', () => this.openEntity === `template:${x}` && 'bg-black/25'],
              onClick: ev => this.onTemplateClick(ev, x),
            }}>
              <div class="flex gap-2 items-center">
                <i class="nf nf-cod-code"></i> ${d.text(() => this.templateName(x))}
              </div>
              <div class="relative top-[-1px] flex gap-2">
                <button class="nf nf-fa-pencil" ${{ onClick: () => this.renameTemplate(x) }}></button>
                <button class="nf nf-fa-trash" ${{ onClick: () => this.deleteTemplate(x) }}></button>
              </div>
            </a>
          `)}
          <div class="flex gap-2 justify-between items-center rounded px-3 py-1">
            <div class="flex gap-2 items-center">
              <i class="nf nf-fa-folder"></i> Candidates
            </div>
            <div class="relative top-[-1px] flex gap-2">
              <button class="nf nf-fa-plus" ${{ onClick: () => this.newCandidate() }}></button>
            </div>
          </div>
          ${d.map(() => this.candidates, x => d.html`
            <a href="#" ${{
              class: ['flex gap-2 justify-between items-center rounded px-3 py-1 ml-3', () => this.openEntity === `candidate:${x}` && 'bg-black/25'],
              onClick: ev => this.onCandidateClick(ev, x),
            }}>
              <div class="flex gap-2 items-center">
                <i class="nf nf-fa-user"></i> ${d.text(() => this.candidateName(x))}
              </div>
              <div class="relative top-[-1px] flex gap-2">
                <button class="nf nf-fa-trash" ${{ onClick: () => this.deleteCandidate(x) }}></button>
              </div>
            </a>
          `)}
        </div>
      </div>
    </div>
  `;
}

export default App;
