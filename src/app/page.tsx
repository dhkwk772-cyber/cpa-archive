"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ⭐ [중요] 아래 따옴표 안에 본인의 Supabase Project URL과 anon public Key를 붙여넣으세요!
const SUPABASE_URL = "https://yrvkdmndajzdmnukpuga.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlydmtkbW5kYWp6ZG1udWtwdWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MDY4MjMsImV4cCI6MjEwODM4MjgyM30.UdXFYQoamyQb0yv2xvNlRNv9xXhdd7rprgHs0So3dhs";

// 주소가 정상적으로 입력되었는지 확인 후 연결
const isConfigured = SUPABASE_URL.startsWith("http") && SUPABASE_ANON_KEY.length > 20;
const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// 데이터 타입 정의
interface Solution {
  id: number;
  question_id: number;
  instructor: string;
  author: string;
  content: string;
  image_url?: string;
  likes: number;
  is_accepted: boolean;
}

interface Question {
  id: number;
  level: string;
  subject: string;
  book: string;
  page: string;
  title: string;
  content: string;
  image_url?: string;
  bounty: number;
  author: string;
  solutions: Solution[];
}

const DEFAULT_INSTRUCTORS = [
  "이승철 와꾸",
  "강경태 와꾸",
  "주민규 와꾸",
  "김종길 와꾸",
  "김민환 와꾸",
  "임세진 와꾸",
  "김기동 와꾸",
  "김재호 와꾸",
];

const DEFAULT_BOOKS = [
  "세법 연습서 (주민규)",
  "세법 연습서 (이승철)",
  "재무관리 연습 (김종길)",
  "재무회계 연습서 (김기동)",
  "원가관리회계 연습서 (임세진)",
  "객관식 재무회계 (김재호)",
];

