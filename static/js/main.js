// static/js/main.js - Animations et interactions modernes

document.addEventListener('DOMContentLoaded', function() {
    // Gestion des formulaires de pronostics
    const predictionForms = document.querySelectorAll('.prediction-form');
    predictionForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const matchId = this.dataset.matchId;
            const score1 = parseInt(this.querySelector('input[name="score1"]').value);
            const score2 = parseInt(this.querySelector('input[name="score2"]').value);
            
            if (isNaN(score1) || isNaN(score2)) {
                showNotification('❌ Veuillez entrer des scores valides', 'error');
                return;
            }
            
            // Désactiver le bouton pendant l'envoi
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enregistrement...';
            
            try {
                const response = await fetch(`/predict/${matchId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ score1, score2 })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showNotification('✅ Pronostic enregistré avec succès !', 'success');
                    
                    // Mettre à jour le bouton
                    submitBtn.textContent = '✓ Pronostic enregistré';
                    setTimeout(() => {
                        submitBtn.textContent = 'Modifier mon pronostic';
                        submitBtn.disabled = false;
                    }, 2000);
                    
                    // Animation de succès sur les inputs
                    this.querySelectorAll('input').forEach(input => {
                        input.style.borderColor = '#10b981';
                        setTimeout(() => {
                            input.style.borderColor = '';
                        }, 1000);
                    });
                } else {
                    showNotification('❌ ' + (data.error || 'Erreur lors de l\'enregistrement'), 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                showNotification('❌ Erreur de connexion au serveur', 'error');
                console.error('Error:', error);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    });
    
    // Gestion des formulaires d'administration
    const resultForms = document.querySelectorAll('.result-form');
    resultForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const matchId = this.dataset.matchId;
            const score1 = parseInt(this.querySelector('input[name="score1"]').value);
            const score2 = parseInt(this.querySelector('input[name="score2"]').value);
            
            if (isNaN(score1) || isNaN(score2)) {
                showNotification('❌ Veuillez entrer des scores valides', 'error');
                return;
            }
            
            if (!confirm(`⚠️ Confirmer le résultat : ${score1} - ${score2} ?\n\nCette action calculera les points de tous les participants.`)) {
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Calcul des points...';
            
            try {
                const response = await fetch(`/admin/update_result/${matchId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ score1, score2 })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showNotification('🏆 Résultat enregistré ! Les points ont été calculés.', 'success');
                    
                    // Rafraîchir la page après 2 secondes
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    showNotification('❌ ' + (data.error || 'Erreur lors de l\'enregistrement'), 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                showNotification('❌ Erreur de connexion au serveur', 'error');
                console.error('Error:', error);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    });
    
    // Animation au scroll pour les éléments
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.match-card, .dashboard-card, .rule-card, .player-card, .stats-banner');
    animatedElements.forEach(el => observer.observe(el));
    
    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Animation des cartes de joueurs au survol
    const playerCards = document.querySelectorAll('.player-card');
    playerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    });
    
    // Animation des stats sur la page d'accueil
    const statsNumbers = document.querySelectorAll('.stats-number');
    if (statsNumbers.length > 0) {
        const animateStats = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.textContent);
                    let currentValue = 0;
                    const increment = finalValue / 50;
                    const duration = 1500;
                    const stepTime = duration / 50;
                    
                    const counter = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= finalValue) {
                            target.textContent = finalValue;
                            clearInterval(counter);
                        } else {
                            target.textContent = Math.floor(currentValue);
                        }
                    }, stepTime);
                    
                    statsObserver.unobserve(target);
                }
            });
        };
        
        const statsObserver = new IntersectionObserver(animateStats, {
            threshold: 0.5
        });
        
        statsNumbers.forEach(stat => {
            stat.textContent = '0';
            statsObserver.observe(stat);
        });
    }
    
    // Validation en temps réel des inputs de score
    const scoreInputs = document.querySelectorAll('.score-inputs input');
    scoreInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Limiter à 2 chiffres
            if (this.value.length > 2) {
                this.value = this.value.slice(0, 2);
            }
            
            // Empêcher les valeurs négatives
            if (this.value < 0) {
                this.value = 0;
            }
            
            // Animation au focus
            this.addEventListener('focus', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            this.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
            });
        });
    });
    
    // Effet de parallaxe subtil sur les grandes sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-section, .cta-section');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
});

// Fonction pour afficher des notifications modernes
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => {
        notif.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notif.remove(), 300);
    });
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Styles inline pour la notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '120px',
        right: '30px',
        padding: '1.5rem 2.5rem',
        borderRadius: '20px',
        fontWeight: '600',
        zIndex: '10000',
        animation: 'slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        maxWidth: '400px'
    });
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        notification.style.color = 'white';
    } else {
        notification.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
        notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    // Retirer après 4 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
    
    /* Animation de chargement */
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 0.8s linear infinite;
    }
`;
document.head.appendChild(style);
