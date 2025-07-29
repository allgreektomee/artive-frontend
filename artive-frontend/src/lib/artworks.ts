// lib/artworks.ts
import { api } from "./api";

export interface Artwork {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export const fetchArtworks = async (): Promise<Artwork[]> => {
  const res = await api.get("/api/artworks");
  return res.data;
};

export const createArtwork = async (formData: FormData) => {
  const res = await api.post("/api/artworks", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteArtwork = async (id: number) => {
  await api.delete(`/api/artworks/${id}`);
};
