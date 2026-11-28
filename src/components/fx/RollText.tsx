// Letters roll upwards one after another when the parent with `.roll-trigger` is hovered or focused.
export function RollText({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="roll-text">
        {Array.from(text).map((char, i) => (
          <span key={i} className="roll-char" data-char={char} style={{ transitionDelay: `${i * 22}ms` }}>
            {char}
          </span>
        ))}
      </span>
    </>
  );
}
