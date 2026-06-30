function InputField({ label, type = "text", placeholder, value, onChange, readOnly }) {
  return (
    <div className="  ">
      <label className="text-xs text-[#a08060] tracking-wide">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className="bg-[#faf8f5] border border-[#c9913a]/25 rounded-xl px-4 py-2.5
                   text-sm text-gray-800 placeholder-[#aaa]
                   focus:outline-none focus:border-[#c9913a] focus:ring-1 focus:ring-[#c9913a]/30
                   transition duration-200"
      />
    </div>
  );
}

export default InputField;