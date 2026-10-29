export function LogoMark() {
    return (
        <svg width="34" height="34" viewBox="0 0 30 30" aria-hidden="true">
            <rect width="30" height="30" rx="9" fill="#ffffff22" />
            <path d="M8 21c0-8 6-13 14-13 0 8-5 14-13 14" fill="#B7D69A" />
            <path d="M9 21c3-4 6-6 10-8" stroke="#24402A" strokeWidth="1.6" fill="none" />
        </svg>
    );
}

export function Sprig() {
    const leaves = [0, 1, 2, 3, 4];
    return (
        <svg className="sprig" viewBox="0 0 120 160" aria-hidden="true">
            <path d="M60 158C58 110 62 60 84 8" stroke="#3E6A42" strokeWidth="3" fill="none" />
            {leaves.map((i) => (
                <g key={i}>
                    <path d={`M${60 + i * 4} ${140 - i * 24}c-22-6-34-20-34-34 18 2 32 16 34 34z`} fill="#335A37" />
                    <path d={`M${62 + i * 4} ${128 - i * 24}c20-8 30-22 30-36-18 4-30 18-30 36z`} fill="#3E6A42" />
                </g>
            ))}
        </svg>
    );
}

export function EmptyPlate() {
    return (
        <svg width="220" height="190" viewBox="0 0 210 190" aria-hidden="true">
            <ellipse cx="105" cy="168" rx="80" ry="9" fill="#BFE0D3" />
            <circle cx="105" cy="98" r="62" fill="#fff" stroke="#8CCBB3" strokeWidth="3" />
            <circle cx="105" cy="98" r="44" fill="none" stroke="#D3ECE2" strokeWidth="3" />
            <rect x="22" y="48" width="7" height="102" rx="3.5" fill="#9AA79E" />
            <path d="M17 48v24M25.5 48v24M34 48v24M17 72q8.5 11 17 0" stroke="#9AA79E" strokeWidth="3" fill="none" strokeLinecap="round" />
            <rect x="181" y="48" width="7" height="102" rx="3.5" fill="#9AA79E" />
            <path d="M188 48q14 22 0 44z" fill="#9AA79E" />
        </svg>
    );
}

export function LoginArt() {
    return (
        <svg viewBox="0 0 210 200" width="280" aria-hidden="true">
            <circle cx="105" cy="100" r="90" fill="#2F5236" />
            <ellipse cx="105" cy="170" rx="80" ry="8" fill="#1d3622" />
            <rect x="50" y="46" width="44" height="118" rx="11" fill="#F3F7EF" />
            <rect x="60" y="32" width="24" height="16" rx="4" fill="#B7D69A" />
            <rect x="54" y="92" width="36" height="68" rx="7" fill="#C6DCEE" />
            <path d="M108 90h44l-6 74h-32z" fill="#F3F7EF" />
            <path d="M112 120h36l-3 40h-30z" fill="#C6DCEE" />
            <circle cx="166" cy="148" r="17" fill="#B8453A" />
            <path d="M166 131q3-10 11-7" stroke="#B7D69A" strokeWidth="2.5" fill="none" />
            <path d="M170 129q10-6 13 2q-8 4-13-2z" fill="#B7D69A" />
        </svg>
    );
}

export function ScaleCorner() {
    return (
        <svg className="corner" width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
            <rect x="14" y="30" width="68" height="56" rx="14" fill="#cfdcee" />
            <circle cx="48" cy="54" r="18" fill="#fff" />
            <path d="M48 54l9-9" stroke="#2E4A72" strokeWidth="3" strokeLinecap="round" />
            <circle cx="48" cy="54" r="3" fill="#2E4A72" />
        </svg>
    );
}

export function FlagCorner() {
    return (
        <svg className="corner" width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
            <path d="M8 84c18-2 22-20 40-22s26-16 36-30" stroke="#E9C987" strokeWidth="5" strokeDasharray="2 9" strokeLinecap="round" fill="none" />
            <path d="M78 12v26" stroke="#7A5212" strokeWidth="3" strokeLinecap="round" />
            <path d="M78 12h14l-4 6 4 6H78z" fill="#E2A13B" />
            <circle cx="8" cy="84" r="5" fill="#7A5212" />
        </svg>
    );
}

export function NavIcon({ name }: { name: "home" | "route" | "book" | "chat" | "users" | "out" }) {
    const paths = {
        home: <path d="M4 11l8-7 8 7v9h-5v-6h-6v6H4z" />,
        route: <><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.5 18H15a3.5 3.5 0 000-7H9a3.5 3.5 0 010-7h6.5" /></>,
        book: <><path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z" /><path d="M5 17a3 3 0 013-3h11" /></>,
        chat: <path d="M4 5h16v11H9l-5 4z" />,
        users: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 4.5a3.5 3.5 0 010 7M18 14c2 .8 3 2.8 3 6" /></>,
        out: <path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10" />,
    };
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {paths[name]}
        </svg>
    );
}

export const mealStyles = {
    BREAKFAST: { color: "#E2A13B", bg: "#FBF1DE", icon: <><circle cx="12" cy="13" r="4.5" /><path d="M12 3v3M4 13H2M22 13h-2M5.6 6.6l1.5 1.5M18.4 6.6l-1.5 1.5M4 20h16" /></> },
    LUNCH: { color: "#3F6B3A", bg: "#E6EEDF", icon: <><circle cx="12" cy="12" r="5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></> },
    SNACK: { color: "#B8453A", bg: "#F6E4E1", icon: <><path d="M12 7c-4-3-8 0-7 5s4 9 7 8c3 1 6-3 7-8s-3-8-7-5z" /><path d="M12 7c0-2 1-3 3-4" /></> },
    DINNER: { color: "#4E6FA0", bg: "#E3EBF5", icon: <path d="M20 14A8 8 0 1110 4a6.5 6.5 0 0010 10z" /> },
};

export function MealIcon({ type }: { type: keyof typeof mealStyles }) {
    const s = mealStyles[type];
    return (
        <span className="meal-icon" style={{ background: s.bg, color: s.color }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">{s.icon}</svg>
        </span>
    );
}
