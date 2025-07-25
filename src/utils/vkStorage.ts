import bridge from '@vkontakte/vk-bridge';

export async function saveFavoritesToVK(favorites: string[]) {
  try {
    await bridge.send('VKWebAppStorageSet', {
      key: 'favorites',
      value: JSON.stringify(favorites),
    });
    return true;
  } catch (e) {
    console.error('VK Storage save error:', e);
    return false;
  }
}

export async function loadFavoritesFromVK(): Promise<string[] | null> {
  try {
    const res = await bridge.send('VKWebAppStorageGet', { keys: ['favorites'] });
    const value = res.keys?.[0]?.value;
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error('VK Storage load error:', e);
    return null;
  }
}