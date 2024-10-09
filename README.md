# Git Conventions

## Branch Strategy

Nous avons deux branches principales :

- **main** : Branche pour le code en production.
- **dev** : Branche pour le développement actif, où toutes les nouvelles fonctionnalités sont fusionnées avant d'intégrer `main`.

Chaque membre de l'équipe doit créer une branche de développement personnelle nommée selon le modèle `dev-votreNom` (exemple : `dev-bryan`). Vous pusherez ensuite vos changements sur la branche `dev`.

## Commit Messages

Les messages de commit doivent suivre une convention stricte pour faciliter la gestion du projet et la lisibilité des changements. Utilisez l'un des types de commit suivants :

- `feat` : Ajout d'une nouvelle fonctionnalité.
- `fix` : Correction d'un bug.
- `docs` : Modifications de la documentation.
- `style` : Changements de style (formatage, espaces, etc.).
- `refactor` : Refactorisation du code sans ajout de fonctionnalité ni correction de bug.
- `test` : Ajout ou modification de tests.
- `chore` : Tâches de maintenance ou modifications de configuration.

### Exemples de commit :

```bash
feat: ajouter la fonctionnalité de paiement
fix: corriger le bug d'affichage sur la page produit
docs: mettre à jour le guide de contribution
