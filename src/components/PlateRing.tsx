import type { MealType } from "../types/meals";
import { mealStyles } from "./Illustrations";

const ORDER: MealType[] = ["BREAKFAST", "LUNCH", "SNACK", "DINNER"];
const LABELS: Record<MealType, string> = { BREAKFAST: "בוקר", LUNCH: "צהריים", SNACK: "ביניים", DINNER: "ערב" };
const R = 118;
const CIRC = 2 * Math.PI * R;

interface PlateRingProps {
    byMeal: Record<MealType, number>;
    total: number;
    target: number | null;
}

export default function PlateRing({ byMeal, total, target }: PlateRingProps) {
    const scale = Math.max(target ?? 0, total, 1);
    let start = 0;
    const arcs = ORDER.filter((t) => byMeal[t] > 0).map((t) => {
        const length = (byMeal[t] / scale) * CIRC;
        const arc = { type: t, length: Math.max(length - 5, 1), offset: start + 2 };
        start += length;
        return arc;
    });
    const remaining = target !== null ? target - total : null;

    return (
        <div className="plate">
            <svg width="270" height="270" viewBox="0 0 260 260" role="img" aria-label={`נאכלו ${total} קלוריות${target ? ` מתוך ${target}` : ""}`}>
                <circle cx="130" cy="130" r={R} fill="none" stroke="#CFDDC6" strokeWidth="16" />
                {arcs.map((a) => (
                    <circle key={a.type} cx="130" cy="130" r={R} fill="none" stroke={mealStyles[a.type].color} strokeWidth="16"
                        strokeLinecap="round" strokeDasharray={`${a.length} ${CIRC}`} strokeDashoffset={-a.offset} transform="rotate(-90 130 130)" />
                ))}
                <circle cx="130" cy="130" r="96" fill="#fff" />
                <circle cx="130" cy="130" r="80" fill="none" stroke="#E6EEDF" strokeWidth="3" />
                <path d="M114 84c4-14 22-19 34-9-7 11-23 14-34 9z" fill="#7FA45A" />
                <circle cx="108" cy="92" r="7" fill="#B8453A" />
                <circle cx="152" cy="90" r="6" fill="#E2A13B" />
                <text x="130" y="140" textAnchor="middle" className="plate-total">{total.toLocaleString()}</text>
                <text x="130" y="166" textAnchor="middle" className="plate-sub">{target ? `מתוך ${target.toLocaleString()} קלוריות` : "קלוריות היום"}</text>
            </svg>
            <div className="legend">
                {ORDER.filter((t) => byMeal[t] > 0).map((t) => (
                    <span key={t}><i style={{ background: mealStyles[t].color }} />{LABELS[t]} <b>{byMeal[t]}</b></span>
                ))}
                {remaining !== null && remaining > 0 && (
                    <span><i style={{ background: "#CFDDC6" }} />נשאר <b>{remaining}</b></span>
                )}
            </div>
        </div>
    );
}
