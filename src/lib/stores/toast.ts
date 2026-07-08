import { writable } from 'svelte/store';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<ToastMessage[]>([]);
  let nextId = 1;

  function show(type: ToastMessage['type'], title: string, description?: string, duration = 4000) {
    const id = nextId++;
    update((msgs) => [...msgs, { id, type, title, description, duration }]);

    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }

    return id;
  }

  function dismiss(id: number) {
    update((msgs) => msgs.filter((m) => m.id !== id));
  }

  return {
    subscribe,
    show,
    dismiss,
    success: (title: string, description?: string) => show('success', title, description),
    error: (title: string, description?: string) => show('error', title, description),
    info: (title: string, description?: string) => show('info', title, description)
  };
}

export const toast = createToastStore();
