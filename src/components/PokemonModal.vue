<script setup lang="ts">
import type { Pokemon } from '../types/pokemon'

const props = defineProps<{
  pokemon: Pokemon
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div
        class="modal"
        :style="{ '--type-color': pokemon.types[0]?.color ?? '#6366f1' }"
      >
        <!-- Close Button -->
        <button class="modal__close" @click="$emit('close')" aria-label="Close">✕</button>

        <!-- Header -->
        <div class="modal__header">
          <div class="modal__header-glow" />
          <img
            :src="pokemon.image"
            :alt="pokemon.name"
            class="modal__image"
          />
          <div class="modal__title">
            <span class="modal__id">#{{ String(pokemon.id).padStart(3, '0') }}</span>
            <h2 class="modal__name">{{ pokemon.name }}</h2>
            <div class="modal__types">
              <span
                v-for="type in pokemon.types"
                :key="type.name"
                class="modal__type"
                :style="{ background: type.color, color: '#fff' }"
              >
                {{ type.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Body Info -->
        <div class="modal__body">
          <div class="modal__info-grid">
            <div class="modal__info-item">
              <span class="modal__info-label">Height</span>
              <span class="modal__info-value">{{ pokemon.height }}m</span>
            </div>
            <div class="modal__info-item">
              <span class="modal__info-label">Weight</span>
              <span class="modal__info-value">{{ pokemon.weight }}kg</span>
            </div>
            <div class="modal__info-item">
              <span class="modal__info-label">Abilities</span>
              <span class="modal__info-value modal__info-value--abilities">
                {{ pokemon.abilities.join(', ') }}
              </span>
            </div>
          </div>

          <!-- Stats -->
          <h3 class="modal__section-title">Base Stats</h3>
          <div class="modal__stats">
            <div v-for="stat in pokemon.stats" :key="stat.name" class="modal__stat-row">
              <span class="modal__stat-name">{{ stat.name }}</span>
              <div class="modal__stat-bar-track">
                <div
                  class="modal__stat-bar-fill"
                  :style="{
                    width: `${Math.min(stat.value / 255 * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${pokemon.types[0]?.color ?? '#6366f1'}, ${pokemon.types[0]?.color ?? '#6366f1'}aa)`
                  }"
                />
              </div>
              <span class="modal__stat-value">{{ stat.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  position: relative;
  width: 90%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  background: #1e1e2e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #94a3b8;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal__close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.modal__header {
  position: relative;
  padding: 2rem 2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  overflow: hidden;
}

.modal__header-glow {
  position: absolute;
  top: -80px;
  left: -80px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: var(--type-color, #6366f1);
  opacity: 0.1;
  filter: blur(60px);
  pointer-events: none;
}

.modal__image {
  width: 140px;
  height: 140px;
  object-fit: contain;
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4));
  animation: float 3s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.modal__title {
  position: relative;
  z-index: 1;
}

.modal__id {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  font-family: 'JetBrains Mono', monospace;
}

.modal__name {
  font-size: 1.6rem;
  font-weight: 800;
  color: #f1f5f9;
  text-transform: capitalize;
  margin: 0.2rem 0 0.6rem;
}

.modal__types {
  display: flex;
  gap: 0.4rem;
}

.modal__type {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.modal__body {
  padding: 0 2rem 2rem;
}

.modal__info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.modal__info-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  padding: 0.75rem;
}

.modal__info-item:last-child {
  grid-column: 1 / -1;
}

.modal__info-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.25rem;
}

.modal__info-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e2e8f0;
}

.modal__info-value--abilities {
  font-size: 0.85rem;
  text-transform: capitalize;
}

.modal__section-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 0.75rem;
}

.modal__stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal__stat-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.modal__stat-name {
  font-size: 0.7rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  width: 3.2rem;
  text-align: right;
  flex-shrink: 0;
}

.modal__stat-bar-track {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.modal__stat-bar-fill {
  height: 100%;
  border-radius: 3px;
  animation: growBar 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes growBar {
  from { width: 0 !important; }
}

.modal__stat-value {
  font-size: 0.75rem;
  font-weight: 700;
  color: #cbd5e1;
  width: 2rem;
  text-align: left;
  font-family: 'JetBrains Mono', monospace;
}
</style>
