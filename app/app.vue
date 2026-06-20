<script setup lang="ts">
const { data: health } = await useFetch('/api/health')
</script>

<template>
  <UApp>
    <UContainer class="py-16">
      <h1 class="text-3xl font-bold">BurnerMap <span class="text-(--ui-text-muted)">rebuild</span></h1>
      <p class="mt-2 text-(--ui-text-muted)">Find your people on the playa.</p>
      <UCard class="mt-8 max-w-md">
        <template #header>System</template>
        <ul class="space-y-1 text-sm">
          <li>DB: <UBadge :color="health?.ok ? 'success' : 'error'">{{ health?.ok ? 'connected' : 'down' }}</UBadge></li>
          <li>PostGIS: {{ health?.postgis ?? '—' }}</li>
          <li>Camps in DB: {{ health?.camps ?? '—' }}</li>
        </ul>
      </UCard>
    </UContainer>
  </UApp>
</template>
