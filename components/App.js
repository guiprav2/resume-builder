import CandidateEditor from './CandidateEditor.js';
import ConfirmationDialog from './ConfirmationDialog.js';
import PromptDialog from './PromptDialog.js';
import TemplateEditor from './TemplateEditor.js';
import appCtrl from '../controllers/app.js';
import candidateRepo from '../repositories/candidate.js';
import d from '../other/dominant.js';
import templateRepo from '../repositories/template.js';
import { showModal } from '../other/util.js';

class App {
  constructor() {
    d.effect(() => appCtrl.openEntity, x => {
      if (!x) { this.content = null; return }
      let [type, id] = x.split(':');
      switch (type) {
        case 'template': this.content = d.el(TemplateEditor, { id }); break;
        case 'candidate': this.content = d.el(CandidateEditor, { id }); break;
      }
    });
  }

  async newTemplate() {
    let [btn, detail] = await showModal(d.el(PromptDialog, { prompt: 'Template name:' }));
    if (btn !== 'ok') { return }
    appCtrl.post('newTemplate', detail);
  }

  async renameTemplate(x) {
    let [btn, detail] = await showModal(d.el(PromptDialog, { prompt: 'Template name:', initialValue: templateRepo.templateName(x) }));
    if (btn !== 'ok') { return }
    appCtrl.post('renameTemplate', x, detail);
  }

  async deleteTemplate(x) {
    let [btn] = await showModal(d.el(ConfirmationDialog, { prompt: 'Delete template?' }));
    if (btn !== 'ok') { return }
    appCtrl.post('deleteTemplate', x);
  }

  async deleteCandidate(x) {
    let [btn] = await showModal(d.el(ConfirmationDialog, { prompt: 'Delete candidate?' }));
    if (btn !== 'ok') { return }
    appCtrl.post('deleteCandidate', x);
  }

  onTemplateClick(ev, x) {
    if (ev.target.closest('button')) { return }
    appCtrl.post('openTemplate', x);
  }

  onCandidateClick(ev, x) {
    if (ev.target.closest('button')) { return }
    appCtrl.post('openCandidate', x);
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
              <button class="nf nf-fa-plus new-template-btn" ${{ onClick: () => this.newTemplate() }}></button>
            </div>
          </div>
          ${d.map(() => appCtrl.templates, x => d.html`
            <a href="#" ${{
              class: ['flex gap-2 justify-between items-center ml-3 px-3 py-1 rounded', () => appCtrl.openEntity === `template:${x}` && 'bg-black/25'],
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
              <button class="nf nf-fa-plus new-candidate-btn" ${{ onClick: () => appCtrl.post('newCandidate') }}></button>
            </div>
          </div>
          ${d.map(() => appCtrl.candidates, x => d.html`
            <a href="#" ${{
              class: ['flex gap-2 justify-between items-center rounded px-3 py-1 ml-3', () => appCtrl.openEntity === `candidate:${x}` && 'bg-black/25'],
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
