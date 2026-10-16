import React, { useEffect, useMemo, useState } from "react";
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

  // FETCH - existing logic unchanged
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

  // DERIVED DATA - existing logic unchanged
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

  // HANDLERS - existing logic unchanged
  const handleSelect = (item) => {
    setSelectedId(item._id);
    setPlayingId(
      item.category === "videos" && item.video?.url
        ? item._id
        : null
    );
  };

  const handleFilter = (value) => {
    setFilter(value);
    setSelectedId(null);
    setPlayingId(null);
  };

  return (
    <section className="relative isolate w-full overflow-hidden bg-gradient-to-br from-[#fbf8f1] via-[#eeebe5] to-[#f8f2e8] py-10 sm:py-14 lg:py-20">

      {/* GLASS BACKGROUND DECORATIONS */}
      <div className="pointer-events-none absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#d4a853]/25 blur-[100px] sm:h-[450px] sm:w-[450px]" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/80 blur-[100px]" />

      <div className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-[#d4a853]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* HEADING */}
        <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b8863b]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a8752b] sm:text-xs">
              Our Work
            </p>
          </div>

          <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            Our{" "}
            <span className="bg-gradient-to-r from-[#c99a4b] via-[#a8752b] to-[#d6b16d] bg-clip-text text-transparent">
              Gallery
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600 sm:text-base">
            Explore our latest work, tap any project to view it
          </p>

          <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-[#c99a4b] to-transparent" />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid gap-4 lg:grid-cols-[380px_1fr] lg:gap-6">
            <div className="order-2 space-y-3 rounded-2xl border border-white/70 bg-white/35 p-3 shadow-lg backdrop-blur-xl lg:order-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[92px] animate-pulse rounded-xl border border-white/70 bg-white/50"
                />
              ))}
            </div>

            <div className="order-1 flex aspect-[4/5] animate-pulse items-center justify-center rounded-2xl border border-white/80 bg-white/40 shadow-xl backdrop-blur-xl sm:aspect-video lg:order-2">
              <Loader2
                size={30}
                className="animate-spin text-[#b8863b]"
              />
            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-red-200/80 bg-white/50 px-4 text-center shadow-xl backdrop-blur-2xl">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50/80">
              <AlertCircle size={28} className="text-red-500" />
            </div>

            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && media.length === 0 && (
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-white/80 bg-white/40 px-4 text-center shadow-xl shadow-stone-900/5 backdrop-blur-2xl">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-white bg-white/60 shadow-sm">
              <ImageIcon size={30} className="text-[#c4a36b]" />
            </div>

            <p className="text-base font-bold text-stone-800">
              Nothing to show yet
            </p>

            <p className="mt-1 text-sm text-stone-500">
              New work will appear here soon
            </p>
          </div>
        )}

        {/* CONTENT */}
        {!loading && !error && media.length > 0 && (
          <>
            {/* FILTER PILLS */}
            <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
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
                    className={`relative h-10 shrink-0 whitespace-nowrap rounded-full border px-5 text-sm font-semibold backdrop-blur-xl transition-all duration-300 ${
                      active
                        ? "border-[#b8863b]/70 bg-gradient-to-r from-[#c99a4b] to-[#a8741f] text-white shadow-lg shadow-[#b8863b]/25"
                        : "border-white/80 bg-white/45 text-stone-700 shadow-sm hover:border-[#d4a853]/70 hover:bg-white/80 hover:shadow-md"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* MAIN GRID */}
            <div className="grid gap-4 lg:grid-cols-[380px_1fr] lg:gap-6">

              {/* PROJECT LIST */}
              <aside className="order-2 overflow-hidden rounded-2xl border border-white/80 bg-white/40 shadow-xl shadow-stone-900/[0.06] backdrop-blur-2xl lg:relative lg:order-1">
                <div className="flex h-full flex-col lg:absolute lg:inset-0">

                  {/* SIDEBAR HEADER */}
                  <div className="flex shrink-0 items-center justify-between border-b border-white/70 px-4 pb-3 pt-4 sm:px-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a8752b]">
                        Gallery Collection
                      </p>

                      <p className="mt-1 text-sm font-semibold text-stone-800">
                        Select a project
                      </p>
                    </div>

                    <span className="rounded-full border border-[#d4a853]/30 bg-[#fff8e9]/80 px-3 py-1.5 text-xs font-bold text-[#9b702e]">
                      {filtered.length} items
                    </span>
                  </div>

                  {/* PROJECT ITEMS */}
                  <div className="max-h-[340px] flex-1 space-y-2 overflow-y-auto p-3 sm:max-h-[420px] sm:space-y-2.5 sm:p-4 lg:max-h-none">
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
                          className={`group flex w-full items-stretch overflow-hidden rounded-xl border text-left backdrop-blur-xl transition-all duration-300 ${
                            active
                              ? "border-[#c99a4b]/70 bg-[#fff8e9]/80 shadow-md shadow-[#b8863b]/10"
                              : "border-white/80 bg-white/35 hover:border-[#d4a853]/70 hover:bg-white/75 hover:shadow-md"
                          }`}
                        >
                          {/* THUMBNAIL */}
                          <div className="relative h-14 w-20 shrink-0 overflow-hidden bg-stone-200/50 sm:h-[92px] sm:w-32">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={getTitle(item)}
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-stone-400">
                                <ImageIcon size={24} />
                              </div>
                            )}

                            {itemIsVideo && (
                              <span className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[2px]">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/20 text-white shadow-lg backdrop-blur-md">
                                  <Play
                                    size={15}
                                    fill="currentColor"
                                  />
                                </span>
                              </span>
                            )}
                          </div>

                          {/* ITEM TEXT */}
                          <div className="flex min-w-0 flex-1 flex-col justify-center px-2.5 py-1.5 sm:px-4 sm:py-2">
                            <span className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-[#a8752b] sm:text-[10px]">
                              {getCategoryLabel(item.category)}
                            </span>

                            <h3 className="truncate text-xs font-bold text-stone-900 sm:mt-1 sm:text-[15px]">
                              {getTitle(item)}
                            </h3>

                            <span
                              className={`mt-1 flex items-center gap-1 text-[10px] sm:text-xs ${
                                active
                                  ? "font-semibold text-[#a8752b]"
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

                          {/* ACTIVE INDICATOR */}
                          {active && (
                            <div className="my-3 w-1 shrink-0 rounded-l-full bg-gradient-to-b from-[#d8b66f] to-[#a8752b]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>

              {/* MAIN MEDIA PLAYER */}
              <div className="order-1 min-w-0 lg:order-2">
                {selected && (
                  <div className="group/player relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/80 bg-stone-900/90 shadow-2xl shadow-stone-900/15 sm:aspect-video">

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
                        {/* BLURRED BACKDROP */}
                        {getThumb(selected) && (
                          <img
                            src={getThumb(selected)}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 hidden h-full w-full scale-110 object-cover opacity-40 blur-2xl sm:block"
                          />
                        )}

                        {/* MAIN IMAGE */}
                        {getThumb(selected) ? (
                          <img
                            src={getThumb(selected)}
                            alt={getTitle(selected)}
                            className="relative h-full w-full object-cover object-[center_20%] sm:object-contain sm:object-center"
                          />
                        ) : (
                          <div className="relative flex h-full items-center justify-center text-stone-400">
                            <ImageIcon size={40} />
                          </div>
                        )}

                        {/* DARK GRADIENT */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                        {/* GLASS TOP BADGE */}
                        <div className="absolute left-3 top-3 sm:left-5 sm:top-5">
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/20 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg backdrop-blur-xl sm:text-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#e5c47e]" />
                            {getCategoryLabel(selected.category)}
                          </span>
                        </div>

                        {/* GLASS PLAY BUTTON */}
                        {isVideo && selected.video?.url && (
                          <button
                            type="button"
                            aria-label="Play video"
                            onClick={() =>
                              setPlayingId(selected._id)
                            }
                            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/20 text-white shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#d4a853] hover:bg-[#b8863b]/80 sm:h-20 sm:w-20"
                          >
                            <Play
                              size={26}
                              fill="currentColor"
                              className="ml-1"
                            />
                          </button>
                        )}

                        {/* TITLE OVERLAY */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                          <div className="max-w-xl">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f1d49a] sm:text-xs">
                              Turban Culture
                            </p>

                            <h3 className="break-words font-serif text-xl font-bold leading-tight text-white drop-shadow-lg sm:text-2xl lg:text-3xl">
                              {getTitle(selected)}
                            </h3>

                            <div className="mt-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#e4c17b] to-transparent" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {!selected && (
                  <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-2xl border border-white/80 bg-white/40 text-sm text-stone-500 shadow-xl backdrop-blur-2xl sm:aspect-video">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white bg-white/50">
                      <ImageIcon size={28} className="text-[#c4a36b]" />
                    </div>

                    <p className="font-semibold text-stone-700">
                      No items in this category
                    </p>
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
