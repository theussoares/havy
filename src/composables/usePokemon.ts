import { ref } from 'vue'
import type { Pokemon, PokemonListItem } from '../types/pokemon'
import { TYPE_COLORS } from '../types/pokemon'

const POKEAPI_BASE = 'https://pokeapi.co/api/v2'

export function usePokemon() {
    const pokemons = ref<Pokemon[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const selectedPokemon = ref<Pokemon | null>(null)
    const searchQuery = ref('')
    const currentPage = ref(0)
    const hasMore = ref(true)
    const PAGE_SIZE = 24

    async function fetchPokemonDetail(nameOrId: string | number): Promise<Pokemon> {
        const res = await fetch(`${POKEAPI_BASE}/pokemon/${nameOrId}`)
        if (!res.ok) throw new Error(`Failed to fetch Pokémon: ${nameOrId}`)
        const data = await res.json()

        return {
            id: data.id,
            name: data.name,
            image: data.sprites.other?.['official-artwork']?.front_default
                ?? data.sprites.front_default,
            imageAnimated: data.sprites.other?.showdown?.front_default
                ?? data.sprites.front_default,
            types: data.types.map((t: any) => ({
                name: t.type.name,
                color: TYPE_COLORS[t.type.name] ?? '#A8A878',
            })),
            stats: data.stats.map((s: any) => ({
                name: s.stat.name.replace('special-', 'sp.'),
                value: s.base_stat,
            })),
            height: data.height / 10,
            weight: data.weight / 10,
            abilities: data.abilities.map((a: any) => a.ability.name),
        }
    }

    async function loadPage() {
        if (loading.value || !hasMore.value) return
        loading.value = true
        error.value = null

        try {
            const offset = currentPage.value * PAGE_SIZE
            const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`)
            const data = await res.json()

            if (!data.results?.length) {
                hasMore.value = false
                return
            }

            const details = await Promise.all(
                data.results.map((p: PokemonListItem) => fetchPokemonDetail(p.name))
            )

            pokemons.value = [...pokemons.value, ...details]
            currentPage.value++
            hasMore.value = data.next !== null
        } catch (err: any) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    function selectPokemon(p: Pokemon) {
        selectedPokemon.value = p
    }

    function clearSelection() {
        selectedPokemon.value = null
    }

    return {
        pokemons,
        loading,
        error,
        selectedPokemon,
        searchQuery,
        hasMore,
        loadPage,
        selectPokemon,
        clearSelection,
    }
}
