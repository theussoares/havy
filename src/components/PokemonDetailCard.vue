<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{
  pokemonId: number
}>()

defineEmits<{
  close: []
}>()

const TYPE_COLORS: Record<string, string> = {
  fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
  psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
  fairy: '#EE99AC', fighting: '#C03028', flying: '#A890F0', ghost: '#705898',
  ground: '#E0C068', bug: '#A8B820', rock: '#B8A038', steel: '#B8B8D0',
  poison: '#A040A0', normal: '#A8A878',
}

const STAT_LABELS: Record<string, string> = {
  hp: 'HP', attack: 'ATK', defense: 'DEF',
  'special-attack': 'SP.ATK', 'special-defense': 'SP.DEF', speed: 'SPD',
}

interface PokemonData {
  id: number
  name: string
  image: string
  types: { name: string; color: string }[]
  stats: { name: string; label: string; value: number }[]
  height: number
  weight: number
  abilities: string[]
  moves: string[]
  description: string
  genus: string
}

const pokemon = ref<PokemonData | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const mainColor = computed(() => pokemon.value?.types[0]?.color ?? '#6366f1')
const totalStats = computed(() => pokemon.value?.stats.reduce((sum, s) => sum + s.value, 0) ?? 0)

onMounted(async () => {
  try {
    const [pokeRes, speciesRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${props.pokemonId}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${props.pokemonId}`),
    ])
    const data = await pokeRes.json()
    const species = await speciesRes.json()

    const flavorEntry = species.flavor_text_entries?.find(
      (e: any) => e.language.name === 'en'
    )
    const genusEntry = species.genera?.find(
      (g: any) => g.language.name === 'en'
    )

    pokemon.value = {
      id: data.id,
      name: data.name,
      image: data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default,
      types: data.types.map((t: any) => ({
        name: t.type.name,
        color: TYPE_COLORS[t.type.name] ?? '#A8A878',
      })),
      stats: data.stats.map((s: any) => ({
        name: s.stat.name,
        label: STAT_LABELS[s.stat.name] ?? s.stat.name,
        value: s.base_stat,
      })),
      height: data.height / 10,
      weight: data.weight / 10,
      abilities: data.abilities.map((a: any) => a.ability.name.replace('-', ' ')),
      moves: data.moves.slice(0, 8).map((m: any) => m.move.name.replace('-', ' ')),
      description: flavorEntry?.flavor_text?.replace(/[\n\f]/g, ' ') ?? '',
      genus: genusEntry?.genus ?? '',
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click.self="$emit('close')">
      <!-- Loading State -->
      <div v-if="loading" class="detail-loading">
        <div class="pokeball-spinner">
          <div class="pokeball-spinner__top" />
          <div class="pokeball-spinner__center" />
          <div class="pokeball-spinner__bottom" />
        </div>
        <span class="detail-loading__text">Loading Pokémon data...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="detail-error">
        <span>⚠️ {{ error }}</span>
        <button @click="$emit('close')">Close</button>
      </div>

      <!-- Detail Card -->
      <div v-else-if="pokemon" class="detail" :style="{ '--color': mainColor }">
        <!-- Background Effects -->
        <div class="detail__bg-orb detail__bg-orb--1" />
        <div class="detail__bg-orb detail__bg-orb--2" />
        <div class="detail__bg-pattern" />

        <!-- Close -->
        <button class="detail__close" @click="$emit('close')" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <!-- Hero Section -->
        <div class="detail__hero">
          <div class="detail__image-ring">
            <img :src="pokemon.image" :alt="pokemon.name" class="detail__image" />
          </div>
          <div class="detail__identity">
            <span class="detail__id">#{{ String(pokemon.id).padStart(3, '0') }}</span>
            <h2 class="detail__name">{{ pokemon.name }}</h2>
            <span class="detail__genus">{{ pokemon.genus }}</span>
            <div class="detail__types">
              <span
                v-for="type in pokemon.types"
                :key="type.name"
                class="detail__type-pill"
                :style="{ background: type.color }"
              >
                {{ type.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="detail__description">{{ pokemon.description }}</p>

        <!-- Bio Grid -->
        <div class="detail__bio-grid">
          <div class="detail__bio-item">
            <span class="detail__bio-icon">📏</span>
            <span class="detail__bio-value">{{ pokemon.height }}m</span>
            <span class="detail__bio-label">Height</span>
          </div>
          <div class="detail__bio-item">
            <span class="detail__bio-icon">⚖️</span>
            <span class="detail__bio-value">{{ pokemon.weight }}kg</span>
            <span class="detail__bio-label">Weight</span>
          </div>
          <div class="detail__bio-item">
            <span class="detail__bio-icon">🏆</span>
            <span class="detail__bio-value">{{ totalStats }}</span>
            <span class="detail__bio-label">Total Stats</span>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="detail__section">
          <h3 class="detail__section-title">
            <span class="detail__section-icon">📊</span> Base Stats
          </h3>
          <div class="detail__stats">
            <div v-for="(stat, i) in pokemon.stats" :key="stat.name" class="detail__stat-row">
              <span class="detail__stat-label">{{ stat.label }}</span>
              <div class="detail__stat-track">
                <div
                  class="detail__stat-fill"
                  :style="{
                    width: `${Math.min(stat.value / 255 * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${mainColor}, ${mainColor}88)`,
                    animationDelay: `${i * 0.1}s`
                  }"
                />
              </div>
              <span class="detail__stat-value" :class="{ 'detail__stat-value--high': stat.value >= 100 }">
                {{ stat.value }}
              </span>
            </div>
          </div>
        </div>

        <!-- Abilities Section -->
        <div class="detail__section">
          <h3 class="detail__section-title">
            <span class="detail__section-icon">✨</span> Abilities
          </h3>
          <div class="detail__abilities">
            <span
              v-for="ability in pokemon.abilities"
              :key="ability"
              class="detail__ability-chip"
            >
              {{ ability }}
            </span>
          </div>
        </div>

        <!-- Moves Section -->
        <div class="detail__section">
          <h3 class="detail__section-title">
            <span class="detail__section-icon">⚔️</span> Moves
          </h3>
          <div class="detail__moves">
            <span
              v-for="move in pokemon.moves"
              :key="move"
              class="detail__move-chip"
            >
              {{ move }}
            </span>
          </div>
        </div>

        <!-- Remote Badge -->
        <div class="detail__remote-badge">
          ⚡ This component was loaded from <strong>port 5002</strong> via Module Federation
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ═══ Overlay ═══ */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(12px);
  animation: overlayIn 0.25s ease;
  padding: 1rem;
}

@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ═══ Loading ═══ */
.detail-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.pokeball-spinner {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  animation: pokeballSpin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.3);
}

.pokeball-spinner__top {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 50%;
  background: #ef4444;
}

.pokeball-spinner__bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 50%;
  background: #f8fafc;
}

.pokeball-spinner__center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #f8fafc;
  border: 4px solid #1e293b;
  z-index: 2;
  box-shadow: 0 0 0 3px #f8fafc;
}

@keyframes pokeballSpin {
  0% { transform: rotate(0); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
}

.detail-loading__text {
  color: #94a3b8;
  font-size: 0.9rem;
}

/* ═══ Error ═══ */
.detail-error {
  color: #fca5a5;
  text-align: center;
}

/* ═══ Detail Card ═══ */
.detail {
  position: relative;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.75rem;
  padding: 0;
  animation: detailSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}

@keyframes detailSlideUp {
  from { opacity: 0; transform: translateY(40px) scale(0.92); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ═══ Background Effects ═══ */
.detail__bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  opacity: 0.15;
}

.detail__bg-orb--1 {
  top: -60px;
  right: -40px;
  width: 250px;
  height: 250px;
  background: var(--color);
}

.detail__bg-orb--2 {
  bottom: 20%;
  left: -60px;
  width: 200px;
  height: 200px;
  background: var(--color);
  opacity: 0.08;
}

.detail__bg-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  opacity: 0.03;
  background-image: radial-gradient(circle, #fff 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
}

/* ═══ Close Button ═══ */
.detail__close {
  position: sticky;
  top: 1rem;
  float: right;
  margin: 1rem 1rem 0 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.detail__close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  transform: rotate(90deg);
}

/* ═══ Hero ═══ */
.detail__hero {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 2rem 1.5rem;
  position: relative;
}

.detail__image-ring {
  position: relative;
  flex-shrink: 0;
}

.detail__image-ring::before {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--color), transparent, var(--color));
  opacity: 0.3;
  animation: ringRotate 6s linear infinite;
}

@keyframes ringRotate {
  to { transform: rotate(360deg); }
}

.detail__image {
  width: 140px;
  height: 140px;
  object-fit: contain;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 8px 24px color-mix(in srgb, var(--color) 40%, transparent));
  animation: heroFloat 3s ease-in-out infinite;
}

@keyframes heroFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.detail__identity {
  min-width: 0;
}

.detail__id {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--color);
  font-family: 'JetBrains Mono', monospace;
  opacity: 0.8;
}

.detail__name {
  font-size: 1.8rem;
  font-weight: 800;
  color: #f1f5f9;
  text-transform: capitalize;
  margin: 0.15rem 0;
  line-height: 1.1;
}

.detail__genus {
  font-size: 0.78rem;
  color: #64748b;
  font-style: italic;
  display: block;
  margin-bottom: 0.6rem;
}

.detail__types {
  display: flex;
  gap: 0.4rem;
}

.detail__type-pill {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

/* ═══ Description ═══ */
.detail__description {
  padding: 0 2rem 1.25rem;
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.65;
}

/* ═══ Bio Grid ═══ */
.detail__bio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding: 0 2rem 1.5rem;
}

.detail__bio-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.85rem 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
  transition: all 0.2s ease;
}

.detail__bio-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}

.detail__bio-icon { font-size: 1.2rem; }

.detail__bio-value {
  font-size: 1.05rem;
  font-weight: 800;
  color: #f1f5f9;
}

.detail__bio-label {
  font-size: 0.6rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ═══ Section ═══ */
.detail__section {
  padding: 0 2rem 1.5rem;
}

.detail__section-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.detail__section-icon { font-size: 0.9rem; }

/* ═══ Stats ═══ */
.detail__stats {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.detail__stat-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.detail__stat-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #475569;
  width: 3rem;
  text-align: right;
  flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace;
}

.detail__stat-track {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
}

.detail__stat-fill {
  height: 100%;
  border-radius: 4px;
  animation: statGrow 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-shadow: 0 0 12px color-mix(in srgb, var(--color) 30%, transparent);
}

@keyframes statGrow {
  from { width: 0 !important; }
}

.detail__stat-value {
  font-size: 0.78rem;
  font-weight: 800;
  color: #94a3b8;
  width: 2rem;
  text-align: left;
  font-family: 'JetBrains Mono', monospace;
}

.detail__stat-value--high {
  color: var(--color);
}

/* ═══ Abilities ═══ */
.detail__abilities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detail__ability-chip {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: capitalize;
  padding: 0.45rem 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  transition: all 0.2s ease;
}

.detail__ability-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color);
  color: #f1f5f9;
}

/* ═══ Moves ═══ */
.detail__moves {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.detail__move-chip {
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: capitalize;
  padding: 0.3rem 0.7rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  color: #64748b;
  transition: all 0.2s ease;
}

.detail__move-chip:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #94a3b8;
}

/* ═══ Remote Badge ═══ */
.detail__remote-badge {
  margin: 0.5rem 2rem 2rem;
  padding: 0.75rem 1rem;
  font-size: 0.72rem;
  color: #64748b;
  text-align: center;
  background: rgba(99, 102, 241, 0.05);
  border: 1px dashed rgba(99, 102, 241, 0.2);
  border-radius: 0.75rem;
}

.detail__remote-badge strong {
  color: #a5b4fc;
}
</style>
