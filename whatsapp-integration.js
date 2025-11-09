// Dr. Kembhavi's Voice of Ayurveda Platform - WhatsApp Integration
// Share reform content and build community via WhatsApp

class WhatsAppManager {
    constructor() {
        this.platformURL = window.location.origin + window.location.pathname;
        this.analyticsURL = this.platformURL.replace('index.html', 'analytics.html');
        this.initializeWhatsAppFeatures();
    }
    
    initializeWhatsAppFeatures() {
        this.addWhatsAppCSS();
        this.addWhatsAppButtons();
        this.createWhatsAppModal();
    }
    
    addWhatsAppCSS() {
        const whatsappCSS = `
            .whatsapp-btn {
                background: linear-gradient(45deg, #25D366, #20B955);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                text-decoration: none;
                margin: 5px;
            }
            
            .whatsapp-btn:hover {
                background: linear-gradient(45deg, #20B955, #1DA851);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(37, 211, 102, 0.4);
            }
            
            .whatsapp-floating {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(45deg, #25D366, #20B955);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 5px 20px rgba(37, 211, 102, 0.4);
                z-index: 1000;
                transition: all 0.3s ease;
                animation: whatsappPulse 2s infinite;
            }
            
            .whatsapp-floating:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 25px rgba(37, 211, 102, 0.6);
            }
            
            @keyframes whatsappPulse {
                0% { box-shadow: 0 5px 20px rgba(37, 211, 102, 0.4); }
                50% { box-shadow: 0 5px 30px rgba(37, 211, 102, 0.7), 0 0 20px rgba(37, 211, 102, 0.3); }
                100% { box-shadow: 0 5px 20px rgba(37, 211, 102, 0.4); }
            }
            
            .whatsapp-modal {
                display: none;
                position: fixed;
                z-index: 10001;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.8);
                backdrop-filter: blur(5px);
            }
            
            .whatsapp-modal-content {
                background: white;
                margin: 5% auto;
                padding: 30px;
                border-radius: 20px;
                width: 90%;
                max-width: 600px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                position: relative;
                animation: modalSlideIn 0.3s ease-out;
            }
            
            .whatsapp-campaign-card {
                background: #f8f9fa;
                padding: 20px;
                margin: 15px 0;
                border-radius: 15px;
                border-left: 4px solid #25D366;
                transition: all 0.3s ease;
            }
            
            .whatsapp-campaign-card:hover {
                background: #e9ecef;
                transform: translateY(-2px);
            }
            
            .campaign-title {
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 10px;
                font-size: 1.1em;
            }
            
            .campaign-preview {
                background: white;
                padding: 15px;
                border-radius: 10px;
                margin: 10px 0;
                font-size: 14px;
                line-height: 1.5;
                border: 1px solid #ddd;
                max-height: 100px;
                overflow-y: auto;
            }
            
            .whatsapp-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            
            .stat-item {
                text-align: center;
                padding: 15px;
                background: linear-gradient(135deg, #25D366, #20B955);
                color: white;
                border-radius: 10px;
            }
            
            .stat-number {
                font-size: 1.8em;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            @media (max-width: 768px) {
                .whatsapp-floating {
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                }
                
                .whatsapp-btn {
                    font-size: 12px;
                    padding: 10px 15px;
                }
                
                .whatsapp-modal-content {
                    margin: 2% auto;
                    width: 95%;
                    max-height: 90vh;
                    overflow-y: auto;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = whatsappCSS;
        document.head.appendChild(style);
    }
    
    addWhatsAppButtons() {
        // Add floating WhatsApp button
        const floatingBtn = document.createElement('div');
        floatingBtn.className = 'whatsapp-floating';
        floatingBtn.innerHTML = `
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"/>
            </svg>
        `;
        floatingBtn.onclick = () => this.showWhatsAppModal();
        document.body.appendChild(floatingBtn);
        
        // Add WhatsApp buttons to relevant sections
        this.addWhatsAppToForums();
    }
    
    addWhatsAppToForums() {
        const forumSection = document.getElementById('forums');
        if (forumSection) {
            const whatsappSection = document.createElement('div');
            whatsappSection.innerHTML = `
                <div style="background: rgba(37, 211, 102, 0.1); padding: 20px; border-radius: 15px; margin: 20px 0;">
                    <h3 style="color: #25D366; margin-bottom: 15px;">📱 Share via WhatsApp</h3>
                    <p style="margin-bottom: 15px; color: #666;">
                        Spread the message to your professional networks:
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        <button class="whatsapp-btn" onclick="whatsappManager.sharePlatformInvite()">
                            🤝 Invite Colleagues
                        </button>
                        <button class="whatsapp-btn" onclick="whatsappManager.shareReformManifesto()">
                            📜 Share Reform Message
                        </button>
                        <button class="whatsapp-btn" onclick="whatsappManager.shareUrgentUpdate()">
                            🚨 Urgent Update
                        </button>
                    </div>
                </div>
            `;
            forumSection.appendChild(whatsappSection);
        }
    }
    
    createWhatsAppModal() {
        const modal = document.createElement('div');
        modal.id = 'whatsappModal';
        modal.className = 'whatsapp-modal';
        
        modal.innerHTML = `
            <div class="whatsapp-modal-content">
                <button class="close-modal" onclick="whatsappManager.closeModal()" style="position: absolute; right: 15px; top: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
                <h2 style="text-align: center; margin-bottom: 20px; color: #25D366;">
                    📱 WhatsApp Sharing Center
                </h2>
                
                <div class="whatsapp-stats">
                    <div class="stat-item">
                        <div class="stat-number" id="whatsapp-shares">0</div>
                        <div>Total Shares</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" id="whatsapp-reach">0</div>
                        <div>Est. Reach</div>
                    </div>
                </div>
                
                <h3 style="color: #2c3e50; margin: 25px 0 15px 0;">📢 Ready-to-Share Messages</h3>
                
                <div class="whatsapp-campaign-card">
                    <div class="campaign-title">🕉️ Platform Introduction</div>
                    <div class="campaign-preview">
                        🌟 *Dr. Kembhavi's Voice of Ayurveda* 🌟
                        
                        Share your views on Academic, Clinical, Research, Administrative, and Development reforms in Ayurveda!
                        
                        Join us: [PLATFORM_URL]
                    </div>
                    <button class="whatsapp-btn" onclick="whatsappManager.sharePlatformInvite()">
                        Share Platform Invite
                    </button>
                </div>
                
                <div class="whatsapp-campaign-card">
                    <div class="campaign-title">📜 Reform Message</div>
                    <div class="campaign-preview">
                        🚨 *AYURVEDA REFORM DISCUSSION* 🚨
                        
                        Let's discuss meaningful reforms in:
                        • Academic curriculum
                        • Clinical practice
                        • Research initiatives
                        • Administrative processes
                        
                        Join: [PLATFORM_URL]
                    </div>
                    <button class="whatsapp-btn" onclick="whatsappManager.shareReformManifesto()">
                        Share Reform Message
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    showWhatsAppModal() {
        document.getElementById('whatsappModal').style.display = 'block';
        this.updateWhatsAppStats();
    }
    
    closeModal() {
        document.getElementById('whatsappModal').style.display = 'none';
    }
    
    updateWhatsAppStats() {
        try {
            const stats = JSON.parse(localStorage.getItem('whatsapp_stats') || '{"shares": 0, "reach": 0}');
            document.getElementById('whatsapp-shares').textContent = stats.shares;
            document.getElementById('whatsapp-reach').textContent = stats.reach;
        } catch (error) {
            console.log('Using default WhatsApp stats');
        }
    }
    
    trackShare(type) {
        try {
            const stats = JSON.parse(localStorage.getItem('whatsapp_stats') || '{"shares": 0, "reach": 0}');
            stats.shares += 1;
            stats.reach += Math.floor(Math.random() * 20) + 10;
            localStorage.setItem('whatsapp_stats', JSON.stringify(stats));
            this.updateWhatsAppStats();
        } catch (error) {
            console.log('Could not track share');
        }
    }
    
    shareReformManifesto() {
        const message = `🚨 *AYURVEDA REFORM DISCUSSION PLATFORM* 🚨

Join Dr. Kembhavi's Voice of Ayurveda - a platform dedicated to meaningful reforms in:

📚 *Academic* - Curriculum and teaching methods
🏥 *Clinical* - Practice standards and patient care
🔬 *Research* - Innovation and development
📋 *Administrative* - Processes and governance
🌱 *Development* - Growth and advancement

🕉️ Your perspectives matter in shaping the future of Ayurvedic education and practice!

Join the discussion: ${this.platformURL}

*Together we can drive meaningful change!*

#AyurvedaReform #DrKembhavi #VoiceOfAyurveda`;

        this.openWhatsApp(message);
        this.trackShare('manifesto');
    }
    
    sharePlatformInvite() {
        const currentUser = window.authManager ? window.authManager.currentUser : null;
        const personalNote = currentUser ? `\n\n*Invitation from ${currentUser.name}*\n${currentUser.institution}` : '';
        
        const message = `🌟 *Dr. Kembhavi's Voice of Ayurveda* 🌟

A platform to share your views about reforms in Ayurveda:

✅ Academic curriculum improvements
✅ Clinical practice enhancements
✅ Research and development initiatives
✅ Administrative process reforms
✅ Overall development strategies

🕉️ *Your Voice Matters!*

Join professionals discussing meaningful reforms in Ayurvedic education and practice.

Platform: ${this.platformURL}

*Empowering Ayurveda professionals to shape the future*${personalNote}

#DrKembhavi #AyurvedaReform #VoiceOfAyurveda`;

        this.openWhatsApp(message);
        this.trackShare('platform');
    }
    
    shareUrgentUpdate() {
        const message = `🚨 *IMPORTANT: AYURVEDA REFORM DISCUSSION* 🚨

⚠️ *Your Input Needed* ⚠️

Dr. Kembhavi's Voice of Ayurveda platform invites you to share your perspectives on critical reforms in:

📚 Academic structures
🏥 Clinical protocols
🔬 Research priorities
📋 Administrative systems
🌱 Development pathways

🔥 *Join the Conversation Today!*

Your experiences and insights are valuable in driving meaningful change.

Join: ${this.platformURL}

*Together we shape the future of Ayurveda*

#AyurvedaReform #DrKembhavi #UrgentDiscussion`;

        this.openWhatsApp(message);
        this.trackShare('urgent');
    }
    
    openWhatsApp(message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://api.whatsapp.com/send?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    }
}

// Initialize WhatsApp Manager
let whatsappManager;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize WhatsApp manager after a short delay
    setTimeout(() => {
        whatsappManager = new WhatsAppManager();
        window.whatsappManager = whatsappManager;
    }, 1000);
});
