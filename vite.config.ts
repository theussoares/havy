import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'havy',
      filename: 'remoteEntry.js',
      exposes: {
        './PokemonDetailCard': './src/components/PokemonDetailCard.vue',
      },
      shared: ['vue']
    })
  ],
  build: {
    target: 'esnext'
  }
})
