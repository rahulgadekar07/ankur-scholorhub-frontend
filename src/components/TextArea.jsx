

// ── TextArea ─────────────────────────────────────────────────────
const TextArea = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <textarea
      className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical min-h-[80px]"
      {...props}
    />
  </div>
);
export default TextArea;