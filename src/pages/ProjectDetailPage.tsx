import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { fetchProject, type Project } from "../lib/projects";
import { useVote } from "../lib/votes";
import { useComments, addComment } from "../lib/comments";
import { useAuth } from "../lib/auth";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProject(id).then((p) => {
      setProject(p);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-pulse w-10 h-10 bg-gradient-cta rounded-lg mx-auto" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <h1 className="text-h1 text-neon-magenta">404</h1>
        <p className="text-body-lg text-text-secondary mt-2">
          Project not found
        </p>
        <Link to="/" className="btn-primary mt-6 inline-block">
          Back to Feed
        </Link>
      </div>
    );
  }

  const user =
    auth.status === "authenticated" ? auth.user : null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <Link
        to="/"
        className="text-mono-sm text-text-dim hover:text-neon-cyan transition-colors mb-4 inline-block"
      >
        ← Back to Feed
      </Link>

      {/* ── Project Detail ── */}
      <div className="card-project">
        {project.media_url && (
          <div className="aspect-video rounded-md overflow-hidden mb-6 bg-bg-deep">
            <img
              src={project.media_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex gap-6">
          {/* Vote column */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <VoteButton
              projectId={project.id}
              userId={user?.id ?? null}
              type="up"
            />
            <span className="text-mono text-vote-up tabular-nums font-bold">
              {project.score}
            </span>
            <VoteButton
              projectId={project.id}
              userId={user?.id ?? null}
              type="down"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-h1 text-text-primary">{project.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-mono-sm text-text-dim">
              <Link
                to={`/profile/${project.username}`}
                className="text-neon-cyan hover:text-glow-cyan"
              >
                @{project.username}
              </Link>
              <span>·</span>
              <time>{new Date(project.created_at).toLocaleDateString()}</time>
            </div>

            {/* Tags */}
            {project.tech_tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {project.tech_tags.map((tag) => (
                  <span key={tag} className="badge">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="divider-subtle my-4" />

            <p className="text-body-md text-text-primary whitespace-pre-wrap">
              {project.description}
            </p>

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 btn-secondary"
              >
                <ExternalLink className="w-4 h-4" />
                View Project
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Comments ── */}
      <div className="mt-8">
        <h2 className="text-h2 text-text-primary mb-6">
          <span className="text-neon-cyan">// </span>
          Comments ({project.comment_count})
        </h2>

        <CommentSection projectId={project.id} />
      </div>
    </div>
  );
}

/* ── Vote Button Sub-component ── */
function VoteButton({
  projectId,
  userId,
  type,
}: {
  projectId: string;
  userId: string | null;
  type: "up" | "down";
}) {
  const { userVote, vote } = useVote(projectId, userId as any);

  const isActive = type === "up" ? userVote === 1 : userVote === -1;
  const Icon = type === "up" ? ArrowUp : ArrowDown;
  const activeClass = type === "up" ? "text-vote-up text-glow-lime" : "text-vote-down text-glow-red";

  return (
    <button
      onClick={() => vote(type === "up" ? 1 : -1)}
      disabled={!userId}
      className={`p-1.5 rounded-sm transition-all duration-150 disabled:opacity-40 ${
        isActive
          ? activeClass + " scale-110"
          : "text-text-dim hover:scale-110 " +
            (type === "up" ? "hover:text-vote-up" : "hover:text-vote-down")
      }`}
      title={userId ? (type === "up" ? "Upvote" : "Downvote") : "Sign in to vote"}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
}

/* ── Comment Section ── */
function CommentSection({ projectId }: { projectId: string }) {
  const auth = useAuth();
  const { comments, loading, refetch } = useComments(projectId);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const user = auth.status === "authenticated" ? auth.user : null;

  const handleSubmit = async () => {
    if (!user || !newComment.trim()) return;
    const ok = await addComment(
      { project_id: projectId, body: newComment.trim() },
      user,
    );
    if (ok) {
      setNewComment("");
      refetch();
    }
  };

  const handleReply = async (parentId: string) => {
    if (!user || !replyText.trim()) return;
    const ok = await addComment(
      { project_id: projectId, body: replyText.trim(), parent_id: parentId },
      user,
    );
    if (ok) {
      setReplyText("");
      setReplyTo(null);
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Composer */}
      {user && (
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-neon-cyan/20 shrink-0 flex items-center justify-center text-mono-sm text-neon-cyan">
            {user.email?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="textarea-neon h-20"
              placeholder="Share your thoughts…"
            />
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim()}
              className="btn-primary text-body-sm"
            >
              Post Comment
            </button>
          </div>
        </div>
      )}

      {!user && (
        <div className="card-project text-center py-6">
          <p className="text-body-sm text-text-dim">
            <Link to="/login" className="text-neon-cyan">
              Sign in
            </Link>{" "}
            to leave a comment
          </p>
        </div>
      )}

      <div className="divider-neon" />

      {/* Comments */}
      {loading ? (
        <p className="text-body-sm text-text-dim text-center py-4">
          Loading comments…
        </p>
      ) : comments.length === 0 ? (
        <p className="text-body-sm text-text-dim text-center py-8">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              replyText={replyText}
              setReplyText={setReplyText}
              handleReply={handleReply}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Recursive Comment Thread ── */
function CommentNode({
  comment,
  replyTo,
  setReplyTo,
  replyText,
  setReplyText,
  handleReply,
  user,
  depth = 0,
}: {
  comment: any;
  replyTo: string | null;
  setReplyTo: (id: string | null) => void;
  replyText: string;
  setReplyText: (t: string) => void;
  handleReply: (parentId: string) => void;
  user: any;
  depth?: number;
}) {
  const MAX_DEPTH = 5;
  const indent = depth > 0;

  return (
    <div>
      <div
        className={`flex gap-3 py-3 ${
          indent ? "border-l-2 border-border-subtle pl-4 ml-6" : ""
        }`}
      >
        <div className="w-7 h-7 rounded-full bg-neon-cyan/20 shrink-0 flex items-center justify-center text-mono-sm text-neon-cyan text-xs">
          {comment.username?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-mono-sm text-neon-cyan font-medium">
              @{comment.username}
            </span>
            <span className="text-mono-sm text-text-dim">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-body-sm text-text-primary mt-1">{comment.body}</p>
          <div className="flex items-center gap-3 mt-2">
            <button className="text-mono-sm text-text-dim hover:text-neon-cyan transition-colors">
              Reply
            </button>
          </div>

          {/* Reply form */}
          {replyTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="textarea-neon h-16 flex-1"
                placeholder="Write a reply…"
              />
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleReply(comment.id)}
                  className="btn-primary text-xs !px-3 !py-1"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    setReplyTo(null);
                    setReplyText("");
                  }}
                  className="btn-ghost text-xs !px-3 !py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies &&
        depth < MAX_DEPTH &&
        comment.replies.map((reply: any) => (
          <CommentNode
            key={reply.id}
            comment={reply}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            replyText={replyText}
            setReplyText={setReplyText}
            handleReply={handleReply}
            user={user}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}