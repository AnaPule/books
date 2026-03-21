import React, { useRef, useEffect, useState } from "react";
import p5 from "p5";

interface BookData {
    spineColor?: [number, number, number];
    coverColor?: [number, number, number];
    title?: string;
}

interface WatercolorShelfProps {
    books: BookData[];
    caption?: string;
}

const DEFAULT_SPINE: [number, number, number] = [55, 38, 32];
const DEFAULT_COVER: [number, number, number] = [101, 72, 60];
const PAPER: [number, number, number] = [210, 190, 140];

const WatercolorShelf: React.FC<WatercolorShelfProps> = ({ books, caption }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const p5Ref = useRef<p5 | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const hoveredRef = useRef<number | null>(null);

    // Book geometry — drawn in p5 coordinate space
    const BOOK_W   = 28;   // spine width (what you see facing you)
    const BOOK_D   = 110;  // depth (front to back) — the large top face
    const BOOK_H   = 155;  // standing height
    const GAP      = 6;    // gap between books
    const TILT     = 0.15; // vertical perspective factor for depth lines

    // Canvas size
    const CW = 600;
    const CH = 280;

    // Compute book x positions (centered)
    const totalW = books.length * (BOOK_W + GAP) - GAP;
    const startX = (CW - totalW) / 2;

    // Base y for book bottoms (shelf surface)
    const SHELF_Y = CH - 60;

    // Book rects in screen space — used for hover detection too
    const getBookRect = (i: number, lifted = false) => {
        const x = startX + i * (BOOK_W + GAP);
        const y = SHELF_Y - BOOK_H + (lifted ? -18 : 0);
        return { x, y, w: BOOK_W, h: BOOK_H };
    };

    const renderWatercolor = (
        p: p5,
        pts: { x: number; y: number }[],
        color: [number, number, number],
        iterations: number,
        bloomFreq = 8
    ) => {
        p.push();
        p.noStroke();
        for (let i = 0; i < iterations; i++) {
            p.fill(color[0], color[1], color[2], p.random(1, 5));
            p.beginShape();
            pts.forEach((pt) => {
                const drift = p.map(i, 0, iterations, 0.3, 9);
                p.vertex(pt.x + p.random(-drift, drift), pt.y + p.random(-drift, drift));
            });
            p.endShape(p.CLOSE);

            if (i % bloomFreq === 0) {
                const cx = pts.reduce((s, pt) => s + pt.x, 0) / pts.length;
                const cy = pts.reduce((s, pt) => s + pt.y, 0) / pts.length;
                p.fill(color[0], color[1], color[2], p.random(2, 7));
                p.ellipse(cx + p.random(-25, 25), cy + p.random(-25, 25), p.random(20, 60), p.random(15, 50));
            }
        }
        p.noFill();
        for (let i = 0; i < 6; i++) {
            p.stroke(color[0] * 0.55, color[1] * 0.55, color[2] * 0.55, p.random(6, 14));
            p.strokeWeight(p.random(0.5, 2));
            p.beginShape();
            pts.forEach((pt) => p.vertex(pt.x + p.random(-3, 3), pt.y + p.random(-3, 3)));
            p.endShape(p.CLOSE);
        }
        p.noStroke();
        p.pop();
    };

    const drawBook = (p: p5, i: number, lifted: boolean) => {
        const book = books[i];
        const spine  = book.spineColor  ?? DEFAULT_SPINE;
        const cover  = book.coverColor  ?? DEFAULT_COVER;
        const { x, y, w, h } = getBookRect(i, lifted);

        // depth offset for top/back faces
        const dx = BOOK_D * 0.55;  // how far right the back goes
        const dy = -BOOK_D * TILT; // how far up the back goes (perspective)

        // ── TOP FACE (pages) — parallelogram on top ──────────────
        renderWatercolor(p, [
            { x: x,     y: y },
            { x: x + w, y: y },
            { x: x + w + dx, y: y + dy },
            { x: x + dx,     y: y + dy },
        ], PAPER, 45, 6);

        // Page lines on top face
        const lc = 14;
        for (let li = 1; li < lc; li++) {
            const t = li / lc;
            p.stroke(160, 138, 90, 55);
            p.strokeWeight(0.5);
            p.line(x + t * dx * 0.02, y + t * dy * 0.02, x + t * dx, y + t * dy);
            p.line(x + w + t * dx * 0.02, y + t * dy * 0.02, x + w + t * dx, y + t * dy);
        }
        p.noStroke();

        // ── SPINE FACE — front vertical rect ─────────────────────
        renderWatercolor(p, [
            { x: x,     y: y },
            { x: x + w, y: y },
            { x: x + w, y: y + h },
            { x: x,     y: y + h },
        ], spine, 90, 7);

        // ── SIDE FACE — right side, visible edge ──────────────────
        renderWatercolor(p, [
            { x: x + w,      y: y },
            { x: x + w + dx, y: y + dy },
            { x: x + w + dx, y: y + h + dy },
            { x: x + w,      y: y + h },
        ], [
            Math.max(cover[0] - 20, 0),
            Math.max(cover[1] - 20, 0),
            Math.max(cover[2] - 20, 0),
        ], 50, 10);

        // ── HOVER GLOW / SHADOW ───────────────────────────────────
        if (lifted) {
            p.noFill();
            p.stroke(spine[0] * 0.4, spine[1] * 0.4, spine[2] * 0.4, 30);
            p.strokeWeight(8);
            p.rect(x - 2, y + h - 4, w + 4, 6, 3);
            p.noStroke();
        }
    };

    useEffect(() => {
        if (!canvasRef.current) return;

        const sketch = (p: p5) => {
            p.setup = () => {
                p.createCanvas(CW, CH).parent(canvasRef.current!);
                p.noLoop();
                p.blendMode(p.MULTIPLY);
            };

            p.draw = () => {
                p.clear();
                const hov = hoveredRef.current;

                // Draw non-hovered books first
                for (let i = 0; i < books.length; i++) {
                    if (i !== hov) drawBook(p, i, false);
                }
                // Draw hovered book last (on top)
                if (hov !== null) drawBook(p, hov, true);

                // Shelf board
                p.noStroke();
                p.fill(230, 195, 185, 220);
                p.rect(0, SHELF_Y + 5, CW, 5, 2);
                p.fill(215, 175, 165, 120);
                p.rect(0, SHELF_Y + 9, CW, 3, 1);
            };
        };

        p5Ref.current = new p5(sketch);

        return () => {
            p5Ref.current?.remove();
        };
    }, [books]);

    // Redraw when hover changes
    useEffect(() => {
        hoveredRef.current = hoveredIndex;
        p5Ref.current?.redraw();
    }, [hoveredIndex]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        let found: number | null = null;
        for (let i = 0; i < books.length; i++) {
            const { x, y, w, h } = getBookRect(i);
            if (mx >= x && mx <= x + w && my >= y && my <= y + h) {
                found = i;
                break;
            }
        }
        setHoveredIndex(found);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {caption && (
                <span style={{
                    fontSize: '0.78rem', letterSpacing: '0.18em',
                    color: '#9b7c68', fontFamily: 'Georgia, serif', opacity: 0.8,
                }}>
                    {caption}
                </span>
            )}
            <div style={{ position: 'relative' }}>
                <div
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ cursor: hoveredIndex !== null ? 'pointer' : 'default' }}
                />
                {/* Paper grain overlays */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    opacity: 0.3, mixBlendMode: 'multiply',
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/handmade-paper.png')",
                }} />

                {/* Tooltip */}
                {hoveredIndex !== null && books[hoveredIndex]?.title && (() => {
                    const { x, y, w } = getBookRect(hoveredIndex, true);
                    return (
                        <div style={{
                            position: 'absolute',
                            left: x + w / 2,
                            top: y - 32,
                            transform: 'translateX(-50%)',
                            background: 'rgba(45,35,30,0.88)',
                            color: '#f5ede4',
                            fontFamily: 'Georgia, serif',
                            fontSize: '0.7rem',
                            letterSpacing: '0.1em',
                            padding: '4px 10px',
                            borderRadius: 4,
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                            zIndex: 50,
                        }}>
                            {books[hoveredIndex].title}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default WatercolorShelf;