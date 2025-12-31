import { mandalsList } from './telanganaMandalsData';

export const telanganaData = {
  districts: [
    "Adilabad district",
    "Bhadradri Kothagudem district",
    "Hyderabad district",
    "Jagtial district",
    "Jangaon district",
    "Jayashankar Bhupalpally district",
    "Jogulamba Gadwal district",
    "Kamareddy district",
    "Karimnagar district",
    "Khammam district",
    "Komaram Bheem Asifabad district",
    "Mahabubabad district",
    "Mahabubnagar district",
    "Mancherial district",
    "Medak district",
    "Medchal-Malkajgiri district",
    "Mulugu district",
    "Nagarkurnool district",
    "Nalgonda district",
    "Narayanpet district",
    "Nirmal district",
    "Nizamabad district",
    "Peddapalli district",
    "Rajanna Sircilla district",
    "Rangareddy district",
    "Sangareddy district",
    "Siddipet district",
    "Suryapet district",
    "Vikarabad district",
    "Wanaparthy district",
    "Warangal Rural district",
    "Warangal Urban district",
    "Yadadri Bhuvanagiri district"
  ],
  mandals: mandalsList
};

// Helper function to get mandals by district
export const getMandalsByDistrict = (district) => {
  return telanganaData.mandals.filter(m => m.district === district);
};

// Helper function to get district by mandal
export const getDistrictByMandal = (mandal) => {
  const found = telanganaData.mandals.find(m => m.mandal === mandal);
  return found ? found.district : null;
}; 