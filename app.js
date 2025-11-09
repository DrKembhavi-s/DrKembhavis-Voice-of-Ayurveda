// Dr. Kembhavi's Voice of Ayurveda Platform - Clean Core Functions
// No dummy data - starts completely fresh

// Data storage using browser's local storage (persists data between sessions)
class PlatformStorage {
    static saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.log('Storage not available, using session data only');
        }
    }
    
    static loadData(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.log('Storage not available, using default data');
            return defaultValue;
        }
    }
}

// Enhanced Forum Management
class ForumManager {
    constructor() {
        // Start with empty array - no dummy posts
        this.posts = PlatformStorage.loadData('forum_posts', []);
        this.reactions = PlatformStorage.loadData('post_reactions', {});
    }
    
    addPost(postData) {
        const newPost = {
            id: Date.now(),
            ...postData,
            date: new Date().toISOString().split('T')[0],
            reactions: { support: 0, helpful: 0, concerned: 0 },
            replies: []
        };
        
        this.posts.unshift(newPost);
        PlatformStorage.saveData('forum_posts', this.posts);
        return newPost;
    }
    
    addReaction(postId, reactionType) {
        const post = this.posts.find(p => p.id == postId);
        if (post) {
            post.reactions[reactionType] = (post.reactions[reactionType] || 0) + 1;
            PlatformStorage.saveData('forum_posts', this.posts);
        }
    }
    
