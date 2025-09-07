import * as secureStore from "expo-secure-store";

export async function saveToken(token) {
  try {
    await secureStore.setItemAsync("userToken", token);
  } catch (err) {
    console.error(err, "ERROR");
  }
}

export async function getToken() {
  try {
    const token = await secureStore.getItemAsync("userToken");
    if (token) {
      // console.log(token, "No token found");
      return token;
    }
    return null;
  } catch (err) {
    console.error(err, "ERROR");
    return null;
  }
}

export async function deleteToken() {
  try {
    await secureStore.deleteItemAsync("userToken");
  } catch {
    console.error("ERROR");
  }
}
