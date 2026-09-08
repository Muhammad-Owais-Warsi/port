export interface Project {
    name: string;
    description: string;
    url: string;
    stack: string[];
    launched?: boolean;
    launched_url?: string;
    launched_position?: string;
    latest?: boolean;
    cherryPicked?: boolean;
}

export const PROJECTS: Project[] = [
    {
        name: "Agent Scope",
        description: "Security layer for agents tool permissions.",
        url: "https://github.com/Muhammad-Owais-Warsi/agent-scope",
        stack: ["Typescript"],
        cherryPicked: true,
    },
    {
        name: "Better Pay",
        description: "The payment layer for modern applications.",
        url: "https://better-pay.gitbook.io/better-pay",
        stack: ["Typescript"],
        launched: true,
        launched_url: "https://peerlist.io/owais786/project/better-pay",
        launched_position: "#1",
        cherryPicked: true,
    },
    {
        name: "Flux",
        description: "Postman alternative built in Rust.",
        url: "https://flux-akeh.onrender.com/",
        stack: ["ReactJS", "Rust"],
        launched: true,
        launched_url: "https://peerlist.io/owais786/project/flux",
        launched_position: "#2",
        cherryPicked: true,
    },
    {
        name: "ChimpType",
        description: "Race your friends. Type like a chimp. 1 v 1 MonkeyType.",
        url: "https://peerlist.io/neils/project/chimptype",
        stack: ["ReactJS", "ExpressJS", "Pusher", "Supabase", "TailwindCSS"],
        launched: true,
        launched_url: "https://peerlist.io/neils/project/chimptype",
        launched_position: "#3",
        cherryPicked: true,
    },
    {
        name: "Dodo Payments Rust SDK",
        description: "Rust SDK to interact with Dodo Payments API.",
        url: "https://muhammad-owais-warsi.github.io/dodopayments_rust_sdk_docs/",
        stack: ["Rust"],
    },
    {
        name: "zurl",
        description: "A faster, simpler curl alternative — built in Rust.",
        url: "https://github.com/Muhammad-Owais-Warsi/zurl",
        stack: ["Rust"],
        launched: true,
        launched_url: "https://peerlist.io/owais786/project/zurl",
        launched_position: "#5",
    },
    {
        name: "ttfx-js",
        description: "A lightweight JavaScript toolkit for terminal text effects.",
        url: "https://github.com/Muhammad-Owais-Warsi/ttfx-js",
        stack: ["JavaScript"],
        latest: true,
        cherryPicked: true,
    },
];
