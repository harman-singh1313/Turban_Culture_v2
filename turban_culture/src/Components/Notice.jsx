import React from 'react'

const Notice = () => {
  return (
      <div className="max-w-6xl mx-auto px-4 mb-16">
          {/* notice */}
          {/* ───────── Pricing Information Section ───────── */}

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-[#b18236]">
            PRICING INFORMATION
          </h1>

          <p className="text-sm md:text-base text-gray-500 mt-2">
            Transparent pricing so you know before you book
          </p>

          <div className="w-16 h-[2px] bg-[#c9913a] mx-auto mt-4 rounded-full" />
        </div>

        {/* Top Notice */}
        <div className="flex flex-col md:flex-row items-center overflow-hidden
    border border-[#c9913a]/20 rounded-2xl mb-8">

          <div className="bg-[#6b0f1a] text-white px-6 py-4 font-semibold
      tracking-wide w-full md:w-auto text-center">
            IMPORTANT
          </div>

          <div className="bg-white px-6 py-4 text-sm text-gray-600 w-full">
            Please review the pricing details before filling out the booking form.
          </div>

        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Groom Card */}
          <div className="h-full bg-white border border-[#c9913a]/20
      rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">

            <h2 className="font-serif text-xl text-[#3d2e1e] mb-6 text-center">
              Groom Styling
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-medium text-[#3d2e1e]">
                    Punjabi Wedding Turban
                  </h3>

                  <p className="text-xs text-gray-400">
                    Starting from
                  </p>
                </div>

                <span className="font-semibold text-[#b18236]">
                  ₹5000
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-medium text-[#3d2e1e]">
                    Jodhpuri Safa
                  </h3>

                  <p className="text-xs text-gray-400">
                    Starting from
                  </p>
                </div>

                <span className="font-semibold text-[#b18236]">
                  ₹6000
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-[#3d2e1e]">
                    Royal Wedding Style
                  </h3>

                  <p className="text-xs text-gray-400">
                    Starting from
                  </p>
                </div>

                <span className="font-semibold text-[#b18236]">
                  ₹8000+
                </span>
              </div>

            </div>
          </div>

          {/* Family Card */}
          <div className="h-full bg-white border border-[#c9913a]/20
      rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">

            <h2 className="font-serif text-xl text-[#3d2e1e] mb-6 text-center">
              Barati / Family
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-medium text-[#3d2e1e]">
                    Simple Turban Styling
                  </h3>

                  <p className="text-xs text-gray-400">
                    Per person
                  </p>
                </div>

                <span className="font-semibold text-[#b18236]">
                  ₹700
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-medium text-[#3d2e1e]">
                    Matching Family Safa
                  </h3>

                  <p className="text-xs text-gray-400">
                    Per person
                  </p>
                </div>

                <span className="font-semibold text-[#b18236]">
                  ₹1000
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-[#3d2e1e]">
                    Kids Turban Styling
                  </h3>

                  <p className="text-xs text-gray-400">
                    Per person
                  </p>
                </div>

                <span className="font-semibold text-[#b18236]">
                  ₹500
                </span>
              </div>

            </div>
          </div>

          {/* Notice Card */}
          <div className="h-full bg-[#fff8ef] border border-[#c9913a]/20
      rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">

            <h2 className="font-serif text-xl text-[#3d2e1e] mb-6 text-center">
              Please Note
            </h2>

            <ul className="space-y-4 text-sm text-gray-600 list-disc pl-5">
              <li>Pricing may vary depending on turban style</li>
              <li>Travel charges may apply</li>
              <li>Final pricing depends on member count</li>
              <li>Fabric requirements may affect pricing</li>
              <li>Event timing may change pricing</li>
            </ul>

          </div>

        </div>

        {/* Bottom Notice */}
        <div className="mt-6 bg-[#fff8ef] border border-[#c9913a]/20
    rounded-2xl p-4 text-center">

          <p className="text-sm text-[#6b5b4b] leading-relaxed">
            Kindly review the pricing details before submitting the booking form.
          </p>

        </div>

      </div>  )
}

export default Notice