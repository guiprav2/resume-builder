class CandidateRepo {
  loadCandidates() {
    let keys = [...Object.keys(localStorage)];
    return keys.filter(x => x.startsWith('mrb:candidate:')).map(x => x.split(':')[2]);
  }

  candidateName = id => {
    let data = JSON.parse(localStorage.getItem(`mrb:candidate:${id}`) || '{}');
    return [data.firstName, data.lastName].filter(Boolean).join(' ') || 'New Candidate';
  };

  loadCandidate(x) { return JSON.parse(localStorage.getItem(`mrb:candidate:${x}`) || '{}') }
  saveCandidate(x, data) { localStorage.setItem(`mrb:candidate:${x}`, JSON.stringify(data)) }
  deleteCandidate(x) { localStorage.removeItem(`mrb:candidate:${x}`) }
}

export default new CandidateRepo();