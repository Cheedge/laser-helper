import React, { useMemo, useState } from 'react';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    ScatterChart,
    Scatter,
} from 'recharts';

const fsToEv = 1.519;

// const defaultParams = {
//     delta_t: 0.1,
//     t_i: 10,
//     t_f: 30,
//     t_0: 20,
//     A1x: 20,
//     A1y: 0,
//     omega1: 0.4 * fsToEv,
//     sigma1: 2,
//     phi1x: -0.5,
//     phi1y: -0.5,
//     A2x: 1,
//     A2y: 1,
//     omega2: 1.6 * fsToEv,
//     sigma2: 3.18,
//     phi2x: -0.5,
//     phi2y: 0,
// };

function gaussian(t, t0, sigma) {
    return Math.exp(-((t - t0) ** 2) / (2 * sigma ** 2));
}

function sinPulse(t, omega, phi) {
    return Math.sin(omega * t + phi);
}

function generatePulseData(p) {
    const data = [];
    for (let t = p.t_i; t <= p.t_f; t += p.delta_t) {
        const t_shift = t - p.t_0;

        const g1 = gaussian(t, p.t_0, p.sigma1);
        const g2 = gaussian(t, p.t_0, p.sigma2);

        const A1x = p.A1x * g1 * sinPulse(t_shift, p.omega1, p.phi1x);
        const A1y = p.A1y * g1 * sinPulse(t_shift, p.omega1, p.phi1y);
        const A2x = p.A2x * g2 * sinPulse(t_shift, p.omega2, p.phi2x);
        const A2y = p.A2y * g2 * sinPulse(t_shift, p.omega2, p.phi2y);

        const Ax = A1x + A2x;
        const Ay = A1y + A2y;

        const t_prev = t - p.delta_t;
        const t_shift_prev = t_prev - p.t_0;

        const g1_prev = gaussian(t_prev, p.t_0, p.sigma1);
        const g2_prev = gaussian(t_prev, p.t_0, p.sigma2);

        const A1x_prev =
            p.A1x * g1_prev * sinPulse(t_shift_prev, p.omega1, p.phi1x);
        const A1y_prev =
            p.A1y * g1_prev * sinPulse(t_shift_prev, p.omega1, p.phi1y);
        const A2x_prev =
            p.A2x * g2_prev * sinPulse(t_shift_prev, p.omega2, p.phi2x);
        const A2y_prev =
            p.A2y * g2_prev * sinPulse(t_shift_prev, p.omega2, p.phi2y);

        const Ax_prev = A1x_prev + A2x_prev;
        const Ay_prev = A1y_prev + A2y_prev;

        const Ex = -(Ax - Ax_prev) / p.delta_t;
        const Ey = -(Ay - Ay_prev) / p.delta_t;

        data.push({
            t: +t.toFixed(2),
            A1x,
            A1y,
            A2x,
            A2y,
            Ax,
            Ay,
            Envelope1: p.A1x * g1,
            Envelope2: p.A2x * g2,
            Ex,
            Ey,
        });
    }
    return data;
}

function computeFluence(data) {
    const C = -137.035999074;
    const to_mJ_per_cm2 = 848.89650302;
    let sumE = 0;
    for (let i = 1; i < data.length - 1; i++) {
        const dt = data[i + 1].t - data[i - 1].t;
        const Ex = (data[i + 1].Ax - data[i - 1].Ax) / (C * dt);
        const Ey = (data[i + 1].Ay - data[i - 1].Ay) / (C * dt);
        sumE += ((Ex ** 2 + Ey ** 2) * dt) / 2;
    }
    return (sumE * to_mJ_per_cm2).toFixed(4);
}

