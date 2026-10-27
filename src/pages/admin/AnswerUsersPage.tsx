import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getConsultations } from "../../api/consultations";
import AnswerForm from "../../components/AnswerForm";
import type { ConsultationStatus } from "../../types/consultations";

function AnswerUsersPage() {

    const [status, setStatus] = useState<ConsultationStatus | "">("PENDING");
    const [openId, setOpenId] = useState<number | null>(null);

    const { data: consultations, isLoading, error } = useQuery({
        queryKey: ["consulations", status],
        queryFn: () => getConsultations(status || undefined)
    });

    return (
        <>
            <h2>פניות משתמשים</h2>

            <label>הצגת פניות
                <select value={status} onChange={(e) => setStatus(e.target.value as ConsultationStatus | "")}>
                    <option value="PENDING">ממתינות לתשובה</option>
                    <option value="ANSWERED">נענו</option>
                    <option value="">הכל</option>
                </select>
            </label>

            {isLoading && <p>טוען...</p>}
            {error && <p className="error">{error.message}</p>}
            {consultations?.length === 0 && <p>אין פניות להצגה</p>}

            <ul>
                {consultations?.map((c) => (
                    <li key={c.id}>
                        <h3>{c.subject}</h3>
                        <p>מאת: {c.user?.fullName} ({c.user?.email})</p>
                        <p>{c.message}</p>
                        <p>מצב: {c.statusLabel}</p>

                        {c.answer && (
                            <div>
                                <strong>תשובת הדיאטן:</strong>
                                <p>{c.answer}</p>
                            </div>
                        )}

                        {c.status === "PENDING" && (
                            openId === c.id ? (
                                <>
                                    <AnswerForm id={c.id} />
                                    <button type="button" onClick={() => setOpenId(null)}>ביטול</button>
                                </>
                            ) : (
                                <button type="button" onClick={() => setOpenId(c.id)}>למענה</button>
                            )
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default AnswerUsersPage;
