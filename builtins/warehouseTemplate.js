export default {
  name: 'Warehouse',
  html: `<!doctype html>
<html>
    <head>
        <link rel="stylesheet" href="other/preflight.css">
        <script src="other/windy.js"></script>
    </head>
    <body class="sans bg-white">
        <div class="min-h-screen flex-1 rounded bg-white">
            <div class="bg-[#8a9d6e] h-32 flex justify-center items-center">
                <div class="font-3xl text-white">Warehouse Resume</div>
            </div>
            {{#if empty}}
                <div class="mt-32 text-center">
                    <div class="nf nf-fa-user font-5xl text-neutral-600"></div>
                    <div class="mt-4 text-neutral-800">Enter candidate details to start</div>
                </div>
            {{/if}}
            <div class="mt-8 p-4 grid grid-cols-3 gap-3 font-neutral-700">
                <div class="col-span-2">
                    {{#if summary}}
                        <div class="uppercase font-bold">Career Objective</div>
                        <div class="my-4">{{summary}}</div>
                    {{/if}}
                    {{#if experiences.length}}
                        <div class="uppercase font-bold">Professional Experience</div>
                        {{#each experiences}}
                            <div class="my-4">
                                <div class="font-sm">
                                    {{timespan this}} | {{company}}, {{location}}
                                </div>
                                <div class="font-bold text-black">{{title}}</div>
                                <div class="mt-2 font-sm">{{description}}</div>
                            </div>
                        {{/each}}
                    {{/if}}
                </div>
                <div class="font-sm">
                    <div class="mb-4">
                        {{#if firstName}}
                            <div class="flex items-center gap-3">
                                <div class="nf nf-fa-user"></div>
                                <div>{{firstName}} {{lastName}}</div>
                            </div>
                        {{/if}}
                        {{#if headline}}
                            <div class="flex items-center gap-3">
                                <div class="nf nf-md-hexagon"></div>
                                <div>{{headline}}</div>
                            </div>
                        {{/if}}
                        {{#if location}}
                            <div class="flex items-center gap-3">
                                <div class="nf nf-oct-location"></div>
                                <div>{{location}}</div>
                            </div>
                        {{/if}}
                        {{#if phone}}
                            <div class="flex items-center gap-3">
                                <div class="nf nf-fa-phone"></div>
                                <a href="tel:{{phone}}">{{phone}}</a>
                            </div>
                        {{/if}}
                        {{#if email}}
                            <div class="flex items-center gap-3">
                                <div class="nf nf-md-email"></div>
                                <a href="mailto:{{email}}">{{email}}</a>
                            </div>
                        {{/if}}
                        {{#if linkedin}}
                            <div class="flex items-center gap-3">
                                <div class="nf nf-fa-linkedin"></div>
                                <a href="{{linkedin}}">{{linkedin_shortname linkedin}}</a>
                            </div>
                        {{/if}}
                    </div>
                    {{#if education.length}}
                        <div class="uppercase font-base font-bold">Education</div>
                        {{#each education}}
                            <div class="font-sm my-2">
                                <div>{{timespan this}}</div>
                                <div>{{university}}</div>
                                <div>{{location}}</div>
                                <div class="font-bold">{{degree}}, {{major}}</div>
                            </div>
                        {{/each}}
                    {{/if}}
                    {{#if skills.length}}
                        <div class="uppercase font-base font-bold">Relevant Skills</div>
                        <div class="mt-2">
                            {{#each skills}}
                                <div>{{skill this}}</div>
                            {{/each}}
                        </div>
                    {{/if}}
                </div>
            </div>
        </div>
        <div class="py-12 bg-neutral-200">
            <img src="https://assets-global.website-files.com/627cdcca8bc0d25e49b26705/62810a813afd94093a9b4fd2_Final-Logo-Manatal-tansparent.webp" class="w-12 mx-auto grayscale">
        </div>
    </body>
</html>`,
};
