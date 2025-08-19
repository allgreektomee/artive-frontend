"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type UserRole = "artist" | "academy" | "gallery";

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
}

export default function SignupPage() {
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    slug: "",
    bio: "",
    role: "artist" as UserRole, // role 추가
  });

  const [errors, setErrors] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "available" | "duplicate"
  >("idle");
  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "available" | "duplicate"
  >("idle");

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // role 옵션 정의
  const roleOptions: RoleOption[] = [
    {
      value: "artist",
      label: "개인 아티스트",
      description: "개인 작가로 활동하며 작품을 전시하고 판매합니다",
    },
    {
      value: "academy",
      label: "미술학원·화실",
      description: "학원이나 화실을 운영하며 수강생 작품을 관리합니다",
    },
    {
      value: "gallery",
      label: "갤러리",
      description: "갤러리를 운영하며 다양한 작가의 작품을 전시합니다",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setEmailStatus("idle");
    }
    if (name === "slug") {
      setSlugStatus("idle");
    }
    // 이름 변경시 자동으로 slug 생성 (선택사항)
    if (name === "name" && !form.slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");
      setForm((prev) => ({ ...prev, slug: autoSlug }));
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setForm((prev) => ({ ...prev, role }));
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const slugRegex = /^[a-z0-9]+$/;

    if (!emailRegex.test(form.email)) return "유효한 이메일 형식을 입력하세요.";
    if (form.password.length < 8)
      return "비밀번호는 최소 8자 이상이어야 합니다.";
    if (form.password !== form.confirmPassword)
      return "비밀번호가 일치하지 않습니다.";
    if (form.name.length < 2) return "이름은 최소 2자 이상이어야 합니다.";
    if (!form.slug) return "갤러리 주소(슬러그)를 입력하세요.";
    if (!slugRegex.test(form.slug))
      return "갤러리 주소는 영문 소문자와 숫자만 사용 가능합니다.";
    if (form.slug.length < 3)
      return "갤러리 주소는 최소 3자 이상이어야 합니다.";
    if (emailStatus !== "available") return "이메일 중복확인을 해주세요.";
    if (slugStatus !== "available") return "갤러리 주소 중복확인을 해주세요.";
    return null;
  };

  const checkEmailDuplication = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("유효한 이메일 형식이 아닙니다.");
      return;
    }

    setEmailStatus("checking");

    try {
      // FastAPI 엔드포인트는 아직 없으므로 임시로 available로 설정
      // TODO: FastAPI에서 이메일 중복 확인 API 구현 필요
      setEmailStatus("available");

      // 실제 구현시:
      // const res = await fetch(`${backEndUrl}/auth/check-email?email=${encodeURIComponent(form.email.trim())}`, {
      //   method: "GET",
      //   headers: { "Accept": "application/json" }
      // });
      // const data = await res.json();
      // setEmailStatus(data.available ? "available" : "duplicate");
    } catch {
      alert("중복 확인 중 오류가 발생했습니다.");
      setEmailStatus("idle");
    }
  };

  const checkSlugAvailability = async (slugValue: string) => {
    const slugRegex = /^[a-z0-9]+$/;
    if (!slugValue || slugValue.length < 3) {
      alert("갤러리 주소는 3자 이상이어야 합니다.");
      return;
    }
    if (!slugRegex.test(slugValue)) {
      alert("영문 소문자와 숫자만 사용 가능합니다.");
      return;
    }

    setSlugStatus("checking");

    try {
      const response = await fetch(`${backEndUrl}/api/auth/check-slug`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ slug: slugValue }),
      });

      const data = await response.json();
      console.log("받은 데이터:", data); // 디버깅

      // ✅ 상태 업데이트 수정
      if (data.available === true) {
        setSlugStatus("available");
        // alert 제거 (UI로 충분함)
      } else {
        setSlugStatus("duplicate");
      }
    } catch (error) {
      console.error("중복 확인 오류:", error);
      alert("서버 연결 오류가 발생했습니다.");
      setSlugStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrors(validationError);
      return;
    }

    setErrors(null);
    setIsLoading(true);

    try {
      // FastAPI 회원가입 API 호출 - role 추가
      const res = await fetch(`${backEndUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          name: form.name.trim(),
          slug: form.slug.trim(),
          bio: form.bio.trim() || null,
          role: form.role, // role 추가
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // 회원가입 성공 - 이메일 인증 안내
        alert(
          "회원가입이 완료되었습니다! 터미널에서 이메일 인증 링크를 확인해주세요."
        );
        router.push("/auth/login");
      } else {
        // FastAPI 에러 응답 형식: { detail: "에러 메시지" }
        setErrors(data.detail || "회원가입에 실패했습니다.");
      }
    } catch (err: unknown) {
      console.error("회원가입 에러:", err);
      if (err instanceof Error) {
        setErrors("네트워크 오류: " + err.message);
      } else {
        setErrors("서버와 연결할 수 없습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>

      {errors && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm mb-4">
          {errors}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 이메일 */}
        <div>
          <div className="flex gap-2 items-center">
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
              className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={checkEmailDuplication}
              className="border border-gray-300 px-4 py-3 rounded-lg bg-white hover:bg-gray-50 text-sm whitespace-nowrap"
              disabled={emailStatus === "checking" || isLoading}
            >
              {emailStatus === "checking"
                ? "확인 중..."
                : emailStatus === "available"
                ? "확인 완료"
                : "중복 확인"}
            </button>
          </div>
          <p
            className={`text-sm mt-1 ${
              emailStatus === "duplicate"
                ? "text-red-600"
                : emailStatus === "available"
                ? "text-green-600"
                : "text-gray-600"
            }`}
          >
            {emailStatus === "duplicate"
              ? "이미 사용 중인 이메일입니다."
              : emailStatus === "available"
              ? "사용 가능한 이메일입니다."
              : "이메일 중복확인을 해주세요."}
          </p>
        </div>

        {/* 이름 */}
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
          required
          disabled={isLoading}
        />

        {/* 갤러리 주소 (슬러그) */}
        <div>
          <div className="flex gap-2 items-center">
            <div className="flex-1 flex">
              <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-3 rounded-l-lg text-gray-600 text-sm">
                artivefor.me/
              </span>
              <input
                type="text"
                name="slug"
                placeholder="gallery-name"
                value={form.slug}
                onChange={handleChange}
                className="flex-1 border border-gray-300 p-3 rounded-r-lg focus:outline-none focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="button"
              onClick={() => checkSlugAvailability(form.slug)}
              className="border border-gray-300 px-4 py-3 rounded-lg bg-white hover:bg-gray-50 text-sm whitespace-nowrap"
              disabled={slugStatus === "checking" || isLoading}
            >
              {slugStatus === "checking"
                ? "확인 중..."
                : slugStatus === "available"
                ? "확인 완료"
                : "중복 확인"}
            </button>
          </div>
          <p
            className={`text-sm mt-1 ${
              slugStatus === "duplicate"
                ? "text-red-600"
                : slugStatus === "available"
                ? "text-green-600"
                : "text-gray-600"
            }`}
          >
            {slugStatus === "duplicate"
              ? "이미 사용 중인 주소입니다."
              : slugStatus === "available"
              ? "사용 가능한 주소입니다."
              : "영문 소문자, 숫자만 사용 가능합니다. (3자 이상)"}
          </p>
        </div>

        {/* 자기소개 */}
        <textarea
          name="bio"
          placeholder="자기소개 (선택사항)"
          value={form.bio}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
          disabled={isLoading}
        />

        {/* 비밀번호 */}
        <input
          type="password"
          name="password"
          placeholder="비밀번호 (8자 이상)"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
          required
          disabled={isLoading}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
          required
          disabled={isLoading}
        />
        {/* 회원 유형 선택 - 새로 추가 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            회원 유형을 선택해주세요
          </label>
          <div className="space-y-2">
            {roleOptions.map((option) => (
              <div
                key={option.value}
                className={`relative flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                  form.role === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => handleRoleChange(option.value)}
              >
                <div className="flex items-center h-5">
                  <input
                    id={option.value}
                    name="role"
                    type="radio"
                    value={option.value}
                    checked={form.role === option.value}
                    onChange={() => handleRoleChange(option.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor={option.value}
                    className="font-medium text-gray-900 cursor-pointer"
                  >
                    {option.label}
                  </label>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 개인정보 처리방침 동의 */}
        <div className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            id="agree"
            required
            className="w-4 h-4"
            disabled={isLoading}
          />
          <label htmlFor="agree" className="text-gray-700">
            <a
              href="https://www.artivefor.me/terms"
              target="_blank"
              className="text-blue-600 underline hover:text-blue-800"
            >
              개인정보처리방침
            </a>
            에 동의합니다.
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "가입 중..." : "가입하기"}
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-6">
        이미 계정이 있으신가요?{" "}
        <Link href="/auth/login">
          <span className="text-blue-600 hover:underline">로그인</span>
        </Link>
      </p>

      {/* 개발환경 테스트용 */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-100 rounded text-xs">
          <p className="font-semibold mb-2">개발 테스트용 예시:</p>
          <p>이메일: test@example.com</p>
          <p>이름: 테스트 사용자</p>
          <p>갤러리 주소: testuser</p>
          <p>회원 유형: {form.role}</p>
          <p className="text-gray-600 mt-1">
            API 서버: {backEndUrl || "환경변수 설정 필요"}
          </p>
        </div>
      )}
    </div>
  );
}
