"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yrvkdmndajzdmnukpuga.supabase.co/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlydmtkbW5kYWp6ZG1udWtwdWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MDY4MjMsImV4cCI6MjEwODM4MjgyM30.UdXFYQoamyQb0yv2xvNlRNv9xXhdd7rprgHs0So3dhs";

const isConfigured = SUPABASE_URL.startsWith("http") && SUPABASE_ANON_KEY.length > 20;
const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  is_gosiban: boolean;
  points: number;
  equipped_badge?: string;
  inventory?: string;
}

interface Solution {
  id: number;
  question_id: number;
  instructor: string;
  author: string;
  author_id?: string | null;
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
  author_id?: string | null;
  solutions: Solution[];
}

interface ShopItem {
  id: number;
  category: string;
  name: string;
  price: number;
  description: string;
  icon: string;
}

interface WikiPost {
  id: number;
  mbti_group: string;
  title: string;
  author: string;
  content: string;
  likes: number;
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

const MBTI_CATEGORIES = [
  {
    id: "ALL",
    label: "🌈 전체 성향",
    badge: "전체",
    desc: "모든 MBTI 수험생들의 공부 전략과 합격 수기를 한눈에 확인합니다.",
  },
  {
    id: "SJ",
    label: "📊 SJ (ISTJ·ESTJ·ISFJ·ESFJ)",
    badge: "규율·계획형",
    desc: "체계적인 루틴, 누적 복습표, 백지 복습과 서브노트 단권화로 승부하는 성향입니다.",
  },
  {
    id: "SP",
    label: "⚡ SP (ISTP·ESTP·ISFP·ESFP)",
    badge: "실전·유연형",
    desc: "지루한 이론 회독보다 실전 모의고사(GS), 타임어택 문제 풀이로 효율을 극대화하는 성향입니다.",
  },
  {
    id: "NT",
    label: "🔬 NT (INTJ·ENTJ·INTP·ENTP)",
    badge: "논리·와꾸분석형",
    desc: "무작정 암기하기보다 기준서 원리와 강사별 와꾸의 논리적 구조를 비교·납득해야 안 풀리는 문제가 없는 성향입니다.",
  },
  {
    id: "NF",
    label: "🌱 NF (INFJ·ENFJ·INFP·ENFP)",
    badge: "의미·마인드셋형",
    desc: "장기 레이스에서 멘탈 관리, 스터디원과의 시너지, 공부 환경 변화 및 슬럼프 극복 루틴이 합격의 열쇠가 되는 성향입니다.",
  },
];

const INITIAL_WIKI_POSTS: WikiPost[] = [
  {
    id: 101,
    mbti_group: "SJ",
    title: "[ISTJ 합격생] 세법·재무회계 연습서 10회독 누적 복습 엑셀 활용법",
    author: "🏅고시반_합격선배",
    content:
      "SJ 성향은 오늘 할 분량이 명확하지 않으면 불안해집니다.\n\n1. 연습서 모든 문제 번호를 엑셀에 적고, 맞은 문제는 O, 헷갈린 논점은 △, 틀린 문제는 X로 표시하세요.\n2. 3회독부터는 O는 과감히 지우고 △와 X만 풉니다.\n3. 이 아카이브 앱의 '단권화 스크랩' 기능으로 X 문제의 강사별 와꾸만 모아 시험 전날까지 무한 반복하면 무조건 합격합니다!",
    likes: 18,
  },
  {
    id: 102,
    mbti_group: "NT",
    title: "[INTJ/INTP 필독] 강사님 말씀이 이해 안 될 때 와꾸 비교로 뚫어내는 법",
    author: "🏅고시반_와꾸장인",
    content:
      "NT 성향은 '그냥 외워'라는 말을 들으면 진도가 안 나갑니다.\n\n예를 들어 세법 의제배당이나 합병 세무조정을 볼 때, 한 강사님의 설명이 납득되지 않으면 즉시 이 앱의 Q&A 탭에서 다른 강사님 와꾸와 비교해 보세요.\n원리(Why)가 한 번 머릿속에 구조화되면, 시험장에서 처음 보는 신유형이 나와도 스스로 와꾸를 조립해서 풀어낼 수 있습니다.",
    likes: 24,
  },
];

export default function GosiApp() {
  const [activeTab, setActiveTab] = useState<"qna" | "wiki" | "study" | "wallet">("qna");
  const [points, setPoints] = useState(1000);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [activeInstructorTab, setActiveInstructorTab] = useState(0);
  const [loading, setLoading] = useState(true);

  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [qnaFilterMode, setQnaFilterMode] = useState<"all" | "my" | "bookmarked">("all");

  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [equippedBadge, setEquippedBadge] = useState<string>("🐣 동차합격 기원");
  const [inventory, setInventory] = useState<string[]>(["🐣 동차합격 기원"]);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authNickname, setAuthNickname] = useState("");
  const [gosibanCode, setGosibanCode] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [isQuestionAnonymous, setIsQuestionAnonymous] = useState(true);
  const [isAnswerAnonymous, setIsAnswerAnonymous] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");

  const [announcement, setAnnouncement] = useState(
    "📢 [공지] 빌드 에러가 수정되었습니다! 상단 및 Q&A 탭의 '단권화 PDF 인쇄 버튼'을 활용해 중요 논점을 모아보세요!"
  );
  const [isNoticeViewOpen, setIsNoticeViewOpen] = useState(false);
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [noticeInput, setNoticeInput] = useState("");

  const [selectedSubject, setSelectedSubject] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const [instructors, setInstructors] = useState<string[]>(DEFAULT_INSTRUCTORS);
  const [books, setBooks] = useState<string[]>(DEFAULT_BOOKS);

  const [newInstructor, setNewInstructor] = useState("");
  const [newAnswerText, setNewAnswerText] = useState("");
  const [selectedAnswerInstructor, setSelectedAnswerInstructor] = useState("이승철 와꾸");
  const [answerImage, setAnswerImage] = useState<string | null>(null);

  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [qLevel, setQLevel] = useState("2차");
  const [qSubject, setQSubject] = useState("세법");
  const [qBook, setQBook] = useState("세법 연습서 (주민규)");
  const [newBookInput, setNewBookInput] = useState("");

  const [qPage, setQPage] = useState("");
  const [isCustomPage, setIsCustomPage] = useState(false);
  const [customPageInput, setCustomPageInput] = useState("");

