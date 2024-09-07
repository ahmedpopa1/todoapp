
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImageAsync = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storage = getStorage();
  const fileRef = ref(storage, `images/${new Date().toISOString()}.jpg`);

  try {
    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
