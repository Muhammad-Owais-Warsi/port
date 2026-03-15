import { SiPeerlist } from "react-icons/si";
import { FaHashnode } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa6";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Dock() {
    const links = [
        {
            name: "GitHub",
            url: "https://github.com/Muhammad-Owais-Warsi",
            icon: <FaGithub className="w-4 h-4" />,
        },
        {
            name: "LinkedIn",
            url: "https://linkedin.com/in/muhammad-owais-warsi",
            icon: <FaLinkedin className="w-4 h-4" />,
        },
        {
            name: "Twitter",
            url: "https://twitter.com/MO_warsi786",
            icon: <FaTwitter className="w-4 h-4" />,
        },
        {
            name: "Email",
            url: "mailto:warsimuhammadowais@gmail.com",
            icon: <FaEnvelope className="w-4 h-4" />,
        },
        {
            name: "Peerlist",
            url: "https://peerlist.io/owais786",
            icon: <SiPeerlist className="w-4 h-4" />,
        },
    ];

    return (
        <TooltipProvider>
            <div className="fixed bottom-2 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-border bg-background px-2 sm:px-4 py-1.5 sm:py-3">
                    {links.map((link, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-full text-muted-foreground hover:text-primary"
                                >
                                    {link.icon}
                                    <span className="sr-only">{link.name}</span>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover text-popover-foreground border border-border text-xs sm:text-sm">
                                {link.name}
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </div>
        </TooltipProvider>
    );
}
