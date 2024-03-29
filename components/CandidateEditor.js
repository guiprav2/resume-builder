import candidateRepo from '../repositories/candidate.js';
import d from '../other/dominant.js';
import debounce from 'https://cdn.skypack.dev/debounce';
import hbs from '../other/handlebars.js';
import templateRepo from '../repositories/template.js';
import { useAppCtrl } from '../controllers/AppCtrl.js';

class CandidateEditor {
  constructor(props) {
    this.props = props;
    let [state, post] = useAppCtrl();
    Object.assign(this, { state, post });

    d.effect(() => JSON.stringify(this.data), debounce(() => {
      this.post('saveCandidate', this.id, this.data);
      this.iframe = this.data?.template ? this.renderFrame() : null;
      d.update();
    }, 200));
  }

  get id() { return this.props.id }
  onAttach = () => { this.data = candidateRepo.loadCandidate(this.id) };

  renderFrame() {
    let iframe = d.html`<iframe class="flex-1 rounded">`;
    iframe.onload = () => {
      let templateData = templateRepo.loadTemplate(this.data.template);
      let doc = this.iframe.contentDocument;
      let empty = Object.values({ ...this.data, template: null }).every(x => Array.isArray(x) ? !x.length : !x);
      doc.open(); doc.write(hbs.compile(templateData.html)({ ...this.data, empty })); doc.close();
    };
    return iframe;
  }

  render = () => d.html`
    <div class="h-screen flex-1 flex bg-[#e5e5e5]">
      ${this.renderForm()}
      <div class="flex-1 flex flex-col gap-3 p-4 pl-2">
        <div class="flex justify-between">
          <span class="font-bold">Preview</span>
          <button class="rounded border border-black/25 px-3 font-sm" ${{ onClick: () => this.iframe.contentWindow.print(), disabled: () => !this.iframe }}>
            <i class="nf nf-fa-cloud_download"></i> Print or save as PDF
          </button>
        </div>
        ${d.portal(() => this.iframe)}
      </div>
    </div>
  `;

