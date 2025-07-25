import React, { useState, useEffect } from 'react';

// Define the speed of light (c) and Planck's constant (h) for calculations
// c = 3 x 10^8 m/s
// h = 6.626 x 10^-34 J.s
// electron charge e = 1.602 x 10^-19 C
// Energy E = hc/lambda (Joules)
// Energy in eV = E_J / e = (hc / (lambda * e))
// Simplified: E_eV = 1240 / lambda_nm (where lambda_nm is wavelength in nanometers)

// const ElectromagneticSpectrum = ({ wavelength }) => {
//     // Data for the electromagnetic spectrum, including wavelength, frequency, and energy ranges.
//     // Wavelengths are in meters (m), Frequencies in Hertz (Hz), and Energy in electron Volts (eV).
//     // The ranges are approximate and can vary slightly depending on the source.
//     const spectrumData = [
//         {
//             waveType: 'Gamma Rays',
//             startWavelength: '1e-19', // meters
//             endWavelength: '1e-12', // meters
//             startFrequency: '3e+20', // Hz (calculated from endWavelength: c / 1e-12)
//             endFrequency: '3e+27', // Hz (calculated from startWavelength: c / 1e-19)
//             startEnergy: '1.24e+6', // eV (calculated from endWavelength: 1240 / (1e-12 * 1e9))
//             endEnergy: '1.24e+13', // eV (calculated from startWavelength: 1240 / (1e-19 * 1e9))
//         },
//         {
//             waveType: 'X-rays',
//             startWavelength: '1e-12',
//             endWavelength: '1e-8',
//             startFrequency: '3e+16', // Hz (c / 1e-8)
//             endFrequency: '3e+20', // Hz (c / 1e-12)
//             startEnergy: '1.24e+2', // eV (1240 / (1e-8 * 1e9))
//             endEnergy: '1.24e+6', // eV (1240 / (1e-12 * 1e9))
//         },
//         {
//             waveType: 'Ultraviolet',
//             startWavelength: '1e-8',
//             endWavelength: '4e-7', // 400 nm
//             startFrequency: '7.5e+14', // Hz (c / 4e-7)
//             endFrequency: '3e+16', // Hz (c / 1e-8)
//             startEnergy: '3.1', // eV (1240 / (4e-7 * 1e9))
//             endEnergy: '1.24e+2', // eV (1240 / (1e-8 * 1e9))
//         },
//         {
//             waveType: 'Visible Light',
//             startWavelength: '4e-7', // 400 nm
//             endWavelength: '7e-7', // 700 nm
//             startFrequency: '4.28e+14', // Hz (c / 7e-7)
//             endFrequency: '7.5e+14', // Hz (c / 4e-7)
//             startEnergy: '1.77', // eV (1240 / (7e-7 * 1e9))
//             endEnergy: '3.1', // eV (1240 / (4e-7 * 1e9))
//         },
//         {
//             waveType: 'Infrared',
//             startWavelength: '7e-7', // 700 nm
//             endWavelength: '1e-3', // 1 mm
//             startFrequency: '3e+11', // Hz (c / 1e-3)
//             endFrequency: '4.28e+14', // Hz (c / 7e-7)
//             startEnergy: '1.24e-3', // eV (1240 / (1e-3 * 1e9))
//             endEnergy: '1.77', // eV (1240 / (7e-7 * 1e9))
//         },
//         {
//             waveType: 'Microwaves',
//             startWavelength: '1e-3', // 1 mm
//             endWavelength: '1', // 1 m
//             startFrequency: '3e+8', // Hz (c / 1)
//             endFrequency: '3e+11', // Hz (c / 1e-3)
//             startEnergy: '1.24e-6', // eV (1240 / (1 * 1e9))
//             endEnergy: '1.24e-3', // eV (1240 / (1e-3 * 1e9))
//         },
//         {
//             waveType: 'Radio Waves',
//             startWavelength: '1', // 1 m
//             endWavelength: '1e+5', // 100 km (can be much longer)
//             startFrequency: '3e+3', // Hz (c / 1e+5)
//             endFrequency: '3e+8', // Hz (c / 1)
//             startEnergy: '1.24e-11', // eV (1240 / (1e+5 * 1e9))
//             endEnergy: '1.24e-6', // eV (1240 / (1 * 1e9))
//         },
//     ];

const ElectromagneticSpectrum = ({ wavelength }) => {
    const regions = [
        // { name: 'Radio', min: 1e6, max: Infinity, color: '#b0e0e6' },
        // { name: 'Microwave', min: 1e3, max: 1e6, color: '#dda0dd' },
        // { name: 'Infrared', min: 700, max: 1e3, color: '#fa8072' },
        // { name: 'Visible', min: 380, max: 700, color: '#ffd700' },
        // { name: 'Ultraviolet', min: 10, max: 380, color: '#87cefa' },
        // { name: 'X-rays', min: 0.01, max: 10, color: '#f0e68c' },
        // { name: 'Gamma', min: 0, max: 0.01, color: '#ff69b4' },
        { name: 'Radio', min: 1e7, max: Infinity, color: '#b0e0e6' },
        { name: 'Microwave', min: 1e4, max: 1e7, color: '#dda0dd' },
        { name: 'Infrared', min: 700, max: 1e4, color: '#fa8072' },
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
                    <th style={cellStyle}>Type</th>
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

export default ElectromagneticSpectrum;
