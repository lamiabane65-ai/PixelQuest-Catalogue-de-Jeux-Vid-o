const API_URL = "https://debuggers-games-api.duckdns.org/api/games";
const grid = document.getElementById("gamesGrid");
const searchInput = document.getElementById("rechercher");
const platformFilters = document.querySelectorAll(".platform-filter");
const genreFilters = document.querySelectorAll(".genre-filter");
const paginationContainer = document.createElement("div"); // container pour pagination
paginationContainer.className = "flex justify-center gap-2 mt-6";
document.querySelector("section").appendChild(paginationContainer);

let allGames = [];
let filteredGames = [];
let currentPage = 1;
const gamesPerPage = 12;

// FETCH DES JEUX
async function fetchGames() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erreur de chargement des jeux");
    const data = await response.json();
    allGames = data.results;
    filteredGames = [...allGames];
    renderGames();
    renderPagination();
  } catch (error) {
    console.error(error);
    grid.innerHTML = `<p class="text-white text-center">Impossible de charger les jeux 😔</p>`;
  }
}

// AFFICHAGE DES JEUX
function renderGames() {
  grid.innerHTML = "";
  const start = (currentPage - 1) * gamesPerPage;
  const end = start + gamesPerPage;
  const gamesToShow = filteredGames.slice(start, end);

  if (gamesToShow.length === 0) {
    grid.innerHTML = `<p class="text-white text-center">Aucun jeu trouvé 😔</p>`;
    return;
  }

  gamesToShow.forEach(game => {
    const card = document.createElement("div");
    card.className = "bg-[#0D062F] text-white rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform";

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isFavorite = favorites.includes(game.id);

    const genreText = Array.isArray(game.genre) ? game.genre.join(", ") : game.genre || "Genre inconnu";
    const platformText = Array.isArray(game.platform) ? game.platform.join(", ") : game.platform || "Plateforme inconnue";

    card.innerHTML = `
      <img src="${game.background_image || 'assets/images/default-game.jpg'}" alt="${game.name}" class="w-full h-40 object-cover">
      <div class="p-3">
        <h3 class="text-lg font-bold mb-1 truncate">${game.name}</h3>
        <p class="text-sm text-gray-300">${genreText}</p>
        <p class="text-xs text-gray-400 mt-1">${platformText}</p>
        <div class="mt-2 flex justify-between items-center">
          <a href="detail.html?id=${game.id}" class="text-purple-400 font-bold text-sm">Voir détails</a>
          <button onclick="toggleFavorite(${game.id})" class="px-2 py-1 rounded ${isFavorite ? 'bg-red-500' : 'bg-gray-600'}">
            ❤️
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// PAGINATION
function renderPagination() {
  paginationContainer.innerHTML = "";
  const pageCount = Math.ceil(filteredGames.length / gamesPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-purple-700 text-white' : 'bg-white text-black'}`;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderGames();
      renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationContainer.appendChild(btn);
  }
}

// helper : retourne un tableau de noms (ex: ["PC","Xbox"]) quel que soit le format d'entrée
function extractNames(field) {
  if (!field && field !== 0) return []; // vide si undefined/null

  // cas : tableau
  if (Array.isArray(field)) {
    // tableau d'objets avec .name ou .platform.name
    return field.map(item => {
      if (!item && item !== 0) return null;
      if (typeof item === 'string') return item;
      if (typeof item === 'object') {
        // ex: { name: "Action" } ou { platform: { name: "PC" } }
        return item.name || (item.platform && item.platform.name) || (item.genre && item.genre.name) || null;
      }
      return null;
    }).filter(Boolean);
  }

  // cas : objet
  if (typeof field === 'object') {
    // ex: { name: "PC" } or { platform: { name: "PC" } }
    return [ field.name || (field.platform && field.platform.name) || (field.genre && field.genre.name) ].filter(Boolean);
  }

  // cas : string / number
  return [String(field)];
}

// --- FILTRAGE DYNAMIQUE (remplace ta fonction actuelle) ---
searchInput.addEventListener("input", applyFilters);
platformFilters.forEach(cb => cb.addEventListener("change", applyFilters));
genreFilters.forEach(cb => cb.addEventListener("change", applyFilters));

function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedPlatforms = Array.from(platformFilters).filter(cb => cb.checked).map(cb => cb.value);
  const selectedGenres = Array.from(genreFilters).filter(cb => cb.checked).map(cb => cb.value);

  // debug rapide (désactive si ça spamme)
  // console.log('selectedPlatforms', selectedPlatforms, 'selectedGenres', selectedGenres, 'search', searchTerm);

  filteredGames = allGames.filter(game => {
    // 1) recherche par nom
    const name = (game.name || '').toString().toLowerCase();
    const matchSearch = !searchTerm || name.includes(searchTerm);

    // 2) plateformes : on normalise en tableau de noms
    // essaye plusieurs clés possibles : game.platform, game.platforms, game.platforms[].platform.name, game.platform (string)
    const gamePlatforms = extractNames(game.platforms ?? game.platform ?? game.platforms_raw ?? []);
    const matchPlatform = selectedPlatforms.length === 0 || gamePlatforms.some(p => selectedPlatforms.includes(p));

    // 3) genres : normalise aussi
    const gameGenres = extractNames(game.genres ?? game.genre ?? []);
    const matchGenre = selectedGenres.length === 0 || gameGenres.some(g => selectedGenres.includes(g));

    return matchSearch && matchPlatform && matchGenre;
  });

  currentPage = 1;
  renderGames();
  renderPagination();
}


// FAVORIS
function toggleFavorite(gameId) {
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (favorites.includes(gameId)) {
    favorites = favorites.filter(id => id !== gameId);
  } else {
    favorites.push(gameId);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderGames();
}

// LANCEMENT
fetchGames();

