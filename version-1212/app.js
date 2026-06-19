(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-menu-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        if (!slides.length || !dots.length) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, pos) {
                slide.classList.toggle("is-active", pos === index);
            });
            dots.forEach(function (dot, pos) {
                dot.classList.toggle("is-active", pos === index);
            });
        }
        function start() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        dots.forEach(function (dot, pos) {
            dot.addEventListener("click", function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                show(pos);
                start();
            });
        });
        show(0);
        start();
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupFilters() {
        var input = document.getElementById("siteSearch");
        var category = document.getElementById("categoryFilter");
        var sort = document.getElementById("sortFilter");
        var status = document.getElementById("filterStatus");
        var list = document.querySelector("[data-filter-list]");
        if (!list) {
            return;
        }
        var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
        function applySort() {
            var mode = sort ? sort.value : "default";
            var sorted = cards.slice();
            if (mode === "year-desc") {
                sorted.sort(function (a, b) {
                    return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                });
            } else if (mode === "year-asc") {
                sorted.sort(function (a, b) {
                    return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
                });
            } else if (mode === "title") {
                sorted.sort(function (a, b) {
                    return normalize(a.dataset.title).localeCompare(normalize(b.dataset.title), "zh-CN");
                });
            }
            sorted.forEach(function (card) {
                list.appendChild(card);
            });
        }
        function applyFilter() {
            var query = normalize(input ? input.value : "");
            var selected = category ? category.value : "all";
            var visible = 0;
            cards.forEach(function (card) {
                var matchedText = normalize(card.dataset.title);
                var matchedCategory = selected === "all" || card.dataset.category === selected;
                var matchedQuery = !query || matchedText.indexOf(query) !== -1;
                var show = matchedCategory && matchedQuery;
                card.hidden = !show;
                if (show) {
                    visible += 1;
                }
            });
            if (status) {
                status.textContent = visible ? "筛选结果已更新。" : "没有找到匹配内容。";
            }
        }
        if (input) {
            input.addEventListener("input", applyFilter);
        }
        if (category) {
            category.addEventListener("change", applyFilter);
        }
        if (sort) {
            sort.addEventListener("change", function () {
                applySort();
                applyFilter();
            });
        }
        applySort();
        applyFilter();
    }

    window.initMoviePlayer = function (source) {
        var video = document.getElementById("movieVideo");
        var button = document.getElementById("playButton");
        var frame = document.getElementById("videoFrame");
        if (!video || !button || !source) {
            return;
        }
        var loaded = false;
        function load() {
            if (loaded) {
                return;
            }
            loaded = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }
        function start() {
            load();
            if (frame) {
                frame.classList.add("is-playing");
            }
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    if (frame) {
                        frame.classList.remove("is-playing");
                    }
                });
            }
        }
        button.addEventListener("click", start);
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener("play", function () {
            if (frame) {
                frame.classList.add("is-playing");
            }
        });
        video.addEventListener("pause", function () {
            if (frame) {
                frame.classList.remove("is-playing");
            }
        });
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
