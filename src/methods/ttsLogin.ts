import NetSchoolApi from "../NetSchoolApi-safe";

interface SchoolAddress {
  countryId: number;
  stateId: number;
  cityId: number;
  parentCityId?: number;
  provinceId?: number;
  municipalityDistrictId: number;
  funcType: number;
  id: number;
  name: string;
}

export interface TTSLogin {
  cid: number;
  sid: number;
  pid: number;
  cn: number;
  sft: number;
  scid: number;
}

/**
 * Поиск нужной школы
 * @param schoolName Название требуемой школы
 * @param schools Список доступных школ
 * @returns Искомая школа (если найдется)
 */
function findSchool(schoolName: string, schools: SchoolAddress[]) {
  schoolName = schoolName.toLowerCase();

  return schools.find((school) => school.name.toLowerCase() == schoolName);
}

/**
 * Преобразование школьных данных в формат данных авторизации
 * @param school Данные школы
 * @returns Данные
 */
function makeTTSLogin(school?: SchoolAddress): TTSLogin {
  if (!school) {
    throw new Error(`Не удалось найти школу, проверьте название`);
  } else {
    return {
      cid: school.countryId,
      sid: school.stateId,
      pid: school.municipalityDistrictId,
      cn: school.cityId,
      sft: 2,
      scid: school.id,
    };
  }
}

export default function ttsLogin(this: NetSchoolApi): Promise<TTSLogin> {
  const { schoolName } = this.credentials;

  return this.Client.get("addresses/schools?funcType=2")
    .then((res) => res.json())
    .then((schools: SchoolAddress[]) => findSchool(schoolName, schools))
    .then(makeTTSLogin);
}
