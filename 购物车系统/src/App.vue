<template>
  <router-view />
</template>

<style>
@import './assets/main.css';

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.btn-primary {
  @apply bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors;
}

.btn-secondary {
  @apply bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors;
}

.card {
  @apply bg-white rounded-lg shadow-md p-4;
}

.input {
  @apply border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent;
}
</style> 