  const [qTitle, setQTitle] = useState("");
  const [qContent, setQContent] = useState("");
  const [qBounty, setQBounty] = useState(200);
  const [qImage, setQImage] = useState<string | null>(null);

  const [selectedMbtiGroup, setSelectedMbtiGroup] = useState<string>("ALL");
  const [wikiPosts, setWikiPosts] = useState<WikiPost[]>(INITIAL_WIKI_POSTS);
  const [isWikiModalOpen, setIsWikiModalOpen] = useState(false);
  const [wMbtiGroup, setWMbtiGroup] = useState("SJ");
  const [wTitle, setWTitle] = useState("");
  const [wContent, setWContent] = useState("");
  const [isWikiAnonymous, setIsWikiAnonymous] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string, email: string) => {
    if (!supabase) return;
    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setUserProfile(data);
      setPoints(data.points);
      if (data.equipped_badge) setEquippedBadge(data.equipped_badge);
      if (data.inventory) {
        try {
          setInventory(JSON.parse(data.inventory));
        } catch (e) {
          setInventory([data.equipped_badge || "🐣 동차합격 기원"]);
        }
      }
    } else {
      const defaultNick = email.split("@")[0];
      const newProf = {
        id: userId,
        email,
        nickname: defaultNick,
        is_gosiban: false,
        points: 1000,
        equipped_badge: "🐣 동차합격 기원",
        inventory: JSON.stringify(["🐣 동차합격 기원"]),
      };
      await supabase.from("user_profiles").insert([newProf]);
      setUserProfile(newProf);
      setPoints(1000);
    }
  };

  const fetchAllData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

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
      if (formatted.length > 0) {
        setSelectedQuestionId((prev) =>
          prev === null || !formatted.some((q) => q.id === prev) ? formatted[0].id : prev
        );
      } else {
        setSelectedQuestionId(null);
      }
    }

    const { data: noticeData } = await supabase
      .from("announcements")
      .select("*")
      .order("id", { ascending: false })
      .limit(1);
    if (noticeData && noticeData.length > 0) {
      setAnnouncement(noticeData[0].content);
    }

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

    const { data: shopData } = await supabase.from("shop_items").select("*");
    if (shopData && shopData.length > 0) {
      setShopItems(shopData);
    } else {
      setShopItems([
        { id: 1, category: "badge", name: "🔥 세법 마스터", price: 500, description: "열정 마크 칭호", icon: "🔥" },
        { id: 2, category: "badge", name: "💎 와꾸 장인", price: 800, description: "와꾸 고수 칭호", icon: "💎" },
        { id: 3, category: "badge", name: "☕ 아아중독 수험생", price: 300, description: "밤샘 뚝심 칭호", icon: "☕" },
      ]);
    }

    const { data: wikiData, error: wikiError } = await supabase
      .from("wiki_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!wikiError && wikiData) {
      setWikiPosts([...wikiData, ...INITIAL_WIKI_POSTS]);
    }

    setLoading(false);
  };

  useEffect(() => {
    const savedPoints = localStorage.getItem("cpa_points");
    if (savedPoints) setPoints(Number(savedPoints));

    const savedAdmin = localStorage.getItem("cpa_is_admin");
    if (savedAdmin === "true") setIsAdmin(true);

    const savedBookmarks = localStorage.getItem("cpa_bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      } catch (e) {
        setBookmarkedIds([]);
      }
    }

    const savedBadge = localStorage.getItem("cpa_badge");
    if (savedBadge) setEquippedBadge(savedBadge);

    const savedInv = localStorage.getItem("cpa_inv");
    if (savedInv) {
      try {
        setInventory(JSON.parse(savedInv));
      } catch (e) {}
    }

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchUserProfile(session.user.id, session.user.email || "");
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchUserProfile(session.user.id, session.user.email || "");
        } else {
          setUserProfile(null);
        }
      });

      fetchAllData();

      return () => {
        authListener.subscription.unsubscribe();
      };
    } else {
      fetchAllData();
    }
  }, []);

  const toggleBookmark = (qId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const exists = bookmarkedIds.includes(qId);
    const updated = exists
      ? bookmarkedIds.filter((id) => id !== qId)
      : [...bookmarkedIds, qId];
    setBookmarkedIds(updated);
    localStorage.setItem("cpa_bookmarks", JSON.stringify(updated));
  };

  const updatePoints = async (newPt: number) => {
    setPoints(newPt);
    localStorage.setItem("cpa_points", String(newPt));
    if (userProfile && supabase) {
      await supabase
        .from("user_profiles")
        .update({ points: newPt })
        .eq("id", userProfile.id);
      setUserProfile({ ...userProfile, points: newPt });
    }
  };

  const handleEquipBadge = async (badgeName: string) => {
    setEquippedBadge(badgeName);
    localStorage.setItem("cpa_badge", badgeName);
    if (userProfile && supabase) {
      await supabase
        .from("user_profiles")
        .update({ equipped_badge: badgeName })
        .eq("id", userProfile.id);
      setUserProfile({ ...userProfile, equipped_badge: badgeName });
    }
    alert(`✨ [${badgeName}] 칭호가 장착되었습니다!`);
  };

  const handleBuyItem = async (item: ShopItem) => {
    if (points < item.price) {
      alert("포인트가 부족합니다! 열심히 답변하고 논점을 등록해 포인트를 모아보세요.");
      return;
    }
    if (inventory.includes(item.name)) {
      alert("이미 보유하고 있는 아이템입니다!");
      return;
    }

    const nextPoints = points - item.price;
    const nextInv = [...inventory, item.name];

    setInventory(nextInv);
    localStorage.setItem("cpa_inv", JSON.stringify(nextInv));
    await updatePoints(nextPoints);

    if (userProfile && supabase) {
      await supabase
        .from("user_profiles")
        .update({ inventory: JSON.stringify(nextInv) })
        .eq("id", userProfile.id);
    }

    alert(`🎁 [${item.name}] 구매 완료! 지갑 & 상점 탭에서 장착하실 수 있습니다.`);
  };

  const getAuthorDisplayName = (isAnon: boolean) => {
    const badgePrefix = equippedBadge ? `[${equippedBadge}] ` : "";
    if (isAdmin && !isAnon) return `🛡️ 관리자 ${badgePrefix}`;
    if (!userProfile) return isAnon ? `익명 ${badgePrefix}` : `비회원 ${badgePrefix}`;
    if (isAnon) {
      return userProfile.is_gosiban ? `익명(🏅고시반) ${badgePrefix}` : `익명 ${badgePrefix}`;
    }
    return userProfile.is_gosiban
      ? `🏅${userProfile.nickname} ${badgePrefix}`
      : `${userProfile.nickname} ${badgePrefix}`;
  };

  const handleAuthSubmit = async () => {
    if (!supabase) return;
    if (!authEmail.trim() || !authPassword.trim()) {
      alert("이메일과 비밀번호를 모두 입력해 주세요!");
      return;
    }

    setAuthLoading(true);

    if (authMode === "signup") {
      if (!authNickname.trim()) {
        alert("사용하실 닉네임을 입력해 주세요!");
        setAuthLoading(false);
        return;
      }

      const isGosibanMember = gosibanCode.trim().toLowerCase() === "skkucpa";
      const initialPoints = isGosibanMember ? 3000 : 1000;

      const { data, error } = await supabase.auth.signUp({
        email: authEmail.trim(),
        password: authPassword.trim(),
      });

      if (error) {
        alert("회원가입 오류: " + error.message);
        setAuthLoading(false);
        return;
      }

      if (data.user) {
        const newProf: UserProfile = {
          id: data.user.id,
          email: authEmail.trim(),
          nickname: authNickname.trim(),
          is_gosiban: isGosibanMember,
          points: initialPoints,
          equipped_badge: "🐣 동차합격 기원",
          inventory: JSON.stringify(["🐣 동차합격 기원"]),
        };
        await supabase.from("user_profiles").insert([newProf]);
        setUserProfile(newProf);
        setPoints(initialPoints);

        alert(
          isGosibanMember
            ? `🎉 고시반 입실생 인증 완료! 특별 혜택으로 시드머니 3,000P가 지급되었습니다!`
            : `🎉 가입이 완료되었습니다! 기본 시드머니 1,000P가 지급되었습니다.`
        );
        setIsAuthModalOpen(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail.trim(),
        password: authPassword.trim(),
      });

      if (error) {
        alert("로그인 실패: 이메일이나 비밀번호를 확인해 주세요. (" + error.message + ")");
        setAuthLoading(false);
        return;
      }

      if (data.user) {
        await fetchUserProfile(data.user.id, data.user.email || "");
        setIsAuthModalOpen(false);
      }
    }

    setAuthLoading(false);
    setAuthEmail("");
    setAuthPassword("");
    setAuthNickname("");
    setGosibanCode("");
  };

  const handleUserLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUserProfile(null);
    alert("로그아웃 되었습니다.");
  };

  const handleAdminLogin = () => {
    if (adminPasswordInput === "cpa1234") {
      setIsAdmin(true);
      localStorage.setItem("cpa_is_admin", "true");
      setIsLoginModalOpen(false);
      setAdminPasswordInput("");
      alert("🔒 관리자 모드가 활성화되었습니다!");
    } else {
      alert("비밀번호가 틀렸습니다! (기본 비번: cpa1234)");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("cpa_is_admin");
    alert("관리자 모드가 해제되었습니다.");
  };

  const handleSaveAnnouncement = async () => {
    if (!isAdmin || !supabase) return;
    if (!noticeInput.trim()) {
      alert("공지 내용을 입력해 주세요!");
      return;
    }

    await supabase.from("announcements").delete().neq("id", 0);
    const { error } = await supabase
      .from("announcements")
      .insert([{ content: noticeInput.trim() }]);

    if (error) {
      alert("공지 저장 오류: " + error.message);
      return;
    }

    setAnnouncement(noticeInput.trim());
    setIsEditingNotice(false);
    setNoticeInput("");
    alert("📢 상단 공지사항이 업데이트되었습니다!");
  };

  const handleDeleteQuestion = async (qId: number) => {
    if (!isAdmin || !supabase) return;
    if (!confirm("정말 이 질문과 모든 강사별 풀이를 삭제하시겠습니까?")) return;

    const { error } = await supabase.from("questions").delete().eq("id", qId);
    if (error) {
      alert("삭제 중 오류 발생: " + error.message);
      return;
    }

    alert("질문이 삭제되었습니다.");
    await fetchAllData();
  };

  const handleDeleteSolution = async (solId: number) => {
    if (!isAdmin || !supabase) return;
    if (!confirm("이 강사 풀이법을 삭제하시겠습니까?")) return;

    const { error } = await supabase.from("solutions").delete().eq("id", solId);
    if (error) {
      alert("답변 삭제 중 오류 발생: " + error.message);
      return;
    }

    alert("풀이법이 삭제되었습니다.");
    setActiveInstructorTab(0);
    await fetchAllData();
  };

  const selectedQuestion =
    questions.find((q) => q.id === selectedQuestionId) || questions[0];

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

  const availablePagesForBook = Array.from(
    new Set(questions.filter((q) => q.book === qBook).map((q) => q.page))
  );

  const targetPageToCheck = isCustomPage ? customPageInput.trim() : qPage;
  const existingPointsForThisProblem = questions.filter(
    (q) => q.book === qBook && q.page === targetPageToCheck
  );

  const handleCreateQuestion = async () => {
    if (!supabase) return;
    if (!userProfile && !isAdmin) {
      alert("질문을 올리시려면 먼저 로그인을 해주세요! (우측 상단 로그인 버튼)");
      setIsAuthModalOpen(true);
      return;
    }

    const finalPage = isCustomPage ? customPageInput.trim() : qPage;

    if (!finalPage || !qTitle.trim() || !qContent.trim()) {
      alert("문제 번호, 세부 논점 포인트 제목, 내용을 모두 입력해 주세요!");
      return;
    }
    if (points < qBounty) {
      alert("보유 포인트가 부족합니다!");
      return;
    }

    const authorName = getAuthorDisplayName(isQuestionAnonymous);

    const payload: any = {
      level: qLevel,
      subject: qSubject,
      book: qBook,
      page: finalPage,
      title: qTitle.trim(),
      content: qContent,
      image_url: qImage || null,
      bounty: qBounty,
      author: authorName,
      author_id: userProfile ? userProfile.id : null,
    };

    let { data, error } = await supabase
      .from("questions")
      .insert([payload])
      .select()
      .single();

    if (error && error.message.includes("author_id")) {
      delete payload.author_id;
      const retry = await supabase.from("questions").insert([payload]).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      alert("질문 저장 중 오류 발생: " + error.message);
      return;
    }

    await updatePoints(points - qBounty);
    setIsAskModalOpen(false);
    setQPage("");
    setCustomPageInput("");
    setIsCustomPage(false);
    setQTitle("");
    setQContent("");
    setQImage(null);

    await fetchAllData();
    if (data) setSelectedQuestionId(data.id);
    alert(`해당 문제의 새로운 논점 포인트가 등록되었습니다! (현상금 ${qBounty}P 차감)`);
  };

  const handleAddSolution = async () => {
    if (!supabase || !selectedQuestion) return;
    if (!userProfile && !isAdmin) {
      alert("풀이법을 등록하고 포인트를 받으시려면 먼저 로그인을 해주세요!");
      setIsAuthModalOpen(true);
      return;
    }

    if (!newAnswerText.trim()) {
      alert("풀이 내용을 입력해 주세요!");
      return;
    }

    const authorName = getAuthorDisplayName(isAnswerAnonymous);
    const rewardPoints = answerImage ? 100 : 50;

    const payload: any = {
      question_id: selectedQuestion.id,
      instructor: selectedAnswerInstructor,
      author: authorName,
      author_id: userProfile ? userProfile.id : null,
      content: newAnswerText,
      image_url: answerImage || null,
      likes: 0,
      is_accepted: false,
    };

    let { error } = await supabase.from("solutions").insert([payload]);

    if (error && error.message.includes("author_id")) {
      delete payload.author_id;
      const retry = await supabase.from("solutions").insert([payload]);
      error = retry.error;
    }

    if (error) {
      alert("답변 저장 중 오류 발생: " + error.message);
      return;
    }

    const nextTabIdx = selectedQuestion.solutions.length;
    setNewAnswerText("");
    setAnswerImage(null);
    await updatePoints(points + rewardPoints);

    await fetchAllData();
    setActiveInstructorTab(nextTabIdx);
    alert(
      answerImage
        ? `📸 손글씨/사진 첨부 보너스 적용! 풀이법이 등록되어 +100P가 적립되었습니다!`
        : `새로운 강사 풀이법이 등록되어 +50P가 적립되었습니다!`
    );
  };

  const handleLikeSolution = async (sol: Solution) => {
    if (!supabase) return;
    await supabase
      .from("solutions")
      .update({ likes: sol.likes + 1 })
      .eq("id", sol.id);
    await fetchAllData();
  };

  const handleAcceptSolution = async (sol: Solution) => {
    if (!supabase || !selectedQuestion) return;

    if (selectedQuestion.solutions.some((s) => s.is_accepted)) {
      alert("이 질문에는 이미 채택된 풀이가 있습니다!");
      return;
    }

    const isOwner =
      userProfile &&
      selectedQuestion.author_id &&
      selectedQuestion.author_id === userProfile.id;
    const isLegacyAllowed = !selectedQuestion.author_id && (userProfile || isAdmin);

    if (!isOwner && !isAdmin && !isLegacyAllowed) {
      alert("질문을 등록한 작성자 본인(또는 관리자)만 풀이를 채택할 수 있습니다!");
      return;
    }

    const { error } = await supabase
      .from("solutions")
      .update({ is_accepted: true })
      .eq("id", sol.id);

    if (error) {
      alert("채택 처리 중 오류 발생: " + error.message);
      return;
    }

    const bountyAmount = selectedQuestion.bounty || 0;
    if (sol.author_id) {
      const { data: receiverProfile } = await supabase
        .from("user_profiles")
        .select("points, nickname")
        .eq("id", sol.author_id)
        .single();

      if (receiverProfile) {
        const updatedReceiverPoints = (receiverProfile.points || 0) + bountyAmount;
        await supabase
          .from("user_profiles")
          .update({ points: updatedReceiverPoints })
          .eq("id", sol.author_id);

        if (userProfile && userProfile.id === sol.author_id) {
          setPoints(updatedReceiverPoints);
          setUserProfile({ ...userProfile, points: updatedReceiverPoints });
          localStorage.setItem("cpa_points", String(updatedReceiverPoints));
        }
      }
    }

    await fetchAllData();
    alert(
      `🏆 풀이가 채택되었습니다! 답변자님의 지갑으로 현상금 ${bountyAmount}P가 즉시 지급되었습니다!`
    );
  };

  const handleCreateWikiPost = async () => {
    if (!wTitle.trim() || !wContent.trim()) {
      alert("전략 제목과 상세 내용을 모두 입력해 주세요!");
      return;
    }
    if (!userProfile && !isAdmin) {
      alert("전략 글을 작성하시려면 먼저 로그인을 해주세요!");
      setIsAuthModalOpen(true);
      return;
    }

    const authorName = getAuthorDisplayName(isWikiAnonymous);
    const newPostObj = {
      mbti_group: wMbtiGroup,
      title: wTitle.trim(),
      author: authorName,
      content: wContent.trim(),
      likes: 0,
    };

    if (supabase) {
      const { data, error } = await supabase
        .from("wiki_posts")
        .insert([newPostObj])
        .select()
        .single();

      if (!error && data) {
        setWikiPosts([data, ...wikiPosts]);
      } else {
        setWikiPosts([{ ...newPostObj, id: Date.now() }, ...wikiPosts]);
      }
    } else {
      setWikiPosts([{ ...newPostObj, id: Date.now() }, ...wikiPosts]);
    }

    await updatePoints(points + 50);
    setIsWikiModalOpen(false);
    setWTitle("");
    setWContent("");
    alert("🧭 나만의 MBTI 수험 전략이 등록되어 +50P가 적립되었습니다!");
  };

  const handleLikeWikiPost = async (post: WikiPost) => {
    const updatedLikes = post.likes + 1;
    setWikiPosts(
      wikiPosts.map((p) => (p.id === post.id ? { ...p, likes: updatedLikes } : p))
    );
    if (supabase && post.id < 100000) {
      await supabase.from("wiki_posts").update({ likes: updatedLikes }).eq("id", post.id);
    }
  };

  const handlePrintPdfSummary = () => {
    window.print();
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSubject = selectedSubject === "전체" || q.subject === selectedSubject;
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.page.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.content.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesMode = true;
    if (qnaFilterMode === "my") {
      matchesMode = Boolean(
        userProfile &&
          (q.author_id === userProfile.id || q.author.includes(userProfile.nickname))
      );
    } else if (qnaFilterMode === "bookmarked") {
      matchesMode = bookmarkedIds.includes(q.id);
    }

    return matchesSubject && matchesSearch && matchesMode;
  });

  const canUserAcceptSelectedQuestion = Boolean(
    selectedQuestion &&
      !selectedQuestion.solutions.some((s) => s.is_accepted) &&
      (isAdmin ||
        (userProfile &&
          selectedQuestion.author_id &&
          selectedQuestion.author_id === userProfile.id) ||
        (!selectedQuestion.author_id && userProfile))
  );

  const filteredWikiPosts =
    selectedMbtiGroup === "ALL"
      ? wikiPosts
      : wikiPosts.filter((p) => p.mbti_group === selectedMbtiGroup);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-slate-900 text-white px-4 md:px-6 py-3.5 flex flex-wrap justify-between items-center sticky top-0 z-20 shadow-md gap-2">
        <div className="flex items-center gap-2.5">
          <span className="bg-emerald-400 text-slate-900 font-extrabold px-2 py-0.5 rounded text-xs">
            DB 연동됨
          </span>
          <h1 className="text-base md:text-xl font-bold tracking-tight">
            CPA 고시반 지식 아카이브
          </h1>
          {isAdmin && (
            <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">
              🛡️ 관리자 모드
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrintPdfSummary}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3 py-2 rounded-full shadow transition flex items-center gap-1"
          >
            <span>🖨️ 단권화 PDF 인쇄</span>
          </button>

          {userProfile ? (
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-xs">
              <span className="font-bold text-emerald-300">
                {equippedBadge} {userProfile.nickname}님
              </span>
              <button
                onClick={handleUserLogout}
                className="text-slate-400 hover:text-white underline ml-1"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode("login");
                setIsAuthModalOpen(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-full transition shadow"
            >
              🔑 로그인 / 가입
            </button>
          )}

          <button
            onClick={() => setIsAskModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow transition"
          >
            ✍️ 새 논점 질문
          </button>

          <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-xs md:text-sm flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">💰</span>
            <span className="font-mono font-bold text-white">{points.toLocaleString()} P</span>
          </div>

          {!isAdmin ? (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px] px-2.5 py-1.5 rounded-full border border-slate-700 transition"
            >
              🔒 관리자
            </button>
          ) : (
            <button
              onClick={handleAdminLogout}
              className="bg-red-900/50 hover:bg-red-900 text-red-200 text-[11px] px-2.5 py-1.5 rounded-full border border-red-700 transition"
            >
              🔓 관리자해제
            </button>
          )}
        </div>
      </header>

      <div
        onClick={() => setIsNoticeViewOpen(true)}
        className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 md:px-6 py-2.5 font-bold text-xs md:text-sm flex justify-between items-center shadow-inner cursor-pointer transition"
      >
        <div className="flex items-center gap-2 overflow-hidden pr-2">
          <span className="bg-slate-900 text-amber-400 px-2 py-0.5 rounded text-xs shrink-0">
            관리자 공지
          </span>
          <span className="truncate">{announcement}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] bg-amber-600/30 text-slate-900 px-2 py-0.5 rounded font-semibold">
            🔍 전체보기
          </span>
          {isAdmin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNoticeInput(announcement);
                setIsEditingNotice(true);
              }}
              className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded hover:bg-slate-800"
            >
              ✏️ 수정
            </button>
          )}
        </div>
      </div>

      <nav className="bg-white border-b border-slate-200 px-6 flex gap-2 overflow-x-auto">
        {[
          { id: "qna", label: "📚 학업 Q&A (단권화 PDF 인쇄 지원)" },
          { id: "wiki", label: "🧭 수험 전략 위키 (MBTI 성향별)" },
          { id: "study", label: "🔥 원터치 스터디" },
          { id: "wallet", label: "💳 지갑 & 상점 (칭호/이모티콘)" },
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

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-semibold">
            ☁️ 데이터를 불러오는 중...
          </div>
        ) : activeTab === "qna" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-slate-800">문제별 논점 포인트 아카이브</h2>
                  <button
                    onClick={() => setIsAskModalOpen(true)}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    + 논점 질문 등록
                  </button>
                </div>

                <button
                  onClick={handlePrintPdfSummary}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
                >
                  <span className="text-base">🖨️</span>
                  <span>⭐ 스크랩한 논점 모아 단권화 PDF 인쇄하기</span>
                </button>

                <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-bold">
                  <button
                    onClick={() => setQnaFilterMode("all")}
                    className={`flex-1 py-1.5 rounded-md transition ${
                      qnaFilterMode === "all"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    전체 ({questions.length})
                  </button>
                  <button
                    onClick={() => setQnaFilterMode("my")}
                    className={`flex-1 py-1.5 rounded-md transition ${
                      qnaFilterMode === "my"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    내 질문
                  </button>
                  <button
                    onClick={() => setQnaFilterMode("bookmarked")}
                    className={`flex-1 py-1.5 rounded-md transition ${
                      qnaFilterMode === "bookmarked"
                        ? "bg-white text-amber-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    ⭐ 스크랩 ({bookmarkedIds.length})
                  </button>
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 문제번호, 논점 포인트, 키워드 검색..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />

                <div className="flex gap-1.5 flex-wrap">
                  {[
                    "전체",
                    "세법",
                    "재무회계",
                    "원가관리",
                    "재무관리",
                    "회계감사",
                    "경제학",
                    "상법",
                  ].map((subj) => (
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
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredQuestions.length === 0 ? (
                  <div className="bg-white border rounded-xl p-8 text-center text-sm text-slate-400">
                    조건에 맞는 논점 질문이 없습니다. 별표(⭐)를 눌러 스크랩해 보세요!
                  </div>
                ) : (
                  filteredQuestions.map((q) => {
                    const isBookmarked = bookmarkedIds.includes(q.id);
                    const hasAccepted = q.solutions?.some((s) => s.is_accepted);
                    return (
                      <div
                        key={q.id}
                        onClick={() => {
                          setSelectedQuestionId(q.id);
                          setActiveInstructorTab(0);
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
                          selectedQuestion?.id === q.id
                            ? "bg-blue-50/60 border-blue-500 shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="flex gap-1.5 flex-wrap">
                            <span className="bg-slate-900 text-amber-300 text-xs px-2 py-0.5 rounded font-extrabold">
                              📌 {q.page}
                            </span>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-semibold">
                              {q.subject}
                            </span>
                            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-medium">
                              {q.book}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {hasAccepted ? (
                              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                ✅ 채택완료
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                                {q.bounty}P
                              </span>
                            )}
                            <button
                              onClick={(e) => toggleBookmark(q.id, e)}
                              title="단권화 스크랩에 담기"
                              className={`text-sm px-1.5 py-0.5 rounded transition ${
                                isBookmarked
                                  ? "text-amber-500 scale-110"
                                  : "text-slate-300 hover:text-amber-400"
                              }`}
                            >
                              {isBookmarked ? "⭐" : "☆"}
                            </button>
                          </div>
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm mb-1">
                          🎯 포인트: {q.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{q.content}</p>

                        <div className="mt-3 flex justify-between items-center text-xs text-slate-400">
                          <span>작성자: {q.author}</span>
                          <div className="flex items-center gap-2">
                            {isAdmin && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteQuestion(q.id);
                                }}
                                className="bg-red-100 text-red-600 hover:bg-red-200 font-bold px-2 py-1 rounded text-[11px]"
                              >
                                🗑️ 삭제
                              </button>
                            )}
                            <span className="text-blue-600 font-semibold">
                              풀이 {q.solutions?.length || 0}개 ➔
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {selectedQuestion ? (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3 gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-slate-900 text-amber-300 text-xs px-2.5 py-1 rounded font-extrabold">
                        📌 대표 문제: {selectedQuestion.page}
                      </span>
                      <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded font-bold">
                        {selectedQuestion.subject}
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {selectedQuestion.book}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(selectedQuestion.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-full border transition ${
                          bookmarkedIds.includes(selectedQuestion.id)
                            ? "bg-amber-50 border-amber-400 text-amber-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {bookmarkedIds.includes(selectedQuestion.id)
                          ? "⭐ 단권화 스크랩됨"
                          : "☆ 단권화 담기"}
                      </button>
                      <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full">
                        현상금 {selectedQuestion.bounty}P
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteQuestion(selectedQuestion.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-full transition"
                        >
                          🗑️ 질문 삭제
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                        수험 논점 포인트
                      </span>
                      <span className="text-xs text-slate-500">
                        작성자: {selectedQuestion.author}
                      </span>
                    </div>
                    <h2 className="text-base font-extrabold text-slate-900 mt-0.5 mb-2">
                      🎯 {selectedQuestion.title}
                    </h2>
                    <p className="text-sm text-slate-700 whitespace-pre-line">
                      {selectedQuestion.content}
                    </p>
                  </div>

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

                  <div className="border-t border-slate-200 pt-5">
                    <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                      <h3 className="text-sm font-bold text-slate-800">
                        🔄 해당 논점에 대한 강사별 풀이 방식(와꾸) 비교
                      </h3>
                      <span className="text-xs text-slate-500">
                        {canUserAcceptSelectedQuestion
                          ? "💡 내 질문입니다! 가장 도움된 풀이를 [🏆 채택하기] 눌러 현상금을 전달하세요."
                          : `총 ${selectedQuestion.solutions.length}개의 풀이`}
                      </span>
                    </div>

                    {selectedQuestion.solutions.length === 0 ? (
                      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center text-sm text-slate-500">
                        아직 등록된 강사별 풀이가 없습니다. 첫 번째 풀이를 등록해 보세요!
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
                            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
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

                                {selectedQuestion.solutions[activeInstructorTab].is_accepted ? (
                                  <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full font-extrabold">
                                    🏆 질문자 채택 완료 ({selectedQuestion.bounty}P 지급됨)
                                  </span>
                                ) : (
                                  canUserAcceptSelectedQuestion && (
                                    <button
                                      onClick={() =>
                                        handleAcceptSolution(
                                          selectedQuestion.solutions[activeInstructorTab]
                                        )
                                      }
                                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full font-bold transition shadow"
                                    >
                                      🏆 채택하기 ({selectedQuestion.bounty}P 지급)
                                    </button>
                                  )
                                )}

                                {isAdmin && (
                                  <button
                                    onClick={() =>
                                      handleDeleteSolution(
                                        selectedQuestion.solutions[activeInstructorTab].id
                                      )
                                    }
                                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-full font-bold transition"
                                  >
                                    🗑️ 답변 삭제
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

                  <div className="mt-6 border-t border-slate-200 pt-5">
                    <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                      <h4 className="text-sm font-bold text-slate-800">
                        ➕ 이 논점 포인트에 다른 강사님 와꾸 보태기
                      </h4>
                      <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        텍스트 +50P / 📸 사진 첨부 시 +100P!
                      </span>
                    </div>

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
                      placeholder="이 논점에 대한 강사별 와꾸 접근법이나 풀이 팁을 공유해 주세요!"
                      className="w-full border border-slate-300 rounded-lg p-3 text-sm mb-2"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 transition">
                          📷 손글씨 / 풀이 사진 첨부 (+100P)
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
                              ✅ 사진 첨부됨 (+100P)
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

                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isAnswerAnonymous}
                          onChange={(e) => setIsAnswerAnonymous(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>🕵️ 익명으로 등록 ({getAuthorDisplayName(isAnswerAnonymous)})</span>
                      </label>
                    </div>

                    <button
                      onClick={handleAddSolution}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition"
                    >
                      이 논점 포인트에 새로운 풀이법 등록하기 ({answerImage ? "+100P" : "+50P"})
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-12 rounded-xl border text-center text-slate-400">
                  왼쪽 목록에서 논점 질문을 선택해 주세요.
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "wiki" ? (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    MBTI 맞춤형 수험 전략 아카이브
                  </span>
                  <h2 className="text-lg md:text-xl font-extrabold text-slate-900 mt-2">
                    🧭 내 성향(MBTI)에 딱 맞는 CPA 합격 전략 위키
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    남들의 공부법을 무작정 따라 하기보다, 내 기질에 맞는 회독법과 멘탈 관리 전략을 선택해 보세요!
                  </p>
                </div>
                <button
                  onClick={() => setIsWikiModalOpen(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs md:text-sm px-4 py-2.5 rounded-xl shadow shrink-0 transition"
                >
                  ✍️ 나만의 MBTI 전략 공유하기 (+50P)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mt-4">
                {MBTI_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedMbtiGroup(cat.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedMbtiGroup === cat.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-xs">{cat.label}</span>
                    </div>
                    <span
                      className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                        selectedMbtiGroup === cat.id
                          ? "bg-blue-800 text-amber-300"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-4 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl text-xs text-amber-900 font-medium">
                💡{" "}
                <b>
                  {MBTI_CATEGORIES.find((c) => c.id === selectedMbtiGroup)?.label} 특징:
                </b>{" "}
                {MBTI_CATEGORIES.find((c) => c.id === selectedMbtiGroup)?.desc}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWikiPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex justify-between items-center gap-2 mb-2">
                      <span className="bg-slate-900 text-amber-300 text-xs font-extrabold px-2.5 py-1 rounded">
                        {post.mbti_group} 성향 추천 전략
                      </span>
                      <span className="text-xs text-slate-400">작성자: {post.author}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base mb-2">
                      {post.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                      {post.content}
                    </p>
                  </div>
                  <div className="flex justify-end items-center pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleLikeWikiPost(post)}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-full border border-blue-200 transition"
                    >
                      👍 유용해요 {post.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === "wallet" ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-lg font-extrabold text-slate-900">
                  💳 내 포인트 지갑 & 프로필 상점
                </h2>
                <div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full text-sm font-extrabold font-mono">
                  💰 {points.toLocaleString()} P
                </div>
              </div>

              <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-400">내 닉네임 및 장착 칭호</p>
                    <p className="text-base font-bold mt-1 text-amber-300">
                      {userProfile ? `${equippedBadge} ${userProfile.nickname}님` : `${equippedBadge} 비회원님`}
                    </p>
                  </div>
                  <span className="bg-emerald-400 text-slate-950 text-xs px-2.5 py-1 rounded font-extrabold">
                    장착 중인 칭호
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1.5">보유 중인 칭호 목록 (선택하여 장착)</p>
                  <div className="flex gap-2 flex-wrap">
                    {inventory.map((badgeName) => (
                      <button
                        key={badgeName}
                        onClick={() => handleEquipBadge(badgeName)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                          equippedBadge === badgeName
                            ? "bg-amber-400 text-slate-950 ring-2 ring-white"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {equippedBadge === badgeName ? `✅ ${badgeName}` : badgeName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    🛍️ 수험생 칭호 및 이모티콘 상점
                  </h3>
                  <span className="text-xs text-slate-500">
                    포인트를 모아 특별한 칭호를 구매해 보세요!
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {shopItems.map((item) => {
                    const isOwned = inventory.includes(item.name);
                    return (
                      <div
                        key={item.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl p-2 bg-white rounded-lg border shadow-sm">
                            {item.icon}
                          </span>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">
                              {item.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                          <span className="font-mono font-bold text-amber-600 text-xs">
                            {item.price} P
                          </span>
                          {isOwned ? (
                            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                              보유 중
                            </span>
                          ) : (
                            <button
                              onClick={() => handleBuyItem(item)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                            >
                              구매하기
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-extrabold text-amber-900 text-xs">
                    🖨️ 나만의 단권화 요약집 PDF 인쇄
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    학업 Q&A 탭에서 스크랩(⭐)한 중요 논점들을 모아 즉시 인쇄/PDF로 저장하세요.
                  </p>
                </div>
                <button
                  onClick={handlePrintPdfSummary}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3.5 py-2 rounded-lg text-xs shrink-0 shadow-sm transition"
                >
                  PDF 인쇄하기
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl border text-center text-slate-500">
            해당 탭 기능은 순차적으로 오픈될 예정입니다!
          </div>
        )}
      </main>

      {/* ⭐ 단권화 PDF 인쇄 시 전용으로 깔끔하게 출력되는 인쇄 영역 */}
      <div className="hidden print:block print:p-8 print:bg-white print:text-slate-900">
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-2xl font-black">CPA 고시반 단권화 논점 요약집</h1>
          <p className="text-xs text-slate-600 mt-1">
            CPA 고시반 지식 아카이브 | 스크랩된 중요 논점 모음
          </p>
        </div>

        <div className="space-y-6">
          {questions
            .filter((q) => bookmarkedIds.includes(q.id))
            .map((q, idx) => (
              <div key={q.id} className="border-b border-slate-300 pb-5 space-y-2">
                <div className="flex justify-between font-bold text-xs text-slate-700">
                  <span>
                    [{idx + 1}] {q.subject} | {q.book} ({q.page})
                  </span>
                  <span>현상금: {q.bounty}P</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  🎯 포인트: {q.title}
                </h3>
                <p className="text-sm text-slate-800 whitespace-pre-line">{q.content}</p>

                {q.solutions && q.solutions.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-slate-400 space-y-2">
                    <p className="text-xs font-bold text-slate-600">💡 강사별 채택/주요 와꾸 풀이:</p>
                    {q.solutions.map((sol) => (
                      <div key={sol.id} className="text-xs text-slate-800 space-y-1">
                        <p className="font-bold">
                          👨‍🏫 {sol.instructor} ({sol.author}) {sol.is_accepted ? "🏆[채택됨]" : ""}
                        </p>
                        <p className="whitespace-pre-line text-slate-700">{sol.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          {bookmarkedIds.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-10">
              스크랩(⭐)된 질문이 없습니다. Q&A 아카이브에서 별표를 눌러 단권화에 담아보세요!
            </p>
          )}
        </div>
      </div>

      {isNoticeViewOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-amber-400 px-2.5 py-1 rounded text-xs font-extrabold">
                  관리자 공지
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">전체 공지사항 안내</h3>
              </div>
              <button
                onClick={() => setIsNoticeViewOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-sm text-slate-800 whitespace-pre-line leading-relaxed font-medium">
              {announcement}
            </div>

            <div className="flex gap-2">
              {isAdmin && (
                <button
                  onClick={() => {
                    setIsNoticeViewOpen(false);
                    setNoticeInput(announcement);
                    setIsEditingNotice(true);
                  }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 rounded-lg text-xs"
                >
                  ✏️ 내용 수정하기
                </button>
              )}
              <button
                onClick={() => setIsNoticeViewOpen(false)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs"
              >
                확인 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {isWikiModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                🧭 MBTI 성향별 수험 전략 공유하기 (+50P)
              </h3>
              <button
                onClick={() => setIsWikiModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                추천 대상 MBTI 기질 선택
              </label>
              <select
                value={wMbtiGroup}
                onChange={(e) => setWMbtiGroup(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold"
              >
                <option value="SJ">📊 SJ (ISTJ·ESTJ·ISFJ·ESFJ) - 규율·계획형</option>
                <option value="SP">⚡ SP (ISTP·ESTP·ISFP·ESFP) - 실전·유연형</option>
                <option value="NT">🔬 NT (INTJ·ENTJ·INTP·ENTP) - 논리·와꾸분석형</option>
                <option value="NF">🌱 NF (INFJ·ENFJ·INFP·ENFP) - 의미·마인드셋형</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">전략 제목</label>
              <input
                type="text"
                value={wTitle}
                onChange={(e) => setWTitle(e.target.value)}
                placeholder="핵심 전략 제목을 입력해 주세요"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">상세 공부법</label>
              <textarea
                rows={5}
                value={wContent}
                onChange={(e) => setWContent(e.target.value)}
                placeholder="회독 팁, 시간 관리, 멘탈 관리법을 적어주세요!"
                className="w-full border border-slate-300 rounded-lg p-3 text-sm"
              />
            </div>

            <div className="flex justify-end">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWikiAnonymous}
                  onChange={(e) => setIsWikiAnonymous(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>🕵️ 익명으로 공유 ({getAuthorDisplayName(isWikiAnonymous)})</span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsWikiModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-lg text-sm"
              >
                취소
              </button>
              <button
                onClick={handleCreateWikiPost}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm"
              >
                전략 등록하고 +50P 받기
              </button>
            </div>
          </div>
        </div>
      )}

      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {authMode === "login" ? "🔑 CPA 아카이브 로그인" : "🎉 수험생 회원가입"}
              </h3>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
                  authMode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                로그인
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
                  authMode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                초간편 회원가입
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">이메일 주소</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="예: skku@g.skku.edu"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">비밀번호</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {authMode === "signup" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">활동 닉네임</label>
                    <input
                      type="text"
                      value={authNickname}
                      onChange={(e) => setAuthNickname(e.target.value)}
                      placeholder="예: 26동차합격"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-1.5">
                    <label className="block text-xs font-extrabold text-amber-900">
                      🏅 고시반 입실생 전용 인증 코드 (선택)
                    </label>
                    <input
                      type="text"
                      value={gosibanCode}
                      onChange={(e) => setGosibanCode(e.target.value)}
                      placeholder="입실생 코드 입력 (힌트: skkucpa)"
                      className="w-full border border-amber-300 rounded-lg px-3 py-1.5 text-xs bg-white"
                    />
                    <p className="text-[11px] text-amber-800">
                      * 인증 코드(<b>skkucpa</b>) 입력 시 <b>3,000P 시드머니</b> 즉시 지급!
                    </p>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleAuthSubmit}
              disabled={authLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-2.5 rounded-lg text-sm transition"
            >
              {authLoading ? "처리 중..." : authMode === "login" ? "로그인하기" : "가입하고 시드머니 받기"}
            </button>
          </div>
        </div>
      )}

      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900">🔒 관리자 인증</h3>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-slate-400 font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600">
              비밀번호: <code className="bg-slate-100 font-bold text-blue-600">cpa1234</code>
            </p>
            <input
              type="password"
              value={adminPasswordInput}
              onChange={(e) => setAdminPasswordInput(e.target.value)}
              placeholder="관리자 비밀번호 입력"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdminLogin();
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleAdminLogin}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg"
              >
                관리자 모드 접속
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingNotice && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900">📢 상단 공지사항 수정</h3>
              <button
                onClick={() => setIsEditingNotice(false)}
                className="text-slate-400 font-bold"
              >
                ✕
              </button>
            </div>
            <textarea
              rows={4}
              value={noticeInput}
              onChange={(e) => setNoticeInput(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditingNotice(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleSaveAnnouncement}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold py-2 rounded-lg"
              >
                공지 업로드
              </button>
            </div>
          </div>
        </div>
      )}

      {isAskModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">✍️ 새 논점 포인트 질문 올리기</h3>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">교재 선택</label>
              <select
                value={qBook}
                onChange={(e) => {
                  setQBook(e.target.value);
                  setQPage("");
                  setIsCustomPage(false);
                }}
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
                  placeholder="목록에 없는 교재명 직접 입력"
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
                  📌 대표 문제 (페이지 및 번호)
                </label>
                {!isCustomPage ? (
                  <div className="flex gap-1.5">
                    <select
                      value={qPage}
                      onChange={(e) => {
                        if (e.target.value === "__custom__") {
                          setIsCustomPage(true);
                          setQPage("");
                        } else {
                          setQPage(e.target.value);
                        }
                      }}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 bg-white"
                    >
                      <option value="">-- 기존 문제 선택 --</option>
                      {availablePagesForBook.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                      <option value="__custom__">➕새로운 문제 직접 입력...</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={customPageInput}
                      onChange={(e) => setCustomPageInput(e.target.value)}
                      placeholder="예: p.214 문제 3번"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900"
                    />
                    <button
                      onClick={() => {
                        setIsCustomPage(false);
                        setCustomPageInput("");
                      }}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-2.5 rounded-lg font-bold shrink-0"
                    >
                      선택하기
                    </button>
                  </div>
                )}
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

            {targetPageToCheck && existingPointsForThisProblem.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800">
                  <span>💡 [자동완성 안내]</span>
                  <span>이 문제에 이미 아래와 같은 논점들이 논의되어 있습니다!</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {existingPointsForThisProblem.map((ep) => (
                    <span
                      key={ep.id}
                      className="bg-white border border-amber-300 text-amber-900 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      🎯 {ep.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                🎯 세부 수험 논점 포인트 (예: 유보 추인 타이밍 관련)
              </label>
              <input
                type="text"
                value={qTitle}
                onChange={(e) => setQTitle(e.target.value)}
                placeholder="이 문제 안에서 헷갈리는 구체적인 논점을 적어주세요"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">질문 상세 내용</label>
              <textarea
                rows={4}
                value={qContent}
                onChange={(e) => setQContent(e.target.value)}
                placeholder="내가 막힌 부분이나 비교하고 싶은 구체적인 접근법을 적어주세요."
                className="w-full border border-slate-300 rounded-lg p-3 text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="cursor-pointer inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg border border-slate-300">
                📸 문제 사진 / 필기 캡처 올리기
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setQImage)}
                  className="hidden"
                />
              </label>

              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isQuestionAnonymous}
                  onChange={(e) => setIsQuestionAnonymous(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>🕵️ 익명으로 질문 ({getAuthorDisplayName(isQuestionAnonymous)})</span>
              </label>
            </div>

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
                {qBounty}P 걸고 논점 질문 등록
              </button>
            </div>
          </div>
        </div>
      )}

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
