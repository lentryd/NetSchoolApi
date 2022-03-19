import Client from "@classes/Client";

interface SchoolAddress {
  id: number;
  name: string;
  cityId: number;
  stateId: number;
  funcType: number;
  countryId: number;
  provinceId?: number;
  parentCityId?: number;
  municipalityDistrictId: number;
}

export interface SchoolInfo {
  cid: number;
  sid: number;
  pid: number;
  cn: number;
  sft: number;
  scid: number;
}

export default async function (client: Client, school: string | number) {
  const schools: SchoolAddress[] = await client
    .get("addresses/schools")
    .then((res) => res.json() as any);

  if (!schools || !schools.length)
    throw new Error("Сетевой не вернул список школ");

  if (typeof school === "string") school = school.toLowerCase();
  const result = schools.find(({ id, name }) =>
    typeof school !== "string" ? id == school : name.toLowerCase() == school
  );

  if (!result) throw new Error("Не удалось найти школу");

  return {
    cid: result.countryId,
    sid: result.stateId,
    pid: result.municipalityDistrictId,
    cn: result.cityId,
    sft: 2,
    scid: result.id,
  };
}