    searchPosts(searchTerm) {
        return this.posts.filter(post => 
            post.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
}

// Coalition Management
class CoalitionManager {
    constructor() {
        this.members = PlatformStorage.loadData('coalition_members', []);
        this.campaigns = PlatformStorage.loadData('campaigns', []);
        this.meetings = PlatformStorage.loadData('meetings', []);
    }
    
    addMember(memberData) {
        const newMember = {
            id: Date.now(),
            ...memberData,
            joinDate: new Date().toISOString().split('T')[0],
            verified: false
        };
        
        this.members.push(newMember);
        PlatformStorage.saveData('coalition_members', this.members);
        this.updateStats();
        return newMember;
    }
    
    createCampaign(campaignData) {
        const newCampaign = {
            id: Date.now(),
            ...campaignData,
            startDate: new Date().toISOString().split('T')[0],
            supporters: 1,
            status: 'active'
        };
        
        this.campaigns.push(newCampaign);
        PlatformStorage.saveData('campaigns', this.campaigns);
        this.updateStats();
        return newCampaign;
    }
    
    updateStats() {
        const states = [...new Set(this.members.map(m => m.state))];
        
        document.getElementById('member-count').textContent = this.members.length;
        document.getElementById('states-count').textContent = states.length;
        document.getElementById('campaigns-count').textContent = this.campaigns.filter(c => c.status === 'active').length;
    }
}

// Compliance Tracker
class ComplianceTracker {
    constructor() {
        // Start with empty array - no default inspections
        this.inspections = PlatformStorage.loadData('inspections', []);
        this.costs = PlatformStorage.loadData('compliance_costs', {});
    }
    
    calculateTotalComplianceCost(hours, staff, costPerHour) {
        const monthly = hours * staff * costPerHour;
        const annual = monthly * 12;
        
        // Calculate opportunity cost (what could have been done instead)
        const teachingHoursLost = hours * staff;
        const studentsAffected = teachingHoursLost / 4; // Assuming 4 hours per student per month
        
        return {
            monthly: monthly,
            annual: annual,
            teachingHoursLost: teachingHoursLost * 12,
            studentsAffected: Math.floor(studentsAffected * 12)
        };
    }
    
    addInspectionExperience(inspectionData) {
        const experience = {
            id: Date.now(),
            ...inspectionData,
            submittedDate: new Date().toISOString().split('T')[0]
        };
        
        this.inspections.push(experience);
        PlatformStorage.saveData('inspections', this.inspections);
        return experience;
    }
}

// Reform Proposal Generator
class ProposalGenerator {
    constructor() {
        this.proposals = PlatformStorage.loadData('proposals', []);
    }
    
    saveProposal(proposalData) {
        const proposal = {
            id: Date.now(),
            ...proposalData,
            createdDate: new Date().toISOString().split('T')[0],
            status: 'draft',
            supporters: 1
        };
        
        this.proposals.push(proposal);
        PlatformStorage.saveData('proposals', this.proposals);
        return proposal;
    }
}

// Advanced Search and Filter System
class SearchManager {
    static searchAll(term) {
        const forumManager = new ForumManager();
        const coalitionManager = new CoalitionManager();
        
        const forumResults = forumManager.searchPosts(term);
        const memberResults = coalitionManager.members.filter(m => 
            m.institutionName?.toLowerCase().includes(term.toLowerCase()) ||
            m.state?.toLowerCase().includes(term.toLowerCase())
        );
        
        return {
            posts: forumResults,
            members: memberResults,
            total: forumResults.length + memberResults.length
        };
    }
}

// Notification System
class NotificationManager {
    constructor() {
        this.notifications = PlatformStorage.loadData('notifications', []);
    }
    
    addNotification(type, message, importance = 'normal') {
        const notification = {
            id: Date.now(),
            type: type,
            message: message,
            importance: importance,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        this.notifications.unshift(notification);
        PlatformStorage.saveData('notifications', this.notifications);
        this.showNotification(notification);
    }
    
    showNotification(notification) {
        // Create a floating notification
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification ${notification.importance}`;
        notificationDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${notification.importance === 'urgent' ? '#dc3545' : '#28a745'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        notificationDiv.innerHTML = `
            <strong>${notification.type}</strong><br>
            ${notification.message}
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                float: right;
                font-size: 16px;
                cursor: pointer;
                margin-top: -5px;
            ">×</button>
        `;
        
        document.body.appendChild(notificationDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notificationDiv.parentElement) {
                notificationDiv.remove();
            }
        }, 5000);
    }
}

// Initialize all managers
let forumManager, coalitionManager, complianceTracker, proposalGenerator, notificationManager;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize managers
    forumManager = new ForumManager();
    coalitionManager = new CoalitionManager();
    complianceTracker = new ComplianceTracker();
    proposalGenerator = new ProposalGenerator();
    notificationManager = new NotificationManager();
    
    // Load initial data
    if (typeof displayPosts === 'function') {
        displayPosts();
    }
    coalitionManager.updateStats();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .post-reactions {
            margin-top: 15px;
            display: flex;
            gap: 10px;
        }
        
        .reaction-btn {
            background: #f8f9fa;
            border: 1px solid #ddd;
            padding: 5px 12px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        }
        
        .reaction-btn:hover {
            background: #e9ecef;
            transform: scale(1.05);
        }
        
        .search-bar {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
    
    // NO welcome notification for clean start
});

// Enhanced functions that work with the managers

function submitPost() {
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const category = document.getElementById('category').value;
    const anonymity = document.getElementById('anonymity').value;
    
    if (!subject || !message) {
        alert('Please fill in both subject and message fields.');
        return;
    }
    
    const newPost = forumManager.addPost({
        author: anonymity === 'anonymous' ? 'Anonymous Contributor' : 'Registered User',
        category: category,
        subject: subject,
        content: message
    });
    
    if (typeof displayPosts === 'function') {
        displayPosts();
    }
    
    // Clear form
    document.getElementById('subject').value = '';
    document.getElementById('message').value = '';
    
    if (notificationManager) {
        notificationManager.addNotification(
            'Post Submitted', 
            'Your views have been shared successfully!',
            'normal'
        );
    }
}

function displayPosts() {
    const container = document.getElementById('posts-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (forumManager.posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💬</div>
                <div class="empty-state-text">No discussions yet</div>
                <div class="empty-state-subtext">Be the first to share your views on Ayurveda reforms!</div>
            </div>
        `;
        return;
    }
    
    forumManager.posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-item';
        
        const categoryLabels = {
            'academic': 'Academic Reforms',
            'clinical': 'Clinical Practice',
            'research': 'Research & Development',
            'administrative': 'Administrative',
            'development': 'Development',
            'regulatory': 'Regulatory'
        };
        
        postElement.innerHTML = `
            <div class="post-header">
                <span class="post-author">${post.author}</span>
                <span class="post-date">${post.date}</span>
            </div>
            <h4>${post.subject}</h4>
            <div class="post-content">${post.content}</div>
            <div class="post-reactions">
                <button class="reaction-btn" onclick="reactToPost(${post.id}, 'support')">
                    💪 Support (${post.reactions.support || 0})
                </button>
                <button class="reaction-btn" onclick="reactToPost(${post.id}, 'helpful')">
                    👍 Helpful (${post.reactions.helpful || 0})
                </button>
                <button class="reaction-btn" onclick="reactToPost(${post.id}, 'concerned')">
                    😟 Concerned (${post.reactions.concerned || 0})
                </button>
            </div>
            <span class="post-category">${categoryLabels[post.category] || post.category}</span>
        `;
        container.appendChild(postElement);
    });
}

function reactToPost(postId, reactionType) {
    forumManager.addReaction(postId, reactionType);
    displayPosts();
}

function calculateComplianceCost() {
    const hours = parseFloat(document.getElementById('hours').value) || 0;
    const staff = parseFloat(document.getElementById('staff').value) || 0;
    const cost = parseFloat(document.getElementById('cost').value) || 0;
    
    if (hours === 0 || staff === 0 || cost === 0) {
        alert('Please fill in all fields to calculate compliance costs.');
        return;
    }
    
    const result = complianceTracker.calculateTotalComplianceCost(hours, staff, cost);
    
    const resultDiv = document.getElementById('cost-result');
    resultDiv.innerHTML = `
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <h4 style="margin-bottom: 15px; color: #856404;">Administrative Burden Analysis</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div>
                    <strong>Monthly Cost:</strong> ₹${result.monthly.toLocaleString()}
                </div>
                <div>
                    <strong>Annual Cost:</strong> ₹${result.annual.toLocaleString()}
                </div>
                <div>
                    <strong>Teaching Hours Lost:</strong> ${result.teachingHoursLost.toLocaleString()} hours/year
                </div>
                <div>
                    <strong>Working Days Lost:</strong> ${Math.floor(result.teachingHoursLost/8)} days/year
                </div>
            </div>
            <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.7); border-radius: 5px;">
                <small style="color: #856404;">
                    <strong>Impact:</strong> This represents ${Math.floor(result.teachingHoursLost/8)} full working days per year 
                    spent on compliance instead of education.
                </small>
            </div>
        </div>
    `;
}

// Global functions for enhanced features
window.reactToPost = reactToPost;
window.submitPost = submitPost;
window.displayPosts = displayPosts;
window.calculateComplianceCost = calculateComplianceCost;
