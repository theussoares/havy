<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePokemon } from '../composables/usePokemon'
import PokemonCard from './PokemonCard.vue'
import PokemonModal from './PokemonModal.vue'

const {
  pokemons,
  loading,
  error,
  selectedPokemon,
  searchQuery,
  hasMore,
  loadPage,
  selectPokemon,
  clearSelection,
} = usePokemon()

const filteredPokemons = computed(() => {
  if (!searchQuery.value) return pokemons.value
  const q = searchQuery.value.toLowerCase()
  return pokemons.value.filter(p =>
    p.name.includes(q) || String(p.id).includes(q)
  )
})

onMounted(() => {
  loadPage()
})
</script>

<template>
  <div class="pokedex">
    <!-- Header -->
    <div class="pokedex__header">
      <div class="pokedex__title-row">
        <div>
          <h2 class="pokedex__title">Pokédex</h2>
          <p class="pokedex__subtitle">{{ pokemons.length }} Pokémon loaded • Heavy Remote Component</p>
        </div>
        <span class="pokedex__badge">REMOTE</span>
      </div>

      <!-- Search -->
      <div class="pokedex__search-container">
        <span class="pokedex__search-icon">🔍</span>
        <input
          v-model="searchQuery"
          class="pokedex__search"
          placeholder="Search by name or ID..."
        />
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="pokedex__error">
      <span>⚠️</span> {{ error }}
    </div>

    <!-- Grid -->
    <div class="pokedex__grid">
      <PokemonCard
        v-for="pokemon in filteredPokemons"
        :key="pokemon.id"
        :pokemon="pokemon"
        class="pokedex__card-enter"
        @select="selectPokemon"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="pokedex__loading">
      <div class="pokedex__pokeball" />
      <span>Catching Pokémon...</span>
    </div>

    <!-- Load More -->
    <div v-if="!loading && hasMore" class="pokedex__load-more">
      <button class="pokedex__load-btn" @click="loadPage">
        Load More Pokémon
      </button>
    </div>

    <!-- Modal -->
    <PokemonModal
      v-if="selectedPokemon"
      :pokemon="selectedPokemon"
      @close="clearSelection"
    />
  </div>
</template>

<style scoped>
.pokedex {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', system-ui, sans-serif;
  color: #e2e8f0;
}

/* Header */
.pokedex__header {
  margin-bottom: 2rem;
}

.pokedex__title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.pokedex__title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #f1f5f9, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pokedex__subtitle {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0.25rem 0 0;
}

.pokedex__badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Search */
.pokedex__search-container {
  position: relative;
}

.pokedex__search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  pointer-events: none;
}

.pokedex__search {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.8rem;
  font-size: 0.9rem;
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  outline: none;
  font-family: inherit;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.pokedex__search:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.pokedex__search::placeholder {
  color: #475569;
}

/* Error */
.pokedex__error {
  padding: 1rem 1.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 0.75rem;
  color: #fca5a5;
  margin-bottom: 1.5rem;
}

/* Grid */
.pokedex__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.pokedex__card-enter {
  animation: cardEntrance 0.5s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}

.pokedex__card-enter:nth-child(1)  { animation-delay: 0.02s; }
.pokedex__card-enter:nth-child(2)  { animation-delay: 0.04s; }
.pokedex__card-enter:nth-child(3)  { animation-delay: 0.06s; }
.pokedex__card-enter:nth-child(4)  { animation-delay: 0.08s; }
.pokedex__card-enter:nth-child(5)  { animation-delay: 0.10s; }
.pokedex__card-enter:nth-child(6)  { animation-delay: 0.12s; }
.pokedex__card-enter:nth-child(7)  { animation-delay: 0.14s; }
.pokedex__card-enter:nth-child(8)  { animation-delay: 0.16s; }
.pokedex__card-enter:nth-child(9)  { animation-delay: 0.18s; }
.pokedex__card-enter:nth-child(10) { animation-delay: 0.20s; }
.pokedex__card-enter:nth-child(11) { animation-delay: 0.22s; }
.pokedex__card-enter:nth-child(12) { animation-delay: 0.24s; }

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Loading */
.pokedex__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: #64748b;
}

.pokedex__pokeball {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(180deg, #ef4444 0%, #ef4444 48%, #333 48%, #333 52%, #f1f5f9 52%, #f1f5f9 100%);
  position: relative;
  animation: spin 1s linear infinite;
}

.pokedex__pokeball::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 3px solid #333;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Load More */
.pokedex__load-more {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.pokedex__load-btn {
  padding: 0.75rem 2rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 0.75rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.pokedex__load-btn:hover {
  background: rgba(99, 102, 241, 0.25);
  border-color: rgba(99, 102, 241, 0.5);
  transform: translateY(-1px);
}
</style>
