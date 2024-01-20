import hrTemplate from '../builtins/hrTemplate.js';
import warehouseTemplate from '../builtins/warehouseTemplate.js';

class TemplateRepo {
  constructor() { this.createBuiltins() }

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
    return keys.filter(x => x.startsWith('mrb:template:')).map(x => x.split(':')[2]);
  }

  templateName = id => {
    let data = JSON.parse(localStorage.getItem(`mrb:template:${id}`), '{}');
    return data.name || 'New Template';
  };

  loadTemplate(x) { return JSON.parse(localStorage.getItem(`mrb:template:${x}`) || '{}') }
  saveTemplate(x, data) { localStorage.setItem(`mrb:template:${x}`, JSON.stringify(data)) }
  deleteTemplate(x) { localStorage.removeItem(`mrb:template:${x}`) }
}

export default new TemplateRepo();