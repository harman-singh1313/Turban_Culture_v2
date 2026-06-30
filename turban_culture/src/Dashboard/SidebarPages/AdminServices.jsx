import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/pricing`;

const getToken = () => localStorage.getItem("adminToken");
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

const emptyPackage = {
  name: "",
  badge: "",        // ← naya
  desc: "",         // ← naya
  icon: "👑",
  theme: "silver",
  price: "",
  features: [""],
  isActive: true,
  isFeatured: false,
  stepText: "",     // ← naya
};
const AdminServices = () => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [packageForm, setPackageForm] = useState(emptyPackage);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      setPricing(res.data.pricing);
    } catch (error) {
      showMessage("error", "Pricing load nahi ho saki");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleSimplePriceChange = (field, value) => {
    setPricing((prev) => ({ ...prev, [field]: value }));
  };

  const saveSimplePrices = async () => {
    try {
      setSaving(true);
      const payload = {
        groomPrice: Number(pricing.groomPrice),
        extraDayPrice: Number(pricing.extraDayPrice),
        memberPrice: Number(pricing.memberPrice),
        engagementPrice: Number(pricing.engagementPrice),
        travelPricePerKm: Number(pricing.travelPricePerKm),
        freeTravelKm: Number(pricing.freeTravelKm),
      };
      const res = await axios.put(API_BASE, payload, authHeaders());
      setPricing(res.data.pricing);
      showMessage("success", "Prices update ho gaye ✅");
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Update fail ho gaya");
    } finally {
      setSaving(false);
    }
  };

  const openAddPackage = () => {
    setEditingPackageId(null);
    setPackageForm(emptyPackage);
    setShowPackageForm(true);
  };

const openEditPackage = (pkg) => {
  setEditingPackageId(pkg._id);
  setPackageForm({
    name: pkg.name,
    badge: pkg.badge || "",       // ← naya
    desc: pkg.desc || "",         // ← naya
    icon: pkg.icon || "👑",
    theme: pkg.theme || "silver",
    price: pkg.price,
    features: pkg.features?.length ? pkg.features : [""],
    isActive: pkg.isActive,
    isFeatured: pkg.isFeatured,
    stepText: pkg.stepText || "", // ← naya
  });
  setShowPackageForm(true);
};

  const closePackageForm = () => {
    setShowPackageForm(false);
    setEditingPackageId(null);
    setPackageForm(emptyPackage);
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...packageForm.features];
    updated[index] = value;
    setPackageForm({ ...packageForm, features: updated });
  };

  const addFeatureField = () => {
    setPackageForm({ ...packageForm, features: [...packageForm.features, ""] });
  };

  const removeFeatureField = (index) => {
    const updated = packageForm.features.filter((_, i) => i !== index);
    setPackageForm({ ...packageForm, features: updated.length ? updated : [""] });
  };

  const submitPackage = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...packageForm,
        price: Number(packageForm.price),
        features: packageForm.features.filter((f) => f.trim() !== ""),
      };
      let res;
      if (editingPackageId) {
        res = await axios.put(`${API_BASE}/packages/${editingPackageId}`, payload, authHeaders());
        showMessage("success", "Package update ho gaya ✅");
      } else {
        res = await axios.post(`${API_BASE}/packages`, payload, authHeaders());
        showMessage("success", "Package add ho gaya ✅");
      }
      setPricing(res.data.pricing);
      closePackageForm();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Operation fail ho gayi");
    } finally {
      setSaving(false);
    }
  };

  const deletePackage = async (packageId) => {
    if (!window.confirm("Ye package delete karna pakka hai?")) return;
    try {
      setSaving(true);
      await axios.delete(`${API_BASE}/packages/${packageId}`, authHeaders());
      setPricing((prev) => ({
        ...prev,
        packages: prev.packages.filter((p) => p._id !== packageId),
      }));
      showMessage("success", "Package delete ho gaya ✅");
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Delete fail ho gaya");
    } finally {
      setSaving(false);
    }
  };

  const toggleQuickField = async (pkg, field) => {
    try {
      const res = await axios.put(
        `${API_BASE}/packages/${pkg._id}`,
        { [field]: !pkg[field] },
        authHeaders()
      );
      setPricing(res.data.pricing);
    } catch (error) {
      showMessage("error", "Toggle fail ho gaya");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Pricing load ho rahi hai...
      </div>
    );
  }

  if (!pricing) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Pricing data load nahi ho saki.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Pricing Dashboard</h1>

      {/* ── Toast ── */}
      {message.text && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* ── Simple Prices ── */}
      <section className="bg-white rounded-2xl shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Simple Booking Prices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: "groomPrice", label: "💍 Groom Price", color: "indigo" },
            { key: "extraDayPrice", label: "📅 Extra Day Price", color: "indigo" },
            { key: "memberPrice", label: "👨‍👨‍👦 Member Price", color: "indigo" },
            { key: "engagementPrice", label: "💛 Engagement Price", color: "indigo" },
            { key: "travelPricePerKm", label: "🚗 Travel Price / Km", color: "orange" },
            { key: "freeTravelKm", label: "🆓 Free Travel Km", color: "orange" },
          ].map((field) => (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-medium">{field.label}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  {field.key.includes("Km") ? "km" : "₹"}
                </span>
                <input
                  type="number"
                  value={pricing[field.key]}
                  onChange={(e) => handleSimplePriceChange(field.key, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 font-semibold"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={saveSimplePrices}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition"
        >
          {saving ? "Saving..." : "💾 Save Prices"}
        </button>
      </section>

      {/* ── Packages ── */}
      <section className="bg-white rounded-2xl shadow p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Packages</h2>
            <p className="text-xs text-gray-400">{pricing.packages.length} package(s) total</p>
          </div>
          <button
            onClick={openAddPackage}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Add Package
          </button>
        </div>

        {pricing.packages.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">📦</p>
            <p className="text-sm">Koi package abhi tak nahi hai.</p>
            <p className="text-xs mt-1">+ Add Package button click karo</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pricing.packages.map((pkg) => (
              <div
                key={pkg._id}
                className={`rounded-2xl border-2 p-5 space-y-3 relative transition-all ${
                  pkg.isActive
                    ? "border-emerald-200 bg-emerald-50/30"
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                {/* Status Badges */}
                <div className="flex gap-1.5 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    pkg.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                    {pkg.isActive ? "● Active" : "● Hidden"}
                  </span>
                  {pkg.isFeatured && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-700">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Icon + Name */}
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{pkg.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base leading-tight">{pkg.name}</h3>
                    {pkg.tag && <p className="text-xs text-gray-400 mt-0.5">{pkg.tag}</p>}
                  </div>
                </div>

                {/* Price — big & clear */}
                <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Package Price</span>
                  <span className="text-2xl font-bold text-indigo-600">₹{pkg.price}</span>
                </div>

                {/* Features */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Features ({pkg.features.length})
                  </p>
                  <ul className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openEditPackage(pkg)}
                    className="text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 font-medium transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deletePackage(pkg._id)}
                    className="text-xs bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 font-medium transition"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={() => toggleQuickField(pkg, "isActive")}
                    className={`text-xs px-3 py-2 rounded-lg font-medium transition ${
                      pkg.isActive
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    }`}
                  >
                    {pkg.isActive ? "🙈 Hide" : "👁️ Show"}
                  </button>
                  <button
                    onClick={() => toggleQuickField(pkg, "isFeatured")}
                    className={`text-xs px-3 py-2 rounded-lg font-medium transition ${
                      pkg.isFeatured
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {pkg.isFeatured ? "★ Unfeature" : "☆ Feature"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Add/Edit Modal ── */}
      {showPackageForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={submitPackage}
            className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingPackageId ? "✏️ Edit Package" : "➕ Add Package"}
              </h3>
              <button type="button" onClick={closePackageForm} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

           <div className="grid grid-cols-2 gap-3">
  <input
    type="text"
    placeholder="Package Name (e.g. Gold Royal)"
    value={packageForm.name}
    onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
    required
    className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  />

  {/* ← naya: badge */}
  <input
    type="text"
    placeholder="Badge (e.g. Silver, Gold)"
    value={packageForm.badge}
    onChange={(e) => setPackageForm({ ...packageForm, badge: e.target.value })}
    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  />

  <input
    type="text"
    placeholder="Icon (emoji e.g. 👑)"
    value={packageForm.icon}
    onChange={(e) => setPackageForm({ ...packageForm, icon: e.target.value })}
    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  />

  {/* ← naya: theme dropdown */}
  <select
    value={packageForm.theme}
    onChange={(e) => setPackageForm({ ...packageForm, theme: e.target.value })}
    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  >
    <option value="silver">🩶 Silver</option>
    <option value="gold">💛 Gold</option>
    <option value="platinum">💜 Platinum</option>
  </select>

  {/* ← naya: desc */}
  <input
    type="text"
    placeholder="Description (e.g. Perfect for elegant weddings)"
    value={packageForm.desc}
    onChange={(e) => setPackageForm({ ...packageForm, desc: e.target.value })}
    className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  />

  {/* ← naya: stepText */}
  <input
    type="text"
    placeholder="Step Text (e.g. Step 1: Essential Coverage)"
    value={packageForm.stepText}
    onChange={(e) => setPackageForm({ ...packageForm, stepText: e.target.value })}
    className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  />

  <div className="col-span-2 relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
    <input
      type="number"
      placeholder="Price"
      value={packageForm.price}
      onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
      required
      className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold"
    />
  </div>
</div>

            {/* Features */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Features ({packageForm.features.filter(f => f.trim()).length})</label>
              {packageForm.features.map((feature, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-emerald-500 text-sm">✓</span>
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(i, e.target.value)}
                    placeholder={`Feature ${i + 1}`}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeatureField(i)}
                    className="text-red-400 hover:text-red-600 px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeatureField}
                className="text-sm text-indigo-600 hover:underline"
              >
                + Add Feature
              </button>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={packageForm.isActive}
                  onChange={(e) => setPackageForm({ ...packageForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600"
                />
                Active (site pe dikhega)
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={packageForm.isFeatured}
                  onChange={(e) => setPackageForm({ ...packageForm, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
                Featured ⭐
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closePackageForm}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                {saving ? "Saving..." : editingPackageId ? "Update Package" : "Add Package"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminServices;