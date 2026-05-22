import { useState } from "react"

export default function ReviewerDecisionModal({ onClose, onSubmit }) {
  const [decision, setDecision] = useState("")
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")

  const needsComment = decision === "rejected" || decision === "need_more_info"

  const handleSubmit = async () => {
    if (!decision) return setError("Select a decision.")
    if (needsComment && !comment.trim()) return setError("Comment is required.")
    try {
      await onSubmit({ decision, reviewer_comment: comment || null })
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-80">
        <h2 className="font-semibold mb-4">Record Decision</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="space-y-2 text-sm mb-4">
          {["approved", "need_more_info", "rejected"].map(d => (
            <label key={d} className="flex items-center gap-2">
              <input type="radio" name="decision" value={d} checked={decision === d} onChange={e => setDecision(e.target.value)} />
              {d.replace(/_/g, " ")}
            </label>
          ))}
        </div>

        {needsComment && (
          <div className="mb-4">
            <label className="text-sm block mb-1">Comment <span className="text-red-500">*</span></label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm">Submit</button>
          <button onClick={onClose} className="border px-3 py-1.5 rounded text-sm">Cancel</button>
        </div>
      </div>
    </div>
  )
}