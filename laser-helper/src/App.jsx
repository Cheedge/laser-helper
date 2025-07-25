import LaserPulsePage from './components/LaserPulsePage';
import EnergyUnitConverter from './components/EnergyUnitConverter';
import React, { useState } from 'react';
import {
    Zap,
    Calculator,
    Menu,
    Github,
    Mail,
    ArrowLeft,
    Code2,
} from 'lucide-react';

const App = () => {
    const [activeComponent, setActiveComponent] = useState('home');

    const components = [
        {
            id: 'laser-pulse',
            name: 'Laser Pulse Calculator',
            description: 'Calculate laser pulse parameters',
            icon: <Zap style={{ color: '#EF4444' }} />,
            component: <LaserPulsePage />,
        },
        {
            id: 'energy-converter',
            name: 'Energy Unit Converter',
            description: 'Convert between energy units',
            icon: <Calculator style={{ color: '#3B82F6' }} />,
            component: <EnergyUnitConverter />,
        },
    ];

    const HomePage = () => (
        <div
            style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow:
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: '32px',
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2
                    style={{
                        fontSize: '30px',
                        fontWeight: 'bold',
                        color: '#1F2937',
                        marginBottom: '16px',
                    }}
                >
                    Welcome to Laser Helper
                </h2>
                <p
                    style={{
                        color: '#4B5563',
                        maxWidth: '672px',
                        margin: '0 auto',
                    }}
                >
                    Your comprehensive toolkit for laser calculations and
                    conversions. Choose from the tools below to get started with
                    your laser physics calculations.
                </p>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                }}
            >
                {components.map((comp) => (
                    <div
                        key={comp.id}
                        onClick={() => setActiveComponent(comp.id)}
                        style={{
                            background:
                                'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
                            padding: '24px',
                            borderRadius: '8px',
                            border: '2px solid #E5E7EB',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.borderColor = '#D1D5DB';
                            e.target.style.boxShadow =
                                '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.borderColor = '#E5E7EB';
                            e.target.style.boxShadow =
                                '0 1px 3px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                marginBottom: '12px',
                            }}
                        >
                            {comp.icon}
                            <h3
                                style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: '#1F2937',
                                }}
                            >
                                {comp.name}
                            </h3>
                        </div>
                        <p style={{ color: '#4B5563' }}>{comp.description}</p>
                        <div
                            style={{
                                marginTop: '16px',
                                fontSize: '14px',
                                color: '#6B7280',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            Click to open{' '}
                            <span style={{ fontSize: '18px' }}>→</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderActiveComponent = () => {
        if (activeComponent === 'home') {
            return <HomePage />;
        }

        const selectedComponent = components.find(
            (comp) => comp.id === activeComponent
        );
        return (
            <div>
                {/* Back button */}
                <button
                    onClick={() => setActiveComponent('home')}
                    style={{
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#F3F4F6',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        color: '#374151',
                        fontSize: '1.25rem',
                    }}
                    onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = '#E5E7EB')
                    }
                    onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = '#F3F4F6')
                    }
                >
                    <ArrowLeft style={{ width: '16px', height: '16px' }} />
                    Back to Home
                </button>

                <div
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow:
                            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        padding: '32px',
                    }}
                >
                    {selectedComponent?.component || <HomePage />}
                </div>
            </div>
        );
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background:
                    'linear-gradient(135deg, #EFF6FF 0%, #F3E8FF 50%, #FDF2F8 100%)',
            }}
        >
            {/* Header */}
            <header
                style={{
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    borderBottom: '1px solid #E5E7EB',
                }}
            >
                <div
                    style={{
                        maxWidth: '1152px',
                        margin: '0 auto',
                        padding: '16px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}
                        >
                            <div
                                style={{
                                    background:
                                        'linear-gradient(45deg, #EF4444 0%, #9333EA 100%)',
                                    padding: '8px',
                                    borderRadius: '8px',
                                }}
                            >
                                <Zap
                                    style={{
                                        color: 'white',
                                        width: '24px',
                                        height: '24px',
                                    }}
                                />
                            </div>
                            <h1
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    background:
                                        'linear-gradient(45deg, #EF4444 0%, #9333EA 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Laser Helper
                            </h1>
                        </div>

                        <nav
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '24px',
                            }}
                        >
                            <button
                                onClick={() => setActiveComponent('home')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    backgroundColor:
                                        activeComponent === 'home'
                                            ? '#F3F4F6'
                                            : 'transparent',
                                    color:
                                        activeComponent === 'home'
                                            ? '#1F2937'
                                            : '#4B5563',
                                    fontSize: '1.25rem',
                                }}
                                onMouseEnter={(e) => {
                                    if (activeComponent !== 'home') {
                                        e.target.style.color = '#1F2937';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeComponent !== 'home') {
                                        e.target.style.color = '#4B5563';
                                    }
                                }}
                            >
                                Home
                            </button>
                            {components.map((comp) => (
                                <button
                                    key={comp.id}
                                    onClick={() => setActiveComponent(comp.id)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontSize: '1.25rem',
                                        backgroundColor:
                                            activeComponent === comp.id
                                                ? '#F3F4F6'
                                                : 'transparent',
                                        color:
                                            activeComponent === comp.id
                                                ? '#1F2937'
                                                : '#4B5563',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeComponent !== comp.id) {
                                            e.target.style.color = '#1F2937';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeComponent !== comp.id) {
                                            e.target.style.color = '#4B5563';
                                        }
                                    }}
                                >
                                    {comp.name}
                                </button>
                            ))}
                        </nav>

                        {/* <button
                            style={{
                                padding: '8px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                display: 'block',
                            }}
                        >
                            <Menu
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    color: '#4B5563',
                                }}
                            />
                        </button> */}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main
                style={{
                    maxWidth: '1152px',
                    margin: '0 auto',
                    padding: '32px 16px',
                }}
            >
                <div style={{ minHeight: '384px' }}>
                    {renderActiveComponent()}
                </div>
            </main>

            {/* Footer */}
            <footer
                style={{
                    backgroundColor: '#1F2937',
                    color: 'white',
                    marginTop: '64px',
                }}
            >
                <div
                    style={{
                        maxWidth: '1152px',
                        margin: '0 auto',
                        padding: '32px 16px',
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '32px',
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '16px',
                                }}
                            >
                                <Zap
                                    style={{
                                        color: '#F87171',
                                        width: '20px',
                                        height: '20px',
                                    }}
                                />
                                <h3
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                    }}
                                >
                                    Laser Helper
                                </h3>
                            </div>
                            <p style={{ color: '#9CA3AF' }}>
                                Professional tools for laser physics
                                calculations and energy conversions.
                            </p>
                        </div>

                        <div>
                            <h4
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    marginBottom: '16px',
                                }}
                            >
                                Tools
                            </h4>
                            <ul
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                }}
                            >
                                <li>
                                    <button
                                        onClick={() =>
                                            setActiveComponent('laser-pulse')
                                        }
                                        style={{
                                            color: '#9CA3AF',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'color 0.2s',
                                            padding: 0,
                                            textAlign: 'left',
                                            fontSize: '1rem',
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.target.style.color = 'white')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.target.style.color = '#9CA3AF')
                                        }
                                    >
                                        Laser Pulse Calculator
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() =>
                                            setActiveComponent(
                                                'energy-converter'
                                            )
                                        }
                                        style={{
                                            color: '#9CA3AF',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'color 0.2s',
                                            padding: 0,
                                            textAlign: 'left',
                                            fontSize: '1rem',
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.target.style.color = 'white')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.target.style.color = '#9CA3AF')
                                        }
                                    >
                                        Energy Unit Converter
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    marginBottom: '16px',
                                }}
                            >
                                Connect
                            </h4>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                {/* <button
                                    style={{
                                        color: '#9CA3AF',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'color 0.2s',
                                        padding: 0,
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.target.style.color = 'white')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.target.style.color = '#9CA3AF')
                                    }
                                > */}
                                <a
                                    href="https://github.com/cheedge"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                >
                                    <Github
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            color: '#9CA3AF',
                                        }}
                                    />
                                    {/* <Github className="h-10 w-10" /> */}
                                </a>
                                {/* </button> */}
                                {/* <button
                                    style={{
                                        color: '#9CA3AF',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'color 0.2s',
                                        padding: 0,
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.target.style.color = 'white')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.target.style.color = '#9CA3AF')
                                    }
                                > */}
                                <a
                                    href="https://cheedgelee@gmail.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                >
                                    <Mail
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            color: '#9CA3AF',
                                        }}
                                    />
                                </a>
                                {/* </button> */}
                                <a
                                    href="https://cheedge.leeindeutschland.de/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                >
                                    <Code2
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            color: '#9CA3AF',
                                        }}
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            borderTop: '1px solid #374151',
                            marginTop: '32px',
                            paddingTop: '32px',
                            textAlign: 'center',
                            color: '#9CA3AF',
                        }}
                    >
                        <p>
                            &copy; {new Date().getFullYear()} Cheedge Lee (李).
                            Built for laser physics enthusiasts.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
