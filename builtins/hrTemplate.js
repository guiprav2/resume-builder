export default {
  name: 'HR',
  html: `<!doctype html>
<html>
    <head>
        <link rel="stylesheet" href="other/preflight.css">
        <script src="other/windy.js"></script>
    </head>
    <body class="min-h-screen sans bg-white">
        <div class="grid grid-cols-3 flex-1 rounded">
            <div class="col-span-2 p-6">
                <div class="flex flex-col justify-center h-40">
                    <div class="font-bold uppercase font-2xl">
                        {{firstName}} {{lastName}}
                    </div>
                    <div>
                        <div class="text-orange-500">
                            {{headline}}
                        </div>
                        <div class="text-neutral-600 font-sm flex print:flex-col items-center print:items-start gap-2 mt-1">
                            <div class="inline-flex items-center gap-2">
                                {{#if email}}
                                    <a href="mailto:{{email}}">
                                        <i class="nf nf-md-email"></i>
                                        {{email}}
                                    </a>
                                {{/if}}
                                {{#if phone}}
                                    <a href="tel:{{phone}}">
                                        <i class="nf nf-fa-phone"></i>
                                        {{phone}}
                                    </a>
                                {{/if}}
                            </div>
                            <div class="inline-flex items-center gap-2">
                                {{#if linkedin}}
                                    <a href="{{linkedin}}" target="linkedin">
                                        <i class="nf nf-md-linkedin"></i>
                                        {{linkedin_shortname linkedin}}
                                    </a>
                                {{/if}}
                                {{#if location}}
                                    <i class="nf nf-oct-location"></i>
                                    {{location}}
                                {{/if}}
                            </div>
                        </div>
                    </div>
                </div>
                {{#if summary}}
                    <div class="uppercase border-b mt-4 pb-1 border-neutral-400">Summary</div>
                    <pre class="mt-2 font-sm whitespace-pre-wrap sans">{{summary}}</pre>
                {{/if}}
                {{#if experiences.length}}
                    <div class="uppercase border-b mt-4 pb-1 border-neutral-400">Experience</div>
                    <div class="flex flex-col gap-3">
                        {{#each experiences}}
                            <div>
                                <div class="mt-2 flex justify-between items-center">
                                    <div class="text-neutral-800">{{this.title}}</div>
                                    <div class="font-sm text-neutral-600">{{timespan this}}</div>
                                </div>
                                <div class="flex justify-between items-center mt-1">
                                    <div class="text-orange-500">{{this.company}}</div>
                                    <div class="font-sm text-neutral-600">{{this.location}}</div>
                                </div>
                                <pre class="mt-2 font-sm whitespace-pre-wrap sans">{{description}}</pre>
                            </div>
                        {{/each}}
                    </div>
                {{/if}}
            </div>
            <div class="min-h-screen bg-red-700 border-red-900 p-3 text-white border-t-12">
                <div class="h-40"></div>
                {{#if skills.length}}
                    <div class="uppercase border-b mt-4 pb-1 border-white">Skills</div>
                    <div class="mt-2 font-sm">
                        {{#each skills}}
                            <div>{{skill this}}</div>
                        {{/each}}
                    </div>
                {{/if}}
                {{#if education.length}}
                    <div class="uppercase border-b mt-4 pb-1 border-white">Education</div>
                    {{#each education}}
                        <div class="mt-2 font-sm">
                            <div>{{timespan this}}</div>
                            <div>{{university}}</div>
                            <div>{{location}}</div>
                            {{#if degree}}
                                {{#if major}}
                                    <div class="font-bold">{{degree}} in {{major}}</div>
                                {{/if}}
                            {{/if}}
                        </div>
                    {{/each}}
                {{/if}}
            </div>
        </div>
        <div class="py-12 bg-neutral-200">
            <img src="https://assets-global.website-files.com/627cdcca8bc0d25e49b26705/62810a813afd94093a9b4fd2_Final-Logo-Manatal-tansparent.webp" class="w-12 mx-auto grayscale">
        </div>
    </body>
</html>`,
};
