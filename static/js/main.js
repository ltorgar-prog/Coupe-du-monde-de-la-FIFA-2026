// static/js/main.js

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
                showNotification('Veuillez entrer des scores valides', 'error');
                return;
            }
            
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
                    showNotification('Pronostic enregistré avec succès ! ⚽', 'success');
                    
                    // Mettre à jour le bouton
                    const button = this.querySelector('button[type="submit"]');
                    button.textContent = 'Modifier mon pronostic';
                } else {
                    showNotification(data.error || 'Erreur lors de l\'enregistrement', 'error');
                }
            } catch (error) {
                showNotification('Erreur de connexion au serveur', 'error');
                console.error('Error:', error);
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
                showNotification('Veuillez entrer des scores valides', 'error');
                return;
            }
            
            if (!confirm(`Êtes-vous sûr de vouloir enregistrer ce résultat : ${score1} - ${score2} ?`)) {
                return;
            }
            
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
                    showNotification('Résultat enregistré ! Les points ont été calculés. 🏆', 'success');
                    
                    // Rafraîchir la page après 2 secondes
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    showNotification(data.error || 'Erreur lors de l\'enregistrement', 'error');
                }
            } catch (error) {
                showNotification('Erreur de connexion au serveur', 'error');
                console.error('Error:', error);
            }
        });
    });
    
    // Animation des cartes au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.5s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const cards = document.querySelectorAll('.match-card, .dashboard-card, .rule-card');
    cards.forEach(card => observer.observe(card));
});

// Fonction pour afficher des notifications
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Ajouter les styles inline
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    if (type === 'success') {
        notification.style.background = '#4CAF50';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = '#f44336';
        notification.style.color = 'white';
    } else {
        notification.style.background = '#2196F3';
        notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    // Retirer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);