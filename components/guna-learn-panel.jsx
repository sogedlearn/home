const { useState } = React;

const TABS = [
    { id: 'learn', label: 'Start Learning Guna', shortLabel: 'Start Learning Guna (Active Focus)' },
    { id: 'cosmologia', label: 'Cosmología', shortLabel: 'Cosmología' },
    { id: 'congreso', label: 'Congreso General', shortLabel: 'Congreso General' },
    { id: 'mola', label: 'Mola', shortLabel: 'Mola' },
];

const GUNA_STATS = [
    { icon: 'fa-book', value: '200 Lessons' },
    { icon: 'fa-layer-group', value: '6 Levels' },
    { icon: 'fa-users', value: '100,000+ Speakers' },
];

function StatList({ className = '' }) {
    return (
        <ul className={`space-y-2 text-sm text-gray-600 ${className}`}>
            {GUNA_STATS.map(({ icon, value }) => (
                <li key={value} className="flex items-center gap-2">
                    <i className={`fas ${icon} text-[#11802b] w-4 text-center`} aria-hidden="true" />
                    <span>{value}</span>
                </li>
            ))}
        </ul>
    );
}

function GunaSidebar() {
    return (
        <div className="flex flex-col items-center sm:items-start gap-4 border-r border-gray-100 pr-4 sm:pr-6">
            <img
                src="Multimedia/Images/Languages/Guna.png"
                alt="Guna flag"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-[#11802b]/20"
            />
            <StatList />
            <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#11802b] mb-2">
                    Guna Quick Info
                </p>
                <svg viewBox="0 0 120 80" className="w-full h-auto" aria-label="Map highlighting Guna Yala, Panama">
                    <rect width="120" height="80" fill="#e8f5e9" rx="4" />
                    <path d="M35 55 Q55 20 78 38 L92 52 Q70 68 48 62 Z" fill="#11802b" opacity="0.85" />
                    <circle cx="62" cy="42" r="3" fill="#e3a008" />
                    <text x="60" y="74" textAnchor="middle" fontSize="7" fill="#374151">Panama · Guna Yala</text>
                </svg>
            </div>
            <img
                src="Multimedia/Images/Molas Guna/Mola 2.jpg"
                alt="Guna Mola pattern"
                className="w-full max-w-[140px] rounded-lg object-cover shadow-sm"
            />
        </div>
    );
}

function LearnTabContent() {
    return (
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="text-center md:text-left shrink-0">
                <img
                    src="Multimedia/Images/Languages/Guna.png"
                    alt="Guna Language"
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-[#11802b]/25 mx-auto md:mx-0"
                />
            </div>
            <div className="flex-1 w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Guna</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                    Master the language of the Guna people from the beautiful San Blas Islands.
                    Explore their rich maritime culture and traditional governance systems.
                </p>
                <StatList className="mb-5" />
                <button
                    type="button"
                    onClick={() => { window.location.href = 'courses/learning-hub.html?course=guna'; }}
                    className="w-full rounded-xl bg-[#11802b] hover:bg-[#0d6622] text-white font-semibold py-3 px-6 transition-colors shadow-md"
                >
                    Start Learning Guna
                </button>
            </div>
        </div>
    );
}

function CosmologiaTabContent() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,140px)_1fr] gap-6">
            <GunaSidebar />
            <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#11802b]/10 text-[#11802b]">
                        <i className="fas fa-globe-americas text-sm" aria-hidden="true" />
                    </span>
                    Cosmología
                </h3>
                <ul className="space-y-3 text-gray-700 text-sm leading-relaxed list-disc pl-5">
                    <li>
                        <strong>Nabgwana (Madre Tierra):</strong> La Tierra es el centro de la cosmovisión Guna;
                        todo ser vivo depende de su equilibrio y protección.
                    </li>
                    <li>
                        <strong>Gunagal (capas espirituales):</strong> El universo Guna se organiza en niveles
                        espirituales donde habitan los seres de la naturaleza y los ancestros.
                    </li>
                    <li>
                        <strong>Galu (lugares sagrados):</strong> Montañas, ríos y arrecifes son espacios
                        ceremoniales donde se mantiene la armonía entre el pueblo y Nabgwana.
                    </li>
                </ul>
                <details className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <summary className="cursor-pointer font-semibold text-[#11802b] text-sm select-none">
                        Leer más
                    </summary>
                    <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc pl-5">
                        <li>Ibeorgun y los cantos sagrados guían la relación con lo invisible.</li>
                        <li>Los Nuchu (espíritus de madera) protegen las comunidades costeras.</li>
                        <li>La reciprocidad con la naturaleza es la base de la vida comunitaria.</li>
                    </ul>
                </details>
            </div>
        </div>
    );
}

