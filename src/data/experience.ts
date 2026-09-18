export interface ExperienceItem {
    title: string;
    company: string;
    location?: string;
    start: string;
    end?: string;
}

export const EXPERIENCES: ExperienceItem[] = [
    {title: "Software Intern", company: "Ressl AI (YC W26)", location: "Remote", start: "Sept 2026", end: "Present"},
    {
        title: "Founding Engineering Intern",
        company: "Cueron",
        location: "Remote",
        start: "Dec 2025",
        end: "Jun 2026",
    },
];
