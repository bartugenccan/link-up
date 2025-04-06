"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [postContent, setPostContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada post oluşturma işlemi yapılacak
    console.log("Post içeriği:", postContent);
    setPostContent("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              LinkUp
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-full text-gray-300 hover:text-white transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
                >
                  Kayıt Ol
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold">
                    {user?.name
                      ?.split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>
                  <span className="hidden md:block">Merhaba, {user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="md:w-1/4">
            <div className="sticky top-24 bg-gray-800 rounded-xl p-4 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Navigasyon</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-700 text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span>Ana Sayfa</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/explore"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Keşfet</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/notifications"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    <span>Bildirimler</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/messages"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                    <span>Mesajlar</span>
                  </Link>
                </li>
                {isAuthenticated && (
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Profil</span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Main Feed */}
          <div className="md:w-2/4">
            {/* Post oluşturma kısmı - sadece giriş yapmış kullanıcılara göster */}
            {isAuthenticated && (
              <div className="mb-6 rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg">
                <form onSubmit={handleSubmit}>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="mb-4 w-full rounded-xl border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    placeholder="Bugün ne düşünüyorsunuz?"
                    required
                  ></textarea>
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-blue-400"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-purple-400"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 font-medium text-white hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      Paylaş
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Mevcut postlar */}
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((postId) => (
                <div
                  key={postId}
                  className="rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg transition-all hover:border-gray-600"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold">
                      {`${postId % 2 === 0 ? "AY" : "MK"}`}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        {postId % 2 === 0 ? "Ali Yılmaz" : "Mehmet Kaya"}
                      </h3>
                      <p className="text-sm text-gray-400">5 saat önce</p>
                    </div>
                  </div>
                  <p className="mb-4 text-gray-200">
                    Bu bir örnek gönderi içeriğidir. LinkUp'da paylaşım yapmak
                    çok kolay!
                    {postId % 2 === 0 &&
                      " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod magna vel diam blandit, vel luctus eros pharetra."}
                  </p>

                  <div className="flex items-center border-t border-gray-700 pt-3">
                    <button className="flex items-center gap-1 rounded-full px-3 py-1 text-gray-400 hover:bg-gray-700 hover:text-pink-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{42 + postId}</span>
                    </button>
                    <button className="flex items-center gap-1 rounded-full px-3 py-1 text-gray-400 hover:bg-gray-700 hover:text-blue-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{10 + postId}</span>
                    </button>
                    <button className="flex items-center gap-1 rounded-full px-3 py-1 text-gray-400 hover:bg-gray-700 hover:text-green-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      <span>{5 + postId}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="md:w-1/4">
            <div className="sticky top-24 space-y-6">
              {/* Trend Topics */}
              <div className="rounded-xl bg-gray-800 p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Gündemdekiler</h2>
                <ul className="space-y-3">
                  {[
                    "React",
                    "TypeScript",
                    "Supabase",
                    "Next.js",
                    "Tailwind CSS",
                  ].map((topic, i) => (
                    <li
                      key={i}
                      className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
                    >
                      <Link
                        href={`/topic/${topic.toLowerCase()}`}
                        className="block"
                      >
                        <span className="text-gray-400 text-sm">#{topic}</span>
                        <p className="font-medium">
                          {topic} ile ilgili trendler
                        </p>
                        <p className="text-sm text-gray-400">
                          {1000 - i * 100} gönderi
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Önerilen Kişiler */}
              <div className="rounded-xl bg-gray-800 p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Önerilen Kişiler</h2>
                <ul className="space-y-3">
                  {[
                    "Ali Yılmaz",
                    "Ayşe Demir",
                    "Mehmet Kaya",
                    "Zeynep Şahin",
                  ].map((person, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-lg font-bold">
                          {person
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium">{person}</p>
                          <p className="text-sm text-gray-400">
                            @{person.toLowerCase().replace(" ", "")}
                          </p>
                        </div>
                      </div>
                      <button className="rounded-full border border-blue-500 px-3 py-1 text-sm text-blue-500 hover:bg-blue-500 hover:text-white">
                        Takip Et
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
