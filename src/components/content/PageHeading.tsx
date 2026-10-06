export default function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-heading">
      {/* Decorative corner architectural registration mark */}
      <svg
        className="page-corner-mark"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 24 L4 4 L24 4"
          stroke="#C4A87C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />
        <circle cx="4" cy="4" r="2.5" fill="#D6A84F" opacity="0.65" />
      </svg>

      <p className="page-eyebrow">
        <span className="page-eyebrow-line" />
        {eyebrow}
      </p>
      <h1>
        {title.split('\n').map((line, i) => (
          <span key={line} className={i ? 'gold-italic' : ''}>
            {line}
            {i < title.split('\n').length - 1 && <br />}
          </span>
        ))}
      </h1>
      <p>{description}</p>
    </header>
  );
}