function CongresoTabContent() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,140px)_1fr] gap-6">
            <GunaSidebar />
            <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#11802b]/10 text-[#11802b]">
                        <i className="fas fa-landmark text-sm" aria-hidden="true" />
                    </span>
                    Congreso General
                </h3>
                <ul className="space-y-3 text-gray-700 text-sm leading-relaxed list-disc pl-5">
                    <li>
                        <strong>Onmaket (Congreso General):</strong> Máxima autoridad política del pueblo Guna,
                        donde se toman decisiones colectivas sobre territorio, educación y bienestar.
                    </li>
                    <li>
                        <strong>Sailas (líderes espirituales):</strong> Interpretan los cantos tradicionales
                        y orientan al congreso con sabiduría ancestral.
                    </li>
                    <li>
                        <strong>Cantos sagrados:</strong> Las decisiones comunitarias se guían mediante
                        cantos ceremoniales que conectan al pueblo con Nabgwana y los ancestros.
                    </li>
                </ul>
            </div>
        </div>
    );
}

function MolaTabContent() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,140px)_1fr] gap-6">
            <GunaSidebar />
            <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#e3a008]/15 text-[#e3a008]">
                        <i className="fas fa-palette text-sm" aria-hidden="true" />
                    </span>
                    Mola
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <img
                        src="Multimedia/Images/Molas Guna/Mola 3.jpg"
                        alt="Traditional Guna Mola textile"
                        className="w-full sm:w-40 h-32 object-cover rounded-xl shadow-md shrink-0"
                    />
                    <p className="text-gray-700 text-sm leading-relaxed">
                        La mola es el arte textil icónico elaborado a mano por mujeres Guna. Mediante capas
                        de tela y diseños geométricos o figurativos, narran la cosmovisión, la naturaleza
                        y la identidad del pueblo.
                    </p>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm leading-relaxed list-disc pl-5">
                    <li>Cada diseño transmite historias de ancestros, animales y espíritus.</li>
                    <li>La técnica de reverse appliqué es reconocida como patrimonio cultural.</li>
                    <li>Las molas son expresión de orgullo, resistencia y memoria colectiva.</li>
                </ul>
            </div>
        </div>
    );
}

const TAB_CONTENT = {
    learn: LearnTabContent,
    cosmologia: CosmologiaTabContent,
    congreso: CongresoTabContent,
    mola: MolaTabContent,
};

function GunaLearnPanel() {
    const [activeTab, setActiveTab] = useState('learn');
    const ActiveContent = TAB_CONTENT[activeTab];

    return (
        <div className="relative flex gap-3">
            <div className="flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/40">
                <div
                    className="flex flex-wrap gap-1 p-2 bg-gray-100/80 border-b border-gray-200"
                    role="tablist"
                    aria-label="Guna culture and language"
                >
                    {TABS.map(({ id, label, shortLabel }) => {
                        const isActive = activeTab === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                aria-label={shortLabel}
                                onClick={() => setActiveTab(id)}
                                className={[
                                    'flex-1 min-w-[100px] px-2 sm:px-3 py-2.5 text-[11px] sm:text-sm font-semibold rounded-lg transition-all duration-200 leading-tight',
                                    isActive
                                        ? 'bg-[#11802b] text-white shadow-md'
                                        : 'bg-gray-200/80 text-gray-600 hover:bg-gray-300/80',
                                ].join(' ')}
                            >
                                <span className="hidden md:inline">{shortLabel}</span>
                                <span className="md:hidden">{label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="p-5 sm:p-6 min-h-[320px]" role="tabpanel">
                    <ActiveContent />
                </div>
            </div>

            <aside
                className="hidden xl:flex flex-col gap-1 bg-white/95 rounded-xl shadow-lg border border-gray-200 p-3 self-start sticky top-28"
                aria-label="Guna Culture quick navigation"
            >
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1 px-1">
                    Guna Culture:
                </p>
                {TABS.filter((t) => t.id !== 'learn').map(({ id, label }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className={[
                            'text-left text-sm px-2 py-1.5 rounded-md transition-colors whitespace-nowrap',
                            activeTab === id
                                ? 'bg-[#e3a008]/20 text-[#11802b] font-semibold'
                                : 'text-gray-600 hover:bg-gray-100',
                        ].join(' ')}
                    >
                        {label}
                    </button>
                ))}
            </aside>
        </div>
    );
}

const panelRoot = document.getElementById('guna-panel-root');
if (panelRoot) {
    ReactDOM.createRoot(panelRoot).render(<GunaLearnPanel />);
}
