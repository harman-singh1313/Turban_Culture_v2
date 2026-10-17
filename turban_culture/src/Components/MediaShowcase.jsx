import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import {
  FiPlay as Play,
  FiArrowRight as ArrowRight,
  FiImage as ImageIcon,
  FiLoader as Loader2,
  FiAlertCircle as AlertCircle,
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

// Title optional hai, khaali ho to category ka naam dikhao
const getTitle = (item) =>
  item.category === "videos" && item.title
    ? item.title
    : getCategoryLabel(item.category);

const getThumb = (item) =>
  item.category === "videos"
    ? item.video?.posterUrl
    : item.image?.url;

const MediaShowcase = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  // Main preview reference for auto scroll
  const playerRef = useRef(null);

  // =========================================================
  // FETCH
  // =========================================================

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await axios.get(`${API_URL}/api/media`);

        if (!active) return;

        if (data.success) {
          setMedia(
            (data.media || []).filter(
              (item) => item.status === "published"
            )
          );
        }
      } catch (err) {
        console.error("SHOWCASE ERROR:", err);

        if (active) {
          setError(
            err.response?.data?.message ||
            "Failed to load gallery."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  // =========================================================
  // DERIVED DATA
  // =========================================================

  // Sirf wahi categories pills mein dikhengi jinme data hai
  const availableCategories = useMemo(
    () =>
      categories.filter((cat) =>
        media.some((item) => item.category === cat.value)
      ),
    [media]
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? media
        : media.filter((item) => item.category === filter),
    [media, filter]
  );

  const selected =
    filtered.find((item) => item._id === selectedId) ||
    filtered[0] ||
    null;

  const isVideo = selected?.category === "videos";
  const isPlaying = !!selected && playingId === selected._id;

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleSelect = (item) => {
    setSelectedId(item._id);

    setPlayingId(
      item.category === "videos" && item.video?.url
        ? item._id
        : null
    );

    // Mobile / tablet te main preview tak smooth auto scroll
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        playerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  const handleFilter = (value) => {
    setFilter(value);
    setSelectedId(null);
    setPlayingId(null);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#fffdf8] via-[#ededec] to-[#f9f5f1] py-10 sm:py-14 lg:py-20">

      {/* Soft background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -transtone-x-1/2 rounded-full bg-[#d4a853]/25 blur-3xl sm:h-96 sm:w-96" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* HEADING */}

        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-10">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#b8863b] sm:text-xs">
            Our Work
          </p>

          <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            Our <span className="text-[#b8863b]">Gallery</span>
          </h2>

          <p className="mt-3 text-sm text-stone-500 sm:text-base">
            Explore our latest work, tap any project to view it
          </p>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="grid gap-4 lg:grid-cols-[380px_1fr] lg:gap-6">
            <div className="order-2 space-y-3 lg:order-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[92px] animate-pulse rounded-xl bg-white ring-1 ring-stone-200"
                />
              ))}
            </div>

            <div className="order-1 flex aspect-[4/5] sm:aspect-video animate-pulse items-center justify-center rounded-2xl bg-stone-200 lg:order-2">
              <Loader2
                size={28}
                className="animate-spin text-[#b8863b]"
              />
            </div>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 text-center">
            <AlertCircle
              size={28}
              className="mb-2 text-red-500"
            />

            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* EMPTY */}

        {!loading && !error && media.length === 0 && (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 text-center">
            <ImageIcon
              size={30}
              className="mb-2 text-stone-300"
            />

            <p className="text-sm font-bold text-stone-700">
              Nothing to show yet
            </p>

            <p className="mt-1 text-xs text-stone-400">
              New work will appear here soon
            </p>
          </div>
        )}

        {/* CONTENT */}

        {!loading && !error && media.length > 0 && (
          <>
            {/* FILTER PILLS */}

            <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
              {[
                { value: "all", label: "All" },
                ...availableCategories,
              ].map((cat) => {
                const active = filter === cat.value;

                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleFilter(cat.value)}
                    className={`h-10 shrink-0 whitespace-nowrap rounded-full px-5 text-sm font-semibold transition ${
                      active
                        ? "bg-gradient-to-r from-[#c99a4b] to-[#a8741f] text-white shadow-lg shadow-[#b8863b]/30"
                        : "bg-white text-stone-600 ring-1 ring-[#ecdcc0] hover:text-[#a8741f] hover:ring-[#d4a853]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* MAIN GRID */}

            <div className="grid gap-4 lg:grid-cols-[380px_1fr] lg:gap-6">

              {/* ================= LIST ================= */}

              <aside className="order-2 overflow-hidden rounded-2xl bg-white shadow-xl shadow-[#b8863b]/10 ring-1 ring-[#ecdcc0] lg:relative lg:order-1">

                <div className="flex h-full flex-col lg:absolute lg:inset-0">

                  <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-4 sm:px-5">
                    <p className="text-xs font-bold tracking-wide text-stone-500">
                      Select a project
                    </p>

                    <span className="text-xs font-semibold text-[#b8863b]">
                      {filtered.length} available
                    </span>
                  </div>

                  <div className="max-h-[340px] flex-1 space-y-2 sm:max-h-[420px] sm:space-y-2.5 overflow-y-auto px-3 pb-3 sm:px-4 sm:pb-4 lg:max-h-none">
                    {filtered.map((item) => {
                      const active = selected?._id === item._id;
                      const itemIsVideo =
                        item.category === "videos";
                      const thumb = getThumb(item);

                      return (
                        <button
                          key={item._id}
                          type="button"
                          onClick={() => handleSelect(item)}
                          className={`group flex w-full items-stretch overflow-hidden rounded-xl border text-left transition ${
                            active
                              ? "border-[#c99a4b] bg-[#fbf3e4] shadow-md shadow-[#b8863b]/10"
                              : "border-[#efe3cf] bg-white hover:border-[#dcc08a] hover:shadow-md"
                          }`}
                        >
                          {/* THUMB */}

                          <div className="relative h-14 w-20 shrink-0 overflow-hidden bg-stone-100 sm:h-[92px] sm:w-32">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={getTitle(item)}
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-stone-300">
                                <ImageIcon size={24} />
                              </div>
                            )}

                            {itemIsVideo && (
                              <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Play
                                  size={18}
                                  fill="currentColor"
                                  className="text-white drop-shadow"
                                />
                              </span>
                            )}
                          </div>

                          {/* TEXT */}

                          <div className="flex min-w-0 flex-1 flex-col justify-center px-2.5 py-1 sm:px-4 sm:py-2">
                            <span className="truncate text-[9px] font-semibold uppercase tracking-wide sm:text-[10px] text-[#b8863b]">
                              {getCategoryLabel(item.category)}
                            </span>

                            <h3 className="truncate text-xs font-bold text-stone-900 sm:mt-0.5 sm:text-[15px]">
                              {getTitle(item)}
                            </h3>

                            <span
                              className={`flex items-center gap-1 text-[10px] sm:mt-0.5 sm:text-xs ${
                                active
                                  ? "text-[#b8863b]"
                                  : "text-stone-500"
                              }`}
                            >
                              {active ? (
                                "Currently selected"
                              ) : (
                                <>
                                  {itemIsVideo
                                    ? "Play video"
                                    : "View image"}
                                  <ArrowRight size={12} />
                                </>
                              )}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>

              {/* ================= PLAYER ================= */}

              <div
                ref={playerRef}
                className="order-1 lg:order-2"
              >
                {selected && (
                  <div className="relative aspect-[4/5] sm:aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl shadow-stone-900/25 ring-1 ring-black/10">

                    {isVideo && isPlaying ? (
                      <video
                        key={selected._id}
                        src={selected.video.url}
                        poster={selected.video?.posterUrl}
                        controls
                        autoPlay
                        playsInline
                        className="h-full w-full bg-black object-contain"
                      />
                    ) : (
                      <>
                        {/* Blurred backdrop */}

                        {getThumb(selected) && (
                          <img
                            src={getThumb(selected)}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 hidden h-full w-full scale-110 object-cover opacity-40 blur-2xl sm:block"
                          />
                        )}

                        {/* Main image */}

                        {getThumb(selected) ? (
                          <img
                            src={getThumb(selected)}
                            alt={getTitle(selected)}
                            className="relative h-full w-full object-cover object-[center_20%] sm:object-contain sm:object-center"
                          />
                        ) : (
                          <div className="relative flex h-full items-center justify-center text-stone-500">
                            <ImageIcon size={40} />
                          </div>
                        )}

                        {/* Gradient for text */}

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

                        {/* Play button */}

                        {isVideo && selected.video?.url && (
                          <button
                            type="button"
                            aria-label="Play video"
                            onClick={() =>
                              setPlayingId(selected._id)
                            }
                            className="absolute left-1/2 top-1/2 flex h-16 w-16 -transtone-x-1/2 -transtone-y-1/2 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/40 backdrop-blur-md transition hover:scale-110 hover:bg-[#b8863b] sm:h-20 sm:w-20"
                          >
                            <Play
                              size={26}
                              fill="currentColor"
                              className="ml-1"
                            />
                          </button>
                        )}

                        {/* Title chip */}

                        <div className="absolute bottom-3 left-3 right-3 flex min-w-0 flex-col items-start gap-1 sm:bottom-5 sm:left-5 sm:right-5">
                          {getTitle(selected) !==
                            getCategoryLabel(selected.category) && (
                            <span className="rounded-full bg-[#b8863b]/90 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur sm:text-xs">
                              {getCategoryLabel(selected.category)}
                            </span>
                          )}

                          <h3 className="max-w-full truncate font-serif text-base font-bold text-white drop-shadow sm:text-xl lg:text-2xl">
                            {getTitle(selected)}
                          </h3>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {!selected && (
                  <div className="flex aspect-[4/5] sm:aspect-video items-center justify-center rounded-2xl bg-white text-sm text-stone-400 ring-1 ring-stone-200">
                    No items in this category
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MediaShowcase;
