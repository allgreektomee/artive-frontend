"use client";

import Image from "next/image";
import { FaInstagram, FaBlog } from "react-icons/fa";

export default function MainPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10 bg-white min-h-screen text-gray-900">
      {/* 인터뷰 썸네일 */}
      <div className="aspect-video relative">
        <Image
          src="https://i.ytimg.com/vi/2Vv-BfVoq4g/maxresdefault.jpg"
          alt="Artist Interview Thumbnail"
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">▶</span>
          </div>
        </div>
      </div>

      {/* 작가 소개 */}
      <div>
        <h1 className="text-3xl font-bold"> JAE YOUNG PARK - Philetus</h1>
        <p className="text-gray-600">
          Contemporary abstract artist exploring color and form
        </p>
        <div className="mt-4 space-x-2">
          <button className="px-4 py-2 bg-gray-200 rounded">Artworks</button>
          <button className="px-4 py-2 bg-gray-200 rounded">About</button>
          <button className="px-4 py-2 bg-gray-200 rounded">
            Associations
          </button>
        </div>
      </div>

      {/* 작품 섹션 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Artworks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Image
            src="https://picsum.photos/id/235/300/200"
            alt="art1"
            width={200}
            height={200}
            className="rounded object-cover"
          />
          <Image
            src="https://picsum.photos/id/236/300/200"
            alt="art2"
            width={200}
            height={200}
            className="rounded object-cover"
          />
          <Image
            src="https://picsum.photos/id/237/300/200"
            alt="art3"
            width={200}
            height={200}
            className="rounded object-cover"
          />
          <Image
            src="https://picsum.photos/id/235/300/200"
            alt="art4"
            width={200}
            height={200}
            className="rounded object-cover"
          />
        </div>
      </div>

      {/* Follow 버튼 */}
      <div className="mt-4">
        <button className="px-4 py-2 bg-black text-white rounded">
          Follow
        </button>
      </div>

      {/* 협회 소개 */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Art Society</h2>
        <div className="flex items-center p-4 bg-gray-100 rounded-lg space-x-4">
          <div className="w-16 h-16 relative rounded-full overflow-hidden border">
            <Image
              src="/open-art-society-logo.png"
              alt="Open Art Society Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold">Art School The Forest</p>
            <p className="text-sm text-gray-600">
              An organization dedicated to promoting contemporary art and
              artists
            </p>
            <div className="flex space-x-3 mt-2">
              <a
                href="https://blog.naver.com/example"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaBlog className="text-gray-700 hover:text-black text-lg" />
              </a>
              <a
                href="https://instagram.com/example"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="text-gray-700 hover:text-black text-lg" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
