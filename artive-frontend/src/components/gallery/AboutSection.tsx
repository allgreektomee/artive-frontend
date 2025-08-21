// components/gallery/AboutSection.tsx
import React from "react";

interface User {
  bio?: string;
}

interface AboutSectionProps {
  galleryUser: User | null;
}

const AboutSection: React.FC<AboutSectionProps> = ({ galleryUser }) => {
  return (
    <div className="py-12 sm:py-16 mt-16">
      {/* Artist Statement */}
      <div className="mb-12 sm:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">
          About the Artist
        </h2>
        <div className="prose prose-lg max-w-4xl">
          <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
            {galleryUser?.bio ||
              "I am a contemporary abstract artist based in Seoul, exploring the infinite possibilities of color, form, and emotion. My work delves into the intersection of traditional Korean aesthetics and modern artistic expression."}
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            Through my paintings, I seek to capture the ephemeral moments of
            beauty that surround us daily, transforming them into visual
            narratives that speak to the universal human experience.
          </p>
        </div>
      </div>

      {/* YouTube Video Section */}
      <div className="mb-12 sm:mb-16">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
          Studio Process
        </h3>
        <div className="w-full max-w-4xl">
          <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden bg-gray-100">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=example"
              title="Artist Studio Process"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Watch me create art in my Seoul studio
          </p>
        </div>
      </div>

      {/* Q&A Section */}
      <div className="mb-12 sm:mb-16">
        <h3 className="text-lg sm:text-xl font-semibold mb-6 sm:mb-8">
          Artist Interview
        </h3>
        <div className="space-y-6 sm:space-y-8">
          <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
            <h4 className="font-medium text-gray-900 mb-2">
              Q: 작가님의 예술적 영감은 무엇에서 오나요?
            </h4>
            <p className="text-gray-700 text-sm sm:text-base">
              서울의 역동적인 에너지와 조용한 성찰의 순간들이 결합되어 영감을
              얻습니다. 하루 종일 변화하는 빛이 만들어내는 다양한 분위기와
              감정들에 매료되어, 이를 제 작품에 담아내려고 노력하고 있어요.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4 sm:pl-6">
            <h4 className="font-medium text-gray-900 mb-2">
              Q: 작가님의 작업 스타일을 어떻게 설명하시겠어요?
            </h4>
            <p className="text-gray-700 text-sm sm:text-base">
              주로 아크릴과 혼합 매체를 사용하여 동서양의 예술적 전통을 융합한
              추상 작품을 만들고 있습니다. 대담한 색채 선택과 캔버스를 가로질러
              흐르는 듯한 역동적인 형태가 제 스타일의 특징이라고 할 수 있어요.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4 sm:pl-6">
            <h4 className="font-medium text-gray-900 mb-2">
              Q: 작품을 통해 전달하고자 하는 메시지가 있다면?
            </h4>
            <p className="text-gray-700 text-sm sm:text-base">
              관람자들이 제 작품과 각자만의 감정적 연결고리를 찾았으면 좋겠어요.
              예술은 작가의 내면 세계와 관찰자의 개인적 경험 사이를 잇는 다리
              역할을 해야 한다고 생각합니다. 각각의 그림은 탐험하고, 느끼고,
              발견하라는 초대장이에요.
            </p>
          </div>

          <div className="border-l-4 border-red-500 pl-4 sm:pl-6">
            <h4 className="font-medium text-gray-900 mb-2">
              Q: 작가님의 작품은 어디서 만날 수 있나요?
            </h4>
            <p className="text-gray-700 text-sm sm:text-base">
              서울 전역의 갤러리에서 정기적으로 전시하고 있으며, 여러 개인
              컬렉션의 일부이기도 합니다. 그룹 전시와 아트페어에도 참여하고
              있어요. 다가오는 전시 소식은 소셜미디어를 통해 확인하실 수
              있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Exhibitions & Recognition */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-6 sm:mb-8">
          Exhibitions & Recognition
        </h3>
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <h4 className="font-medium mb-4 sm:mb-6">Recent Exhibitions</h4>
            <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
              <li>• "Colors of Seoul" - Gallery Modern, 2024</li>
              <li>• "Abstract Emotions" - Art Space K, 2023</li>
              <li>• Group Exhibition - Seoul Arts Center, 2023</li>
              <li>• "New Visions" - Contemporary Gallery, 2022</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4 sm:mb-6">Awards & Recognition</h4>
            <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
              <li>• Emerging Artist Award - Seoul Art Fair, 2024</li>
              <li>• Featured Artist - Korean Art Magazine, 2023</li>
              <li>• Excellence Award - National Art Competition, 2022</li>
              <li>• Rising Star - Contemporary Art Review, 2021</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
