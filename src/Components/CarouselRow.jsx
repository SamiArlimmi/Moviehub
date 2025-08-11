import React, { useEffect, useMemo, useRef } from "react";
import MovieDetail from "./MovieDetail";
import "../css/CarouselRow.css";

export default function CarouselRow({ title, movies, onMovieClick }) { // Add onMovieClick prop here
    // Always call hooks at the top of the component
    const containerRef = useRef(null);
    const isAdjustingRef = useRef(false);

    // 3x list for seamless loop; this should be computed even if movies are empty
    const tripled = useMemo(() => {
        return movies ? [...movies, ...movies, ...movies] : [];
    }, [movies]);

    const centerScroll = () => {
        const el = containerRef.current;
        if (!el) return;
        const third = el.scrollWidth / 3;
        const prev = el.style.scrollBehavior;
        el.style.scrollBehavior = "auto";
        el.scrollLeft = third; // middle copy
        el.style.scrollBehavior = prev || "";
    };

    useEffect(() => {
        const id = requestAnimationFrame(centerScroll);
        return () => cancelAnimationFrame(id);
    }, [movies]);

    const handleScroll = () => {
        const el = containerRef.current;
        if (!el || isAdjustingRef.current) return;

        const third = el.scrollWidth / 3;
        const left = el.scrollLeft;

        if (left < third * 0.2 || left > third * 1.8) {
            const prev = el.style.scrollBehavior;
            el.style.scrollBehavior = "auto";
            isAdjustingRef.current = true;

            if (left < third) el.scrollLeft = left + third;
            else el.scrollLeft = left - third;

            requestAnimationFrame(() => {
                el.style.scrollBehavior = prev || "";
                isAdjustingRef.current = false;
            });
        }
    };

    // Buttons control movement (smooth), 1 card at a time
    const scrollByCards = (n) => {
        const el = containerRef.current;
        if (!el) return;
        const card = el.querySelector(".movie-detail");
        const cardWidth = card ? card.getBoundingClientRect().width : 200;
        const gap = parseFloat(getComputedStyle(el).getPropertyValue("--gap") || "16");
        el.scrollBy({ left: (cardWidth + gap) * n, behavior: "smooth" });
    };

    if (!movies || movies.length === 0) return null; // Conditional rendering of JSX (not hooks)

    return (
        <section className="movies-section">
            <div className="row-header">
                <h2 className="section-title">{title}</h2>
            </div>

            <div className="loop-wrapper">
                <button
                    className="side-btn side-left"
                    aria-label="Previous"
                    onClick={() => scrollByCards(-1)}
                >
                    ‹
                </button>

                <div
                    className="loop-row no-manual-scroll"
                    ref={containerRef}
                    onScroll={handleScroll}
                >
                    {tripled.map((movie, i) => (
                        <MovieDetail
                            movie={movie}
                            key={`${movie.id}-${i}`}
                            onMovieClick={onMovieClick} // Pass the onMovieClick prop here
                        />
                    ))}
                </div>

                <button
                    className="side-btn side-right"
                    aria-label="Next"
                    onClick={() => scrollByCards(1)}
                >
                    ›
                </button>
            </div>
        </section>
    );
}