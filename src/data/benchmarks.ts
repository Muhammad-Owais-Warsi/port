export interface BenchmarkOrg {
    name: string;
    url: string;
}

export interface Benchmark {
    name: string;
    subtitle?: string;
    date: string;
    description: string;
    url: string;
    orgs?: BenchmarkOrg[];
}

export const BENCHMARKS: Benchmark[] = [
    {
        name: "C2A Bench",
        date: "Nov 2026",
        description:
            "Can an AI agent learn and adapt to changing business context to resolve customer issues?",
        url: "https://c2abench.com/",
        orgs: [
            { name: "New Measure", url: "https://newmeasure.ai/" },
            { name: "Observe.AI", url: "https://www.observe.ai/" },
        ],
    },
];
