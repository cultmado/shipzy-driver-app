import { toastController, useIonRouter } from '@ionic/vue';

/** Compact input used on the profile settings pages (42px, rounded-lg). */
export const fieldInput =
  'h-[42px] w-full rounded-lg border border-line bg-surface px-3.5 text-[13px] text-ink outline-none placeholder:text-ink-subtle focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10';

/** White card wrapping a settings form. */
export const formCard = 'rounded-xl border border-line-soft bg-surface p-5 shadow-card';

export async function showToast(message: string, color: 'success' | 'danger' | 'dark' = 'success') {
  const toast = await toastController.create({ message, duration: 1800, position: 'top', color });
  await toast.present();
}

/** Shows a success toast, then returns to the profile tab. Call during setup. */
export function useSaveAndBack() {
  const ionRouter = useIonRouter();
  return async (message: string) => {
    await showToast(message);
    if (ionRouter.canGoBack()) ionRouter.back();
    else ionRouter.navigate('/tabs/profile', 'back', 'replace');
  };
}

/** Inset teal button in the settings pages' sticky footer. */
export const footerBtn = 'btn-ocean mx-auto mb-1 flex w-[calc(100%-48px)] rounded-lg py-2.5 text-[13px] font-medium';
