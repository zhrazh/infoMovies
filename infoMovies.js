/* =========================================================
   infoMovies | Tugas 5 - JavaScript & jQuery
   Data film di bawah adalah data dummy untuk latihan frontend.
   Belum terhubung ke backend/API/database.
   ========================================================= */
(function () {
    "use strict";

    // 1. Variabel dan tipe data: array of object untuk katalog film.
    const movies = [
        {
            id: 1, title: "Interstellar", year: 2014,
            genres: ["Sci-Fi", "Drama", "Adventure"], rating: 8.6,
            director: "Christopher Nolan", duration: 169,
            poster: "images/interstellar.jpg",
            synopsis: "Seorang mantan pilot NASA, Cooper, memimpin misi luar angkasa untuk mencari planet baru yang dapat dihuni manusia ketika Bumi menghadapi krisis lingkungan.",
            trailer: "https://youtu.be/zSWdZVtXT7E"
        },
        {
            id: 2, title: "Inception", year: 2010,
            genres: ["Sci-Fi", "Thriller", "Action"], rating: 8.8,
            director: "Christopher Nolan", duration: 148,
            poster: "images/inception.jpg",
            synopsis: "Seorang pencuri yang ahli memasuki mimpi diberi tugas untuk menanamkan sebuah ide ke dalam pikiran targetnya.",
            trailer: ""
        },
        {
            id: 3, title: "The Dark Knight", year: 2008,
            genres: ["Action", "Crime", "Drama"], rating: 9.0,
            director: "Christopher Nolan", duration: 152,
            poster: "",
            synopsis: "Batman menghadapi ancaman baru yang menguji batas moral dan keteguhan Gotham City.",
            trailer: ""
        },
        {
            id: 4, title: "Mad Max: Fury Road", year: 2015,
            genres: ["Action", "Adventure", "Sci-Fi"], rating: 8.1,
            director: "George Miller", duration: 120,
            poster: "",
            synopsis: "Di dunia pasca-apokaliptik, Max bergabung dengan Furiosa dalam perjalanan berbahaya untuk mencari kebebasan.",
            trailer: ""
        },
        {
            id: 5, title: "John Wick", year: 2014,
            genres: ["Action", "Thriller"], rating: 7.4,
            director: "Chad Stahelski", duration: 101,
            poster: "",
            synopsis: "Seorang mantan pembunuh bayaran kembali menghadapi dunia kriminal yang pernah ia tinggalkan.",
            trailer: ""
        },
        {
            id: 6, title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001,
            genres: ["Adventure", "Fantasy", "Drama"], rating: 8.8,
            director: "Peter Jackson", duration: 178,
            poster: "",
            synopsis: "Seorang hobbit memulai perjalanan untuk menghancurkan cincin yang memiliki kekuatan berbahaya.",
            trailer: ""
        },
        {
            id: 7, title: "Superbad", year: 2007,
            genres: ["Comedy"], rating: 7.6,
            director: "Greg Mottola", duration: 113,
            poster: "",
            synopsis: "Dua sahabat berusaha membuat malam terakhir sebelum lulus sekolah menjadi pengalaman yang tak terlupakan.",
            trailer: ""
        },
        {
            id: 8, title: "The Hangover", year: 2009,
            genres: ["Comedy"], rating: 7.7,
            director: "Todd Phillips", duration: 100,
            poster: "",
            synopsis: "Sekelompok teman mencoba mengingat kejadian malam sebelumnya setelah bangun dengan situasi yang kacau.",
            trailer: ""
        }
    ];

    const STORAGE_KEYS = {
        logs: "infomovies_tugas5_logs",
        profile: "infomovies_tugas5_profile"
    };

    // Fallback sesi digunakan bila browser membatasi localStorage pada file lokal.
    let sessionLogs = [];

    function readStoredData(key, fallback) {
        try {
            const value = window.localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeStoredData(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            return false;
        }
    }

    function getLogs() {
        const savedLogs = readStoredData(STORAGE_KEYS.logs, null);
        return Array.isArray(savedLogs) ? savedLogs : sessionLogs;
    }

    function saveLogs(logs) {
        sessionLogs = logs;
        writeStoredData(STORAGE_KEYS.logs, logs);
    }

    function escapeHTML(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 2. Function pemroses data: filter judul, genre, tahun, dan sutradara.
    function filterMovies(keyword) {
        const query = String(keyword || "").trim().toLowerCase();
        if (!query) return [];
        return movies.filter(function (movie) {
            const searchable = [
                movie.title, movie.year, movie.director, movie.genres.join(" ")
            ].join(" ").toLowerCase();
            return searchable.includes(query);
        });
    }

    function getMoviesByGenre(genre) {
        if (!genre || genre === "All") {
            return movies.slice().sort(function (a, b) { return b.rating - a.rating; });
        }
        return movies.filter(function (movie) {
            return movie.genres.some(function (item) {
                return item.toLowerCase() === genre.toLowerCase();
            });
        }).sort(function (a, b) { return b.rating - a.rating; });
    }

    function getMovieByTitle(title) {
        const normalized = String(title || "").trim().toLowerCase();
        return movies.find(function (movie) {
            return movie.title.toLowerCase() === normalized;
        }) || movies[0];
    }

    function posterMarkup(movie, extraClass) {
        if (movie.poster) {
            return '<img class="movie-poster ' + (extraClass || '') + '" src="' +
                escapeHTML(movie.poster) + '" alt="Poster film ' + escapeHTML(movie.title) + '">';
        }
        return '<div class="movie-poster-placeholder ' + (extraClass || '') +
            '" role="img" aria-label="Poster ilustrasi ' + escapeHTML(movie.title) + '">' +
            '<span class="poster-icon" aria-hidden="true">🎬</span><strong>' +
            escapeHTML(movie.title) + '</strong><small>' + movie.year + '</small></div>';
    }

    function movieCardMarkup(movie, kicker) {
        const detailURL = "film.html?title=" + encodeURIComponent(movie.title);
        const logURL = "log.html?title=" + encodeURIComponent(movie.title);
        return '<div class="col-12 col-sm-6 col-xl-4 movie-grid-item">' +
            '<article class="movie-card h-100">' +
                '<a class="movie-card-link" href="' + detailURL + '">' +
                    posterMarkup(movie, '') +
                    '<div class="movie-card-copy">' +
                        '<span class="movie-kicker">' + escapeHTML(kicker || "MOVIE DATABASE") + '</span>' +
                        '<h3>' + escapeHTML(movie.title) + ' (' + movie.year + ')</h3>' +
                        '<p class="movie-meta">' + escapeHTML(movie.genres.join(" · ")) + '</p>' +
                        '<span class="movie-rating"><span aria-hidden="true">★</span> ' + movie.rating.toFixed(1) + '/10</span>' +
                    '</div>' +
                '</a>' +
                '<div class="movie-card-actions"><a class="btn btn-sm btn-outline-warning" href="' +
                    logURL + '">+ Add to Log</a></div>' +
            '</article>' +
        '</div>';
    }

    // 3. Percabangan dan perulangan: render kartu dari array, bukan ditulis satu per satu di HTML.
    function renderDashboard() {
        const catalog = document.getElementById("movieCatalog");
        if (!catalog) return;

        let markup = "";
        for (let index = 0; index < movies.length; index += 1) {
            const label = index === 0 ? "FEATURED MOVIE" : (index === 1 ? "POPULAR PICK" : "MOVIE DATABASE");
            markup += movieCardMarkup(movies[index], label);
        }
        catalog.innerHTML = markup;

        const summary = document.getElementById("movieSummary");
        if (summary) {
            summary.textContent = movies.length + " film tersedia dalam katalog contoh. Data ini masih dummy.";
        }
    }

    function renderSearchResults(results, keyword) {
        const resultsElement = document.getElementById("searchResults");
        if (!resultsElement) return;

        if (results.length === 0) {
            resultsElement.innerHTML = '<div class="empty-state">Tidak ada film yang cocok dengan kata kunci <strong>' +
                escapeHTML(keyword) + '</strong>. Coba judul, genre, atau sutradara lain.</div>';
            return;
        }

        resultsElement.innerHTML =
            '<p class="movie-summary">Ditemukan ' + results.length + ' film untuk kata kunci "' +
            escapeHTML(keyword) + '".</p><div class="row g-4">' +
            results.map(function (movie) { return movieCardMarkup(movie, "SEARCH RESULT"); }).join("") +
            '</div>';
    }

    function renderRecommendations(genre) {
        const resultElement = document.getElementById("recommendationResults");
        if (!resultElement) return;

        const filtered = getMoviesByGenre(genre);
        resultElement.innerHTML = filtered.map(function (movie) {
            return movieCardMarkup(movie, genre === "All" ? "TOP RATED" : genre.toUpperCase() + " PICK");
        }).join("");

        const summary = document.getElementById("recommendationSummary");
        if (summary) {
            summary.textContent = filtered.length + " rekomendasi" +
                (genre === "All" ? " dari semua genre, diurutkan berdasarkan rating." : " untuk genre " + genre + ".");
        }
    }

    function renderFilmDetail() {
        const detail = document.getElementById("filmDetail");
        if (!detail) return;

        const params = new URLSearchParams(window.location.search);
        const requestedTitle = params.get("title");
        const movie = getMovieByTitle(requestedTitle);
        const title = document.getElementById("detailTitle");
        const poster = document.getElementById("detailPoster");
        const placeholder = document.getElementById("detailPosterPlaceholder");
        const posterTitle = document.getElementById("detailPosterTitle");

        document.title = movie.title + " | infoMovies";
        if (title) title.textContent = movie.title + " (" + movie.year + ")";
        if (posterTitle) posterTitle.textContent = movie.title;

        if (movie.poster) {
            poster.src = movie.poster;
            poster.alt = "Poster film " + movie.title;
            poster.classList.remove("d-none");
            if (placeholder) placeholder.classList.add("d-none");
        } else {
            if (poster) poster.classList.add("d-none");
            if (placeholder) placeholder.classList.remove("d-none");
        }

        const facts = document.getElementById("detailFacts");
        if (facts) {
            facts.innerHTML =
                "<dt>Genre</dt><dd>" + escapeHTML(movie.genres.join(", ")) + "</dd>" +
                "<dt>Tahun rilis</dt><dd>" + movie.year + "</dd>" +
                "<dt>Durasi</dt><dd>" + movie.duration + " menit</dd>" +
                "<dt>Sutradara</dt><dd>" + escapeHTML(movie.director) + "</dd>" +
                "<dt>Rating contoh</dt><dd>★ " + movie.rating.toFixed(1) + "/10</dd>";
        }

        const synopsis = document.getElementById("detailSynopsis");
        if (synopsis) synopsis.textContent = movie.synopsis;

        const trailer = document.getElementById("detailTrailer");
        if (trailer) {
            trailer.innerHTML = movie.trailer
                ? '<a href="' + escapeHTML(movie.trailer) + '" target="_blank" rel="noopener noreferrer">Tonton trailer ' + escapeHTML(movie.title) + '</a>'
                : '<span class="text-muted">Tautan trailer belum ditambahkan pada data dummy.</span>';
        }

        const logLink = document.getElementById("detailLogLink");
        if (logLink) logLink.href = "log.html?title=" + encodeURIComponent(movie.title);
    }

    function renderLogs() {
        const list = document.getElementById("logList");
        if (!list) return;

        const logs = getLogs().slice().sort(function (a, b) { return b.id - a.id; });
        const count = document.getElementById("logCount");
        const empty = document.getElementById("emptyLogs");

        if (count) count.textContent = logs.length + (logs.length === 1 ? " film sudah dicatat." : " film sudah dicatat.");
        if (empty) empty.classList.toggle("d-none", logs.length > 0);

        if (logs.length === 0) {
            list.innerHTML = "";
            return;
        }

        list.innerHTML = logs.map(function (entry) {
            const genres = Array.isArray(entry.genres) && entry.genres.length ? entry.genres.join(", ") : "Genre belum dipilih";
            const rating = entry.rate ? "★ " + escapeHTML(entry.rate) + "/5" : "Belum diberi rating";
            return '<article class="log-entry">' +
                '<div class="log-entry-main"><h3>' + escapeHTML(entry.title) + '</h3>' +
                '<p class="mb-1">' + escapeHTML(entry.director || "Sutradara belum diisi") + ' · ' + escapeHTML(genres) + '</p>' +
                '<p class="log-review mb-1">' + escapeHTML(entry.review || "Belum ada ulasan.") + '</p>' +
                '<small>' + escapeHTML(entry.date || "Tanggal tidak diisi") + ' · ' + rating + '</small></div>' +
                '<button type="button" class="btn btn-sm btn-outline-danger delete-log" data-log-id="' + entry.id + '">Hapus</button>' +
            '</article>';
        }).join("");
    }

    function showFeedback(selector, message, kind) {
        if (!window.jQuery) return;
        const element = window.jQuery(selector);
        if (!element.length) return;
        element.stop(true, true)
            .removeClass("feedback-success feedback-error")
            .addClass(kind === "success" ? "feedback-success" : "feedback-error")
            .text(message)
            .fadeIn(180);
    }

    function initializeSearch() {
        const form = document.getElementById("searchForm");
        if (!form) return;
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const input = document.getElementById("searchInput");
            const keyword = input ? input.value.trim() : "";
            const feedback = document.getElementById("searchValidation");
            if (!keyword) {
                if (feedback) feedback.textContent = "Masukkan kata kunci terlebih dahulu.";
                renderSearchResults([], "");
                return;
            }
            if (feedback) feedback.textContent = "";
            renderSearchResults(filterMovies(keyword), keyword);
        });
    }

    function initializeGenreFilters() {
        const buttons = document.querySelectorAll(".genre-filter");
        if (!buttons.length) return;

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                buttons.forEach(function (item) {
                    item.classList.remove("active", "btn-warning");
                    item.classList.add("btn-outline-warning");
                    item.setAttribute("aria-pressed", "false");
                });
                button.classList.add("active", "btn-warning");
                button.classList.remove("btn-outline-warning");
                button.setAttribute("aria-pressed", "true");
                renderRecommendations(button.dataset.genre || "All");
            });
        });

        renderRecommendations("All");
    }

    function initializeLogForm() {
        const form = document.getElementById("movieLogForm");
        if (!form || !window.jQuery) return;

        const params = new URLSearchParams(window.location.search);
        const titleFromQuery = params.get("title");
        const titleInput = document.getElementById("movieTitle");
        if (titleInput && titleFromQuery) titleInput.value = titleFromQuery;

        window.jQuery(form).on("submit", function (event) {
            event.preventDefault();
            const title = document.getElementById("movieTitle").value.trim();
            const director = document.getElementById("director").value.trim();
            const date = document.getElementById("watchedDate").value;
            const rating = document.getElementById("rating").value;
            const rateInput = form.querySelector('input[name="rate"]:checked');
            const review = document.getElementById("review").value.trim();
            const genres = Array.from(form.querySelectorAll('input[name="genre_input"]:checked'))
                .map(function (input) { return input.value; });

            if (!title) {
                showFeedback("#logFeedback", "Judul film wajib diisi sebelum log ditambahkan.", "error");
                document.getElementById("movieTitle").focus();
                return;
            }

            if (genres.length === 0) {
                showFeedback("#logFeedback", "Pilih minimal satu genre film.", "error");
                return;
            }

            const logs = getLogs();
            const entry = {
                id: Date.now(),
                title: title,
                director: director,
                genres: genres,
                date: date,
                contentRating: rating,
                rate: rateInput ? rateInput.value : "",
                review: review
            };

            logs.push(entry);
            saveLogs(logs);
            renderLogs();
            showFeedback("#logFeedback", 'Log "' + title + '" berhasil ditambahkan ke daftar contoh.', "success");
            form.reset();
        });

        window.jQuery(document).on("click", ".delete-log", function () {
            const id = Number(window.jQuery(this).attr("data-log-id"));
            const updatedLogs = getLogs().filter(function (entry) { return Number(entry.id) !== id; });
            saveLogs(updatedLogs);
            renderLogs();
            showFeedback("#logFeedback", "Satu log berhasil dihapus.", "success");
        });

        window.jQuery("#clearLogs").on("click", function () {
            if (getLogs().length === 0) {
                showFeedback("#logFeedback", "Daftar log sudah kosong.", "error");
                return;
            }
            saveLogs([]);
            renderLogs();
            showFeedback("#logFeedback", "Semua log contoh telah dihapus.", "success");
        });

        window.jQuery("#toggleLogHistory").on("click", function () {
            window.jQuery("#logList, #emptyLogs, #logCount").stop(true, true).slideToggle(220);
        });

        window.jQuery(form).on("reset", function () {
            window.setTimeout(function () {
                window.jQuery("#logFeedback").stop(true, true).fadeOut(150);
            }, 0);
        });

        renderLogs();
    }

    function initializeProfileForm() {
        const form = document.getElementById("profileForm");
        if (!form || !window.jQuery) return;

        const savedProfile = readStoredData(STORAGE_KEYS.profile, null);
        if (savedProfile) {
            ["nama", "username", "email", "bio"].forEach(function (field) {
                const input = document.getElementById(field);
                if (input && savedProfile[field] !== undefined) input.value = savedProfile[field];
            });
            (savedProfile.genres || []).forEach(function (genre) {
                const input = form.querySelector('input[name="genre-favorit"][value="' + genre + '"]');
                if (input) input.checked = true;
            });
        }

        window.jQuery(form).on("submit", function (event) {
            event.preventDefault();
            const profile = {
                nama: document.getElementById("nama").value.trim(),
                username: document.getElementById("username").value.trim(),
                email: document.getElementById("email").value.trim(),
                bio: document.getElementById("bio").value.trim(),
                genres: Array.from(form.querySelectorAll('input[name="genre-favorit"]:checked'))
                    .map(function (input) { return input.value; })
            };

            if (!profile.nama || !profile.username || !profile.email) {
                showFeedback("#profileFeedback", "Nama, username, dan email wajib diisi.", "error");
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
                showFeedback("#profileFeedback", "Format email belum valid.", "error");
                return;
            }

            writeStoredData(STORAGE_KEYS.profile, profile);
            showFeedback("#profileFeedback", "Profil berhasil disimpan secara lokal pada browser.", "success");
        });
    }

    // jQuery effects and event handling: demonstrate slideToggle(), click, and clear actions.
    function initializeJQueryInteractions() {
        if (!window.jQuery) return;
        const $ = window.jQuery;

        $("#toggleSearchHelp").on("click", function () {
            $("#searchHelp").stop(true, true).slideToggle(220);
        });

        $("#clearSearch").on("click", function () {
            $("#searchInput").val("");
            $("#searchValidation").text("");
            $("#searchResults").stop(true, true).fadeOut(120, function () {
                $(this).html('<p class="text-muted">Masukkan kata kunci untuk menemukan film dari katalog infoMovies.</p>').fadeIn(180);
            });
            $("#searchInput").trigger("focus");
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderDashboard();
        renderFilmDetail();
        initializeSearch();
        initializeGenreFilters();
        initializeLogForm();
        initializeProfileForm();
        initializeJQueryInteractions();
    });
}());
