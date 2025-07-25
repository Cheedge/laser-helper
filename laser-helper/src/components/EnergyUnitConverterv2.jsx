import React, { useState } from 'react';

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

const EMSpectrumTable = ({ wavelength }) => {
    const regions = [
        { name: 'Radio', min: 1e6, max: Infinity, color: '#b0e0e6' },
        { name: 'Microwave', min: 1e3, max: 1e6, color: '#dda0dd' },
        { name: 'Infrared', min: 700, max: 1e3, color: '#fa8072' },
        { name: 'Visible', min: 380, max: 700, color: '#ffd700' },
        { name: 'Ultraviolet', min: 10, max: 380, color: '#87cefa' },
        { name: 'X-rays', min: 0.01, max: 10, color: '#f0e68c' },
        { name: 'Gamma', min: 0, max: 0.01, color: '#ff69b4' },
    ];

    return (
        <table
            style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '20px',
            }}
        >
            <thead>
                <tr style={{ background: '#f2f2f2' }}>
                    <th style={cellStyle}>Region</th>
                    <th style={cellStyle}>Wavelength Range (nm)</th>
                </tr>
            </thead>
            <tbody>
                {regions.map((region) => {
                    const isActive =
                        wavelength <= region.max && wavelength > region.min;
                    return (
                        <tr
                            key={region.name}
                            style={{
                                background: region.color,
                                border: isActive
                                    ? '2px solid red'
                                    : '1px solid #ccc',
                            }}
                        >
                            <td style={cellStyle}>{region.name}</td>
                            <td style={cellStyle}>
                                {region.max === Infinity
                                    ? `> ${region.min.toExponential(1)}`
                                    : `${region.min} – ${region.max}`}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

const cellStyle = {
    padding: '8px',
    textAlign: 'center',
    border: '1px solid #ccc',
};

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
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center' }}>Energy Unit Converter</h2>
            <fieldset style={{ padding: '10px', border: '1px solid #ccc' }}>
                <legend>Input Data</legend>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {unitList.map((unit) => (
                        <div
                            key={unit}
                            style={{ width: '200px', margin: '10px' }}
                        >
                            <input
                                type="text"
                                style={{
                                    width: '120px',
                                    textAlign: 'right',
                                    padding: '4px',
                                }}
                                value={
                                    inputBuffer[unit] !== undefined
                                        ? inputBuffer[unit]
                                        : energyValues[unit].toExponential(5)
                                }
                                onChange={handleChange(unit)}
                                onBlur={() =>
                                    setInputBuffer((prev) => ({
                                        ...prev,
                                        [unit]: undefined,
                                    }))
                                }
                            />
                            <label>{' ' + unit}</label>
                        </div>
                    ))}
                </div>
            </fieldset>
            <EMSpectrumTable wavelength={energyValues['nm']} />
            <p style={{ textAlign: 'center', marginTop: '10px' }}>
                <b>Current wavelength:</b> {energyValues.nm.toFixed(2)} nm,{' '}
                <b>Frequency:</b>{' '}
                {(299792458 / (energyValues.nm * 1e-9) / 1e12).toFixed(2)} THz.
            </p>
        </div>
    );
};

export default EnergyUnitConverter;
