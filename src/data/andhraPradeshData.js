import { mandalsList } from "./andhraPradeshMandalsData";

export const districts = [
  "Alluri Sitharama Raju district",
  "Anakapalli district",
  "Anantapuram district",
  "Annamayya district",
  "Bapatla district",
  "Chittoor district",
  "East Godavari district",
  "Eluru district",
  "Guntur district",
  "Kakinada district",
  "Konaseema district",
  "Krishna district",
  "Kurnool district",
  "Nandyal district",
  "Nellore district",
  "NTR district",
  "Palnadu district",
  "Parvathipuram Manyam district",
  "Prakasam district",
  "Sri Sathya Sai district",
  "Srikakulam district",
  "Tirupati district",
  "Visakhapatnam district",
  "Vizianagaram district",
  "West Godavari district",
  "YSR Kadapa district"
];

export const andhraPradeshData = {
  districts: districts,
  mandals: mandalsList
};

// Helper function to get mandals by district
export const getMandalsByDistrict = (district) => {
  return andhraPradeshData.mandals.filter(m => m.district === district);
};

// Helper function to get district by mandal
export const getDistrictByMandal = (mandal) => {
  const found = andhraPradeshData.mandals.find(m => m.mandal === mandal);
  return found ? found.district : null;
}; 