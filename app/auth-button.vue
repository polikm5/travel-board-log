<script setup lang="ts">
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient();

async function signIn() {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: "/dashboard",
  });
}
</script>

<template>
  <button class="btn btn-primary" @click="signIn">
    Sign in
    <Icon name="tabler:brand-github" size="1.5em" />
  </button>
</template>
