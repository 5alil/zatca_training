import { useState } from 'react';
import './UserProfileCard.css';

export type UserStatus = 'active' | 'away' | 'offline';

export interface UserProfile {
  name: string;
  email: string;
  role?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  status?: UserStatus;
  skills?: string[];
}

export interface UserProfileCardProps {
  /** Optional nested profile object */
  user?: UserProfile;
  /** Full name (overrides user.name if provided) */
  name?: string;
  /** Email address (overrides user.email if provided) */
  email?: string;
  /** Role or job title (overrides user.role if provided) */
  role?: string;
  /** Geographic or remote location (overrides user.location if provided) */
  location?: string;
  /** Short biographical description (overrides user.bio if provided) */
  bio?: string;
  /** Image URL for avatar (overrides user.avatarUrl if provided) */
  avatarUrl?: string;
  /** Online availability status (overrides user.status if provided) */
  status?: UserStatus;
  /** Skill tags list (overrides user.skills if provided) */
  skills?: string[];
  /** Whether the user is initially followed */
  initialFollowed?: boolean;
  /** Callback fired when follow status changes */
  onFollowChange?: (isFollowing: boolean) => void;
  /** Callback fired when the secondary/message action is clicked */
  onMessageClick?: () => void;
  /** Additional CSS class names for customization */
  className?: string;
}

/**
 * Extracts uppercase initials from a full name (e.g., "Sarah Jenkins" -> "SJ").
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Reusable User Profile Card component showcasing modern React 19 and TypeScript practices.
 */
export default function UserProfileCard({
  user,
  name,
  email,
  role,
  location,
  bio,
  avatarUrl,
  status,
  skills,
  initialFollowed = false,
  onFollowChange,
  onMessageClick,
  className = '',
}: UserProfileCardProps) {
  // Resolve props (accepts either individual props or consolidated user object)
  const profileName = name ?? user?.name ?? 'Anonymous User';
  const profileEmail = email ?? user?.email ?? '';
  const profileRole = role ?? user?.role ?? 'Team Member';
  const profileLocation = location ?? user?.location;
  const profileBio = bio ?? user?.bio;
  const profileAvatarUrl = avatarUrl ?? user?.avatarUrl;
  const profileStatus = status ?? user?.status ?? 'active';
  const profileSkills = skills ?? user?.skills ?? [];

  // Local state for interactive features
  const [isFollowing, setIsFollowing] = useState(initialFollowed);
  const [imageError, setImageError] = useState(false);
  const [prevAvatarUrl, setPrevAvatarUrl] = useState(profileAvatarUrl);

  // Sync image error state when avatarUrl changes without triggering extra render passes via effect
  if (profileAvatarUrl !== prevAvatarUrl) {
    setPrevAvatarUrl(profileAvatarUrl);
    setImageError(false);
  }

  const handleFollowToggle = () => {
    setIsFollowing((prev) => {
      const nextState = !prev;
      onFollowChange?.(nextState);
      return nextState;
    });
  };

  const handleMessage = () => {
    if (onMessageClick) {
      onMessageClick();
    } else if (profileEmail) {
      window.location.href = `mailto:${profileEmail}`;
    }
  };

  const initials = getInitials(profileName);

  return (
    <article
      className={`user-profile-card ${className}`.trim()}
      aria-label={`User profile for ${profileName}`}
    >
      <div className="avatar-wrapper">
        {profileAvatarUrl && !imageError ? (
          <img
            src={profileAvatarUrl}
            alt={profileName}
            className="avatar-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="avatar-fallback"
            role="img"
            aria-label={profileName}
          >
            {initials}
          </div>
        )}
        <span
          className={`status-indicator status-${profileStatus}`}
          title={`Status: ${profileStatus}`}
          aria-label={`Status: ${profileStatus}`}
          role="status"
        />
      </div>

      <h3 className="user-name">{profileName}</h3>
      <p className="user-role">{profileRole}</p>

      {(profileLocation || profileEmail) && (
        <div className="user-meta">
          {profileLocation && (
            <span className="meta-item">
              <svg
                className="meta-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{profileLocation}</span>
            </span>
          )}

          {profileEmail && (
            <span className="meta-item">
              <svg
                className="meta-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <a href={`mailto:${profileEmail}`}>{profileEmail}</a>
            </span>
          )}
        </div>
      )}

      {profileBio && <p className="user-bio">{profileBio}</p>}

      {profileSkills.length > 0 && (
        <div className="skills-container">
          <p className="skills-heading">Skills & Expertise</p>
          <ul className="skills-list" role="list">
            {profileSkills.map((skill) => (
              <li key={skill} className="skill-chip">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card-actions">
        <button
          type="button"
          onClick={handleFollowToggle}
          className={`btn ${isFollowing ? 'btn-following' : 'btn-primary'}`}
          aria-pressed={isFollowing}
          aria-label={isFollowing ? `Unfollow ${profileName}` : `Follow ${profileName}`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        <button
          type="button"
          onClick={handleMessage}
          className="btn btn-secondary"
          aria-label={`Message ${profileName}`}
        >
          Message
        </button>
      </div>
    </article>
  );
}
