(function() {
    // --- WAIT FOR PAGE TO LOAD ---
    window.addEventListener('DOMContentLoaded', () => {

        // --- CONFIGURATION: THE SOUL ALCHEMIST FUNNEL (6 PAGES) ---
        const potentialPages = [
            { file: 'index.html', label: '1. Opt-In (The Detox)', icon: '1' },
            { file: 'assessment.html', label: '2. Diagnostic Engine', icon: '2' },
            { file: 'results.html', label: '3. The Bridge (VSL)', icon: '3' },
            { file: 'sales.html', label: '4. Sales Letter', icon: '4' },
            { file: 'booking.html', label: '5. Booking Portal', icon: '5' },
            { file: 'thank-you.html', label: '6. The Initiation', icon: '6' }
        ];

        // --- 1. INJECT CSS STYLES (STS DARK/GOLD THEME) ---
        const style = document.createElement('style');
        style.innerHTML = `
            /* IMPORT FONTS IF MISSING (Fallback) */
            @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;700&family=Montserrat:wght@400;600&display=swap');

            #sts-demo-overlay { 
                position: fixed; bottom: 30px; right: 30px; z-index: 99999; 
                font-family: 'Montserrat', sans-serif; 
            }
            
            /* TOGGLE BUTTON - GOLD ACCENT */
            #sts-toggle-btn {
                background: #D4AF37; /* Gold */
                color: #0B0B0B; /* Dark Background */
                border: 1px solid #D4AF37;
                padding: 14px 28px; 
                border-radius: 4px; /* Sharper corners for STS style */
                font-weight: 700; 
                cursor: pointer;
                box-shadow: 0 4px 30px rgba(0,0,0,0.5); 
                transition: all 0.3s ease;
                display: flex; align-items: center; gap: 10px; 
                font-size: 12px;
                text-transform: uppercase; 
                letter-spacing: 2px;
                font-family: 'Jost', sans-serif;
            }
            #sts-toggle-btn:hover { 
                transform: translateY(-3px); 
                background: #FFFFFF; 
                color: #0B0B0B;
                box-shadow: 0 10px 40px rgba(212, 175, 55, 0.3);
            }
            
            /* MENU CONTAINER - DARK PANEL */
            #sts-menu {
                position: absolute; bottom: 70px; right: 0; width: 320px;
                background: #141414; /* Panel Black */
                border: 1px solid rgba(255,255,255,0.1);
                border-top: 2px solid #D4AF37; /* Gold Top Border */
                border-radius: 6px; 
                padding: 24px; 
                display: none; 
                flex-direction: column;
                box-shadow: 0 30px 60px rgba(0,0,0,0.9); 
                backdrop-filter: blur(10px);
            }
            #sts-menu.active { display: flex; animation: stsFadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
            
            /* HEADER */
            .sts-menu-header {
                color: #FFFFFF; 
                font-family: 'Jost', sans-serif; 
                font-size: 14px; 
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 20px; 
                padding-bottom: 15px; 
                border-bottom: 1px solid rgba(255,255,255,0.1);
                display: flex; justify-content: space-between; align-items: center;
            }
            
            .sts-badge {
                font-size: 9px; 
                color: #D4AF37; 
                border: 1px solid #D4AF37; 
                padding: 3px 6px; 
                border-radius: 2px;
            }
            
            /* LINKS */
            .sts-link {
                display: flex; align-items: center; padding: 12px 15px; 
                color: #B8B8B8; /* Muted Text */
                text-decoration: none; font-size: 13px; border-radius: 4px;
                transition: all 0.2s; margin-bottom: 6px; 
                border: 1px solid transparent;
                background: transparent;
            }
            .sts-link:hover { 
                background: #0B0B0B; 
                color: #FFFFFF; 
                border-color: rgba(212, 175, 55, 0.3);
            }
            .sts-link.current { 
                background: rgba(212, 175, 55, 0.1); 
                color: #D4AF37; 
                border-color: rgba(212, 175, 55, 0.2); 
                font-weight: 600; 
            }
            
            .sts-link-icon { 
                width: 22px; height: 22px; 
                background: #0B0B0B; 
                color: #555;
                border-radius: 50%; 
                display: flex; align-items: center; justify-content: center;
                margin-right: 12px; font-weight: bold; font-size: 10px;
                font-family: 'Jost', sans-serif;
            }
            .sts-link:hover .sts-link-icon { color: #D4AF37; }
            .sts-link.current .sts-link-icon { background: #D4AF37; color: #0B0B0B; }
            
            /* LOADING / INFO */
            .sts-loading { padding: 20px; text-align: center; color: #555; font-size: 11px; }
            
            .sts-back-link {
                margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;
            }
            .sts-back-link a { 
                color: #D4AF37; 
                text-decoration: none; 
                font-size: 10px; 
                text-transform: uppercase; 
                letter-spacing: 2px; 
                font-weight: 700; 
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .sts-back-link a:hover { opacity: 1; text-decoration: underline; }
            
            @keyframes stsFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);

        // --- 2. CREATE UI SHELL ---
        const overlay = document.createElement('div');
        overlay.id = 'sts-demo-overlay';
        overlay.innerHTML = `
            <div id="sts-menu">
                <div class="sts-menu-header">
                    <span>Funnel Roadmap</span>
                    <span class="sts-badge">LIVE DEMO</span>
                </div>
                <div id="sts-links-container">
                    <div class="sts-loading">Initializing System...</div>
                </div>
                <div class="sts-back-link">
                    <a href="../index.html">Exit Simulation</a>
                </div>
            </div>
            <button id="sts-toggle-btn">
                <span>Navigate</span>
            </button>
        `;
        
        document.body.appendChild(overlay);

        // --- 3. AUTO-DISCOVERY LOGIC ---
        async function detectPages() {
            const container = document.getElementById('sts-links-container');
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            
            container.innerHTML = '';
            let foundCount = 0;

            for (const page of potentialPages) {
                try {
                    // Check if current page OR ping file (HEAD Request)
                    let exists = (currentPath === page.file || (currentPath === '' && page.file === 'index.html'));
                    
                    if (!exists) {
                        const response = await fetch(page.file, { method: 'HEAD' });
                        if (response.ok) exists = true;
                    }

                    if (exists) {
                        foundCount++;
                        const link = document.createElement('a');
                        link.href = page.file;
                        link.className = `sts-link ${(currentPath === page.file || (currentPath === '' && page.file === 'index.html')) ? 'current' : ''}`;
                        link.innerHTML = `
                            <span class="sts-link-icon">${page.icon}</span>
                            <span>${page.label}</span>
                        `;
                        container.appendChild(link);
                    }
                } catch (err) {
                    console.log(`Could not verify ${page.file}`);
                }
            }

            if (foundCount === 0) {
                container.innerHTML = '<div class="sts-loading">No linked pages found.<br>Ensure files are in the same folder.</div>';
            }
        }

        // --- 4. INIT EVENTS ---
        const btn = document.getElementById('sts-toggle-btn');
        const menu = document.getElementById('sts-menu');

        btn.addEventListener('click', () => {
            const isActive = menu.classList.toggle('active');
            btn.innerHTML = isActive ? '<span>✕ Close</span>' : '<span>Navigate</span>';
            // Change button style on active
            if(isActive) {
                btn.style.background = '#FFFFFF';
                btn.style.color = '#0B0B0B';
            } else {
                btn.style.background = '#D4AF37';
                btn.style.color = '#0B0B0B';
            }
        });

        // Run detection immediately
        detectPages();

    }); 
})();