export default function GosiApp() {
  const [activeTab, setActiveTab] = useState<"qna" | "wiki" | "study" | "wallet">("qna");
  const [points, setPoints] = useState(1200);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [activeInstructorTab, setActiveInstructorTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // 검색 및 필터 상태
  const [selectedSubject, setSelectedSubject] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  // 강사 및 교재 목록 상태
  const [instructors, setInstructors] = useState<string[]>(DEFAULT_INSTRUCTORS);
  const [books, setBooks] = useState<string[]>(DEFAULT_BOOKS);

  // 답변(새 풀이) 입력 상태
  const [newInstructor, setNewInstructor] = useState("");
  const [newAnswerText, setNewAnswerText] = useState("");
  const [selectedAnswerInstructor, setSelectedAnswerInstructor] = useState("이승철 와꾸");
  const [answerImage, setAnswerImage] = useState<string | null>(null);

  // 새 질문 등록 모달 상태
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [qLevel, setQLevel] = useState("2차");
  const [qSubject, setQSubject] = useState("세법");
  const [qBook, setQBook] = useState("세법 연습서 (주민규)");
  const [newBookInput, setNewBookInput] = useState("");
  const [qPage, setQPage] = useState("");
  const [qTitle, setQTitle] = useState("");
  const [qContent, setQContent] = useState("");
  const [qBounty, setQBounty] = useState(200);
  const [qImage, setQImage] = useState<string | null>(null);

  // 이미지 확대 보기 모달 상태
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 1. 처음 화면이 켜질 때 Supabase에서 데이터 불러오기
  const fetchAllData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);

    // 질문과 그에 달린 강사별 풀이(solutions) 함께 가져오기
    const { data: qData, error: qError } = await supabase
      .from("questions")
      .select("*, solutions(*)")
      .order("created_at", { ascending: false });

    if (!qError && qData) {
      const formatted: Question[] = qData.map((q: any) => ({
        ...q,
        solutions: (q.solutions || []).sort((a: any, b: any) => a.id - b.id),
      }));
      setQuestions(formatted);
      if (formatted.length > 0 && selectedQuestionId === null) {
        setSelectedQuestionId(formatted[0].id);
      }
    }

    // 추가된 강사/교재 옵션 가져오기
    const { data: optData } = await supabase.from("custom_options").select("*");
    if (optData) {
      const customInst = optData
        .filter((o: any) => o.category === "instructor")
        .map((o: any) => o.name);
      const customBooks = optData
        .filter((o: any) => o.category === "book")
        .map((o: any) => o.name);

      setInstructors(Array.from(new Set([...DEFAULT_INSTRUCTORS, ...customInst])));
      setBooks(Array.from(new Set([...DEFAULT_BOOKS, ...customBooks])));
    }

    setLoading(false);
  };

  useEffect(() => {
    const savedPoints = localStorage.getItem("cpa_points");
    if (savedPoints) setPoints(Number(savedPoints));
    fetchAllData();
  }, []);

  // 포인트 변경 시 브라우저에 저장
  const updatePoints = (newPt: number) => {
    setPoints(newPt);
    localStorage.setItem("cpa_points", String(newPt));
  };

  // 현재 선택된 질문 객체
  const selectedQuestion =
    questions.find((q) => q.id === selectedQuestionId) || questions[0];

  // 이미지 파일을 Base64 문자열로 변환 (DB에 바로 저장 가능)
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 새로운 강사 선택지 DB에 추가
  const handleAddInstructor = async () => {
    if (!newInstructor.trim() || !supabase) return;
    const formatted = newInstructor.includes("와꾸")
      ? newInstructor.trim()
      : `${newInstructor.trim()} 와꾸`;

    if (!instructors.includes(formatted)) {
      await supabase
        .from("custom_options")
        .insert([{ category: "instructor", name: formatted }]);
      setInstructors([...instructors, formatted]);
      setSelectedAnswerInstructor(formatted);
    }
    setNewInstructor("");
  };

  // 새로운 교재 선택지 DB에 추가
  const handleAddBook = async () => {
    if (!newBookInput.trim() || !supabase) return;
    const formatted = newBookInput.trim();
    if (!books.includes(formatted)) {
      await supabase
        .from("custom_options")
        .insert([{ category: "book", name: formatted }]);
      setBooks([...books, formatted]);
      setQBook(formatted);
    }
    setNewBookInput("");
  };

  // 새 질문 Supabase DB에 등록하기
  const handleCreateQuestion = async () => {
    if (!supabase) return;
    if (!qPage.trim() || !qTitle.trim() || !qContent.trim()) {
      alert("페이지/문제번호, 제목, 질문 내용을 모두 입력해 주세요!");
      return;
    }
    if (points < qBounty) {
      alert("보유 포인트가 부족합니다!");
      return;
    }

    const { data, error } = await supabase
      .from("questions")
      .insert([
        {
          level: qLevel,
          subject: qSubject,
          book: qBook,
          page: qPage,
          title: qTitle,
          content: qContent,
          image_url: qImage || null,
          bounty: qBounty,
          author: "실장_나",
        },
      ])
      .select()
      .single();

    if (error) {
      alert("질문 저장 중 오류가 발생했습니다: " + error.message);
      return;
    }

    updatePoints(points - qBounty);
    setIsAskModalOpen(false);
    setQPage("");
    setQTitle("");
    setQContent("");
    setQImage(null);

    await fetchAllData();
    if (data) setSelectedQuestionId(data.id);
    alert(`질문이 서버에 영구 등록되었습니다! (현상금 ${qBounty}P 차감)`);
  };

  // 새로운 강사별 풀이(답변) Supabase DB에 등록하기
  const handleAddSolution = async () => {
    if (!supabase || !selectedQuestion) return;
    if (!newAnswerText.trim()) {
      alert("풀이 내용을 입력해 주세요!");
      return;
    }

    const { error } = await supabase.from("solutions").insert([
      {
        question_id: selectedQuestion.id,
        instructor: selectedAnswerInstructor,
        author: "실장_나",
        content: newAnswerText,
        image_url: answerImage || null,
        likes: 0,
        is_accepted: false,
      },
    ]);

    if (error) {
      alert("답변 저장 중 오류가 발생했습니다: " + error.message);
      return;
    }

    const nextTabIdx = selectedQuestion.solutions.length;
    setNewAnswerText("");
    setAnswerImage(null);
    updatePoints(points + 50);

    await fetchAllData();
    setActiveInstructorTab(nextTabIdx);
    alert("새로운 강사 풀이법이 DB에 영구 등록되어 50P가 적립되었습니다!");
  };

  // 답변 추천(좋아요) DB 반영
  const handleLikeSolution = async (sol: Solution) => {
    if (!supabase) return;
    await supabase
      .from("solutions")
      .update({ likes: sol.likes + 1 })
      .eq("id", sol.id);
    await fetchAllData();
  };

  // 답변 채택하기 DB 반영
  const handleAcceptSolution = async (sol: Solution) => {
    if (!supabase || !selectedQuestion) return;
    await supabase
      .from("solutions")
      .update({ is_accepted: true })
      .eq("id", sol.id);
    await fetchAllData();
    alert(`이 풀이를 채택하여 답변자에게 현상금 ${selectedQuestion.bounty}P가 전달되었습니다!`);
  };

  // 만약 아직 키를 안 넣었을 때 보여줄 안내 화면
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
          <span className="bg-amber-400 text-slate-900 font-extrabold px-2.5 py-1 rounded text-xs">
            연결 대기 중
          </span>
          <h1 className="text-xl font-bold">
            거의 다 됐습니다! Supabase 주소와 키를 넣어주세요 🔑
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Cursor 에디터에 열려있는 <code>page.tsx</code> 파일의{" "}
            <strong className="text-amber-400">6번째, 7번째 줄</strong>에 본인의{" "}
            <code>Project URL</code>과 <code>anon public Key</code>를 붙여넣고 저장(Ctrl+S)하면 즉시 연결됩니다!
          </p>
        </div>
      </div>
    );
  }

  // 필터링된 질문 목록
  const filteredQuestions = questions.filter((q) => {
    const matchesSubject = selectedSubject === "전체" || q.subject === selectedSubject;
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.page.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 상단 헤더 */}
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-400 text-slate-900 font-extrabold px-2.5 py-1 rounded text-xs">
            DB 연결됨 ●
          </span>
          <h1 className="text-lg md:text-xl font-bold tracking-tight">
            CPA 고시반 지식 아카이브
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAskModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full shadow transition"
          >
            ✍️ 새 질문 올리기
          </button>
          <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
            <span className="text-amber-400 font-bold">💰</span>
            <span className="font-mono font-bold text-white">{points.toLocaleString()} P</span>
          </div>
        </div>
      </header>

      {/* 상단 네비게이션 탭 */}
      <nav className="bg-white border-b border-slate-200 px-6 flex gap-2 overflow-x-auto">
        {[
          { id: "qna", label: "📚 학업 Q&A (와꾸 비교)" },
          { id: "wiki", label: "🧭 수험 전략 위키" },
          { id: "study", label: "🔥 원터치 스터디" },
          { id: "wallet", label: "💳 포인트 지갑" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3.5 px-4 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-semibold">
            ☁️ Supabase 데이터베이스에서 고시반 아카이브를 불러오는 중...
          </div>
        ) : (
          activeTab === "qna" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 왼쪽: 문제 검색, 과목 필터 및 질문 리스트 */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-slate-800">과목별 문제 아카이브</h2>
                    <button
                      onClick={() => setIsAskModalOpen(true)}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      + 질문 등록하기
                    </button>
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="🔍 교재명, 페이지(예: 214), 키워드 검색..."
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />

                  <div className="flex gap-1.5 flex-wrap">
                    {["전체", "세법", "재무회계", "원가관리", "재무관리", "회계감사", "경제학", "상법"].map(
                      (subj) => (
                        <button
                          key={subj}
                          onClick={() => setSelectedSubject(subj)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            selectedSubject === subj
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {subj}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* 질문 카드 리스트 */}
                <div className="space-y-3">
                  {filteredQuestions.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => {
                        setSelectedQuestionId(q.id);
                        setActiveInstructorTab(0);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedQuestion?.id === q.id
                          ? "bg-blue-50/60 border-blue-500 shadow-sm"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex gap-1.5 flex-wrap">
                          <span className="bg-slate-800 text-white text-xs px-2 py-0.5 rounded font-medium">
                            {q.level}
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-semibold">
                            {q.subject}
                          </span>
                          <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-medium">
                            {q.book} · {q.page}
                          </span>
                        </div>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                          {q.bounty}P
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mb-1">{q.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{q.content}</p>
                      <div className="mt-3 flex justify-between items-center text-xs text-slate-400">
                        <span>작성자: {q.author}</span>
                        <span className="text-blue-600 font-semibold">
                          강사별 풀이 {q.solutions?.length || 0}개 ➔
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 오른쪽: 선택된 문제 상세 & 강사별 와꾸 탭 비교 */}
              <div className="lg:col-span-7 space-y-6">
                {selectedQuestion && (
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded font-bold">
                          {selectedQuestion.level}
                        </span>
                        <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded font-bold">
                          {selectedQuestion.subject}
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                          {selectedQuestion.book} ({selectedQuestion.page})
                        </span>
                      </div>
                      <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full">
                        현상금 {selectedQuestion.bounty}P
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 mb-2">
                      {selectedQuestion.title}
                    </h2>
                    <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4 whitespace-pre-line">
                      {selectedQuestion.content}
                    </p>

                    {selectedQuestion.image_url && (
                      <div className="mb-6">
                        <p className="text-xs font-bold text-slate-500 mb-1.5">
                          📎 첨부된 문제/필기 캡처 (클릭 시 확대)
                        </p>
                        <img
                          src={selectedQuestion.image_url}
                          alt="문제 이미지"
                          onClick={() => setPreviewImage(selectedQuestion.image_url!)}
                          className="max-h-64 rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition"
                        />
                      </div>
                    )}

                    {/* 강사별 풀이(와꾸) 비교 탭 */}
                    <div className="border-t border-slate-200 pt-5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-slate-800">
                          🔄 강사별 풀이 방식(와꾸) 비교해서 보기
                        </h3>
                        <span className="text-xs text-slate-500">
                          총 {selectedQuestion.solutions.length}개의 풀이
                        </span>
                      </div>

                      {selectedQuestion.solutions.length === 0 ? (
                        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center text-sm text-slate-500">
                          아직 등록된 강사별 풀이가 없습니다. 첫 번째 풀이를 등록하고 포인트를 받아보세요!
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-2 mb-4 flex-wrap">
                            {selectedQuestion.solutions.map((sol, idx) => (
                              <button
                                key={sol.id}
                                onClick={() => setActiveInstructorTab(idx)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
                                  activeInstructorTab === idx
                                    ? "bg-slate-900 text-amber-400 shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                              >
                                <span>👨‍🏫 {sol.instructor}</span>
                                {sol.is_accepted && (
                                  <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                                    채택됨
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>

                          {selectedQuestion.solutions[activeInstructorTab] && (
                            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-slate-600">
                                  답변자: {selectedQuestion.solutions[activeInstructorTab].author}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleLikeSolution(
                                        selectedQuestion.solutions[activeInstructorTab]
                                      )
                                    }
                                    className="text-xs bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full font-semibold text-slate-700 transition"
                                  >
                                    👍 추천 {selectedQuestion.solutions[activeInstructorTab].likes}
                                  </button>
                                  {!selectedQuestion.solutions[activeInstructorTab].is_accepted && (
                                    <button
                                      onClick={() =>
                                        handleAcceptSolution(
                                          selectedQuestion.solutions[activeInstructorTab]
                                        )
                                      }
                                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-full font-bold transition"
                                    >
                                      🏆 채택하기
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line mb-3">
                                {selectedQuestion.solutions[activeInstructorTab].content}
                              </p>

                              {selectedQuestion.solutions[activeInstructorTab].image_url && (
                                <div className="mt-3">
                                  <p className="text-xs font-bold text-slate-500 mb-1">
                                    📝 첨부된 손글씨/와꾸 이미지 (클릭 시 확대)
                                  </p>
                                  <img
                                    src={selectedQuestion.solutions[activeInstructorTab].image_url}
                                    alt="풀이 이미지"
                                    onClick={() =>
                                      setPreviewImage(
                                        selectedQuestion.solutions[activeInstructorTab].image_url!
                                      )
                                    }
                                    className="max-h-64 rounded-lg border border-amber-300 cursor-pointer hover:opacity-90 transition"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* 새로운 강사 풀이 추가 폼 */}
                    <div className="mt-6 border-t border-slate-200 pt-5">
                      <h4 className="text-sm font-bold text-slate-800 mb-3">
                        ➕ 다른 강사님 풀이법(와꾸)이나 손글씨 풀이 보태기 (+50P)
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-2 mb-3">
                        <select
                          value={selectedAnswerInstructor}
                          onChange={(e) => setSelectedAnswerInstructor(e.target.value)}
                          className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white font-medium"
                        >
                          {instructors.map((inst) => (
                            <option key={inst} value={inst}>
                              {inst}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-1 flex-1">
                          <input
                            type="text"
                            value={newInstructor}
                            onChange={(e) => setNewInstructor(e.target.value)}
                            placeholder="목록에 없는 강사명 직접 입력"
                            className="border border-slate-300 rounded-lg px-3 py-2 text-xs flex-1"
                          />
                          <button
                            onClick={handleAddInstructor}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-2 rounded-lg text-xs font-bold shrink-0"
                          >
                            + 강사 추가
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={3}
                        value={newAnswerText}
                        onChange={(e) => setNewAnswerText(e.target.value)}
                        placeholder="내가 듣는 강사님의 와꾸나 풀이 접근법을 공유해 주세요!"
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm mb-2"
                      />

                      <div className="flex items-center justify-between mb-3">
                        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 transition">
                          📷 아이패드 손글씨 / 풀이 사진 첨부
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, setAnswerImage)}
                            className="hidden"
                          />
                        </label>
                        {answerImage && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-600 font-bold">
                              ✅ 사진 첨부됨
                            </span>
                            <button
                              onClick={() => setAnswerImage(null)}
                              className="text-xs text-red-500 underline"
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleAddSolution}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition"
                      >
                        이 문제에 새로운 풀이법 등록하기 (서버 저장)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </main>

      {/* ✍️ 새 질문 올리기 모달 */}
      {isAskModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">✍️ 새 학업 질문 올리기</h3>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">시험 구분</label>
                <select
                  value={qLevel}
                  onChange={(e) => setQLevel(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="1차">1차</option>
                  <option value="2차">2차 (동차/유예)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">과목</label>
                <select
                  value={qSubject}
                  onChange={(e) => setQSubject(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >
                  {["세법", "재무회계", "원가관리", "재무관리", "회계감사", "경제학", "상법"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                교재 및 강사 선택
              </label>
              <select
                value={qBook}
                onChange={(e) => setQBook(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-2"
              >
                {books.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newBookInput}
                  onChange={(e) => setNewBookInput(e.target.value)}
                  placeholder="목록에 없는 교재명 (예: 세법 워크북 강경태)"
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs flex-1"
                />
                <button
                  onClick={handleAddBook}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  + 교재 추가
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  페이지 및 문제 번호 (필수)
                </label>
                <input
                  type="text"
                  value={qPage}
                  onChange={(e) => setQPage(e.target.value)}
                  placeholder="예: p.145 문제 4번"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  현상금 포인트 (보유: {points}P)
                </label>
                <select
                  value={qBounty}
                  onChange={(e) => setQBounty(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-amber-700"
                >
                  {[100, 200, 300, 400, 500].map((pt) => (
                    <option key={pt} value={pt}>
                      {pt} P 걸기
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">질문 제목</label>
              <input
                type="text"
                value={qTitle}
                onChange={(e) => setQTitle(e.target.value)}
                placeholder="어떤 논리나 와꾸가 헷갈리는지 한 줄로 적어주세요"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">질문 상세 내용</label>
              <textarea
                rows={4}
                value={qContent}
                onChange={(e) => setQContent(e.target.value)}
                placeholder="내가 푼 방식이나 막힌 부분, 혹은 비교하고 싶은 다른 강사님 풀이법을 적어주세요."
                className="w-full border border-slate-300 rounded-lg p-3 text-sm"
              />
            </div>

            <div>
              <label className="cursor-pointer inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg border border-slate-300">
                📸 문제 사진 / 내 필기 캡처 올리기
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setQImage)}
                  className="hidden"
                />
              </label>
              {qImage && (
                <div className="mt-2 flex items-center gap-3">
                  <img src={qImage} alt="미리보기" className="h-16 rounded border" />
                  <button
                    onClick={() => setQImage(null)}
                    className="text-xs text-red-500 underline"
                  >
                    사진 지우기
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-lg text-sm"
              >
                취소
              </button>
              <button
                onClick={handleCreateQuestion}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm"
              >
                {qBounty}P 걸고 질문 등록하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 이미지 확대 보기 모달 */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={previewImage}
            alt="확대 이미지"
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}