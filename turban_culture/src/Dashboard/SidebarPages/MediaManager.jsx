import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FiUpload as Upload,
  FiImage as ImageIcon,
  FiVideo as Video,
  FiRefreshCw as RefreshCw,
  FiEdit2 as Pencil,
  FiTrash2 as Trash2,
  FiPlay as Play,
  FiX as X,
  FiLoader as Loader2,
} from "react-icons/fi";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const categories = [
  { value: "groom", label: "Groom" },
  { value: "wattan-wali-pagg", label: "Wattan Wali Pagg" },
  { value: "patiala-shahi", label: "Patiala Shahi" },
  { value: "amritsar-shahi-pagg", label: "Amritsar Shahi Pagg" },
  { value: "jodhpuri-safa", label: "Jodhpuri Safa" },
  { value: "groom-safa", label: "Groom Safa" },
  { value: "dumala-sahib", label: "Dumala Sahib" },
  { value: "videos", label: "Videos" },
];

const getCategoryLabel = (value) =>
  categories.find((item) => item.value === value)?.label || value;

// Title sirf videos ke liye hai. Images par category ka naam dikhta hai
const getDisplayTitle = (item) =>
  item.category === "videos"
    ? item.title || "Untitled video"
    : getCategoryLabel(item.category);

const MediaManager = () => {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const posterInputRef = useRef(null);

  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("groom");
  const [status, setStatus] = useState("published");

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);

  const [imagePreview, setImagePreview] = useState("");
  const [posterPreview, setPosterPreview] = useState("");

  const [filter, setFilter] = useState("all");

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editStatus, setEditStatus] = useState("published");
  const [updating, setUpdating] = useState(false);

  // =========================================================
  // GET MEDIA
  // =========================================================

  const fetchMedia = async () => {
    try {
      setLoading(true);

      const endpoint =
        filter === "all"
          ? `${API_URL}/api/media`
          : `${API_URL}/api/media?category=${filter}`;

      const { data } = await axios.get(endpoint);

      if (data.success) {
        setMedia(data.media || []);
      }
    } catch (error) {
      console.error("GET MEDIA ERROR:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to load media.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [filter]);

  // =========================================================
  // IMAGE
  // =========================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Please select a valid image.",
      });
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // =========================================================
  // VIDEO
  // =========================================================

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setMessage({
        type: "error",
        text: "Please select a valid video.",
      });
      return;
    }

    setVideoFile(file);
  };

  // =========================================================
  // POSTER
  // =========================================================

  const handlePosterChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Please select a valid poster.",
      });
      return;
    }

    if (posterPreview) {
      URL.revokeObjectURL(posterPreview);
    }

    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  // =========================================================
  // CATEGORY CHANGE
  // =========================================================

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setCategory(value);

    if (value === "videos") {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImageFile(null);
      setImagePreview("");

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } else {
      setTitle("");

      if (posterPreview) {
        URL.revokeObjectURL(posterPreview);
      }

      setVideoFile(null);
      setPosterFile(null);
      setPosterPreview("");

      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }

      if (posterInputRef.current) {
        posterInputRef.current.value = "";
      }
    }
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setTitle("");
    setCategory("groom");
    setStatus("published");

    setImageFile(null);
    setVideoFile(null);
    setPosterFile(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (posterPreview) {
      URL.revokeObjectURL(posterPreview);
    }

    setImagePreview("");
    setPosterPreview("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }

    if (posterInputRef.current) {
      posterInputRef.current.value = "";
    }
  };

  // =========================================================
  // UPLOAD  (title optional)
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (category === "videos") {
      if (!videoFile) {
        setMessage({
          type: "error",
          text: "Please choose a video.",
        });
        return;
      }

      if (!posterFile) {
        setMessage({
          type: "error",
          text: "Please choose a video poster.",
        });
        return;
      }
    } else if (!imageFile) {
      setMessage({
        type: "error",
        text: "Please choose an image.",
      });
      return;
    }

    try {
      setUploading(true);
      setMessage({ type: "", text: "" });

      const formData = new FormData();

      // Title sirf videos ke liye (optional)
      if (category === "videos" && title.trim()) {
        formData.append("title", title.trim());
      }

      formData.append("status", status);

      let response;

      if (category === "videos") {
        formData.append("video", videoFile);
        formData.append("poster", posterFile);

        response = await axios.post(
          `${API_URL}/api/media/video`,
          formData
        );
      } else {
        formData.append("category", category);
        formData.append("image", imageFile);

        response = await axios.post(
          `${API_URL}/api/media/image`,
          formData
        );
      }

      if (response.data.success) {
        setMessage({
          type: "success",
          text:
            category === "videos"
              ? "Video uploaded successfully."
              : "Image uploaded successfully.",
        });

        resetForm();
        await fetchMedia();
      }
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Upload failed.",
      });
    } finally {
      setUploading(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${getDisplayTitle(item)}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(item._id);

      const { data } = await axios.delete(
        `${API_URL}/api/media/${item._id}`
      );

      if (data.success) {
        setMedia((prev) =>
          prev.filter((mediaItem) => mediaItem._id !== item._id)
        );

        setMessage({
          type: "success",
          text: "Media deleted successfully.",
        });
      }
    } catch (error) {
      console.error("DELETE ERROR:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Delete failed.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // EDIT  (title optional)
  // =========================================================

  const openEdit = (item) => {
    setEditingItem(item);
    setEditTitle(item.title || "");
    setEditCategory(item.category);
    setEditStatus(item.status);
  };

  const closeEdit = () => {
    if (updating) return;

    setEditingItem(null);
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const { data } = await axios.put(
        `${API_URL}/api/media/${editingItem._id}`,
        {
          ...(editingItem.category === "videos" && {
            title: editTitle.trim(),
          }),
          category: editCategory,
          status: editStatus,
        }
      );

      if (data.success) {
        setMedia((prev) =>
          prev.map((item) =>
            item._id === editingItem._id
              ? data.media
              : item
          )
        );

        setMessage({
          type: "success",
          text: "Media updated successfully.",
        });

        setEditingItem(null);
      }
    } catch (error) {
      console.error("UPDATE ERROR:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Update failed.",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f8f7fb] p-3 sm:p-4 lg:p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mx-auto mb-4 flex max-w-[1400px] items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Media Manager
          </h1>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Upload and manage gallery images and videos
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMedia}
          disabled={loading}
          aria-label="Refresh"
          className="flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 sm:h-9 sm:w-auto sm:px-3"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin" : ""}
          />

          <span className="hidden sm:inline">
            Refresh
          </span>
        </button>
      </div>

      {/* =====================================================
          ADD MEDIA
      ===================================================== */}

      <section className="mx-auto mb-4 max-w-[1400px] rounded-xl border border-slate-200 bg-white p-3 sm:p-5">

        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Add Media
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Add an image or upload a video with poster
          </p>
        </div>

        {/* MESSAGE */}

        {message.text && (
          <div
            className={`mb-4 flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 text-xs font-medium sm:items-center sm:py-2 ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <span className="min-w-0 break-words">
              {message.text}
            </span>

            <button
              type="button"
              aria-label="Close message"
              className="-m-1 shrink-0 p-1"
              onClick={() =>
                setMessage({
                  type: "",
                  text: "",
                })
              }
            >
              <X size={15} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* TOP FIELDS */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-12">

            {category === "videos" && (
            <div className="sm:col-span-2 md:col-span-5">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Title (optional)
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter media title (optional)"
                disabled={uploading}
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 sm:h-10 sm:text-sm"
              />
            </div>
            )}

            <div
              className={
                category === "videos"
                  ? "md:col-span-4"
                  : "md:col-span-6"
              }
            >
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Category
              </label>

              <select
                value={category}
                onChange={handleCategoryChange}
                disabled={uploading}
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 sm:h-10 sm:text-sm"
              >
                {categories.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={
                category === "videos"
                  ? "md:col-span-3"
                  : "md:col-span-6"
              }
            >
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                disabled={uploading}
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 sm:h-10 sm:text-sm"
              >
                <option value="published">
                  Published
                </option>

                <option value="draft">
                  Draft
                </option>
              </select>
            </div>
          </div>

          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          {category !== "videos" && (
            <div className="mt-4">
              <div className="mb-2">
                <h3 className="text-xs font-bold text-slate-800">
                  Image
                </h3>

                <p className="text-[11px] text-slate-400">
                  JPG, PNG or WEBP
                </p>
              </div>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() =>
                  imageInputRef.current?.click()
                }
                disabled={uploading}
                className="flex min-h-[82px] w-full items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 transition hover:border-violet-400 hover:bg-violet-50/40 disabled:opacity-60 sm:px-4"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-14 w-16 shrink-0 rounded-md object-cover"
                    />

                    <div className="min-w-0 flex-1 text-left sm:max-w-[250px] sm:flex-none">
                      <p className="text-xs font-bold text-slate-800">
                        Image Selected
                      </p>

                      <p className="truncate text-[11px] text-slate-500">
                        {imageFile?.name}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload
                      size={22}
                      className="shrink-0 text-violet-600"
                    />

                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800">
                        Choose Image
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Click to select image
                      </p>
                    </div>
                  </>
                )}
              </button>
            </div>
          )}

          {/* =================================================
              VIDEO + POSTER
          ================================================= */}

          {category === "videos" && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* VIDEO */}

              <div className="min-w-0">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-slate-800">
                    Video
                  </h3>

                  <p className="text-[11px] text-slate-400">
                    MP4, MOV, WEBM
                  </p>
                </div>

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() =>
                    videoInputRef.current?.click()
                  }
                  disabled={uploading}
                  className={`flex min-h-[82px] w-full items-center justify-center gap-3 rounded-lg border px-3 transition sm:px-4 ${
                    videoFile
                      ? "border-violet-300 bg-violet-50"
                      : "border-dashed border-slate-300 bg-slate-50 hover:border-violet-400"
                  }`}
                >
                  <Video
                    size={22}
                    className="shrink-0 text-violet-600"
                  />

                  <div className="min-w-0 flex-1 text-left sm:max-w-[220px] sm:flex-none">
                    <p className="text-xs font-bold text-slate-800">
                      {videoFile
                        ? "Video Selected"
                        : "Choose Video"}
                    </p>

                    <p className="truncate text-[11px] text-slate-400">
                      {videoFile
                        ? videoFile.name
                        : "Click to select video"}
                    </p>
                  </div>
                </button>
              </div>

              {/* POSTER */}

              <div className="min-w-0">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-slate-800">
                    Poster
                  </h3>

                  <p className="text-[11px] text-slate-400">
                    JPG, PNG or WEBP
                  </p>
                </div>

                <input
                  ref={posterInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePosterChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() =>
                    posterInputRef.current?.click()
                  }
                  disabled={uploading}
                  className="flex min-h-[82px] w-full items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 transition hover:border-violet-400 sm:px-4"
                >
                  {posterPreview ? (
                    <>
                      <img
                        src={posterPreview}
                        alt="Poster"
                        className="h-14 w-16 shrink-0 rounded-md object-cover"
                      />

                      <div className="min-w-0 flex-1 text-left sm:max-w-[200px] sm:flex-none">
                        <p className="text-xs font-bold text-slate-800">
                          Poster Selected
                        </p>

                        <p className="truncate text-[11px] text-slate-400">
                          {posterFile?.name}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon
                        size={22}
                        className="shrink-0 text-violet-600"
                      />

                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800">
                          Choose Poster
                        </p>

                        <p className="text-[11px] text-slate-400">
                          Video thumbnail
                        </p>
                      </div>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* SUBMIT */}

          <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 text-xs font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:h-10 sm:w-auto"
            >
              {uploading ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={15} />
                  Upload Media
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* =====================================================
          EXISTING MEDIA
      ===================================================== */}

      <section className="mx-auto max-w-[1400px] rounded-xl border border-slate-200 bg-white p-3 sm:p-5">

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Existing Media
            </h2>

            <p className="text-xs text-slate-500">
              Manage uploaded images and videos
            </p>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <span className="shrink-0 rounded-md bg-violet-50 px-2.5 py-2.5 text-[10px] font-bold text-violet-700 sm:py-2">
              {media.length} Items
            </span>

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="h-10 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 text-base outline-none sm:h-8 sm:w-40 sm:flex-none sm:text-[11px]"
            >
              <option value="all">
                All Media
              </option>

              {categories.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="flex min-h-[180px] flex-col items-center justify-center text-slate-400">
            <Loader2
              size={25}
              className="mb-2 animate-spin text-violet-600"
            />

            <p className="text-xs">
              Loading media...
            </p>
          </div>
        )}

        {/* EMPTY */}

        {!loading && media.length === 0 && (
          <div className="flex min-h-[180px] flex-col items-center justify-center px-2 text-center">
            <ImageIcon
              size={30}
              className="mb-2 text-slate-300"
            />

            <h3 className="text-sm font-bold text-slate-700">
              No media found
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Upload media or select another category
            </p>
          </div>
        )}

        {/* CARDS */}

        {!loading && media.length > 0 && (
          <div
            className="
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-3
              sm:gap-3
              lg:grid-cols-4
              xl:grid-cols-5
            "
          >
            {media.map((item) => {
              const isVideo =
                item.category === "videos";

              const thumbnail = isVideo
                ? item.video?.posterUrl
                : item.image?.url;

              const displayTitle = getDisplayTitle(item);

              return (
                <article
                  key={item._id}
                  className="group min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* IMAGE */}

                  <div className="relative aspect-square overflow-hidden bg-slate-100 sm:aspect-[1.15/1]">

                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={displayTitle}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <ImageIcon size={28} />
                      </div>
                    )}

                    {/* STATUS */}

                    <span
                      className={`absolute left-1.5 top-1.5 rounded px-1.5 py-1 text-[10px] font-bold capitalize sm:text-[8px] ${
                        item.status === "published"
                          ? "bg-emerald-50/95 text-emerald-700"
                          : "bg-amber-50/95 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>

                    {/* VIDEO PLAY */}

                    {isVideo && item.video?.url && (
                      <a
                        href={item.video.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Play video"
                        className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white transition hover:scale-110 hover:bg-violet-600 sm:h-8 sm:w-8"
                      >
                        <Play
                          size={14}
                          fill="currentColor"
                        />
                      </a>
                    )}
                  </div>

                  {/* CARD CONTENT */}

                  <div className="p-2">
                    <h3
                      title={displayTitle}
                      className="truncate text-xs font-bold text-slate-800"
                    >
                      {displayTitle}
                    </h3>

                    <div className="mt-1 flex min-w-0 items-center gap-1 text-[10px] text-slate-500 sm:text-[9px]">
                      {isVideo ? (
                        <Video
                          size={11}
                          className="shrink-0"
                        />
                      ) : (
                        <ImageIcon
                          size={11}
                          className="shrink-0"
                        />
                      )}

                      <span className="truncate">
                        {isVideo
                          ? getCategoryLabel(item.category)
                          : "Image"}
                      </span>
                    </div>

                    {/* ACTIONS */}

                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          openEdit(item)
                        }
                        className="flex h-9 items-center justify-center gap-1 rounded-md border border-slate-200 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 sm:h-7 sm:text-[9px]"
                      >
                        <Pencil size={10} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item)
                        }
                        disabled={
                          deletingId === item._id
                        }
                        className="flex h-9 items-center justify-center gap-1 rounded-md bg-violet-600 text-[11px] font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50 sm:h-7 sm:text-[9px]"
                      >
                        {deletingId === item._id ? (
                          <Loader2
                            size={10}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={10} />
                        )}

                        <span>
                          {deletingId === item._id
                            ? "..."
                            : "Delete"}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {editingItem && (
        <div
          className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-[2px] sm:items-center sm:p-3"
          onMouseDown={closeEdit}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-xl"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            <div className="flex shrink-0 items-start justify-between border-b border-slate-100 p-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Edit Media
                </h2>

                <p className="text-xs text-slate-400">
                  Update media information
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 sm:h-7 sm:w-7"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto p-4">

              {/* TITLE (sirf videos) */}

              {editingItem.category === "videos" && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Title (optional)
                </label>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                  placeholder="Enter media title (optional)"
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-base outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 sm:h-10 sm:text-sm"
                />
              </div>
              )}

              {/* CATEGORY */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Category
                </label>

                <select
                  value={editCategory}
                  disabled={
                    editingItem.category ===
                    "videos"
                  }
                  onChange={(e) =>
                    setEditCategory(
                      e.target.value
                    )
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-base outline-none disabled:cursor-not-allowed disabled:bg-slate-100 sm:h-10 sm:text-sm"
                >
                  {categories.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                      disabled={
                        editingItem.category !==
                          "videos" &&
                        item.value === "videos"
                      }
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Status
                </label>

                <select
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(e.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-base outline-none sm:h-10 sm:text-sm"
                >
                  <option value="published">
                    Published
                  </option>

                  <option value="draft">
                    Draft
                  </option>
                </select>
              </div>
            </div>

            {/* MODAL ACTIONS */}

            <div className="flex shrink-0 gap-2 border-t border-slate-100 p-4 sm:justify-end">

              <button
                type="button"
                onClick={closeEdit}
                disabled={updating}
                className="h-11 flex-1 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 sm:h-9 sm:flex-none"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={updating}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-60 sm:h-9 sm:flex-none"
              >
                {updating && (
                  <Loader2
                    size={13}
                    className="animate-spin"
                  />
                )}

                {updating
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManager;
