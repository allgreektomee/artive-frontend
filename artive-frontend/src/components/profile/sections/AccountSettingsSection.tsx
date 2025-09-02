// components/profile/sections/AccountSettingsSection.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionProps } from "../../../utils/types";

const AccountSettingsSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
}) => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && (hasUpperCase || hasLowerCase) && hasNumbers,
    };
  };

  const passwordValidation = validatePassword(newPassword);

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("모든 필드를 입력해주세요");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다");
      return;
    }

    if (!passwordValidation.isValid) {
      alert("비밀번호 조건을 만족해주세요");
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${backEndUrl}/api/auth/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        alert("비밀번호가 변경되었습니다");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await response.json();
        alert(error.detail || error.message || "비밀번호 변경에 실패했습니다");
      }
    } catch (error) {
      alert("비밀번호 변경 중 오류가 발생했습니다");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "회원탈퇴") {
      alert("확인 문구를 정확히 입력해주세요");
      return;
    }

    if (!deletePassword) {
      alert("비밀번호를 입력해주세요");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${backEndUrl}/api/auth/account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: deletePassword,
        }),
      });

      if (response.ok) {
        alert("회원 탈퇴가 완료되었습니다");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
      } else {
        const error = await response.json();
        alert(error.detail || error.message || "회원 탈퇴에 실패했습니다");
      }
    } catch (error) {
      alert("회원 탈퇴 중 오류가 발생했습니다");
    }
  };

  return (
    <div className="space-y-8">
      {/* PC에서만 보이는 타이틀 */}
      {!isMobile && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">계정 설정</h2>
          <p className="text-sm text-gray-500 mt-1">
            계정 보안 및 회원 정보를 관리하세요
          </p>
        </div>
      )}

      {/* 비밀번호 변경 섹션 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">비밀번호 변경</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-2">
              현재 비밀번호
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="현재 비밀번호 입력"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              새 비밀번호
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="새 비밀번호 입력"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* 비밀번호 조건 표시 */}
            {newPassword && (
              <div className="mt-2 space-y-1">
                <p
                  className={`text-xs flex items-center ${
                    passwordValidation.minLength
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <span className="mr-1">
                    {passwordValidation.minLength ? "✓" : "○"}
                  </span>
                  최소 8자 이상
                </p>
                <p
                  className={`text-xs flex items-center ${
                    passwordValidation.hasNumbers
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <span className="mr-1">
                    {passwordValidation.hasNumbers ? "✓" : "○"}
                  </span>
                  숫자 포함
                </p>
                <p
                  className={`text-xs flex items-center ${
                    passwordValidation.hasUpperCase ||
                    passwordValidation.hasLowerCase
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <span className="mr-1">
                    {passwordValidation.hasUpperCase ||
                    passwordValidation.hasLowerCase
                      ? "✓"
                      : "○"}
                  </span>
                  영문자 포함
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              새 비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="새 비밀번호 다시 입력"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-600 mt-1">
                비밀번호가 일치하지 않습니다
              </p>
            )}
            {confirmPassword &&
              newPassword === confirmPassword &&
              newPassword && (
                <p className="text-xs text-green-600 mt-1">
                  비밀번호가 일치합니다
                </p>
              )}
          </div>

          <button
            onClick={handlePasswordChange}
            disabled={
              isChangingPassword ||
              !passwordValidation.isValid ||
              newPassword !== confirmPassword
            }
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isChangingPassword ||
              !passwordValidation.isValid ||
              newPassword !== confirmPassword
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isChangingPassword ? "변경 중..." : "비밀번호 변경"}
          </button>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold mb-4 text-red-600">위험 구역</h3>

        {/* 회원 탈퇴 섹션 */}
        <div className="border border-red-200 rounded-lg p-6 bg-red-50">
          <h4 className="text-base font-semibold text-red-900 mb-2">
            회원 탈퇴
          </h4>
          <p className="text-sm text-red-700 mb-4">
            회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다. 신중하게
            결정해주세요.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            회원 탈퇴
          </button>
        </div>
      </div>

      {/* 회원 탈퇴 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              정말 탈퇴하시겠습니까?
            </h3>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <strong>경고:</strong> 회원 탈퇴 시 다음 정보가 모두
                  삭제됩니다:
                </p>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  <li>프로필 정보</li>
                  <li>작품 및 포트폴리오</li>
                  <li>전시 및 수상 이력</li>
                  <li>모든 업로드된 이미지</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="비밀번호 입력"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  확인 문구 입력
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  아래 입력란에{" "}
                  <strong className="text-red-600">"회원탈퇴"</strong>를
                  입력해주세요
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="회원탈퇴"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                    setDeleteConfirmText("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "회원탈퇴" || !deletePassword}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    deleteConfirmText === "회원탈퇴" && deletePassword
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  회원 탈퇴
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettingsSection;
