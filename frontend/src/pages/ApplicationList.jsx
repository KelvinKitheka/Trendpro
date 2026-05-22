import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/applications";

export default function ApplicationList() {
    const [ apps, setApps ] = useState([]);
    const [ error , setError ] = useState("");
    const navigate = useNavigate();

    const TH = "border px-3 py-2";

    useEffect(() => {
        api.list().then(setApps).catch(e => setError(e.message))
    }, [])

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Applications</h1>
                <button
                type="submit"
                onClick={() => navigate("/applications/new")}
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
                >
                    + New Application
                </button>
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <table className="w-full text-sm border-gray-200 border-collapse">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className={TH}>Tracking Number</th>
                        <th className={TH}>Applicant</th>
                        <th className={TH}>Company</th>
                        <th className={TH}>Type</th>
                        <th className={TH}>Status</th>
                        <th className={TH}>Created</th>
                    </tr>
                </thead>

                <tbody>
                        {apps.length === 0 && (
                            <tr>
                                <td colSpan={6} className="border px-3 py-4 text-center text-gray-400">
                                    No applications yet.
                                </td>
                            </tr>
                        )}
                        {apps.map(app => (
                            <tr
                                key={app.id}
                                onClick={() => navigate(`/applications/${app.id}`)}
                                className="cursor-pointer hover:bg-gray-50"
                            >
                                <td className={TH}>{app.tracking_number}</td>
                                <td className={TH}>{app.applicant_name}</td>
                                <td className={TH}>{app.company_name}</td>
                                <td className={TH}>{app.application_type}</td>
                                <td className={TH}>{app.status}</td>
                                <td className={TH}>{new Date(app.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}