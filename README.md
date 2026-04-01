# POS Display Product Quantity (Odoo 18)

Affiche la quantité de stock et le prix de vente directement sur les cartes produit dans l'interface du Point de Vente.

## Fonctionnalités

### Badge quantité en stock
Chaque carte produit dans le POS affiche un badge avec la quantité en stock :
- **Vert** : stock > 0
- **Rouge** : stock = 0
- **NA** : produits combo

Activation/désactivation via **Point de Vente → Configuration → Paramètres → Afficher la quantité des produits**.

### Prix de vente sur la carte
Le prix de vente unitaire est affiché en bleu sous le nom de chaque produit, formaté avec la devise configurée.

## Correction : Filtrage par emplacement du POS

Le module original (CodeSphere Tech) affichait la quantité **totale de tous les emplacements**. Cette version corrigée affiche uniquement la quantité de stock dans **l'emplacement configuré sur le POS**.

### Avant (version originale)

| POS | Emplacement configuré | Quantité affichée |
|---|---|---|
| POS Dépôt E01 | E01/Depot E01 | Stock total (E01 + CFD + MG04 + ...) |
| POS Dépôt CFD | CFD/Depot CFD | Stock total (E01 + CFD + MG04 + ...) |

### Après (version corrigée)

| POS | Emplacement configuré | Quantité affichée |
|---|---|---|
| POS Dépôt E01 | E01/Depot E01 | Stock de E01 uniquement |
| POS Dépôt CFD | CFD/Depot CFD | Stock de CFD uniquement |

## Comment ça marche

1. Le POS lit son **emplacement d'origine** depuis le type d'opération (`Point de Vente → Configuration → Type d'opération → Emplacement d'origine`)
2. La méthode `get_qty_by_pos_location()` interroge les `stock.quant` uniquement pour cet emplacement et ses sous-emplacements
3. Le JS affiche la quantité filtrée et le prix de vente sur chaque carte produit

## Installation

1. Copier le dossier `cst_pos_product_qty` dans votre répertoire d'addons
2. Redémarrer Odoo
3. **Apps** → chercher **"POS Display Product Quantity"** → **Installer**

## Configuration

1. **Point de Vente → Configuration → Paramètres**
2. Cochez **"Afficher la quantité des produits"**
3. Vérifiez que l'emplacement d'origine est bien défini dans le type d'opération de chaque POS

## Dépendances

- `point_of_sale`
- `stock`

## Crédits

- Module original : CodeSphere Tech
- Correction filtrage par emplacement + affichage prix : Lalaina710

## Licence

LGPL-3
