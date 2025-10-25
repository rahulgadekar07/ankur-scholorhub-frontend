// ── Input ───────────────────────────────────────────────────────
const Input = ({ label, icon, ...props }) => (
  <div className="flex flex-col">
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      <input
        className={`w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          icon ? "pl-10" : ""
        }`}
        {...props}
      />
    </div>
  </div>
);

export default Input;