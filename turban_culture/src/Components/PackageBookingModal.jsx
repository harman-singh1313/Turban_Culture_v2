import { useState } from "react"

const PackageBookingModal = ({
  selectedPackage,
  showModal,
  setShowModal,
}) => {

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    location: "",
  })

  const update = (field, value) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

  }

  const handleSubmit = () => {

    console.log({
      ...formData,
      package: selectedPackage,
    })

    alert("Booking Submitted")

    setShowModal(false)

  }

  if (!showModal) return null

  return (

    <div className="fixed inset-0 z-50
    flex items-center justify-center
    bg-black/50 p-4">

      <div className="bg-white w-full max-w-md
      rounded-3xl p-6 relative">

        {/* Close */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-400"
        >
          ✕
        </button>

        {/* Package Info */}
        <div className="text-center mb-6">

          <h2 className="font-serif text-3xl text-[#3d2e1e]">
            {selectedPackage?.name}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {selectedPackage?.badge}
          </p>

          <p className="text-3xl font-bold text-[#c9913a] mt-3">
            ₹{selectedPackage?.price}
          </p>

        </div>

        {/* Inputs */}
        <div className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full border border-[#c9913a]/20
            rounded-xl px-4 py-3 outline-none"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full border border-[#c9913a]/20
            rounded-xl px-4 py-3 outline-none"
          />

          <input
            type="date"
            value={formData.date}
            onChange={(e) => update("date", e.target.value)}
            className="w-full border border-[#c9913a]/20
            rounded-xl px-4 py-3 outline-none"
          />

          <select
            value={formData.time}
            onChange={(e) => update("time", e.target.value)}
            className="w-full border border-[#c9913a]/20
            rounded-xl px-4 py-3 outline-none"
          >
            <option value="">
              Select Timing
            </option>

            <option value="Morning">
              Morning
            </option>

            <option value="Evening">
              Evening
            </option>

          </select>

          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => update("location", e.target.value)}
            className="w-full border border-[#c9913a]/20
            rounded-xl px-4 py-3 outline-none"
          />

        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-5 bg-[#c9913a]
          text-white py-3 rounded-xl font-semibold"
        >
          Confirm Booking
        </button>

      </div>

    </div>

  )
}

export default PackageBookingModal