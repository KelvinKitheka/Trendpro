import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/applications";

const TYPES = ["recordation", "renewal", "change_of_ownership", "change_of_name", "discontinuation"]
const EMPTY = {applicant_name: "", applicant_email: "", company_name: "", application_type: "", description: ""}

export default function ApplicationForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id)
    const [form, setForm] = useState(EMPTY)
    const [error, setError] = useState("")

    useEffect(() => {
        if (isEdit) {
            api.get(id).then(app => setForm({
                applicant_name: app.applicant_name,
                applicant_email: app.applicant_email,
                company_name: app.company_name,
                application_type: app.application_type,
                description: app.description,
            }))
        }
    }, [])

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async () => {
        setError("")
        try {
            if (isEdit) {
                await api.update(id, form) 
                navigate(`/applications/${id}`)
            } else {
                const created = await api.create(form)
                navigate(`/applications/${created.id}`)
            }
        } catch (e) {
            setError(e.message)
        }
    }

    const inputClass = "w-full border border-gray-300 rounded px-2 py-1.5 text-sm mt-1 mb-3"

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-lg">
            <button onClick={() => navigate(-1)} className="text-sm text-blue-600 mb-4 block">Back</button>
            <h1 className="text-xl font-semibold mb-4">{isEdit ? "Edit Application" : "New Application"}</h1>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="space-y-3 text-sm">
            <label>Applicant Name
                <input name="applicant_name" value={form.applicant_name} onChange={handleChange} className={inputClass}/>
            </label>
            <label>Applicant Email
                <input name="applicant_email" type="email" value={form.applicant_email} onChange={handleChange} className={inputClass}/>
            </label>
            <label>Company Name
                <input name="company_name" value={form.company_name} onChange={handleChange} className={inputClass}/>
            </label>
            <label>Application Type
                <select name="application_type" value={form.application_type} onChange={handleChange} className={inputClass}>
                    <option value="">-- Select type --</option>
                    {TYPES.map(t => (
                        <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                    ))}
                </select>
            </label>
            <label>Description
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={inputClass}/>
            </label>
            <div className="flex gap-2 pt-2">
                <button onClick={handleSubmit} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm">Save Draft</button>
                <button onClick={() => navigate(-1)} className="border px-3 py-1.5 rounded text-sm">Cancel</button>
            </div>
            </div>
            </div>
        </div>
    )
}