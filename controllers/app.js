import candidateRepo from '../repositories/candidate.js';
import d from '../other/dominant.js';
import templateRepo from '../repositories/template.js';
import { nanoid } from 'https://cdn.skypack.dev/nanoid';

class AppCtrl {
  constructor() {
    this.post('loadTemplates');
    this.post('loadCandidates');
  }

  post(action, ...args) {
    console.log('appCtrl.post:', action, args);
    this[action](...args);
    d.update();
  }

  loadTemplates() {
    let keys = [...Object.keys(localStorage)];
    this.templates = keys.filter(x => x.startsWith('mrb:template:')).map(x => x.split(':')[2]);
  }

  loadCandidates() {
    let keys = [...Object.keys(localStorage)];
    this.candidates = keys.filter(x => x.startsWith('mrb:candidate:')).map(x => x.split(':')[2]);
  }

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
    if (this.openEntity === `template:${x}`) { this.openEntity = null }
    this.post('loadTemplates');
  }

  openTemplate(x) { this.openEntity = `template:${x}` }

  saveCandidate(x, data) {
    candidateRepo.saveCandidate(x, data);
    this.post('loadCandidates');
  }

  newCandidate() {
    this.post('saveCandidate', nanoid(), { firstName: '', lastName: '', template: 'builtin-1', experiences: [], education: [], skills: [] });
    this.post('loadCandidates');
  }

  deleteCandidate(x) {
    candidateRepo.deleteCandidate(x);
    if (this.openEntity === `candidate:${x}`) { this.openEntity = null }
    this.post('loadCandidates');
  }

  openCandidate(x) { this.openEntity = `candidate:${x}` }
}

export default new AppCtrl();