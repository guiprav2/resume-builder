import candidateRepo from '../repositories/candidate.js';
import d from '../other/dominant.js';
import templateRepo from '../repositories/template.js';
import { nanoid } from 'https://cdn.skypack.dev/nanoid';

class AppCtrl {
  state = {};

  constructor() {
    this.post('loadTemplates');
    this.post('loadCandidates');
  }

  post = (action, ...args) => {
    location.href.includes('debug=1') && console.log('appCtrl.post:', action, args);
    this[action](...args);
    d.update();
  };

  loadTemplates() { this.state.templates = templateRepo.loadTemplates() }
  loadCandidates() { this.state.candidates = candidateRepo.loadCandidates() }

  saveTemplate(x, data) {
    templateRepo.saveTemplate(x, data);
    this.post('loadTemplates');
  }

  newTemplate(name) {
    this.post('saveTemplate', nanoid(), { name, html: '' });
    this.post('loadTemplates');
  }

  renameTemplate(x, name) {
    this.post('saveTemplate', x, { ...this.loadTemplate(x), name });
    this.post('loadTemplates');
  }

  deleteTemplate(x) {
    templateRepo.deleteTemplate(x);
    if (this.state.openEntity === `template:${x}`) { this.state.openEntity = null }
    this.post('loadTemplates');
  }

  openTemplate(x) { this.state.openEntity = `template:${x}` }

  saveCandidate(x, data) {
    candidateRepo.saveCandidate(x, data);
    this.post('loadCandidates');
  }

  newCandidate() {
    let id = nanoid();
    this.post('saveCandidate', id, { firstName: '', lastName: '', template: 'builtin-1', experiences: [], education: [], skills: [] });
    this.post('loadCandidates');
    this.post('openCandidate', id)
  }

  deleteCandidate(x) {
    candidateRepo.deleteCandidate(x);
    if (this.state.openEntity === `candidate:${x}`) { this.state.openEntity = null }
    this.post('loadCandidates');
  }

  openCandidate(x) { this.state.openEntity = `candidate:${x}` }
}

let appCtrl = new AppCtrl();
function useAppCtrl() { return [appCtrl.state, appCtrl.post] }
export { useAppCtrl };