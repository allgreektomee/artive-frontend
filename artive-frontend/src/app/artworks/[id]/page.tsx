// app/artworks/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Share2,
  Edit2,
  Trash2,
  Calendar,
  Ruler,
  Palette,
  MapPin,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Clock,
  Image as ImageIcon,
  Video,
  FileText,
  ExternalLink,
  User,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Artist {
  id: number;
  username: string;
  name: string;
  slug: string;
  profile_image?: string;
  bio?: string;
}

interface Artwork {
  id: number;
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  medium?: string;
  size?: string;
  year?: number;
  location?: string;
  price?: number;
  currency?: string;
  is_for_sale: boolean;
  status: "work_in_progress" | "completed" | "archived";
  thumbnail_url?: string;
  work_in_progress_url?: string;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  artist: Artist;
  images: ArtworkImage[];
  histories: ArtworkHistory[];
  tags?: string[];
}

interface ArtworkImage {
  id: number;
  image_url: string;
  order: number;
  caption?: string;
}

interface ArtworkHistory {
  id: number;
  title: string;
  description?: string;
  media_url?: string;
  media_type: "image" | "video" | "document";
  recorded_at: string;
  created_at: string;
}

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const artworkId = params?.id as string;

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Image gallery states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // History modal states
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [newHistory, setNewHistory] = useState({
    title: "",
    description: "",
    media_url: "",
    media_type: "image" as "image" | "video" | "document",
    recorded_at: new Date().toISOString().split("T")[0],
  });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (artworkId) {
      fetchArtwork();
      checkOwnership();
    }
  }, [artworkId]);

  const fetchArtwork = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers: HeadersInit = { Accept: "application/json" };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${backendUrl}/api/artworks/${artworkId}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch artwork");
      }

      const data = await response.json();
      setArtwork(data);
    } catch (err) {
      console.error("Error fetching artwork:", err);
      setError("Failed to load artwork");
    } finally {
      setLoading(false);
    }
  };

  const checkOwnership = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        if (artwork) {
          setIsOwner(userData.id === artwork.artist?.id);
        }
      }
    } catch (error) {
      console.error("Failed to check ownership:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${backendUrl}/api/artworks/${artworkId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push(`/${artwork?.artist?.slug || ""}`);
      }
    } catch (error) {
      console.error("Failed to delete artwork:", error);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: artwork?.title,
          text: artwork?.description,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleAddHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/artworks/${artworkId}/history`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newHistory),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (artwork) {
          setArtwork({
            ...artwork,
            histories: [...artwork.histories, data],
          });
        }
        setShowAddHistory(false);
        setNewHistory({
          title: "",
          description: "",
          media_url: "",
          media_type: "image",
          recorded_at: new Date().toISOString().split("T")[0],
        });
      }
    } catch (error) {
      console.error("Failed to add history:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      work_in_progress: {
        label: "In Progress",
        color: "bg-yellow-100 text-yellow-800",
      },
      completed: { label: "Completed", color: "bg-green-100 text-green-800" },
      archived: { label: "Archived", color: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const allImages = artwork
    ? [
        ...(artwork.thumbnail_url
          ? [{ id: 0, image_url: artwork.thumbnail_url, order: 0 }]
          : []),
        ...(artwork.images || []),
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error || "Artwork not found"}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-4">
              {isOwner && (
                <>
                  <Link
                    href={`/artworks/${artworkId}/edit`}
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    <Edit2 className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {allImages.length > 0 && (
              <>
                <div
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setShowFullscreen(true)}
                >
                  <Image
                    src={allImages[currentImageIndex].image_url}
                    alt={artwork.title}
                    fill
                    className="object-contain"
                    priority
                  />
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) =>
                            prev === 0 ? allImages.length - 1 : prev - 1
                          );
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) =>
                            prev === allImages.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {allImages.map((img, index) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          index === currentImageIndex
                            ? "border-gray-900"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          src={img.image_url}
                          alt={`${artwork.title} ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Artwork Info */}
          <div className="space-y-6">
            {/* Title and Status */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {artwork.title}
                </h1>
                {getStatusBadge(artwork.status)}
              </div>
              {artwork.title_en && (
                <p className="text-lg text-gray-600">{artwork.title_en}</p>
              )}
            </div>

            {/* Artist Info */}
            <Link
              href={`/${artwork.artist?.slug || ""}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {artwork.artist?.profile_image ? (
                <Image
                  src={artwork.artist.profile_image}
                  alt={artwork.artist?.name || ""}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">
                  {artwork.artist?.name || "Unknown Artist"}
                </p>
                <p className="text-sm text-gray-600">
                  @{artwork.artist?.username || "unknown"}
                </p>
              </div>
            </Link>

            {/* Details */}
            <div className="space-y-3">
              {artwork.year && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span>{artwork.year}</span>
                </div>
              )}
              {artwork.medium && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Palette className="w-4 h-4" />
                  <span>{artwork.medium}</span>
                </div>
              )}
              {artwork.size && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Ruler className="w-4 h-4" />
                  <span>{artwork.size}</span>
                </div>
              )}
              {artwork.location && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4" />
                  <span>{artwork.location}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {artwork.description && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {artwork.description}
                </p>
                {artwork.description_en && (
                  <p className="text-gray-600 whitespace-pre-wrap mt-2">
                    {artwork.description_en}
                  </p>
                )}
              </div>
            )}

            {/* Price */}
            {artwork.is_for_sale && artwork.price && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 mb-1">For Sale</p>
                <p className="text-2xl font-bold text-green-800">
                  {artwork.currency} {artwork.price.toLocaleString()}
                </p>
              </div>
            )}

            {/* Tags */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="w-5 h-5" />
                <span>{artwork.view_count} views</span>
              </div>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(artwork.created_at), {
                  addSuffix: true,
                  locale: ko,
                })}
              </p>
            </div>

            {/* History Timeline */}
            {artwork.histories && artwork.histories.length > 0 && (
              <div className="pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Work History</h3>
                  {isOwner && (
                    <button
                      onClick={() => setShowHistoryModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      View All
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {artwork.histories.slice(0, 3).map((history) => (
                    <div key={history.id} className="flex gap-3">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 bg-gray-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {history?.title || ""}
                        </p>
                        <p className="text-sm text-gray-600">
                          {history?.recorded_at
                            ? format(
                                new Date(history.recorded_at),
                                "yyyy.MM.dd"
                              )
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full h-full flex items-center justify-center p-4">
            <Image
              src={allImages[currentImageIndex].image_url}
              alt={artwork.title}
              width={1920}
              height={1080}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {allImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? allImages.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === allImages.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && isOwner && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Work History</h2>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
              <button
                onClick={() => setShowAddHistory(true)}
                className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex items-center justify-center gap-2 text-gray-600"
              >
                <Plus className="w-5 h-5" />
                Add History
              </button>

              <div className="space-y-4">
                {artwork?.histories?.map((history) => (
                  <div key={history?.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {history?.title || ""}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {history?.recorded_at
                          ? format(new Date(history.recorded_at), "yyyy.MM.dd")
                          : ""}
                      </span>
                    </div>
                    {history?.description && (
                      <p className="text-gray-700 mb-3">
                        {history.description}
                      </p>
                    )}
                    {history?.media_url && (
                      <div className="mt-3">
                        {history.media_type === "image" ? (
                          <img
                            src={history.media_url}
                            alt={history?.title || ""}
                            className="w-full rounded-lg"
                          />
                        ) : history.media_type === "video" ? (
                          <video
                            src={history.media_url}
                            controls
                            className="w-full rounded-lg"
                          />
                        ) : (
                          <a
                            href={history.media_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                          >
                            <FileText className="w-4 h-4" />
                            View Document
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add History Modal */}
      {showAddHistory && isOwner && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Add History</h2>
              <button
                onClick={() => setShowAddHistory(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newHistory.title}
                  onChange={(e) =>
                    setNewHistory({ ...newHistory, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Started sketching"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newHistory.description}
                  onChange={(e) =>
                    setNewHistory({
                      ...newHistory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Add details about this milestone..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newHistory.recorded_at}
                  onChange={(e) =>
                    setNewHistory({
                      ...newHistory,
                      recorded_at: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media Type
                </label>
                <select
                  value={newHistory.media_type}
                  onChange={(e) =>
                    setNewHistory({
                      ...newHistory,
                      media_type: e.target.value as
                        | "image"
                        | "video"
                        | "document",
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media URL
                </label>
                <input
                  type="url"
                  value={newHistory.media_url}
                  onChange={(e) =>
                    setNewHistory({ ...newHistory, media_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddHistory(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddHistory}
                  disabled={!newHistory.title}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
