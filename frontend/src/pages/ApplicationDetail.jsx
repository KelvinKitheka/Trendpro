import { useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/applications';
import ReviewerDecisionModal from '../components/ReviewerDecisionModal';

const ApplicationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ app, setApp] = useState(null);
    const [ error, setError] = useState("");
    const [ showModal, setShowModal ] = useState(false);

    useEffect(() => {
        api.get(id).then(setApp).catch(e => setError(e.message))
    }, [id]);

    

    const action = async (fn) => {
    try { setApp(await fn()) }
    catch (e) { setError(e.message) }
  }

    if (!app) return <p className="p-6 text-gray-500">Loading...</p>

  return (
    <div className="p-6 max-w-lg">
      <button onClick={() => navigate("/")} className="text-sm text-blue-600 mb-4 block">Back</button>
      <h1 className="text-xl font-semibold mb-4">{app.tracking_number}</h1>

      { error && <p>{error}</p>}

      <table className="w-full text-sm border border-gray-200 border-collapse mb-6">
        <tbody>
            {[
            ["Status",      app.status],
            ["Applicant",   app.applicant_name],
            ["Email",       app.applicant_email],
            ["Company",     app.company_name],
            ["Type",        app.application_type],
            ["Description", app.description],
            ["Created",     new Date(app.created_at).toLocaleString()],
            app.submitted_at && ["Submitted", new Date(app.submitted_at).toLocaleString()],
            app.reviewed_at  && ["Reviewed",  new Date(app.reviewed_at).toLocaleString()],
            app.reviewer_comment && ["Reviewer Comment", app.reviewer_comment],
            ].filter(Boolean).map(([label, value]) => (
                <tr key={label}>
                    <td className="border px-3 py-2 text-gray-500 font-medium w-36">{label}</td>
                    <td className="border px-3 py-2">{value}</td>
                </tr>
            ))}
        </tbody>
      </table>

    <div className="flex gap-2">
    {(app.status === "draft" || app.status === "need_more_info") && <>
        <button onClick={() => navigate(`/applications/${id}/edit`)} className="border px-3 py-1.5 rounded text-sm">Edit</button>
        <button onClick={() => action(() => api.submit(id))} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm">Submit</button>
    </>}
    {app.status === "submitted" &&
        <button onClick={() => action(() => api.startReview(id))} className="bg-yellow-500 text-white px-3 py-1.5 rounded text-sm">Start Review</button>}
    {app.status === "under_review" &&
        <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm">Record Decision</button>}
    </div>

    {(app.status === "approved" || app.status === "rejected") && (
    <p className="text-sm text-gray-500 mt-2">
        This application is <span className="font-medium">{app.status}</span> and can no longer be edited.
    </p>
    )}

    {showModal && (
        <ReviewerDecisionModal
            onClose={() => setShowModal(false)}
            onSubmit={async (payload) => {
                await action(() => api.decision(id, payload))
                setShowModal(false)
            }}
        />
    )}
    </div>
  )
}

export default ApplicationDetail
 