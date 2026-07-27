"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useSchoolContent } from "@/features/school/lib/content-store";
import { resolveStoredAssetUrl } from "@/features/storage/domain/asset-url";

export function HomeHero() {
  const { content } = useSchoolContent();
  const { landing, heroSlides } = content;
  const [current, setCurrent] = useState(0);
  const activeIndex = Math.min(current, Math.max(heroSlides.length - 1, 0));

  useEffect(() => {
    if (heroSlides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setCurrent((value) => (value + 1) % heroSlides.length), 6000);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section className="home-hero">
      <div className="shell hero-layout">
        <div className="hero-content">
          <div className="status-pill"><span /><b>{landing.admissionStatus}</b></div>
          <p className="overline">{landing.schoolDescriptor}</p>
          <h1>{landing.heroTitle}</h1>
          <p className="hero-summary">{landing.heroSummary}</p>
          <div className="button-row">
            <Link className="button button-primary" href="#admissions">{landing.heroPrimaryAction}</Link>
            <Link className="button button-secondary" href="#school">{landing.heroSecondaryAction}</Link>
          </div>
          <p className="hero-help">{landing.heroHelpText} <Link href={`tel:${landing.phone.replaceAll(" ", "")}`}>{landing.phone}</Link>.</p>
        </div>
        <div
          className={`hero-media${heroSlides.length <= 1 ? " single-slide" : ""}`}
          aria-roledescription="carousel"
          aria-label={`Life at ${landing.brandName}`}
        >
          <div className="hero-slides" aria-live="off">
            {heroSlides.map((slide, index) => (
              <article
                className={`hero-slide${activeIndex === index ? " active" : ""}`}
                aria-label={`Slide ${index + 1} of ${heroSlides.length}`}
                aria-hidden={activeIndex !== index}
                key={slide.id}
              >
                <Image src={resolveStoredAssetUrl(slide.storageFileId, slide.src)} alt={slide.alt} fill sizes="(max-width: 1020px) 100vw, 50vw" priority={index === 0} unoptimized={!slide.isLocalAsset} />
                <div className="hero-caption"><strong>{slide.heading}</strong><span>{slide.supporting}</span></div>
              </article>
            ))}
          </div>
          <div className="carousel-controls">
            <div className="carousel-dots" aria-label="Choose a slide">
              {heroSlides.map((slide, index) => (
                <button type="button" aria-label={`Show slide ${index + 1}`} aria-current={activeIndex === index} onClick={() => setCurrent(index)} key={slide.id} />
              ))}
            </div>
            <div className="carousel-position"><span>{String(activeIndex + 1).padStart(2, "0")}</span><i /><span>{String(heroSlides.length).padStart(2, "0")}</span></div>
            <button type="button" aria-label="Show previous slide" onClick={() => setCurrent((activeIndex - 1 + heroSlides.length) % heroSlides.length)}>←</button>
            <button type="button" aria-label="Show next slide" onClick={() => setCurrent((activeIndex + 1) % heroSlides.length)}>→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
