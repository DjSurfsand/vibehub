import { Plus, Tag, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../lib/projects";
import { useAuth } from "../lib/auth";

export default function CreatePage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags((prev) => [...prev, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth.status !== "authenticated") return;

    setSubmitting(true);
    const project = await createProject(
      {
        title,
        description,
        url: url || undefined,
        media_url: mediaUrl || undefined,
        tech_tags: tags,
      },
      auth.user,
    );
    setSubmitting(false);

    if (project) {
      setSuccess(true);
      setTimeout(() => navigate(`/projects/${project.id}`), 1200);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-lime flex items-center justify-center mx-auto shadow-glow-lime">
          <Check className="w-8 h-8 text-text-on-neon" />
        </div>
        <h2 className="text-h2 text-neon-lime">Project Submitted!</h2>
        <p className="text-body-md text-text-secondary">
          Redirecting to your project…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-md bg-gradient-cta flex items-center justify-center shadow-glow-cyan">
          <Plus className="w-5 h-5 text-text-on-neon" />
        </div>
        <h1 className="text-h1 text-text-primary">
          <span className="text-neon-cyan">/</span>create
        </h1>
      </div>

      <div className="divider-neon mb-8" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-label-caps text-text-dim block mb-1.5">
            PROJECT TITLE *
          </label>
          <input
            className="input-neon"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What did you build?"
            required
          />
        </div>

        <div>
          <label className="text-label-caps text-text-dim block mb-1.5">
            PROJECT URL
          </label>
          <input
            className="input-neon"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/your-project or live demo"
          />
        </div>

        <div>
          <label className="text-label-caps text-text-dim block mb-1.5">
            DESCRIPTION *
          </label>
          <textarea
            className="textarea-neon h-32"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your vibecoded creation…"
            required
          />
        </div>

        <div>
          <label className="text-label-caps text-text-dim block mb-1.5">
            SCREENSHOT / MEDIA URL
          </label>
          <input
            className="input-neon"
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://i.imgur.com/your-screenshot.png"
          />
          <p className="text-mono-sm text-text-dim mt-1.5">
            A 16:9 screenshot or GIF of your project in action
          </p>
        </div>

        <div>
          <label className="text-label-caps text-text-dim block mb-1.5">
            <Tag className="w-3 h-3 inline mr-1" />
            TAGS
          </label>
          <input
            className="input-neon"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type a tag and press Enter (react, python, ai, …)"
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="badge badge-cyan cursor-pointer hover:bg-neon-red/30
                             transition-colors inline-flex items-center gap-1"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? "Submitting…" : "Submit Creation →"}
          </button>
        </div>
      </form>
    </div>
  );
}