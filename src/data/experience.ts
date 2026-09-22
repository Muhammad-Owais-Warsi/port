export interface ExperienceItem {
    role: string;
    company: string;
    type?: string;
    start: string;
    end?: string;
    logo?: string;
}

export const EXPERIENCES: ExperienceItem[] = [
    {
        role: "Software Engineer",
        company: "Ressl AI (YC W26)",
        type: "Intern",
        start: "Sep 2026",
        end: "Present",
        logo: "/logo/ressl.jpg",
    },
    {
        role: "Founding Engineer",
        company: "Cueron",
        type: "Intern",
        start: "Dec 2025",
        end: "Jun 2026",
        logo: "/logo/cueron.jpg",
    },
];
