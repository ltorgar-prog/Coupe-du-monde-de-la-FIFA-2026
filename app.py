"""
Application de Pronostics - Coupe du Monde FIFA 2026
Molliet Lauper SA
"""

from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from datetime import datetime
import json
import os

app = Flask(__name__)
app.secret_key = 'votre_cle_secrete_a_changer_en_production'

# Fichiers de données
DATA_DIR = 'data'
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
MATCHES_FILE = os.path.join(DATA_DIR, 'matches.json')
PREDICTIONS_FILE = os.path.join(DATA_DIR, 'predictions.json')

# Créer le dossier data s'il n'existe pas
os.makedirs(DATA_DIR, exist_ok=True)

# Initialiser les fichiers s'ils n'existent pas
def init_data_files():
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump({}, f)
    
    if not os.path.exists(MATCHES_FILE):
        # Exemples de matchs
        matches = {
            "1": {
                "id": "1",
                "team1": "Canada",
                "team2": "Mexique",
                "flag1": "🇨🇦",
                "flag2": "🇲🇽",
                "date": "2026-06-11",
                "time": "20:00",
                "stage": "Phase de groupes",
                "group": "A",
                "score1": None,
                "score2": None,
                "finished": False
            },
            "2": {
                "id": "2",
                "team1": "États-Unis",
                "team2": "Argentine",
                "flag1": "🇺🇸",
                "flag2": "🇦🇷",
                "date": "2026-06-12",
                "time": "17:00",
                "stage": "Phase de groupes",
                "group": "B",
                "score1": None,
                "score2": None,
                "finished": False
            },
            "3": {
                "id": "3",
                "team1": "France",
                "team2": "Brésil",
                "flag1": "🇫🇷",
                "flag2": "🇧🇷",
                "date": "2026-06-13",
                "time": "18:00",
                "stage": "Phase de groupes",
                "group": "C",
                "score1": None,
                "score2": None,
                "finished": False
            },
            "4": {
                "id": "4",
                "team1": "Allemagne",
                "team2": "Espagne",
                "flag1": "🇩🇪",
                "flag2": "🇪🇸",
                "date": "2026-06-14",
                "time": "21:00",
                "stage": "Phase de groupes",
                "group": "D",
                "score1": None,
                "score2": None,
                "finished": False
            },
            "5": {
                "id": "5",
                "team1": "Angleterre",
                "team2": "Italie",
                "flag2": "🇮🇹",
                "date": "2026-06-15",
                "time": "19:00",
                "stage": "Phase de groupes",
                "group": "E",
                "score1": None,
                "score2": None,
                "finished": False
            }
        }
        with open(MATCHES_FILE, 'w', encoding='utf-8') as f:
            json.dump(matches, f, indent=2, ensure_ascii=False)
    
    if not os.path.exists(PREDICTIONS_FILE):
        with open(PREDICTIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump({}, f)

init_data_files()

# Fonctions utilitaires
def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filename, data):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def calculate_points(prediction, actual):
    """Calcule les points selon la précision du pronostic"""
    pred1, pred2 = prediction
    act1, act2 = actual
    
    # Score exact: 5 points
    if pred1 == act1 and pred2 == act2:
        return 5
    
    # Bonne différence de buts: 3 points
    if (pred1 - pred2) == (act1 - act2):
        return 3
    
    # Bon vainqueur: 2 points
    if (pred1 > pred2 and act1 > act2) or (pred1 < pred2 and act1 < act2) or (pred1 == pred2 and act1 == act2):
        return 2
    
    return 0

# Routes
@app.route('/')
def index():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', user=session['user'])

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        prenom = request.form.get('prenom', '').strip()
        if prenom:
            users = load_json(USERS_FILE)
            if prenom not in users:
                users[prenom] = {
                    'prenom': prenom,
                    'points': 0,
                    'predictions_count': 0
                }
                save_json(USERS_FILE, users)
            
            session['user'] = prenom
            return redirect(url_for('matches'))
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))

@app.route('/matches')
def matches():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    matches_data = load_json(MATCHES_FILE)
    predictions = load_json(PREDICTIONS_FILE)
    user = session['user']
    
    # Ajouter les pronostics de l'utilisateur aux matchs
    for match_id, match in matches_data.items():
        match['user_prediction'] = predictions.get(user, {}).get(match_id)
    
    return render_template('matches.html', matches=matches_data, user=user)

@app.route('/predict/<match_id>', methods=['POST'])
def predict(match_id):
    if 'user' not in session:
        return jsonify({'error': 'Non connecté'}), 401
    
    user = session['user']
    data = request.get_json()
    score1 = data.get('score1')
    score2 = data.get('score2')
    
    if score1 is None or score2 is None:
        return jsonify({'error': 'Scores invalides'}), 400
    
    matches_data = load_json(MATCHES_FILE)
    if match_id not in matches_data:
        return jsonify({'error': 'Match introuvable'}), 404
    
    if matches_data[match_id]['finished']:
        return jsonify({'error': 'Match déjà terminé'}), 400
    
    predictions = load_json(PREDICTIONS_FILE)
    if user not in predictions:
        predictions[user] = {}
    
    predictions[user][match_id] = {
        'score1': score1,
        'score2': score2,
        'timestamp': datetime.now().isoformat()
    }
    
    save_json(PREDICTIONS_FILE, predictions)
    
    # Mettre à jour le compteur de prédictions
    users = load_json(USERS_FILE)
    users[user]['predictions_count'] = len(predictions[user])
    save_json(USERS_FILE, users)
    
    return jsonify({'success': True})

@app.route('/leaderboard')
def leaderboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    users = load_json(USERS_FILE)
    sorted_users = sorted(users.values(), key=lambda x: x['points'], reverse=True)
    
    return render_template('leaderboard.html', users=sorted_users, current_user=session['user'])

@app.route('/admin')
def admin():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    matches_data = load_json(MATCHES_FILE)
    return render_template('admin.html', matches=matches_data)

@app.route('/admin/update_result/<match_id>', methods=['POST'])
def update_result(match_id):
    if 'user' not in session:
        return jsonify({'error': 'Non connecté'}), 401
    
    data = request.get_json()
    score1 = data.get('score1')
    score2 = data.get('score2')
    
    matches_data = load_json(MATCHES_FILE)
    if match_id not in matches_data:
        return jsonify({'error': 'Match introuvable'}), 404
    
    matches_data[match_id]['score1'] = score1
    matches_data[match_id]['score2'] = score2
    matches_data[match_id]['finished'] = True
    save_json(MATCHES_FILE, matches_data)
    
    # Calculer les points pour tous les utilisateurs
    predictions = load_json(PREDICTIONS_FILE)
    users = load_json(USERS_FILE)
    
    for user, user_predictions in predictions.items():
        if match_id in user_predictions:
            pred = user_predictions[match_id]
            points = calculate_points(
                (pred['score1'], pred['score2']),
                (score1, score2)
            )
            users[user]['points'] = users[user].get('points', 0) + points
    
    save_json(USERS_FILE, users)
    
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)





