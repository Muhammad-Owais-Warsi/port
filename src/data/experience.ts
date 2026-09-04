export interface ExperienceItem {
    title: string;
    company: string;
    location?: string;
    start: string;
    end?: string;
}

export const EXPERIENCES: ExperienceItem[] = [
    {
        title: "Founding Engineering Intern",
        company: "Cueron",
        location: "Remote",
        start: "Dec 2025",
        end: "Jun 2026",
    },
];
