import provincesRaw from "./raw/provinces.json";
import districtsRaw from "./raw/districts.json";
import localLevelsRaw from "./raw/local_levels.json";

/*
  Full Nepal geo dataset:
  - 7 provinces
  - 77 districts
  - 753 local levels

  This file converts the raw JSON dataset into the same format
  our signup form already uses:
  PROVINCES
  DISTRICTS_BY_PROVINCE
  LOCAL_LEVELS
*/

function getValue(item, possibleKeys) {
  for (const key of possibleKeys) {
    if (item[key] !== undefined && item[key] !== null) {
      return item[key];
    }
  }
  return "";
}

function toNumber(value) {
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

function cleanName(value) {
  return String(value || "").trim();
}

const normalizedProvinces = provincesRaw.map((province) => ({
  id: toNumber(getValue(province, ["province_id", "id"])),
  name: cleanName(getValue(province, ["name", "province_name", "english_name"])),
  nepaliName: cleanName(getValue(province, ["nepali_name", "name_np", "nepali"]))
}));

const normalizedDistricts = districtsRaw.map((district) => ({
  id: toNumber(getValue(district, ["district_id", "id"])),
  provinceId: toNumber(getValue(district, ["province_id", "province"])),
  name: cleanName(getValue(district, ["name", "district_name", "english_name"])),
  nepaliName: cleanName(getValue(district, ["nepali_name", "name_np", "nepali"]))
}));

const normalizedLocalLevels = localLevelsRaw.map((localLevel) => ({
  id: toNumber(getValue(localLevel, ["municipality_id", "local_level_id", "id"])),
  districtId: toNumber(getValue(localLevel, ["district_id", "district"])),
  name: cleanName(getValue(localLevel, ["name", "local_level_name", "municipality_name", "english_name"])),
  nepaliName: cleanName(getValue(localLevel, ["nepali_name", "name_np", "nepali"])),
  typeId: toNumber(getValue(localLevel, ["local_level_type_id", "type_id"]))
}));

export const NEPAL_PROVINCES = [...normalizedProvinces].sort((a, b) => a.id - b.id);

export const NEPAL_DISTRICTS = [...normalizedDistricts].sort((a, b) => a.id - b.id);

export const NEPAL_LOCAL_LEVELS = [...normalizedLocalLevels].sort((a, b) => a.id - b.id);

export const PROVINCES = NEPAL_PROVINCES.map((province) => province.name);

export const DISTRICTS_BY_PROVINCE = NEPAL_PROVINCES.reduce((acc, province) => {
  acc[province.name] = NEPAL_DISTRICTS
    .filter((district) => district.provinceId === province.id)
    .map((district) => district.name);

  return acc;
}, {});

export const LOCAL_LEVELS = NEPAL_DISTRICTS.reduce((acc, district) => {
  acc[district.name] = NEPAL_LOCAL_LEVELS
    .filter((localLevel) => localLevel.districtId === district.id)
    .map((localLevel) => localLevel.name);

  return acc;
}, {});

export function getProvinceByName(provinceName) {
  return NEPAL_PROVINCES.find((province) => province.name === provinceName) || null;
}

export function getDistrictByName(districtName) {
  return NEPAL_DISTRICTS.find((district) => district.name === districtName) || null;
}

export function getLocalLevelByName(localLevelName) {
  return NEPAL_LOCAL_LEVELS.find((localLevel) => localLevel.name === localLevelName) || null;
}

export function getDistrictsByProvince(provinceName) {
  return DISTRICTS_BY_PROVINCE[provinceName] || [];
}

export function getLocalLevelsByDistrict(districtName) {
  return LOCAL_LEVELS[districtName] || [];
}

export const NEPAL_GEO_STATS = {
  provinces: NEPAL_PROVINCES.length,
  districts: NEPAL_DISTRICTS.length,
  localLevels: NEPAL_LOCAL_LEVELS.length
};