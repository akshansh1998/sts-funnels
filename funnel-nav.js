(function() {
    // --- CONFIGURATION: Define standard pages to look for ---
    const potentialPages = [
        { file: 'index.html', label: 'Opt-In Page', icon: '1' },
        { file: 'assessment.html', label: 'Assessment Bridge', icon: '2' },
        { file: 'sales.html', label: 'Sales Letter', icon: '3' },
        { file: 'booking.html', label: 'Booking Portal', icon: '4' },
        { file: 'upsell.html', label: 'Upsell / OTO', icon: '5' },
        { file: 'thank-you.html', label: 'Success Page', icon: '✓' }
    ];

    // --- 1. CSS STYLES ---
    const style = document.createElement('style');
    style.innerHTML = `
        #sts-demo-overlay { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Manrope', sans-serif; }
        #sts-toggle-btn {
            background: #D4AF37; color: #0A1A2F; border: 1px solid rgba(255,255,255,0.2);
            padding: 12px 24px; border-radius: 50px; font-weight: 700; cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4); transition: all 0.3s ease;
            display: flex; align-items: center; gap: 8px; font-size: 14px;
            text-transform: uppercase; letter-spacing: 1px;
        }
        #sts-toggle-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(212, 175, 55, 0.4); background: #fff; }
        
        #sts-menu {
            position: absolute; bottom: 60px; right: 0; width: 300px;
            background: rgba(10, 26, 47, 0.95); border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 12px; padding: 16px; display: none; flex-direction: column;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8); backdrop-filter: blur(15px);
        }
        #sts-menu.active { display: flex; animation: slideUp 0.3s ease-out; }
        
        .sts-menu-header {
            color: #fff; font-family: 'Playfair Display', serif; font-size: 16px;
            margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex; justify-content: space-between; align-items: center;
        }
        .sts-link {
            display: flex; align-items: center; padding: 12px; color: #94A3B8;
            text-decoration: none; font-size: 13px; border-radius: 6px;
            transition: all 0.2s; margin-bottom: 4px; border: 1px solid transparent;
        }
        .sts-link:hover { background: rgba(255,255,255,0.05); color: #fff; border-color: rgba(255,255,255,0.1); }
        .sts-link.current { background: rgba(212, 175, 55, 0.1); color: #D4AF37; border-color: rgba(212, 175, 55, 0.3); }
        .sts-link-icon { 
            width: 24px; height: 24px; background: rgba(255,255,255,0.05); 
            border-radius: 4px; display: flex; align-items: center; justify-content: center;
            margin-right: 12px; font-weight: bold; font-size: 10px;
        }
        .sts-link.current .sts-link-icon { background: #D4AF37; color: #0A1A2F; }
        
        .sts-loading { padding: 20px; text-align: center; color: #64748B; font-size: 12px; }
        
        .sts-back-link {
            margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;
        }
        .sts-back-link a { color: #D4AF37; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }
        
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);

    // --- 2. CREATE UI SHELL ---
    const overlay = document.createElement('div');
    overlay.id = 'sts-demo-overlay';
    overlay.innerHTML = `
        <div id="sts-menu">
            <div class="sts-menu-header">
                <span>Funnel Navigator</span>
                <span style="font-size:10px; opacity:0.5; border:1px solid #fff; padding:2px 6px; border-radius:4px;">DEMO</span>
            </div>
            <div id="sts-links-container">
                <div class="sts-loading">Scanning funnel steps...</div>
            </div>
            <div class="sts-back-link">
                <a href="../index.html">← Back to Portfolio Library</a>
            </div>
        </div>
        <button id="sts-toggle-btn">
            <span>⚙️ Funnel Demo</span>
        </button>
    `;
    document.body.appendChild(overlay);

    // --- 3. AUTO-DISCOVERY LOGIC ---
    async function detectPages() {
        const container = document.getElementById('sts-links-container');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        // Clear loading
        container.innerHTML = '';

        let foundCount = 0;

        // Iterate through potential pages and check if they exist
        for (const page of potentialPages) {
            try {
                // Determine if we are on this page
                const isCurrent = currentPath === page.file || (currentPath === '' && page.file === 'index.html');

                // If it's the current page, we know it exists. Otherwise, ping it.
                let exists = isCurrent;
                
                if (!exists) {
                    const response = await fetch(page.file, { method: 'HEAD' });
                    if (response.ok) exists = true;
                }

                if (exists) {
                    foundCount++;
                    const link = document.createElement('a');
                    link.href = page.file;
                    link.className = `sts-link ${isCurrent ? 'current' : ''}`;
                    link.innerHTML = `
                        <span class="sts-link-icon">${page.icon}</span>
                        <span>${page.label}</span>
                    `;
                    container.appendChild(link);
                }
            } catch (err) {
                // If fetch fails (e.g. offline or CORS), ignore
                console.log(`Could not verify ${page.file}`);
            }
        }

        if (foundCount === 0) {
            container.innerHTML = '<div class="sts-loading">No linked pages found. Ensure files are in the same folder.</div>';
        }
    }

    // --- 4. INIT ---
    const btn = document.getElementById('sts-toggle-btn');
    const menu = document.getElementById('sts-menu');

    // Toggle Menu
    btn.addEventListener('click', () => {
        const isActive = menu.classList.toggle('active');
        btn.innerHTML = isActive ? '<span>✖ Close</span>' : '<span>⚙️ Funnel Demo</span>';
    });

    // Run detection immediately
    detectPages();

})();