import { Accordion } from "@base-ui/react/accordion";

const items = [
  {
    heading: "Problem",
    body: "Copying an Astro <Image> component from localhost fails silently in Paper. No image appears in the editor after paste.",
  },
  {
    heading: "Paper's suggested fix",
    body: 'Add allowedDomains to your Astro config:\n\nsecurity: {\n  allowedDomains: [{ hostname: "app.paper.design" }]\n}',
    code: true,
  },
  {
    heading: "Why it still fails",
    body: "Vite blocks cross-origin subresource requests at the dev server level regardless of Astro's security config. The /_image endpoint returns a CORS error because Vite's cross-site fetch guard fires before any Astro header can apply. This also affects images served from /public — even without the @fs absolute path, Vite still blocks the cross-origin fetch.",
  },
  {
    heading: "Fix for vanilla Vite + React",
    body: 'Adding these Vite server headers resolves it in a plain Vite+React project:\n\nserver: {\n  cors: true,\n  headers: {\n    "Access-Control-Allow-Origin": "*",\n    "Cross-Origin-Resource-Policy": "cross-origin"\n  }\n}',
    code: true,
  },
  {
    heading: "Astro caveat",
    body: "The same Vite server header config does not work in Astro — the headers appear to have no effect even after a hard reload of the dev server, Paper, and the browser. The working workaround is to run a production build first and snapshot from the built output.",
  },
];

function PlusIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
    </svg>
  );
}

export default function CORSThreadAccordion() {
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
        Context — Discord thread
      </p>
      <Accordion.Root className="flex flex-col w-full text-gray-900">
        {items.map((item) => (
          <Accordion.Item
            key={item.heading}
            className="border-b border-gray-100"
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-2 text-left text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors">
                {item.heading}
                <PlusIcon className="mr-1 size-2.5 shrink-0 text-gray-400 transition-transform ease-out group-data-panel-open:rotate-45 group-data-panel-open:scale-110" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] ease-out data-ending-style:h-0 data-starting-style:h-0">
              <div className="pb-3">
                {item.code ? (
                  <pre className="text-xs text-gray-600 bg-gray-50 rounded p-2 whitespace-pre-wrap leading-relaxed">
                    {item.body}
                  </pre>
                ) : (
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.body}
                  </p>
                )}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
