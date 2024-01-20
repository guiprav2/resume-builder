import CandidateEditor from './CandidateEditor.js';
import ConfirmationDialog from './ConfirmationDialog.js';
import PromptDialog from './PromptDialog.js';
import candidateRepo from '../repositories/candidate.js';
import d from '../other/dominant.js';
import templateRepo from '../repositories/template.js';
import { nanoid } from 'https://cdn.skypack.dev/nanoid';
import { showModal } from '../other/util.js';

class App {
  constructor() {
    this.loadTemplates();
    this.loadCandidates();
  }

  loadTemplates() { this.templates = templateRepo.loadTemplates() }
  loadCandidates() { this.candidates = candidateRepo.loadCandidates() }

  async newTemplate() {
    let [btn, detail] = await showModal(d.el(PromptDialog, { prompt: 'Template name:' }));
    if (btn !== 'ok') { return }
    templateRepo.saveTemplate(nanoid(), { name: detail, html: '' });
    this.loadTemplates();
  }

  async renameTemplate(x) {
    let [btn, detail] = await showModal(d.el(PromptDialog, { prompt: 'Template name:', initialValue: templateRepo.templateName(x) }));
    if (btn !== 'ok') { return }
    templateRepo.saveTemplate(x, { ...templateRepo.loadTemplate(x), name: detail });
    this.loadTemplates();
  }

  async deleteTemplate(x) {
    let [btn] = await showModal(d.el(ConfirmationDialog, { prompt: 'Delete template?' }));
    if (btn !== 'ok') { return }
    templateRepo.deleteTemplate(x);
    if (this.openEntity === `template:${x}`) { this.content = this.openEntity = null }
    this.loadTemplates();
  }

  newCandidate() {
    let id = nanoid();
    candidateRepo.saveCandidate(id, {});
    this.loadCandidates();
    this.openCandidate(id)
  }

  async deleteCandidate(x) {
    let [btn] = await showModal(d.el(ConfirmationDialog, { prompt: 'Delete candidate?' }));
    if (btn !== 'ok') { return }
    candidateRepo.deleteCandidate(x);
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
                <i class="nf nf-cod-code"></i> ${d.text(() => templateRepo.templateName(x))}
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
                <i class="nf nf-fa-user"></i> ${d.text(() => candidateRepo.candidateName(x))}
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