  renderForm = () => d.html`
    <div class="flex flex-col gap-3 w-96 p-4 pl-6 overflow-auto" ${{ onAttach: this.onAttach }}>
      <div class="font-bold">Basic Details</div>
      <div class="grid grid-cols-2 gap-3 max-w-sm">
        ${this.renderInput({ name: 'firstName', placeholder: 'First Name' })}
        ${this.renderInput({ name: 'lastName', placeholder: 'Last Name' })}
        ${this.renderInput({ name: 'headline', placeholder: 'Headline', span: 2 })}
        ${this.renderInput({ name: 'email', placeholder: 'E-mail' })}
        ${this.renderInput({ name: 'phone', placeholder: 'Phone' })}
        ${this.renderInput({ name: 'location', placeholder: 'Location', span: 2 })}
        ${this.renderInput({ name: 'linkedin', placeholder: 'LinkedIn URL', span: 2 })}
        <textarea
          class="rounded border-black/25 border px-3 font-sm outline-blue-500 focus:outline py-1 col-span-2 h-24"
          placeholder="Summary"
          ${{ value: d.binding({ get: () => this.data.summary, set: x => this.data.summary = x }), }}
        ></textarea>
        <select
          class="rounded border-black/25 border px-3 font-sm outline-blue-500 focus:outline py-1 col-span-2 bg-white"
          ${{ onChange: ev => this.data.template = ev.target.value }}
        >
          ${d.usePlaceholderTag('option', d.map(() => this.state.templates, x => d.html`
            <option ${{ value: x, selected: () => this.data.template === x }}>${d.text(() => templateRepo.templateName(x))}</option>
          `))}
        </select>
      </div>
      <div class="font-bold">Experiences</div>
      ${d.map(() => this.data.experiences, x => d.html`
        <div class="grid grid-cols-2 gap-3 max-w-sm">
          ${this.renderInput({ name: 'title', placeholder: 'Title', data: x })}
          ${this.renderInput({ name: 'company', placeholder: 'Company', data: x })}
          ${this.renderInput({ name: 'location', placeholder: 'Location', span: 2, data: x })}
          ${this.renderInput({ name: 'startDate', placeholder: 'Start Date', data: x })}
          ${this.renderInput({ name: 'endDate', placeholder: 'End Date', data: x })}
          <textarea
            class="rounded border-black/25 border px-3 font-sm outline-blue-500 focus:outline py-1 col-span-2 h-24"
            placeholder="Description"
            ${{ value: d.binding({ get: () => x.description, set: y => x.description = y }), }}
          ></textarea>
        </div>
        <button
          class="rounded border-black/25 border px-3 font-sm outline-blue-500 focus:outline py-1 col-span-2 flex items-center justify-center gap-2"
          ${{ onClick: () => this.data.experiences.splice(this.data.experiences.indexOf(x), 1) }}
        >
          <i class="nf nf-fa-trash"></i> Delete
        </button>
      `)}
      <button
        class="rounded border-black/25 border px-3 font-sm outline-blue-500 focus:outline py-1 col-span-2 flex items-center justify-center gap-2"
        ${{ onClick: () => this.data.experiences.push({}) }}
      >
        <i class="nf nf-fa-plus"></i> Add
      </button>
      <div class="font-bold">Education</div>
      ${d.map(() => this.data.education, x => d.html`
        <div class="grid grid-cols-2 gap-3 max-w-sm">
          ${this.renderInput({ name: 'degree', placeholder: 'Degree', data: x })}
          ${this.renderInput({ name: 'major', placeholder: 'Major', data: x })}
          ${this.renderInput({ name: 'university', placeholder: 'University', span: 2, data: x })}
          ${this.renderInput({ name: 'location', placeholder: 'Location', span: 2, data: x })}
          ${this.renderInput({ name: 'startDate', placeholder: 'Start Date', data: x })}
          ${this.renderInput({ name: 'endDate', placeholder: 'End Date', data: x })}
        </div>
        <button
          class="rounded border-black/25 border px-3 font-sm outline-blue-500 focus:outline py-1 col-span-2 flex items-center justify-center gap-2"
          ${{ onClick: () => this.data.education.splice(this.data.education.indexOf(x), 1) }}
        >
          <i class="nf nf-fa-trash"></i> Delete
        </button>
      `)}
      <button
        class="rounded border-black/25 border px-3 font-sm outline-blue-500 focus:outline py-1 col-span-2 flex items-center justify-center gap-2"
        ${{ onClick: () => this.data.education.push({}) }}
      >
        <i class="nf nf-fa-plus"></i> Add
      </button>
      <div class="font-bold">Skills</div>
      ${d.map(() => this.data.skills, x => d.html`
        <div class="grid gap-3 max-w-sm grid-cols-3">
          ${this.renderInput({ name: 'name', placeholder: 'Skill', span: 2, data: x })}
          <div class="flex gap-3 items-center">
            ${this.renderInput({ name: 'score', placeholder: 'Score', data: x })}
            <button class="nf nf-oct-x" ${{ onClick: () => this.data.skills.splice(this.data.skills.indexOf(x), 1) }}></button>
          </div>
        </div>
      `)}
      <button
        class="rounded border-black/25 border px-3 font-sm outline-blue-500 focus:outline py-1 col-span-2 flex items-center justify-center gap-2"
        ${{ onClick: () => this.data.skills.push({}) }}
      >
        <i class="nf nf-fa-plus"></i> Add
      </button>
    </div>
  `;

  renderInput = ({ name, placeholder, span = 1, data }) => d.html`
    <input ${{
      class: `w-full rounded border-black/25 border px-3 font-sm outline-blue-500 focus:outline py-1 col-span-${span}`,
      placeholder,
      value: d.binding({ get: () => (data || this.data)[name], set: x => (data || this.data)[name] = x }),
     }}>
  `;
}

export default CandidateEditor;
