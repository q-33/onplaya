<script setup lang="ts">
const form = reactive({ name: '', email: '', message: '' })
const busy = ref(false)
const sent = ref(false)
const error = ref('')

async function submit() {
  busy.value = true
  error.value = ''
  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...form } })
    sent.value = true
  }
  catch (e: any) {
    error.value = e?.data?.statusMessage ?? 'Could not send your message.'
  }
  finally {
    busy.value = false
  }
}

useHead({ title: 'Contact — BurnerMap' })
</script>

<template>
  <UContainer class="max-w-xl py-12 sm:py-16">
    <h1 class="font-display text-3xl font-bold uppercase tracking-tight">Contact</h1>
    <p class="mt-2 text-(--ui-text-muted)">
      Questions, corrections, or want your camp/art fixed up? Send a note below — or email
      <a href="mailto:digit@burnermap.org" class="text-primary hover:underline">digit@burnermap.org</a> directly.
    </p>
    <UCard class="mt-6">
      <div v-if="sent" class="space-y-3 py-2 text-center">
        <UIcon name="i-lucide-send" class="mx-auto size-10 text-primary" />
        <p class="text-sm">Thanks — your message is on its way. I will reply to <b>{{ form.email }}</b>.</p>
      </div>
      <form v-else class="space-y-3" @submit.prevent="submit">
        <div class="grid gap-3 sm:grid-cols-2">
          <UInput v-model="form.name" placeholder="Your name" required class="w-full" />
          <UInput v-model="form.email" type="email" placeholder="Your email" required class="w-full" />
        </div>
        <UTextarea v-model="form.message" :rows="6" placeholder="Your message" required class="w-full" />
        <p v-if="error" class="text-sm text-error">{{ error }}</p>
        <UButton type="submit" :loading="busy" icon="i-lucide-send">Send message</UButton>
      </form>
    </UCard>
  </UContainer>
</template>
