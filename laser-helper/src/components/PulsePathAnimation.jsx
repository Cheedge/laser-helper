import React, { useEffect, useMemo, useRef, useState } from 'react';
import { generatePulseData } from '../utils/pulseUtils';

// Crystal cell configurations
const CRYSTAL_CELLS = {
    hexagonal: {
        name: '2D Hexagonal',
        a0: 3.32,
        latticeVectors: {
            b1: null, // Will be calculated
            b2: null,
        },
        kPoints: {
            Gamma: [0, 0],
            K: null, // Will be calculated
            Kp: null,
            M: null,
        },
        drawCell: (ctx, cx, cy, scale, a0) => {
            const TWO_PI = 2 * Math.PI;
            const K_mag = (4 * Math.PI) / (3 * a0);
            const hexRadius = K_mag * scale;

            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const x = hexRadius * Math.cos(angle);
                const y = hexRadius * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        },
        initCell: (a0) => {
            const TWO_PI = 2 * Math.PI;
            return {
                latticeVectors: {
                    b1: [TWO_PI / a0, TWO_PI / (a0 * Math.sqrt(3))],
                    b2: [-TWO_PI / a0, TWO_PI / (a0 * Math.sqrt(3))],
                },
                kPoints: {
                    Gamma: [0, 0],
                    K: [(4 * Math.PI) / (3 * a0), 0],
                    Kp: [(-4 * Math.PI) / (3 * a0), 0],
                    M: [Math.PI / a0, -Math.PI / (a0 * Math.sqrt(3))],
                },
            };
        },
    },
    square: {
        name: '2D Square',
        a0: 3.0,
        drawCell: (ctx, cx, cy, scale, a0) => {
            const side = (Math.PI / a0) * scale;
            ctx.beginPath();
            ctx.rect(-side, -side, 2 * side, 2 * side);
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        },
        initCell: (a0) => {
            const TWO_PI = 2 * Math.PI;
            return {
                latticeVectors: {
                    b1: [TWO_PI / a0, 0],
                    b2: [0, TWO_PI / a0],
                },
                kPoints: {
                    Gamma: [0, 0],
                    X: [Math.PI / a0, 0],
                    Y: [0, Math.PI / a0],
                    M: [Math.PI / a0, Math.PI / a0],
                },
            };
        },
    },
    rectangular: {
        name: '2D Rectangular',
        a0: 3.0,
        b0: 2.0,
        drawCell: (ctx, cx, cy, scale, a0, b0 = 2.0) => {
            const width = (Math.PI / a0) * scale;
            const height = (Math.PI / b0) * scale;
            ctx.beginPath();
            ctx.rect(-width, -height, 2 * width, 2 * height);
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        },
        initCell: (a0, b0 = 2.0) => {
            const TWO_PI = 2 * Math.PI;
            return {
                latticeVectors: {
                    b1: [TWO_PI / a0, 0],
                    b2: [0, TWO_PI / b0],
                },
                kPoints: {
                    Gamma: [0, 0],
                    X: [Math.PI / a0, 0],
                    Y: [0, Math.PI / b0],
                    S: [Math.PI / a0, Math.PI / b0],
                },
            };
        },
    },
};

const CrystalCellComponent = ({
    cellType,
    a0,
    b0,
    scale,
    cx,
    cy,
    onKPointsChange,
}) => {
    const cellConfig = CRYSTAL_CELLS[cellType];
    const canvasRef = useRef(null);

    const cellData = useMemo(() => {
        if (cellConfig.initCell) {
            return cellConfig.initCell(a0, b0);
        }
        return { latticeVectors: {}, kPoints: {} };
    }, [cellType, a0, b0]);

    useEffect(() => {
        if (onKPointsChange) {
            onKPointsChange(cellData.kPoints, cellData.latticeVectors);
        }
    }, [cellData, onKPointsChange]);

    const drawCell = (ctx) => {
        ctx.save();
        ctx.translate(cx, cy);

        // Draw cell
        if (cellConfig.drawCell) {
            cellConfig.drawCell(ctx, 0, 0, scale, a0, b0);
        }

        // Draw k-points
        Object.entries(cellData.kPoints).forEach(([label, [kx, ky]]) => {
            const x = kx * scale;
            const y = -ky * scale;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = '#000';
            ctx.fill();
            ctx.font = '12px Arial';
            ctx.fillText(label, x + 5, y - 5);
        });

        ctx.restore();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw axes
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx - 160, cy);
        ctx.lineTo(cx + 160, cy);
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText('kₓ', cx + 160, cy - 5);

        ctx.beginPath();
        ctx.moveTo(cx, cy + 160);
        ctx.lineTo(cx, cy - 160);
        ctx.stroke();
        ctx.fillText('kᵧ', cx + 5, cy - 160);

        drawCell(ctx);
    }, [cellType, a0, b0, cx, cy, scale]);

    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={400}
            style={{ border: '1px solid #ccc' }}
        />
    );
};

