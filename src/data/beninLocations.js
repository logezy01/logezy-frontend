// Départements, communes et quartiers du Bénin
export const DEPARTMENTS = {
  'Alibori': ['Banikoara', 'Gogounou', 'Kandi', 'Karimama', 'Malanville', 'Ségbana'],
  'Atacora': ['Boukoumbé', 'Cobly', 'Kérou', 'Kouandé', 'Matéri', 'Natitingou', 'Péhunco', 'Tanguiéta', 'Toucountouna'],
  'Atlantique': ['Abomey-Calavi', 'Allada', 'Kpomassè', 'Ouidah', 'Sô-Ava', 'Toffo', 'Tori-Bossito', 'Zè'],
  'Borgou': ['Bembéréké', 'Kalalé', "N'Dali", 'Nikki', 'Parakou', 'Pèrèrè', 'Sinendé', 'Tchaourou'],
  'Collines': ['Bantè', 'Dassa-Zoumè', 'Glazoué', 'Ouèssè', 'Savalou', 'Savè'],
  'Couffo': ['Aplahoué', 'Djakotomey', 'Dogbo', 'Klouékanmè', 'Lalo', 'Toviklin'],
  'Donga': ['Bassila', 'Copargo', 'Djougou', 'Ouaké'],
  'Littoral': ['Cotonou'],
  'Mono': ['Athiémé', 'Bopa', 'Comè', 'Grand-Popo', 'Houéyogbé', 'Lokossa'],
  'Ouémé': ['Adjarra', 'Adjohoun', 'Aguégués', 'Akpro-Missérété', 'Avrankou', 'Bonou', 'Dangbo', 'Porto-Novo', 'Sèmè-Kpodji'],
  'Plateau': ['Adja-Ouèrè', 'Ifangni', 'Kétou', 'Pobè', 'Sakété'],
  'Zou': ['Abomey', 'Agbangnizoun', 'Bohicon', 'Covè', 'Djidja', 'Ouinhi', 'Za-Kpota', 'Zagnanado', 'Zogbodomey'],
};

// Liste plate de toutes les communes (pour les <select>)
export const CITIES = Object.values(DEPARTMENTS).flat().sort();

// Quartiers connus pour les grandes villes — utilisé en autocomplete/suggestion.
// Les autres communes utilisent un champ texte libre (pas de liste exhaustive disponible).
export const QUARTIERS_BY_CITY = {
  'Cotonou': [
    'Agla', 'Aibatin', 'Akpakpa', 'Avotrou', 'Cadjèhoun', 'Dantokpa', 'Fidjrossè',
    'Fifadji', 'Ganhi', 'Gbégamey', 'Haie Vive', 'Houéyiho', 'Jonquet', 'Kindonou',
    'Midombo', 'Missité', 'Pk3', 'Pk10', 'Pk12', 'Sainte-Rita', 'Saint-Michel',
    'Sègbèya', 'Suru-Léré', 'Vodjè', 'Yénawa', 'Zongo',
  ],
  'Abomey-Calavi': [
    'Akassato', 'Godomey', 'Togba', 'Hêvié', 'Zinvié', 'Glo-Djigbé', 'Ouèdo',
    'Kpanroun', 'Tankpè', 'Zogbadjè', 'Calavi centre',
  ],
  'Porto-Novo': [
    'Ouando', 'Djegan-Daho', 'Avakpa', 'Attakè', 'Houéyiho', 'Zongo', 'Akonaboe',
    'Gbodjè', 'Louho',
  ],
  'Parakou': ['Zongo', 'Guéma', 'Titirou', 'Albarika'],
};

// Renvoie les quartiers connus pour une ville, ou tableau vide si aucune donnée
export function getQuartiersForCity(city) {
  return QUARTIERS_BY_CITY[city] || [];
}