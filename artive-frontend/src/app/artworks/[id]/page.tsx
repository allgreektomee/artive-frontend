"use client";

import Image from "next/image";
import Link from "next/link";

export default function ArtworkDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  const getArtworkById = (id: string) => ({
    id,
    title: `Untitled #${id}`,
    subtitle: "Acrylic on canvas 35x23 3호",
    description:
      "This is a sample description of the artwork. It explores abstract color forms and emotional depth using layered acrylics.",
    imageUrl: `https://picsum.photos/seed/${id}/800/600`,
  });

  const artwork = getArtworkById(id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">{artwork.title}</h1>
      <Image
        src={artwork.imageUrl}
        alt={artwork.title}
        width={800}
        height={600}
        className="rounded shadow"
      />
      <p className="text-gray-500 mt-4">{artwork.subtitle}</p>
      <p className="mt-2 text-gray-700">{artwork.description}</p>

      <div className="mt-6 flex gap-4">
        <Link href="/">
          <button className="px-4 py-2 bg-gray-200 rounded">Home</button>
        </Link>
        <Link href="/artworks">
          <button className="px-4 py-2 bg-gray-200 rounded">
            All Artworks
          </button>
        </Link>
      </div>
    </div>
  );
}
