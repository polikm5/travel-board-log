import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);
  const relativeFetch = ((url: string, opts?: any) => {
    try {
      if (url.startsWith("http"))
        url = new URL(url).pathname;
    }
    catch {}
    return useFetch(url, opts);
  }) as any;
  async function init() {
    const data = await authClient.useSession(relativeFetch);
    session.value = data;
  }
  const user = computed(() => {
    return session.value?.data?.user;
  });
  const loading = computed(() => session.value?.isPending);
  async function signIn() {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
    });
  }

  async function signOut() {
    await authClient.signOut();
    navigateTo("/");
  }

  return {
    loading,
    user,
    init,
    signIn,
    signOut,
  };
});
