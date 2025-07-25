import React, { useState, useEffect, useRef } from 'react';
import ElectromagneticSpectrum from './ElectromagneticSpectrum';

const unitList = ['a.u.', 'eV', 'nm', 'cm-1', 'THz', 'fs'];

function convertEnergy(value, unit) {
    const csol = 299792458;
    const hartree_to_eV = 27.211386245988;
    const fs_to_thz = 1000;

    let hw, a_u, thz, cm1, nm, fs;

    switch (unit) {
        case 'a.u.':
            a_u = value;
            hw = a_u * hartree_to_eV;
            break;
        case 'eV':
            hw = value;
            a_u = hw / hartree_to_eV;
            break;
        case 'nm':
            nm = value;
            thz = (csol * 1e-6) / nm;
            hw = 4.135667696e-3 * thz;
            a_u = hw / hartree_to_eV;
            break;
        case 'THz':
            thz = value;
            hw = 4.135667696e-3 * thz;
            a_u = hw / hartree_to_eV;
            break;
        case 'cm-1':
            cm1 = value;
            thz = (cm1 * csol) / 1e10;
            hw = 4.135667696e-3 * thz;
            a_u = hw / hartree_to_eV;
            break;
        case 'fs':
            fs = value;
            thz = fs_to_thz / fs;
            hw = 4.135667696e-3 * thz;
            a_u = hw / hartree_to_eV;
            break;
        default:
            return null;
    }

    thz = thz ?? (1000 * hw) / 4.135667696;
    cm1 = cm1 ?? (thz * 1e10) / csol;
    nm = nm ?? (csol * 1e-3) / thz;
    fs = fs ?? 1000 / thz;

    return {
        'a.u.': a_u,
        eV: hw,
        THz: thz,
        'cm-1': cm1,
        nm: nm,
        fs: fs,
    };
}

const EnergyUnitConverter = () => {
    const [energyValues, setEnergyValues] = useState(convertEnergy(1, 'eV'));
    const [inputBuffer, setInputBuffer] = useState({});

    const handleChange = (unit) => (e) => {
        const val = e.target.value;
        setInputBuffer((prev) => ({ ...prev, [unit]: val }));
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            const result = convertEnergy(parsed, unit);
            if (result) setEnergyValues(result);
        }
    };

    return (
        <div className="px-8 py-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Energy Unit Converter
            </h2>
            <fieldset className="max-w-3xl mx-auto border rounded p-6">
                <legend className="text-xl font-semibold mb-4 text-center">
                    Input the data
                </legend>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {unitList.map((unit, idx) => (
                        <div
                            key={unit}
                            style={{ width: '200px', margin: '10px' }}
                        >
                            <input
                                id={`input-${unit}`}
                                type="text"
                                className="flex-grow border rounded px-3 py-2 text-right"
                                value={
                                    inputBuffer[unit] !== undefined
                                        ? inputBuffer[unit]
                                        : energyValues[unit].toExponential(10)
                                }
                                onChange={handleChange(unit)}
                                onBlur={() =>
                                    setInputBuffer((prev) => ({
                                        ...prev,
                                        [unit]: undefined,
                                    }))
                                }
                            />
                            <label
                                htmlFor={`input-${unit}`}
                                className="whitespace-nowrap text-lg font-medium"
                            >
                                {' ' + unit}
                            </label>
                        </div>
                    ))}
                </div>
            </fieldset>
            <EMSpectrum wavelength={energyValues['nm']} />
        </div>
    );
};

const EMSpectrum = ({ wavelength }) => {
    const [containerWidth, setContainerWidth] = useState(1060);
    const containerRef = useRef(null);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                const containerElement = containerRef.current;
                const rect = containerElement.getBoundingClientRect();
                // Use the container width minus some padding
                setContainerWidth(Math.max(300, rect.width - 40));
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const regions = [
        {
            name: 'Radio',
            max: 1e22,
            min: 1e7,
            color: '#b0e0e6',
            labelY: 12,
            labelDirect: true,
        },
        {
            name: 'Microwave',
            max: 1e7,
            min: 1e4,
            color: '#dda0dd',
            labelY: 12,
            labelDirect: true,
        },
        {
            name: 'Infrared',
            max: 1e4,
            min: 700,
            color: '#fa8072',
            labelY: 10,
            labelDirect: false,
        },
        {
            name: 'Visible',
            max: 700,
            min: 380,
            color: '#ffd700',
            labelY: 50,
            labelDirect: false,
        },
        {
            name: 'Ultraviolet',
            max: 380,
            min: 10,
            color: '#87cefa',
            labelY: 12,
            labelDirect: true,
        },
        {
            name: 'X-rays',
            max: 10,
            min: 0.01,
            color: '#f0e68c',
            labelY: 12,
            labelDirect: true,
        },
        {
            name: 'Gamma',
            max: 0.01,
            min: 1e-9,
            color: '#ff69b4',
            labelY: 12,
            labelDirect: true,
        },
    ];

    const width = containerWidth;
    const height = 60;
    const log = (x) => Math.log10(x);
    const x = (val) =>
        ((log(val) - log(1e-9)) / (log(1e22) - log(1e-9))) * width;

    return (
        <div ref={containerRef} className="w-full">
            <h3 className="text-lg font-semibold mb-2 text-center">
                Electromagnetic Spectrum
            </h3>
            <p className="text-center">
                The red line corresponds with above data
            </p>
            <svg
                width={width}
                height={height + 40}
                className="border rounded block mx-auto max-w-full"
                viewBox={`0 0 ${width} ${height + 40}`}
                preserveAspectRatio="xMidYMid meet"
            >
                {regions.map((r) => (
                    <g key={r.name}>
                        <rect
                            x={x(r.min)}
                            y={20}
                            width={x(r.max) - x(r.min)}
                            height={30}
                            fill={r.color}
                        />
                        {r.labelDirect ? (
                            <text
                                x={(x(r.min) + x(r.max)) / 2}
                                y={r.labelY}
                                fontSize={Math.max(8, width / 100)}
                                textAnchor="middle"
                            >
                                {r.name}
                            </text>
                        ) : (
                            <>
                                <text
                                    x={(x(r.min) + x(r.max)) / 2}
                                    y={r.labelY < 20 ? 10 : 70}
                                    fontSize={Math.max(8, width / 100)}
                                    textAnchor="middle"
                                >
                                    {r.name}
                                </text>
                                <line
                                    x1={(x(r.min) + x(r.max)) / 2}
                                    x2={(x(r.min) + x(r.max)) / 2}
                                    y1={r.labelY < 20 ? 15 : 65}
                                    y2={r.labelY < 20 ? 20 : 50}
                                    stroke="black"
                                    strokeDasharray="2,2"
                                />
                            </>
                        )}
                    </g>
                ))}
                <line
                    x1={x(wavelength)}
                    x2={x(wavelength)}
                    y1={20}
                    y2={50}
                    stroke="red"
                    strokeWidth={2}
                />
            </svg>
            <p className="text-sm mt-1 text-center">
                Current <b>wavelength:</b> {wavelength.toFixed(6)} nm. And
                corresponding <b>frequency:</b>{' '}
                {(299792458 / wavelength).toFixed(6)} Hz.
            </p>
            <div>
                <ElectromagneticSpectrum wavelength={wavelength} />
            </div>
        </div>
    );
};

export default EnergyUnitConverter;