const labelMap = {
    delta_t: 'Δt',
    t_i: 't ⁱ (plot start)',
    t_f: 'tᶠ (plot end)',
    t_0: 't⁰',
    A1x: 'A₁ₓ',
    A1y: 'A₁ᵧ',
    omega1: 'ω₁',
    sigma1: 'σ₁',
    phi1x: 'φ₁ₓ',
    phi1y: 'φ₁ᵧ',
    A2x: 'A₂ₓ',
    A2y: 'A₂ᵧ',
    omega2: 'ω₂',
    sigma2: 'σ₂',
    phi2x: 'φ₂ₓ',
    phi2y: 'φ₂ᵧ',
};

const PulseVisualization = ({ params, setParams }) => {
    const [polarChoice, setPolarChoice] = useState('AxAy');
    const [visibility, setVisibility] = useState({
        Ax: true,
        Ay: true,
        A1x: true,
        A2x: true,
        A1y: true,
        A2y: true,
        Envelope1: true,
        Envelope2: true,
    });

    // Initialize form values only once and keep them independent
    const [formValues, setFormValues] = useState(() => {
        const initialValues = {};
        Object.entries(params).forEach(([key, value]) => {
            if (key.includes('omega')) {
                initialValues[key] = String(value.toFixed(6));
            } else if (key.includes('phi')) {
                initialValues[key] = String(value.toFixed(6));
            } else {
                initialValues[key] = String(value);
            }
        });
        return initialValues;
    });

    // const pulseData = useMemo(() => generatePulseData(params), [params]);
    const pulseData = useMemo(() => {
        console.log('Generating pulse with params:', params);
        return generatePulseData(params);
    }, [params]);

    const fluence = useMemo(() => computeFluence(pulseData), [pulseData]);

    // Reset form values to match current params (for external updates)
    const resetFormValues = () => {
        const newFormValues = {};
        Object.entries(params).forEach(([key, value]) => {
            if (key.includes('omega')) {
                newFormValues[key] = String(value.toFixed(6));
            } else if (key.includes('phi')) {
                newFormValues[key] = String(value.toFixed(6));
            } else {
                newFormValues[key] = String(value);
            }
        });
        setFormValues(newFormValues);
    };

    const updateFormValue = (key, value) => {
        setFormValues((prev) => ({ ...prev, [key]: value }));
    };

    const toggleVisibility = (key) => {
        setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const polarizationKeys = {
        AxAy: ['Ax', 'Ay'],
        A1xA1y: ['A1x', 'A1y'],
        A2xA2y: ['A2x', 'A2y'],
    };

    const applyChanges = () => {
        const newParams = {};
        for (const key in formValues) {
            const val = formValues[key];
            if (val.trim() === '') continue;
            const parsed = parseFloat(val);
            if (isNaN(parsed)) continue;
            if (key.includes('omega')) {
                newParams[key] = parsed * fsToEv;
            } else if (key.includes('phi')) {
                newParams[key] = parsed * Math.PI;
            } else {
                newParams[key] = parsed;
            }
        }
        setParams((prev) => ({ ...prev, ...newParams }));
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
            <h2>Pulse Parameters</h2>
            <h3>
                <center>
                    <b>
                        A(t)=A<sub>0</sub>exp[ -(t-t<sub>0</sub>)<sup>2</sup>/2σ
                        <sup>2</sup> ]sin[ω(t−t<sub>0</sub>)+ϕ<sub>CEP</sub>]
                    </b>
                </center>
            </h3>
            <fieldset>
                <legend>Time Setup (fs)</legend>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {['delta_t', 't_i', 't_f', 't_0'].map((key) => (
                        <div
                            key={key}
                            style={{ width: '150px', margin: '5px' }}
                        >
                            <label>{labelMap[key]}: </label>
                            <input
                                type="number"
                                value={formValues[key]}
                                onChange={(e) =>
                                    updateFormValue(key, e.target.value)
                                }
                            />
                        </div>
                    ))}
                </div>
            </fieldset>
            <fieldset>
                <legend>Pulse 1</legend>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {['A1x', 'A1y', 'omega1', 'sigma1', 'phi1x', 'phi1y'].map(
                        (key) => (
                            <div
                                key={key}
                                style={{ width: '160px', margin: '10px' }}
                            >
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '4px',
                                    }}
                                >
                                    {key === 'omega1'
                                        ? `${labelMap[key]} (eV)`
                                        : key === 'phi1x' || key === 'phi1y'
                                        ? `${labelMap[key]} (π)`
                                        : labelMap[key]}
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formValues[key]}
                                    onChange={(e) =>
                                        updateFormValue(key, e.target.value)
                                    }
                                    style={{ width: '100%', padding: '4px' }}
                                />
                            </div>
                        )
                    )}
                </div>
            </fieldset>
            <fieldset>
                <legend>Pulse 2</legend>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {['A2x', 'A2y', 'omega2', 'sigma2', 'phi2x', 'phi2y'].map(
                        (key) => (
                            <div
                                key={key}
                                style={{ width: '160px', margin: '10px' }}
                            >
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '4px',
                                    }}
                                >
                                    {key === 'omega2'
                                        ? `${labelMap[key]} (eV)`
                                        : key === 'phi2x' || key === 'phi2y'
                                        ? `${labelMap[key]} (π)`
                                        : labelMap[key]}
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formValues[key]}
                                    onChange={(e) =>
                                        updateFormValue(key, e.target.value)
                                    }
                                    style={{ width: '100%', padding: '4px' }}
                                />
                            </div>
                        )
                    )}
                </div>
            </fieldset>
            <div style={{ marginBottom: '24px', marginTop: '24px' }}>
                <button
                    onClick={applyChanges}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#3b82f6',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        color: 'white',
                        fontSize: '1rem',
                        marginRight: '10px',
                    }}
                >
                    Apply Changes
                </button>
                <button
                    onClick={resetFormValues}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#6b7280',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        color: 'white',
                        fontSize: '1rem',
                    }}
                >
                    Reset Form
                </button>
            </div>
            <h2>Full Hybrid Pulse (Aₓ = A₁ₓ + A₂ₓ, Aᵧ = A₁ᵧ + A₂ᵧ)</h2>
            {Object.keys(visibility).map((key) => (
                <label key={key} style={{ marginRight: '10px' }}>
                    <input
                        type="checkbox"
                        checked={visibility[key]}
                        onChange={() => toggleVisibility(key)}
                    />{' '}
                    {key}
                </label>
            ))}
            <LineChart width={800} height={300} data={pulseData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis
                    dataKey="t"
                    label={{
                        value: 'Time (fs)',
                        position: 'insideBottomRight',
                        offset: -5,
                    }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {visibility.Ax && (
                    <Line dataKey="Ax" stroke="#ff7300" dot={false} name="Aₓ" />
                )}
                {visibility.Ay && (
                    <Line dataKey="Ay" stroke="#387908" dot={false} name="Aᵧ" />
                )}
                {visibility.A1x && (
                    <Line
                        dataKey="A1x"
                        stroke="#0000ff"
                        dot={false}
                        name="A₁ₓ"
                    />
                )}
                {visibility.A2x && (
                    <Line
                        dataKey="A2x"
                        stroke="#a99999"
                        dot={false}
                        name="A₂ₓ"
                    />
                )}
                {visibility.A1y && (
                    <Line
                        dataKey="A1y"
                        stroke="#cc55aa"
                        dot={false}
                        name="A₁ᵧ"
                    />
                )}
                {visibility.A2y && (
                    <Line
                        dataKey="A2y"
                        stroke="#55aacc"
                        dot={false}
                        name="A₂ᵧ"
                    />
                )}
                {visibility.Envelope1 && (
                    <Line
                        dataKey="Envelope1"
                        stroke="#8884d8"
                        dot={false}
                        strokeDasharray="5 5"
                        name="Pulse 1 Envelope"
                    />
                )}
                {visibility.Envelope2 && (
                    <Line
                        dataKey="Envelope2"
                        stroke="#82ca9d"
                        dot={false}
                        strokeDasharray="5 5"
                        name="Pulse 2 Envelope"
                    />
                )}
            </LineChart>
            <h2>Polarization Path (Aₓ vs Aᵧ)</h2>
            <label>
                Select Ax, Ay:
                <select
                    value={polarChoice}
                    onChange={(e) => setPolarChoice(e.target.value)}
                >
                    <option value="AxAy">Ax, Ay</option>
                    <option value="A1xA1y">A1x, A1y</option>
                    <option value="A2xA2y">A2x, A2y</option>
                </select>
            </label>
            <ScatterChart width={400} height={400}>
                <CartesianGrid stroke="#ccc" />
                <XAxis
                    dataKey={polarizationKeys[polarChoice][0]}
                    name="Aₓ"
                    type="number"
                />
                <YAxis
                    dataKey={polarizationKeys[polarChoice][1]}
                    name="Aᵧ"
                    type="number"
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                    name="Trajectory"
                    data={pulseData}
                    fill="#ff7300"
                    line
                />
            </ScatterChart>
            <h2>Electric Fields Eₓ(t), Eᵧ(t)</h2>
            <LineChart width={800} height={300} data={pulseData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis
                    dataKey="t"
                    label={{
                        value: 'Time (fs)',
                        offset: -5,
                        position: 'insideBottomRight',
                    }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    dataKey="Ex"
                    stroke="#ff7300"
                    dot={false}
                    name="Eₓ = -dAₓ/dt"
                />
                <Line
                    dataKey="Ey"
                    stroke="#387908"
                    dot={false}
                    name="Eᵧ = -dAᵧ/dt"
                />
            </LineChart>
            <h2>Pulse Characteristics</h2>
            <p>
                <strong>Total Fluence = </strong> {fluence} mJ/cm²
            </p>
            <p>
                <strong>
                    Pulse 1 FWHM<sub>1</sub> ={' '}
                </strong>{' '}
                {(2 * Math.sqrt(2 * Math.log(2)) * params['sigma1']).toFixed(4)}{' '}
                fs
            </p>
            <p>
                <strong>
                    Pulse 2 FWHM<sub>2</sub> ={' '}
                </strong>{' '}
                {(2 * Math.sqrt(2 * Math.log(2)) * params['sigma2']).toFixed(4)}{' '}
                fs
            </p>
            <p>
                <strong>
                    Pulse 1 T<sub>1</sub> ={' '}
                </strong>{' '}
                {((2 * Math.PI) / params['omega1']).toFixed(4)} fs
            </p>{' '}
            <p>
                <strong>
                    Pulse 2 T<sub>2</sub> ={' '}
                </strong>{' '}
                {((2 * Math.PI) / params['omega2']).toFixed(4)} fs
            </p>
            <p>
                <strong>Pulse 1 main cycle count = </strong>{' '}
                {(
                    (Math.sqrt(2 * Math.log(2)) * params['sigma1']) /
                    (Math.PI / params['omega1'])
                ).toFixed(4)}
            </p>
            <p>
                <strong>Pulse 2 main cycle count = </strong>{' '}
                {(
                    (Math.sqrt(2 * Math.log(2)) * params['sigma2']) /
                    (Math.PI / params['omega2'])
                ).toFixed(4)}
            </p>
            <p>
                <i>{'99.73% confidence interval (6σ / T):'}</i>
            </p>
            <p>
                <strong>Pulse 1 all cycles count = </strong>{' '}
                {(
                    (6 * params['sigma1']) /
                    ((2 * Math.PI) / params['omega1'])
                ).toFixed(4)}
            </p>
            <p>
                <strong>Pulse 2 all cycles count = </strong>{' '}
                {(
                    (6 * params['sigma2']) /
                    ((2 * Math.PI) / params['omega2'])
                ).toFixed(4)}
            </p>
        </div>
    );
};

export default PulseVisualization;