const PulsePathAnimation = ({ params }) => {
    const pulseData = useMemo(() => generatePulseData(params), [params]);

    const [cellType, setCellType] = useState('hexagonal');
    const [a0, setA0] = useState(3.32);
    const [b0, setB0] = useState(2.0);
    const [startPoint, setStartPoint] = useState('K');
    const [kPoints, setKPoints] = useState({});
    const [latticeVectors, setLatticeVectors] = useState({});

    const handleCellDataChange = (newKPoints, newLatticeVectors) => {
        setKPoints(newKPoints);
        setLatticeVectors(newLatticeVectors);

        // Reset start point if it doesn't exist in new cell
        if (!newKPoints[startPoint]) {
            const firstPoint = Object.keys(newKPoints)[0];
            setStartPoint(firstPoint || 'Gamma');
        }
    };

    const trajectory = useMemo(() => {
        const startPosCartesian = kPoints[startPoint] || [0, 0];
        const { b1, b2 } = latticeVectors;

        if (!b1 || !b2) return [];

        return pulseData.map(({ t, Ax, Ay }) => {
            const dkx = Ax / 137.036;
            const dky = Ay / 137.036;

            const delta_kx = dkx * b1[0] + dky * b2[0];
            const delta_ky = dkx * b1[1] + dky * b2[1];

            const kx = startPosCartesian[0] + delta_kx;
            const ky = startPosCartesian[1] + delta_ky;

            return { t, kx, ky, Ax, Ay };
        });
    }, [pulseData, startPoint, kPoints, latticeVectors]);

    const trajectoryCanvasRef = useRef(null);
    const pulseCanvasRef = useRef(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const trajectoryCanvas = trajectoryCanvasRef.current;
        const pulseCanvas = pulseCanvasRef.current;

        if (!trajectoryCanvas || !pulseCanvas || trajectory.length === 0)
            return;

        const tctx = trajectoryCanvas.getContext('2d');
        const pctx = pulseCanvas.getContext('2d');

        const scale = 100;
        const cx = trajectoryCanvas.width / 2;
        const cy = trajectoryCanvas.height / 2;

        const drawTrajectory = () => {
            tctx.clearRect(
                0,
                0,
                trajectoryCanvas.width,
                trajectoryCanvas.height
            );

            // Draw trajectory path
            if (trajectory.length > 0) {
                tctx.beginPath();
                for (
                    let i = 0;
                    i <= Math.min(index, trajectory.length - 1);
                    i++
                ) {
                    const { kx, ky } = trajectory[i];
                    const x = cx + kx * scale;
                    const y = cy - ky * scale;
                    if (i === 0) tctx.moveTo(x, y);
                    else tctx.lineTo(x, y);
                }
                tctx.strokeStyle = '#0077cc';
                tctx.lineWidth = 2;
                tctx.stroke();

                // Draw current position
                const pt = trajectory[Math.min(index, trajectory.length - 1)];
                tctx.beginPath();
                tctx.arc(
                    cx + pt.kx * scale,
                    cy - pt.ky * scale,
                    4,
                    0,
                    2 * Math.PI
                );
                tctx.fillStyle = 'red';
                tctx.fill();
            }
        };

        const drawPulse = () => {
            pctx.clearRect(0, 0, pulseCanvas.width, pulseCanvas.height);

            const pwidth = pulseCanvas.width;
            const pheight = pulseCanvas.height;
            const baseY = pheight / 2;

            // Calculate time scaling based on actual time range
            const timeRange = params.t_f - params.t_i;
            const timeScale = (pwidth - 60) / timeRange; // Leave margin for labels

            // Find max amplitude for scaling
            const maxAmp = Math.max(
                ...trajectory.map((p) =>
                    Math.max(Math.abs(p.Ax), Math.abs(p.Ay))
                )
            );
            const ampScale = maxAmp > 0 ? (pheight / 2 - 40) / maxAmp : 1; // Leave margin for labels

            // Draw axes
            pctx.strokeStyle = '#ddd';
            pctx.lineWidth = 1;
            pctx.beginPath();
            pctx.moveTo(40, baseY);
            pctx.lineTo(pwidth - 20, baseY);
            pctx.stroke();

            pctx.beginPath();
            pctx.moveTo(40, 20);
            pctx.lineTo(40, pheight - 20);
            pctx.stroke();

            // Draw axis labels
            pctx.fillStyle = '#000';
            pctx.font = '12px Arial';
            pctx.fillText('t (fs)', pwidth - 50, pheight - 5);
            pctx.save();
            pctx.translate(15, pheight / 2);
            pctx.rotate(-Math.PI / 2);
            pctx.fillText('A(t)', 0, 0);
            pctx.restore();

            // Draw time ticks
            const numTicks = 5;
            for (let i = 0; i <= numTicks; i++) {
                const t = params.t_i + (i / numTicks) * timeRange;
                const x = 40 + (t - params.t_i) * timeScale;
                pctx.beginPath();
                pctx.moveTo(x, baseY - 3);
                pctx.lineTo(x, baseY + 3);
                pctx.stroke();
                pctx.fillText(t.toFixed(1), x - 10, baseY + 20);
            }

            if (trajectory.length > 0) {
                // Draw Ax
                pctx.beginPath();
                for (
                    let i = 0;
                    i <= Math.min(index, trajectory.length - 1);
                    i++
                ) {
                    const x = 40 + (trajectory[i].t - params.t_i) * timeScale;
                    const y = baseY - trajectory[i].Ax * ampScale;
                    if (i === 0) pctx.moveTo(x, y);
                    else pctx.lineTo(x, y);
                }
                pctx.strokeStyle = '#ff7300';
                pctx.lineWidth = 2;
                pctx.stroke();

                // Draw Ay
                pctx.beginPath();
                for (
                    let i = 0;
                    i <= Math.min(index, trajectory.length - 1);
                    i++
                ) {
                    const x = 40 + (trajectory[i].t - params.t_i) * timeScale;
                    const y = baseY - trajectory[i].Ay * ampScale;
                    if (i === 0) pctx.moveTo(x, y);
                    else pctx.lineTo(x, y);
                }
                pctx.strokeStyle = '#387908';
                pctx.lineWidth = 2;
                pctx.stroke();

                // Draw legend
                pctx.fillStyle = '#ff7300';
                pctx.fillText('Aₓ', pwidth - 80, 30);
                pctx.fillStyle = '#387908';
                pctx.fillText('Aᵧ', pwidth - 80, 50);
            }
        };

        drawTrajectory();
        drawPulse();
    }, [trajectory, index, params]);

    useEffect(() => {
        if (trajectory.length === 0) return;

        const interval = setInterval(() => {
            setIndex((i) => (i + 1 >= trajectory.length ? 0 : i + 1));
        }, 50);

        return () => clearInterval(interval);
    }, [trajectory.length]);

    return (
        <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
            <h2>k-Space Trajectory Tracking</h2>

            <div
                style={{
                    marginBottom: '20px',
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                }}
            >
                <div>
                    <label>
                        Crystal Cell Type:
                        <select
                            value={cellType}
                            onChange={(e) => setCellType(e.target.value)}
                            style={{ marginLeft: '10px' }}
                        >
                            {Object.entries(CRYSTAL_CELLS).map(
                                ([key, config]) => (
                                    <option key={key} value={key}>
                                        {config.name}
                                    </option>
                                )
                            )}
                        </select>
                    </label>
                </div>

                <div>
                    <label>
                        Lattice parameter a₀ (Å):
                        <input
                            type="text"
                            value={a0} // Keep value as a string
                            onChange={(e) => {
                                const val = e.target.value;
                                // Allow empty string or a string that can be parsed as a number (including partial decimals)
                                if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
                                    setA0(val); // Store the string value directly
                                }
                            }}
                            onBlur={(e) => {
                                // Convert to a number only when blurring, or if it's an invalid number, set to default
                                const numVal = parseFloat(e.target.value);
                                if (e.target.value === '' || isNaN(numVal)) {
                                    setA0('3.32'); // Set to default as a string
                                } else {
                                    setA0(numVal.toString()); // Convert the valid number back to a string for display
                                }
                            }}
                            style={{ marginLeft: '10px', width: '80px' }}
                        />
                    </label>
                </div>

                {cellType === 'rectangular' && (
                    <div>
                        <label>
                            Lattice parameter b₀ (Å):
                            <input
                                type="text"
                                value={b0}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Allow empty string or a string that can be parsed as a number (including partial decimals)
                                    if (
                                        val === '' ||
                                        /^-?\d*\.?\d*$/.test(val)
                                    ) {
                                        setB0(val); // Store the string value directly
                                    }
                                }}
                                onBlur={(e) => {
                                    // Convert to a number only when blurring, or if it's an invalid number, set to default
                                    const numVal = parseFloat(e.target.value);
                                    if (
                                        e.target.value === '' ||
                                        isNaN(numVal)
                                    ) {
                                        setB0('2.1'); // Set to default as a string
                                    } else {
                                        setB0(numVal.toString()); // Convert the valid number back to a string for display
                                    }
                                }}
                                style={{ marginLeft: '10px', width: '80px' }}
                            />
                        </label>
                    </div>
                )}

                <div>
                    <label>
                        Starting k-point:
                        <select
                            value={startPoint}
                            onChange={(e) => setStartPoint(e.target.value)}
                            style={{ marginLeft: '10px' }}
                        >
                            {Object.keys(kPoints).map((point) => (
                                <option key={point} value={point}>
                                    {point}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div>
                    <h3>k-Space Trajectory</h3>
                    <div style={{ position: 'relative' }}>
                        <CrystalCellComponent
                            cellType={cellType}
                            a0={a0}
                            b0={b0}
                            scale={100}
                            cx={200}
                            cy={200}
                            onKPointsChange={handleCellDataChange}
                        />
                        <canvas
                            ref={trajectoryCanvasRef}
                            width={400}
                            height={400}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                pointerEvents: 'none',
                            }}
                        />
                    </div>
                </div>

                <div>
                    <h3>Pulse Components vs Time</h3>
                    <canvas
                        ref={pulseCanvasRef}
                        width={400}
                        height={400}
                        style={{ border: '1px solid #ccc' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PulsePathAnimation;
