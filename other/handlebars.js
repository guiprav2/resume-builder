import hbs from 'https://cdn.skypack.dev/handlebars';
hbs.registerHelper('linkedin_shortname', url => url.split('/').filter(Boolean).pop());
hbs.registerHelper('timespan', x => [x.startDate, x.endDate].filter(Boolean).join(' - '));
hbs.registerHelper('skill', x => [x.name, x.score].filter(Boolean).join(' - '));
export default hbs;