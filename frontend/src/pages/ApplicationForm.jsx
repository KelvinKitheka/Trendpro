import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/applications";

const TYPES = ["recordation", "renewal", "change_of_ownership", "change_of_name", "discontinuation"]
const EMPTY = {applicant_name: "", applicant_email: "", company_email: "", application_type: "", description: ""}

export default function ApplicationDetail() {
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
                company_email: app.company_email,
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

    const inputClass = "w-full border border-gray-300 rounded px-2 py-1.5 text-sm mt-1"

    return (
        <div className="p-6 max-w-lg">
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
            <label>Applicant Type
                <input name="applicant_type" value={form.applicant_type} onChange={handleChange} className={inputClass}/>
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
    )
}