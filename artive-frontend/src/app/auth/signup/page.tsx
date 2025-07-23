"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import Image from "next/image";

export default function SignupPage() {
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    file: null as File | null,
  });

  const [errors, setErrors] = useState<string | null>(null);
  // const [thumbnailUrl, setThumbnailUrl] = useState("/default-profile.png");

  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "available" | "duplicate"
  >("idle");

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "file" && files) {
      const file = files[0];
      setForm((prev) => ({ ...prev, file }));
      // setThumbnailUrl(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (name === "email") {
        setEmailStatus("idle");
      }
    }
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      return "유효한 이메일 형식을 입력하세요.";
    }
    if (form.password.length < 8) {
      return "비밀번호는 최소 8자 이상이어야 합니다.";
    }
    if (form.password !== form.confirmPassword) {
      return "비밀번호가 일치하지 않습니다.";
    }
    if (form.name.length < 2) {
      return "닉네임은 최소 2자 이상이어야 합니다.";
    }
    if (form.file && form.file.size > 2 * 1024 * 1024) {
      return "썸네일 파일은 2MB 이하만 가능합니다.";
    }
    if (emailStatus !== "available") {
      return "이메일 중복확인을 해주세요.";
    }
    return null;
  };

  const checkEmailDuplication = async () => {
    console.log("버튼 눌림!");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("유효한 이메일 형식이 아닙니다.");
      return;
    }

    setEmailStatus("checking");

    try {
      console.log("✅ backEndUrl =", backEndUrl);

      const res = await fetch(
        `${backEndUrl}/auth/check-email?email=${encodeURIComponent(
          form.email.trim()
        )}`
      );
      const data = await res.json();

      if (data.available) {
        setEmailStatus("available");
      } else {
        setEmailStatus("duplicate");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        // console.error(err.message);
      } else {
        // console.error("알 수 없는 오류:", err);
      }
      alert("중복 확인 중 오류가 발생했습니다.");
      setEmailStatus("idle");
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

    try {
      const res = await fetch(`${backEndUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
        }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const result = await res.text();
        alert(result);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        // console.error(err.message);
      } else {
        // console.error("알 수 없는 오류:", err);
      }
      alert("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // ✅ 로딩 종료
    }
  };

  return (
    <div className="max-w-md mx-aut mx-4 mt-10 p-4 shadow rounded border ">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>
      {errors && <p className="text-red-600 mb-2">{errors}</p>}

      {/* <div className="flex justify-center mb-4">
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="relative w-24 h-24">
            <Image
              src={thumbnailUrl}
              alt="썸네일 미리보기"
              fill
              className="rounded-full object-cover border border-gray-300 hover:opacity-80 transition"
            />
          </div>
        </label>
        <input
          id="file-input"
          type="file"
          name="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div> */}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2 items-center">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            className="flex-1 border p-2 rounded placeholder-gray-400"
            required
          />
          <button
            type="button"
            onClick={checkEmailDuplication}
            className="border px-3 py-2 rounded bg-white-500 hover:bg-gray-600 text-sm"
            disabled={emailStatus === "checking"}
          >
            {emailStatus === "checking"
              ? "확인 중..."
              : emailStatus === "available"
              ? "확인 완료"
              : "중복 확인"}
          </button>
        </div>
        <p
          className={`text-sm ${
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

        <input
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded placeholder-gray-400"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호 (8자 이상)"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded placeholder-gray-400"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border p-2 rounded placeholder-gray-400"
          required
        />

        <button
          type="submit"
          className="bg-black text-white w-full py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "가입 중..." : "가입하기"}
        </button>
      </form>
    </div>
  );
}
