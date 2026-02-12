<script setup lang="ts">
import type { Pokemon } from '../types/pokemon'

defineProps<{
  pokemon: Pokemon
}>()

defineEmits<{
  select: [pokemon: Pokemon]
}>()
</script>

<template>
  <div
    class="pokemon-card"
    :style="{ '--type-color': pokemon.types[0]?.color ?? '#A8A878' }"
    @click="$emit('select', pokemon)"
  >
    <!-- Background Glow -->
    <div class="pokemon-card__glow" />

    <!-- ID Badge -->
    <span class="pokemon-card__id">#{{ String(pokemon.id).padStart(3, '0') }}</span>

    <!-- Image -->
    <div class="pokemon-card__image-container">
      <img
        :src="pokemon.image"
        :alt="pokemon.name"
        class="pokemon-card__image"
        loading="lazy"
      />
    </div>

    <!-- Info -->
    <h3 class="pokemon-card__name">{{ pokemon.name }}</h3>

    <!-- Types -->
    <div class="pokemon-card__types">
      <span
        v-for="type in pokemon.types"
        :key="type.name"
        class="pokemon-card__type"
        :style="{ background: type.color + '33', color: type.color, borderColor: type.color + '55' }"
      >
        {{ type.name }}
      </span>
    </div>

    <!-- Stat Preview -->
    <div class="pokemon-card__stats-preview">
      <div v-for="stat in pokemon.stats.slice(0, 3)" :key="stat.name" class="pokemon-card__stat-bar">
        <span class="pokemon-card__stat-label">{{ stat.name }}</span>
        <div class="pokemon-card__stat-track">
          <div
            class="pokemon-card__stat-fill"
            :style="{
              width: `${Math.min(stat.value / 255 * 100, 100)}%`,
              background: `linear-gradient(90deg, ${pokemon.types[0]?.color ?? '#6366f1'}, ${pokemon.types[0]?.color ?? '#6366f1'}88)`
            }"
          />
        </div>
        <span class="pokemon-card__stat-value">{{ stat.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1.25rem;
  padding: 1.5rem 1.25rem 1.25rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
}

.pokemon-card:hover {
  border-color: var(--type-color, #6366f1);
  transform: translateY(-6px);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.3),
    0 0 30px color-mix(in srgb, var(--type-color) 20%, transparent);
}

.pokemon-card__glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 50% 80%, var(--type-color, #6366f1) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.pokemon-card:hover .pokemon-card__glow {
  opacity: 0.08;
}

.pokemon-card__id {
  position: absolute;
  top: 0.75rem;
  right: 0.85rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.15);
  font-family: 'JetBrains Mono', monospace;
}

.pokemon-card__image-container {
  width: 100px;
  height: 100px;
  margin: 0 auto 0.75rem;
  position: relative;
  transition: transform 0.3s ease;
}

.pokemon-card:hover .pokemon-card__image-container {
  transform: scale(1.1) translateY(-4px);
}

.pokemon-card__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
  transition: filter 0.3s ease;
}

.pokemon-card:hover .pokemon-card__image {
  filter: drop-shadow(0 6px 20px color-mix(in srgb, var(--type-color) 40%, transparent));
}

.pokemon-card__name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #e2e8f0;
  text-transform: capitalize;
  margin: 0 0 0.5rem;
  letter-spacing: 0.02em;
}

.pokemon-card__types {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

.pokemon-card__type {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  border: 1px solid;
}

.pokemon-card__stats-preview {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.pokemon-card__stat-bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.pokemon-card__stat-label {
  font-size: 0.6rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  width: 2.8rem;
  text-align: right;
  flex-shrink: 0;
}

.pokemon-card__stat-track {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.pokemon-card__stat-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.8s ease;
}

.pokemon-card__stat-value {
  font-size: 0.6rem;
  font-weight: 600;
  color: #94a3b8;
  width: 1.5rem;
  text-align: left;
  flex-shrink: 0;
}
</style>
