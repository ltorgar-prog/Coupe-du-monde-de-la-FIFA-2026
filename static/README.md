# Application Pronostics Coupe du Monde 2026 ⚽
## Molliet Lauper SA

Une application web interactive permettant aux collaborateurs de faire des pronostics sur les matchs de la Coupe du Monde FIFA 2026 et de gagner des points.

---

## 🚀 Installation

### Prérequis
- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/worldcup-2026.git
cd worldcup-2026
```

2. **Créer un environnement virtuel**
```bash
python -m venv venv

# Sur Windows
venv\Scripts\activate

# Sur macOS/Linux
source venv/bin/activate
```

3. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

4. **Structure des fichiers**
Assurez-vous d'avoir la structure suivante :
```
worldcup_app/
├── app.py
├── requirements.txt
├── README.md
├── data/                  (créé automatiquement)
│   ├── users.json
│   ├── matches.json
│   └── predictions.json
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
└── templates/
    ├── index.html
    ├── login.html
    ├── matches.html
    ├── leaderboard.html
    └── admin.html
```

5. **Lancer l'application**
```bash
python app.py
```

6. **Accéder à l'application**
Ouvrez votre navigateur et allez sur : `http://localhost:5000`

---

## 📋 Fonctionnalités

### Pour les utilisateurs
- ✅ Connexion avec prénom (pas d'anonymat)
- ⚽ Faire des pronostics sur les matchs à venir
- 📊 Voir le classement en temps réel
- 🏆 Gagner des points selon la précision des pronostics

### Système de points
- **5 points** : Score exact
- **3 points** : Bonne différence de buts
- **2 points** : Bon vainqueur (ou match nul)
- **0 point** : Pronostic incorrect

### Pour les administrateurs
- 📝 Entrer les résultats des matchs
- 🔄 Calcul automatique des points
- 📈 Mise à jour du classement

---

## 🎮 Utilisation

### Connexion
1. Entrez votre prénom sur la page de connexion
2. Vous serez automatiquement enregistré si c'est votre première connexion

### Faire un pronostic
1. Allez sur "Matchs"
2. Choisissez un match qui n'a pas encore commencé
3. Entrez votre pronostic de score
4. Cliquez sur "Valider mon pronostic"
5. Vous pouvez modifier votre pronostic jusqu'au début du match

### Voir le classement
1. Allez sur "Classement"
2. Consultez votre position et vos points
3. Le premier gagne le prix !

### Administration (entrer les résultats)
1. Allez sur "Admin"
2. Entrez le score final du match
3. Cliquez sur "Valider le résultat"
4. Les points sont automatiquement calculés et ajoutés

---

## 🔧 Configuration

### Ajouter des matchs
Éditez le fichier `data/matches.json` :
```json
{
  "3": {
    "id": "3",
    "team1": "France",
    "team2": "Brésil",
    "date": "2026-06-13",
    "time": "18:00",
    "stage": "Phase de groupes",
    "group": "C",
    "score1": null,
    "score2": null,
    "finished": false
  }
}
```

### Modifier le système de points
Dans `app.py`, fonction `calculate_points()` :
```python
def calculate_points(prediction, actual):
    # Personnalisez votre système de points ici
    ...
```

---

## 📦 Fichier requirements.txt
```
Flask==3.0.0
Werkzeug==3.0.1
```

---

## 🎨 Personnalisation

### Couleurs
Modifiez les variables CSS dans `static/css/style.css` :
```css
:root {
    --primary-color: #1a472a;      /* Vert foncé */
    --secondary-color: #2d5f3f;    /* Vert moyen */
    --accent-color: #ffd700;       /* Or */
}
```

### Logo de l'entreprise
Pour ajouter votre vrai logo :
1. Placez votre logo dans `static/images/logo.png`
2. Modifiez les templates pour afficher l'image :
```html
<img src="{{ url_for('static', filename='images/logo.png') }}" alt="Logo">
```

---

## 🔒 Sécurité

⚠️ **Important pour la production** :
1. Changez la clé secrète dans `app.py` :
```python
app.secret_key = 'VOTRE_CLE_SECRETE_UNIQUE_ET_COMPLEXE'
```

2. Utilisez une vraie base de données (PostgreSQL, MySQL) au lieu de fichiers JSON

3. Ajoutez un système d'authentification plus robuste

4. Configurez HTTPS

5. Ajoutez une protection CSRF

---

## 🚀 Déploiement

### Hébergement recommandé
- **Heroku** (facile, gratuit pour débuter)
- **PythonAnywhere**
- **Google Cloud Platform**
- **AWS**

### Étapes de déploiement (Heroku exemple)
```bash
# Installer Heroku CLI
heroku login

# Créer une app
heroku create worldcup-molliet-lauper

# Déployer
git push heroku main

# Ouvrir l'app
heroku open
```

---

## 🐛 Dépannage

### L'application ne démarre pas
- Vérifiez que Python 3.8+ est installé : `python --version`
- Vérifiez que Flask est installé : `pip list | grep Flask`
- Vérifiez les logs d'erreur dans le terminal

### Les pronostics ne s'enregistrent pas
- Vérifiez que le dossier `data/` existe
- Vérifiez les permissions d'écriture
- Consultez la console JavaScript (F12) pour les erreurs

### Les points ne se calculent pas
- Vérifiez que les résultats sont bien enregistrés dans `data/matches.json`
- Vérifiez que `finished: true` pour les matchs terminés

---

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la documentation ci-dessus
2. Consultez les logs d'erreur
3. Contactez votre administrateur système

---

## 📝 Licence

© 2026 Molliet Lauper SA - Usage interne uniquement

---

## 🎉 Bonne chance à tous les participants !

Que le meilleur gagne ! ⚽🏆