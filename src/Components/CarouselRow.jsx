import React, { useEffect, useMemo, useRef } from "react";
import MovieDetail from "./MovieDetail";
import "../css/CarouselRow.css";

export default function CarouselRow({ title, movies, onMovieClick }) {
    // Reference til det scrollende container element
    const containerRef = useRef(null);

    // Flag til at forhindre scroll justeringer under programmatisk scrolling
    const isAdjustingRef = useRef(false);

    // Skab tredobbelt kopi af film til sømløs uendelig scrolling effekt
    // Dette tillader karrusellen at loope glat uden at hoppe tilbage til start
    const tripled = useMemo(() => {
        return movies ? [...movies, ...movies, ...movies] : [];
    }, [movies]);

    // Funktion til at centrere scroll positionen på den midterste kopi af film
    const centerScroll = () => {
        const element = containerRef.current;
        if (!element) return;

        // Beregn en tredjedel af den totale scroll bredde (midterste sektion)
        const oneThird = element.scrollWidth / 3;

        // Deaktiver midlertidigt glat scrolling for øjeblikkelig positionering
        const previousScrollBehavior = element.style.scrollBehavior;
        element.style.scrollBehavior = "auto";

        // Sæt scroll position til midterste kopi
        element.scrollLeft = oneThird;

        // Gendan forrige scroll opførsel
        element.style.scrollBehavior = previousScrollBehavior || "";
    };

    // Centrer scrollet når film ændres
    useEffect(() => {
        const animationId = requestAnimationFrame(centerScroll);
        return () => cancelAnimationFrame(animationId);
    }, [movies]);

    // Håndter scroll events for at skabe uendelig loop effekt
    const handleScroll = () => {
        const element = containerRef.current;
        if (!element || isAdjustingRef.current) return;

        const oneThird = element.scrollWidth / 3;
        const currentScrollLeft = element.scrollLeft;

        // Tjek om vi har scrollet for langt til venstre eller højre (20% tærskel)
        if (currentScrollLeft < oneThird * 0.2 || currentScrollLeft > oneThird * 1.8) {
            // Gem nuværende scroll opførsel og deaktiver glat scrolling
            const previousScrollBehavior = element.style.scrollBehavior;
            element.style.scrollBehavior = "auto";
            isAdjustingRef.current = true;

            // Hop til tilsvarende position i midterste sektion
            if (currentScrollLeft < oneThird) {
                element.scrollLeft = currentScrollLeft + oneThird;
            } else {
                element.scrollLeft = currentScrollLeft - oneThird;
            }

            // Gendan scroll opførsel efter justering
            requestAnimationFrame(() => {
                element.style.scrollBehavior = previousScrollBehavior || "";
                isAdjustingRef.current = false;
            });
        }
    };

    // Funktion til at scrolle med et bestemt antal filmkort
    const scrollByCards = (numberOfCards) => {
        const element = containerRef.current;
        if (!element) return;

        // Find et filmkort for at beregne dets bredde
        const movieCard = element.querySelector(".movie-detail");
        const cardWidth = movieCard ? movieCard.getBoundingClientRect().width : 200;

        // Få afstanden mellem kort fra CSS variabel
        const gap = parseFloat(getComputedStyle(element).getPropertyValue("--gap") || "16");

        // Scroll glat med kortbredde + afstand
        element.scrollBy({
            left: (cardWidth + gap) * numberOfCards,
            behavior: "smooth"
        });
    };

    // Hjælpefunktion til at få film/TV-show titel
    // Film bruger 'title' egenskab, TV-shows bruger 'name' egenskab
    const getTitle = (item) => item.title || item.name || 'No Title';

    // Hjælpefunktion til at få udgivelsesår
    // Film bruger 'release_date', TV-shows bruger 'first_air_date'
    const getReleaseYear = (item) => {
        const date = item.release_date || item.first_air_date;
        return date ? new Date(date).getFullYear() : '';
    };

    // Skab forbedrede film objekter med konsistente titel og år egenskaber
    const enhancedMovies = useMemo(() => {
        return movies?.map(item => ({
            ...item,
            displayTitle: getTitle(item),
            displayYear: getReleaseYear(item)
        })) || [];
    }, [movies]);

    // Skab tredobbelt kopi af forbedrede film til uendelig scrolling
    const tripledEnhanced = useMemo(() => {
        return enhancedMovies ? [...enhancedMovies, ...enhancedMovies, ...enhancedMovies] : [];
    }, [enhancedMovies]);

    // Render ikke noget hvis ingen film er angivet
    if (!movies || movies.length === 0) return null;

    return (
        <section className="movies-section">
            {/* Sektion header med titel */}
            <div className="row-header">
                <h2 className="section-title">{title}</h2>
            </div>

            {/* Hovedkarussel container med navigationsknapper */}
            <div className="loop-wrapper">
                {/* Venstre navigationsknap */}
                <button
                    className="side-btn side-left"
                    aria-label="Previous movies"
                    onClick={() => scrollByCards(-1)}
                >
                    ‹
                </button>

                {/* Scrollende container med filmkort */}
                <div
                    className="loop-row no-manual-scroll"
                    ref={containerRef}
                    onScroll={handleScroll}
                >
                    {/* Render hvert filmkort */}
                    {tripledEnhanced.map((movie, index) => (
                        <MovieDetail
                            movie={movie}
                            key={`${movie.id}-${index}`}
                            onMovieClick={onMovieClick}
                        />
                    ))}
                </div>

                {/* Højre navigationsknap */}
                <button
                    className="side-btn side-right"
                    aria-label="Next movies"
                    onClick={() => scrollByCards(1)}
                >
                    ›
                </button>
            </div>
        </section>
    );
}