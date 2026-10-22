"use client";

import React, { useEffect, useState, useRef } from "react";
import { SiteContent, ProjectItem, AchievementItem } from "@/lib/content/types";
import {
  Save,
  CheckCircle2,
  RefreshCw,
  Layers,
  User,
  Briefcase,
  Award,
  Shield,
  KeyRound,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  X,
  AlertTriangle,
} from "lucide-react";

export default function AdminPage() {
  // Authentication states
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    tableReady: boolean;
    error?: string;
  } | null>(null);
  const [loginEmail, setLoginEmail] = useState("reddixrobotics@gmail.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Content states
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<"projects" | "achievements" | "hero" | "about" | "career">("projects");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Modals & form states
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Partial<ProjectItem>>({
    title: "",
    category: "Autonomous Navigation / AMR",
    year: "2026",
    description: "",
    technologies: ["ROS 2", "SLAM", "LiDAR"],
    metrics: "±2cm accuracy",
    image: "/images/projects/autonomous-navigation-robot.png",
    githubUrl: "",
    liveUrl: "",
  });
  const [projectTagInput, setProjectTagInput] = useState("ROS 2, SLAM, LiDAR");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Achievement form state
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);
  const [newAchievement, setNewAchievement] = useState<Partial<AchievementItem>>({
    title: "",
    issuer: "REDDIX ROBOTICS",
    date: "2026",
    description: "",
    metric: "1st Place",
  });

  // Check auth status on mount
  useEffect(() => {
    fetch("/api/auth", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setIsSupabaseConnected(Boolean(data.isSupabaseConnected));
        if (data.supabaseStatus) {
          setSupabaseStatus(data.supabaseStatus);
        }
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadContent();
        }
      })
      .catch((err) => console.error("Auth check failed", err))
      .finally(() => setAuthLoading(false));
  }, []);

  const loadContent = () => {
    fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Content load failed", err));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        loadContent();
      } else {
        setLoginError(data.error || "Authentication failed. Invalid email or password.");
      }
    } catch {
      setLoginError("Network connection error. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setContent(null);
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  const handleSave = async (updatedContent?: SiteContent): Promise<boolean> => {
    const payload = updatedContent || content;
    if (!payload) return false;

    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage("");

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setContent(payload);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
        return true;
      } else {
        const errorText = data.error || "Failed to save updates.";
        setErrorMessage(errorText);
        alert(`Save Failed:\n\n${errorText}`);
        return false;
      }
    } catch (e: any) {
      const errorText = e?.message || "Network error while saving.";
      setErrorMessage(errorText);
      alert(`Save Network Error:\n\n${errorText}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Image Upload Handler ───
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNewProject((prev) => ({ ...prev, image: data.url }));
      } else {
        alert("Upload error: " + (data.error || "Could not upload image"));
      }
    } catch {
      alert("Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // ─── Project Add / Update ───
  const handleSaveProjectForm = () => {
    if (!content) return;
    if (!newProject.title?.trim()) {
      alert("Project title is required.");
      return;
    }

    const techArray = projectTagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const projectData: ProjectItem = {
      id: editingProjectId || `proj-${Date.now()}`,
      title: newProject.title || "Untitled Project",
      category: newProject.category || "Robotics",
      year: newProject.year || "2026",
      description: newProject.description || "",
      technologies: techArray.length > 0 ? techArray : ["Robotics", "ROS 2"],
      metrics: newProject.metrics || "",
      image: newProject.image || "/images/projects/autonomous-navigation-robot.png",
      githubUrl: newProject.githubUrl || "",
      liveUrl: newProject.liveUrl || "",
    };

    let updatedProjects: ProjectItem[];
    if (editingProjectId) {
      updatedProjects = content.projects.map((p) => (p.id === editingProjectId ? projectData : p));
    } else {
      updatedProjects = [projectData, ...content.projects];
    }

    const updatedContent = { ...content, projects: updatedProjects };
    setContent(updatedContent);
    handleSave(updatedContent);

    // Reset Form
    setIsAddingProject(false);
    setEditingProjectId(null);
    setNewProject({
      title: "",
      category: "Autonomous Navigation / AMR",
      year: "2026",
      description: "",
      technologies: ["ROS 2", "SLAM", "LiDAR"],
      metrics: "±2cm accuracy",
      image: "/images/projects/autonomous-navigation-robot.png",
      githubUrl: "",
      liveUrl: "",
    });
    setProjectTagInput("ROS 2, SLAM, LiDAR");
  };

  const handleEditProject = (proj: ProjectItem) => {
    setEditingProjectId(proj.id);
    setNewProject(proj);
    setProjectTagInput(proj.technologies ? proj.technologies.join(", ") : "");
    setIsAddingProject(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!content) return;
    if (!confirm("Are you sure you want to delete this project?")) return;

    const previousProjects = content.projects;
    const updatedProjects = content.projects.filter((p) => p.id !== id);
    const updatedContent = { ...content, projects: updatedProjects };
    setContent(updatedContent);

    const saved = await handleSave(updatedContent);
    if (!saved) {
      // Revert if saving failed
      setContent({ ...content, projects: previousProjects });
    }
  };

  const handleMoveProject = (idx: number, direction: "up" | "down") => {
    if (!content) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= content.projects.length) return;

    const updated = [...content.projects];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    const updatedContent = { ...content, projects: updated };
    setContent(updatedContent);
    handleSave(updatedContent);
  };

  // ─── Achievement Add / Update ───
  const handleSaveAchievementForm = () => {
    if (!content) return;
    if (!newAchievement.title?.trim()) {
      alert("Achievement title is required.");
      return;
    }

    const itemData: AchievementItem = {
      id: editingAchievementId || `achieve-${Date.now()}`,
      title: newAchievement.title || "Untitled Milestone",
      issuer: newAchievement.issuer || "REDDIX ROBOTICS",
      date: newAchievement.date || "2026",
      description: newAchievement.description || "",
      metric: newAchievement.metric || "",
    };

    let updatedAchievements: AchievementItem[];
    if (editingAchievementId) {
      updatedAchievements = content.achievements.map((a) => (a.id === editingAchievementId ? itemData : a));
    } else {
      updatedAchievements = [itemData, ...content.achievements];
    }

    const updatedContent = { ...content, achievements: updatedAchievements };
    setContent(updatedContent);
    handleSave(updatedContent);

    setIsAddingAchievement(false);
    setEditingAchievementId(null);
    setNewAchievement({
      title: "",
      issuer: "REDDIX ROBOTICS",
      date: "2026",
      description: "",
      metric: "1st Place",
    });
  };

  const handleEditAchievement = (item: AchievementItem) => {
    setEditingAchievementId(item.id);
    setNewAchievement(item);
    setIsAddingAchievement(true);
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!content) return;
    if (!confirm("Are you sure you want to delete this achievement?")) return;

    const previousAchievements = content.achievements;
    const updatedAchievements = content.achievements.filter((a) => a.id !== id);
    const updatedContent = { ...content, achievements: updatedAchievements };
    setContent(updatedContent);

    const saved = await handleSave(updatedContent);
    if (!saved) {
      // Revert if saving failed
      setContent({ ...content, achievements: previousAchievements });
    }
  };

  // ─── LOADING SCREEN ───
  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
          INITIALIZING SECURITY GATEWAY...
        </p>
      </div>
    );
  }

  // ─── LOGIN SCREEN ───
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#050B14]/90 p-8 shadow-[0_0_50px_rgba(0,229,255,0.12)] backdrop-blur-2xl">
          {/* Cyan Glow Top Border */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00e5ff]" />

          {/* Security Icon Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-950/40 text-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              <Shield className="h-7 w-7" />
              <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-ping" />
            </div>

            <h1 className="mt-5 font-mono text-lg font-black uppercase tracking-[0.22em] text-white">
              REDDIX ROBOTICS
            </h1>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-cyan-400">
              SECURE ADMIN TERMINAL
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              Provide authorized credentials to manage portfolio projects, achievements, and live telemetry.
            </p>
          </div>

          {/* Error Notice */}
          {loginError && (
            <div className="mt-5 flex items-center gap-2.5 rounded-lg border border-red-500/50 bg-red-950/40 p-3 text-xs text-red-300">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full rounded-lg border border-cyan-500/30 bg-[#02050A] px-3.5 py-2.5 font-mono text-xs text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  placeholder="reddixrobotics@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-lg border border-cyan-500/30 bg-[#02050A] px-3.5 py-2.5 font-mono text-xs text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="mt-6 flex w-full min-h-[46px] items-center justify-center gap-2 rounded-lg border border-cyan-400/80 bg-cyan-500 px-4 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all hover:bg-cyan-400 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  AUTHENTICATE & ACCESS
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 border-t border-zinc-800/80 pt-4 text-center">
            <p className="font-mono text-[10px] text-zinc-500">
              Authorized Account: <span className="text-zinc-300">reddixrobotics@gmail.com</span>
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-cyan-400/70">
              Default Key: <code className="text-white bg-black/60 px-1 py-0.5 rounded">reddix@2026</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Content loading fallback
  if (!content) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <RefreshCw className="h-7 w-7 animate-spin text-cyan-400" />
        <span className="font-mono text-xs text-zinc-400">LOADING SITE DATABASE...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ─── Top Admin Session Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-cyan-500/20 bg-zinc-900/60 p-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
          <div>
            <p className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              SESSION ACTIVE: <span className="text-cyan-400">reddixrobotics@gmail.com</span>
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  isSupabaseConnected
                    ? "bg-emerald-400 shadow-[0_0_6px_#10b981]"
                    : "bg-cyan-400 shadow-[0_0_6px_#00e5ff]"
                }`}
              />
              <span className="font-mono text-[10px] text-zinc-400">
                {isSupabaseConnected
                  ? "STORAGE ENGINE: SUPABASE CLOUD (PERMANENT POSTGRESQL)"
                  : "STORAGE ENGINE: BUILT-IN JSON (SUPABASE READY)"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-cyan-400/80 bg-cyan-500 px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all hover:bg-cyan-400 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saveSuccess ? "PUBLISHED LIVE!" : isSaving ? "SAVING..." : "SAVE & PUBLISH"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3.5 py-2 font-mono text-xs text-zinc-300 hover:border-red-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Supabase Action Required Banner */}
      {supabaseStatus?.configured && !supabaseStatus?.tableReady && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-950/40 p-4 text-xs text-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold uppercase tracking-wider text-amber-300">
              Action Required: Database Table Not Initialized Yet
            </p>
            <p className="mt-1 text-amber-200/90 leading-relaxed">
              Supabase keys are connected, but the <code className="bg-black/60 px-1 py-0.5 rounded text-cyan-300 font-mono">site_content</code> table was not found in your Supabase database. Deletions and edits will revert on refresh until you run the SQL script in your Supabase SQL editor.
            </p>
            <p className="mt-2 text-zinc-300 text-[11px]">
              👉 Open your Supabase Dashboard → <strong>SQL Editor</strong> → Paste the SQL setup script and click <strong>Run</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Supabase Missing Keys Banner (when in production / Vercel without env vars) */}
      {!isSupabaseConnected && !supabaseStatus?.configured && (
        <div className="flex items-start gap-3 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3.5 text-xs text-cyan-200">
          <AlertTriangle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-cyan-300">
              Storage Engine: Local Fallback (Supabase Not Connected)
            </p>
            <p className="mt-0.5 text-zinc-400 text-[11px] leading-relaxed">
              To make all deletions, uploads, and edits permanent on your live website, add <code className="text-cyan-300">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-cyan-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your Vercel Environment Variables and redeploy.
            </p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="rounded-lg border border-red-500/60 bg-red-950/40 p-4 text-xs text-red-200">
          {errorMessage}
        </div>
      )}

      {/* ─── Navigation Tabs ─── */}
      <div className="flex overflow-x-auto border-b border-zinc-800 space-x-2 sm:space-x-4 pb-px">
        {[
          { id: "projects", label: "Projects", icon: Briefcase, count: content.projects.length },
          { id: "achievements", label: "Achievements", icon: Award, count: content.achievements.length },
          { id: "hero", label: "Hero & HUD", icon: Layers },
          { id: "about", label: "About & Bio", icon: User },
          { id: "career", label: "Startup Journey", icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 font-mono text-xs uppercase tracking-wider border-b-2 transition-all ${
                isActive
                  ? "border-cyan-400 text-cyan-300 font-bold shadow-[0_2px_12px_rgba(0,229,255,0.2)]"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="rounded-full bg-zinc-800 px-1.5 py-0.5 text-[10px] text-cyan-300 font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════
          PROJECTS TAB: UPLOAD & MANAGE PROJECTS
      ═══════════════════════════════════════════════ */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Portfolio Projects</h2>
              <p className="text-xs text-zinc-400">
                Add, edit, and organize autonomous robotics projects shown on the homepage and showcase sections.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingProjectId(null);
                setNewProject({
                  title: "",
                  category: "Autonomous Navigation / AMR",
                  year: "2026",
                  description: "",
                  technologies: ["ROS 2", "SLAM", "LiDAR"],
                  metrics: "±2cm accuracy",
                  image: "/images/projects/autonomous-navigation-robot.png",
                  githubUrl: "",
                  liveUrl: "",
                });
                setProjectTagInput("ROS 2, SLAM, LiDAR");
                setIsAddingProject(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-400 bg-cyan-950/40 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 hover:bg-cyan-900/60 shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all"
            >
              <Plus className="h-4 w-4" />
              Upload New Project
            </button>
          </div>

          {/* ─── ADD / EDIT PROJECT MODAL FORM ─── */}
          {isAddingProject && (
            <div className="rounded-2xl border border-cyan-400/40 bg-zinc-950 p-6 sm:p-8 space-y-5 shadow-[0_0_30px_rgba(0,229,255,0.15)] animate-in fade-in">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-400">
                  {editingProjectId ? "Edit Project" : "Upload & Create New Project"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingProject(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g. Autonomous AMR Warehouse Robot"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    placeholder="e.g. Autonomous Navigation / AMR"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Year
                  </label>
                  <input
                    type="text"
                    value={newProject.year}
                    onChange={(e) => setNewProject({ ...newProject, year: e.target.value })}
                    placeholder="2026"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Key Metric
                  </label>
                  <input
                    type="text"
                    value={newProject.metrics}
                    onChange={(e) => setNewProject({ ...newProject, metrics: e.target.value })}
                    placeholder="e.g. ±1.5cm SLAM precision, 10hr battery"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Technologies / Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={projectTagInput}
                  onChange={(e) => setProjectTagInput(e.target.value)}
                  placeholder="ROS 2, LiDAR, SLAM, Python, C++, Jetson Orin"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Detailed description of robotics engineering, algorithmic stack, and field trials..."
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Image Upload / URL Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Project Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* File Upload Button */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 font-mono text-xs text-white hover:bg-zinc-700 transition-colors"
                  >
                    {isUploadingImage ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                    ) : (
                      <Upload className="h-4 w-4 text-cyan-400" />
                    )}
                    {isUploadingImage ? "Uploading..." : "Upload Image File"}
                  </button>

                  <span className="text-xs text-zinc-500 font-mono">or enter URL:</span>

                  <input
                    type="text"
                    value={newProject.image}
                    onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                    placeholder="/images/projects/autonomous-navigation-robot.png"
                    className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none w-full sm:w-auto"
                  />
                </div>

                {/* Preview */}
                {newProject.image && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-[11px] text-zinc-500 font-mono">Preview:</span>
                    <div className="relative h-14 w-28 overflow-hidden rounded border border-cyan-400/40 bg-black">
                      <img
                        src={newProject.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    GitHub URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Live Demo / Video URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddingProject(false)}
                  className="rounded-lg border border-zinc-700 px-4 py-2 font-mono text-xs text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProjectForm}
                  className="rounded-lg bg-cyan-400 px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
                >
                  {editingProjectId ? "Update Project" : "Save & Add Project"}
                </button>
              </div>
            </div>
          )}

          {/* ─── PROJECTS LIST ─── */}
          <div className="grid grid-cols-1 gap-4">
            {content.projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition-all hover:border-cyan-500/40 hover:bg-zinc-900/40"
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Project thumbnail */}
                  <div className="relative h-16 w-24 sm:h-20 sm:w-32 shrink-0 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
                    {proj.image ? (
                      <img src={proj.image} alt={proj.title} className="h-full w-full object-contain p-1" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                        {proj.category}
                      </span>
                      {proj.year && (
                        <span className="text-[10px] font-mono text-zinc-500">• {proj.year}</span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white mt-0.5">{proj.title}</h4>

                    <p className="text-xs text-zinc-400 line-clamp-1 mt-1 max-w-xl">
                      {proj.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {proj.metrics && (
                        <span className="rounded bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 font-mono text-[10px] text-cyan-300 font-semibold">
                          {proj.metrics}
                        </span>
                      )}
                      {proj.technologies?.slice(0, 4).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="rounded bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Move Up/Down */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveProject(idx, "up")}
                    className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-20"
                    title="Move Up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === content.projects.length - 1}
                    onClick={() => handleMoveProject(idx, "down")}
                    className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-20"
                    title="Move Down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEditProject(proj)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-300 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          ACHIEVEMENTS TAB: UPLOAD & MANAGE ACHIEVEMENTS
      ═══════════════════════════════════════════════ */}
      {activeTab === "achievements" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Key Achievements & Honors</h2>
              <p className="text-xs text-zinc-400">
                Add awards, publications, patents, and major milestones displayed in the Key Achievements section.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingAchievementId(null);
                setNewAchievement({
                  title: "",
                  issuer: "REDDIX ROBOTICS",
                  date: "2026",
                  description: "",
                  metric: "1st Place",
                });
                setIsAddingAchievement(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-400 bg-cyan-950/40 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 hover:bg-cyan-900/60 shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all"
            >
              <Plus className="h-4 w-4" />
              Upload New Achievement
            </button>
          </div>

          {/* ─── ADD / EDIT ACHIEVEMENT FORM ─── */}
          {isAddingAchievement && (
            <div className="rounded-2xl border border-cyan-400/40 bg-zinc-950 p-6 sm:p-8 space-y-5 shadow-[0_0_30px_rgba(0,229,255,0.15)] animate-in fade-in">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-400">
                  {editingAchievementId ? "Edit Achievement" : "Add New Achievement"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingAchievement(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Achievement Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                    placeholder="e.g. Best Autonomous Robotics Innovation"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Issuer / Awarding Body
                  </label>
                  <input
                    type="text"
                    value={newAchievement.issuer}
                    onChange={(e) => setNewAchievement({ ...newAchievement, issuer: e.target.value })}
                    placeholder="e.g. International Robotics Forum"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Date / Year
                  </label>
                  <input
                    type="text"
                    value={newAchievement.date}
                    onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                    placeholder="MAR 2026"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Highlight Metric / Impact
                  </label>
                  <input
                    type="text"
                    value={newAchievement.metric}
                    onChange={(e) => setNewAchievement({ ...newAchievement, metric: e.target.value })}
                    placeholder="Rank 1 / 150 Teams"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                  placeholder="Summary of the milestone, criteria, and demonstrated impact..."
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddingAchievement(false)}
                  className="rounded-lg border border-zinc-700 px-4 py-2 font-mono text-xs text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAchievementForm}
                  className="rounded-lg bg-cyan-400 px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
                >
                  {editingAchievementId ? "Update Achievement" : "Save & Add Achievement"}
                </button>
              </div>
            </div>
          )}

          {/* ─── ACHIEVEMENTS LIST ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.achievements.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition-all hover:border-cyan-500/40 hover:bg-zinc-900/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-cyan-400 font-bold">{item.date}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditAchievement(item)}
                        className="p-1 text-zinc-500 hover:text-cyan-300 transition-colors"
                        title="Edit Achievement"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAchievement(item.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete Achievement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white mt-2">{item.title}</h4>
                  <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mt-0.5">
                    {item.issuer}
                  </p>

                  <p className="text-xs text-zinc-400 mt-3 leading-relaxed">{item.description}</p>
                </div>

                {item.metric && (
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="text-zinc-500">METRIC:</span>
                    <span className="font-bold">{item.metric}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          HERO & HUD TAB
      ═══════════════════════════════════════════════ */}
      {activeTab === "hero" && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-6">
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-400 border-b border-zinc-800 pb-3">
            Hero Section & HUD Telemetry Settings
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">Eyebrow</label>
              <input
                type="text"
                value={content.hero.eyebrow}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, eyebrow: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">Hero Name</label>
              <input
                type="text"
                value={content.hero.name}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, name: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">Subtitle</label>
              <input
                type="text"
                value={content.hero.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, subtitle: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">CTA Label</label>
              <input
                type="text"
                value={content.hero.ctaLabel}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, ctaLabel: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">HUD Location</label>
              <input
                type="text"
                value={content.hero.hudLocation}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, hudLocation: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">HUD Timezone</label>
              <input
                type="text"
                value={content.hero.hudTimezone}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, hudTimezone: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          ABOUT TAB
      ═══════════════════════════════════════════════ */}
      {activeTab === "about" && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-6">
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-400 border-b border-zinc-800 pb-3">
            About Section Content
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">Heading</label>
              <input
                type="text"
                value={content.about.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...content.about, title: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">Lead Paragraph</label>
              <textarea
                rows={3}
                value={content.about.leadParagraph}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...content.about, leadParagraph: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">Bio Paragraph</label>
              <textarea
                rows={4}
                value={content.about.bioParagraph}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...content.about, bioParagraph: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          CAREER TAB
      ═══════════════════════════════════════════════ */}
      {activeTab === "career" && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-6">
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-400 border-b border-zinc-800 pb-3">
            Career Timeline Milestones
          </h3>
          <div className="space-y-6">
            {content.career.map((item, idx) => (
              <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Role</label>
                    <input
                      type="text"
                      value={item.role}
                      onChange={(e) => {
                        const updated = [...content.career];
                        updated[idx].role = e.target.value;
                        setContent({ ...content, career: updated });
                      }}
                      className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Organization</label>
                    <input
                      type="text"
                      value={item.organization}
                      onChange={(e) => {
                        const updated = [...content.career];
                        updated[idx].organization = e.target.value;
                        setContent({ ...content, career: updated });
                      }}
                      className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Summary</label>
                  <textarea
                    rows={2}
                    value={item.summary}
                    onChange={(e) => {
                      const updated = [...content.career];
                      updated[idx].summary = e.target.value;
                      setContent({ ...content, career: updated });
                    }}
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
