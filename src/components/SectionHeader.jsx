import React from "react";

export default function SectionHeader({
  label,
  title,
  subtitle,
  align = "left", // "left" | "center"
  className = "",
}) {
  const isCenter = align === "center";

  return (
    <div className={`mb-12 sm:mb-16 md:mb-20 ${className}`}>
      <div
        className={`flex items-center gap-3 mb-4 ${
          isCenter ? "justify-center" : ""
        }`}
      >
        <div
          className={`h-px ${
            isCenter ? "w-12 bg-gradient-to-r from-transparent to-cyan-400" : "w-8 bg-cyan-400"
          }`}
        />
        <span className="text-cyan-400 text-xs font-mono tracking-[0.3em] uppercase">
          {label}
        </span>
        <div
          className={`h-px ${
            isCenter ? "w-12 bg-gradient-to-l from-transparent to-cyan-400" : "w-8 bg-cyan-400"
          }`}
        />
      </div>

      <div className={isCenter ? "text-center" : ""}>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight sm:leading-none mb-3 sm:mb-4 font-display">
          {title}
        </h2>
        {subtitle ? (
          <p
            className={`text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed ${
              isCenter ? "mx-auto" : ""
            }`}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

