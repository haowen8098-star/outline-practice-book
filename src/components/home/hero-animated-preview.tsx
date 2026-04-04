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
  const speedMultiplier = 1.2;

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
          const getCenteredIndex = (node: SVGElement) => {
            const count = getCharCount(node);
            return getCharIndex(node) - (count - 1) / 2;
          };
          const getAssembleX = (node: SVGElement) => {
            const centeredIndex = getCenteredIndex(node);
            const lineIndex = getLineIndex(node);
            const lineBias = lineIndex === 0 ? -112 : 112;
            return lineBias + centeredIndex * 94 + (centeredIndex % 2 === 0 ? 12 : -12);
          };
          const getAssembleY = (node: SVGElement) => {
            const centeredIndex = Math.abs(getCenteredIndex(node));
            return getLineIndex(node) === 0 ? -132 - centeredIndex * 10 : 132 + centeredIndex * 10;
          };
          const getOutlineX = (node: SVGElement) => {
            const centeredIndex = getCenteredIndex(node);
            const lineIndex = getLineIndex(node);
            return (lineIndex === 0 ? -38 : 38) + centeredIndex * 22;
          };
          const getOutlineY = (node: SVGElement) => (getLineIndex(node) === 0 ? -64 : 64);
          const getAssembleRotation = (node: SVGElement) => {
            const centeredIndex = getCenteredIndex(node);
            return (getLineIndex(node) === 0 ? -1 : 1) * 5 + centeredIndex * 4.5;
          };
          const getOutlineRotation = (node: SVGElement) => getCenteredIndex(node) * 2.4;

          if (reduce) {
            gsap.set(fillNodes, { opacity: 0 });
            gsap.set(outlineNodes, { opacity: 1, strokeDashoffset: 0, x: 0, y: 0, rotation: 0, scale: 1 });
            return;
          }

          if (!motionOk) return;

          gsap.set(fillNodes, {
            opacity: 0,
            x: (_index, target) => getAssembleX(target as SVGElement),
            y: (_index, target) => getAssembleY(target as SVGElement),
            rotation: (_index, target) => getAssembleRotation(target as SVGElement),
            scale: 0.78,
            filter: "blur(18px)",
            transformOrigin: "50% 50%",
            force3D: true,
          });
          gsap.set(outlineNodes, {
            opacity: 0,
            x: (_index, target) => getOutlineX(target as SVGElement),
            y: (_index, target) => getOutlineY(target as SVGElement),
            rotation: (_index, target) => getOutlineRotation(target as SVGElement),
            scale: 1.06,
            filter: "blur(0px)",
            strokeDashoffset: 1400,
            transformOrigin: "50% 50%",
            force3D: true,
          });

          if (board) {
            gsap.to(board, {
              y: -10,
              duration: 8.6 / speedMultiplier,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          }

          if (panel) {
            gsap.to(panel, {
              scale: 1.012,
              duration: 8.6 / speedMultiplier,
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

          timeline.timeScale(speedMultiplier);

          timeline
            .to({}, { duration: 0.7 })
            .to(
              fillNodes,
              {
                opacity: 1,
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 2.45,
                stagger: {
                  each: 0.16,
                  from: "edges",
                },
                ease: "expo.out",
              },
            )
            .to(
              fillNodes,
              {
                keyframes: [
                  {
                    y: (_index, target) => (getLineIndex(target as SVGElement) === 0 ? -4 : 4),
                    duration: 0.28,
                  },
                  {
                    y: 0,
                    duration: 0.5,
                  },
                ],
                stagger: {
                  each: 0.05,
                  from: "center",
                },
                ease: "sine.out",
              },
              "-=1.1",
            )
            .to({}, { duration: 1.15 })
            .to(
              outlineNodes,
              {
                opacity: 1,
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                strokeDashoffset: 0,
                duration: 2.2,
                stagger: {
                  each: 0.14,
                  from: "center",
                },
                ease: "power4.out",
              },
              "+=0.15",
            )
            .to(
              fillNodes,
              {
                opacity: 0,
                y: (_index, target) => (getLineIndex(target as SVGElement) === 0 ? -10 : 10),
                scale: 0.985,
                filter: "blur(8px)",
                duration: 0.88,
                stagger: {
                  each: 0.06,
                  from: "center",
                },
              },
              "-=1.55",
            )
            .to(
              outlineNodes,
              {
                filter: "drop-shadow(0 12px 24px rgba(118,132,182,0.12))",
                duration: 1.1,
                stagger: {
                  each: 0.03,
                  from: "center",
                },
              },
              "-=1.05",
            )
            .to({}, { duration: 3.4 });
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
