import * as SecureStore from "expo-secure-store";

export async function saveSecureItem(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Failed to save secure item: ${key}`, error);
  }
}

export async function getSecureItem(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Failed to get secure item: ${key}`, error);
    return null;
  }
}

export async function removeSecureItem(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Failed to remove secure item: ${key}`, error);
  }
}

export async function saveSecureJson<T>(key: string, value: T) {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save secure JSON: ${key}`, error);
  }
}

export async function getSecureJson<T>(key: string): Promise<T | null> {
  try {
    const value = await SecureStore.getItemAsync(key);

    if (!value) return null;

    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Failed to get secure JSON: ${key}`, error);
    return null;
  }
}

export async function appendToSecureArray<T>(key: string, item: T) {
  try {
    const currentArray = await getSecureJson<T[]>(key);
    const updatedArray = [...(currentArray ?? []), item];

    await saveSecureJson(key, updatedArray);
  } catch (error) {
    console.error(`Failed to append to secure array: ${key}`, error);
  }
}

export async function appendManyToSecureArray<T>(
  key: string,
  items: T[]
) {
  try {
    const currentArray = await getSecureJson<T[]>(key);
    const updatedArray = [...(currentArray ?? []), ...items];

    await saveSecureJson(key, updatedArray);
  } catch (error) {
    console.error(`Failed to append many to secure array: ${key}`, error);
  }
}