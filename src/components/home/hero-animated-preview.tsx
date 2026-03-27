"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import type { OutlineStylePreset } from "@/types/site";

import { OutlinePreviewSvg } from "../outline/outline-preview-svg";

gsap.registerPlugin(useGSAP);

interface HeroAnimatedPreviewProps {
  text: string;
  style: OutlineStylePreset;
}

export function HeroAnimatedPreview({ text, style }: HeroAnimatedPreviewProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOk: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { motionOk, reduce } = context.conditions as {
            motionOk: boolean;
            reduce: boolean;
          };

          const root = scopeRef.current;
          const fillNodes = Array.from(root?.querySelectorAll<SVGElement>(".preview-sequence--source") ?? []);
          const outlineNodes = Array.from(root?.querySelectorAll<SVGElement>(".preview-sequence--outline") ?? []);
          const board = root?.querySelector<HTMLElement>(".hero-preview-motion");
          const panel = root?.querySelector<HTMLElement>(".hero-preview-surface");
          const getLineIndex = (node: SVGElement) => Number(node.dataset.lineIndex ?? 0);
          const getCharIndex = (node: SVGElement) => Number(node.dataset.charIndex ?? 0);
          const getCharCount = (node: SVGElement) => Number(node.dataset.charCount ?? 1);
          const getAssembleX = (node: SVGElement) => {
            const count = getCharCount(node);
            const centeredIndex = getCharIndex(node) - (count - 1) / 2;
            return centeredIndex * 58;
          };
          const getAssembleY = (node: SVGElement) => (getLineIndex(node) === 0 ? -96 : 96);
          const getOutlineY = (node: SVGElement) => (getLineIndex(node) === 0 ? -44 : 44);

          if (reduce) {
            gsap.set(fillNodes, { opacity: 0 });
            gsap.set(outlineNodes, { opacity: 1, strokeDashoffset: 0 });
            return;
          }

          if (!motionOk) return;

          gsap.set(fillNodes, {
            opacity: 0,
            x: (_index, target) => getAssembleX(target as SVGElement),
            y: (_index, target) => getAssembleY(target as SVGElement),
            scale: 0.8,
            filter: "blur(14px)",
            transformOrigin: "50% 50%",
          });
          gsap.set(outlineNodes, {
            opacity: 0,
            x: (_index, target) => getAssembleX(target as SVGElement) * 0.28,
            y: (_index, target) => getOutlineY(target as SVGElement),
            scale: 1.04,
            filter: "blur(0px)",
            strokeDashoffset: 1400,
            transformOrigin: "50% 50%",
          });

          if (board) {
            gsap.to(board, {
              y: -8,
              duration: 6.2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          }

          if (panel) {
            gsap.to(panel, {
              scale: 1.01,
              duration: 6.2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              transformOrigin: "50% 50%",
            });
          }

          const timeline = gsap.timeline({
            repeat: -1,
            defaults: { ease: "power2.inOut" },
          });

          timeline
            .to({}, { duration: 0.55 })
            .to(
              fillNodes,
              {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1.85,
                stagger: {
                  each: 0.12,
                  from: "center",
                },
                ease: "expo.out",
              },
            )
            .to({}, { duration: 0.5 })
            .to(
              outlineNodes,
              {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                strokeDashoffset: 0,
                duration: 1.75,
                stagger: {
                  each: 0.11,
                  from: "center",
                },
                ease: "power3.out",
              },
              1.9,
            )
            .to(
              fillNodes,
              {
                opacity: 0,
                y: (_index, target) => (getLineIndex(target as SVGElement) === 0 ? -14 : 14),
                scale: 1.015,
                filter: "blur(6px)",
                duration: 1.05,
                stagger: {
                  each: 0.08,
                  from: "center",
                },
              },
              2.28,
            )
            .to(
              outlineNodes,
              {
                filter: "drop-shadow(0 10px 22px rgba(118,132,182,0.12))",
                duration: 0.8,
                stagger: {
                  each: 0.03,
                  from: "center",
                },
              },
              2.66,
            )
            .to({}, { duration: 2.9 });
        },
      );

      return () => mm.revert();
    },
    { scope: scopeRef },
  );

  return (
    <div ref={scopeRef} className="hero-preview-motion">
      <div className="hero-preview-surface">
      <OutlinePreviewSvg
        text={text}
        style={style}
        mode="timeline"
        visualWeight="hero"
        animationVariant="solid-to-outline"
        className="w-full"
      />
      </div>
    </div>
  );
}
