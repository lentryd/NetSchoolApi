import Client from "@/classes/Client";

interface LocationType {
  id: number;
  key: string;
  name: string;
}

interface LocationInfo {
  locationType: LocationType;
  inProvinceCenter: boolean;
  isProvinceSchoolInCity: boolean;
}

interface CommonInfo {
  legalFormName: string;
  legalFormName83: string;
  typeName: string;
  showFormName: boolean;
  formName: string;
  schoolName: string;
  fullSchoolName: string;
  schoolNumber: string;
  foundingDate: Date;
  independ: string;
  additionalName: string;
  mainSchool: string;
  founders: string[];
  ownEducManagements: string[];
  status: string;
  smallOrganization: string;
  locationInfo: LocationInfo;
  about: string;
  emId?: any;
}

interface ManagementInfo {
  director: string;
  principalUVR: string;
  principalAHC: string;
  principalIT: string;
  collegiateManagement: string;
}

interface ContactInfo {
  stateProvinceName: string;
  cityName: string;
  districtName?: any;
  postAddress: string;
  phones: string;
  fax: string;
  email: string;
  web: string;
  addressesAdditionalBuildings: string;
  juridicalAddress: string;
}

interface OtherInfo {
  inn: string;
  kpp: string;
  ogrn: string;
  okpo: string;
  okato: string;
  okogu: string;
  okopf: string;
  okfs: string;
  okved: string;
  specialization: string;
  maxOccupancy: string;
  maxOccupancyOnShift: string;
  numberShifts: string;
  referenceToCharter: string;
  presenceOfPool: string;
  barrierFreeEnvironment: string;
  videoSurveillance: string;
  linkToScanCopyLicenseEducation?: any;
  socialPartnerShip: string;
  timetable: string;
  conditionsEducation: string;
  projectTypeForSchool?: any;
}

interface BankDetails {
  bankScore: string;
  corrScore: string;
  personalAccount: string;
  bik: string;
  note: string;
  bankName: string;
  bankKpp: string;
}

interface FoodPayDetails {
  foodPayOrgName: string;
  foodPayInn: string;
  foodPayKpp: string;
  foodPayBankName: string;
  foodPayBankScore: string;
  foodPayBankCorrScore: string;
  foodPayBankBik: string;
  foodPayBankKpp: string;
}

interface InternetConnectionInfo {
  computersCount: string;
  contentFilteringName: string;
  internetSpeedUnderContract: string;
  internetSpeedInFact: string;
  internetProviderName: string;
  internetAccessTechnology: string;
}

export interface CardObject {
  commonInfo: CommonInfo;
  managementInfo: ManagementInfo;
  contactInfo: ContactInfo;
  otherInfo: OtherInfo;
  bankDetails: BankDetails;
  foodPayDetails: FoodPayDetails;
  internetConnectionInfo: InternetConnectionInfo;
}

export default async function (client: Client, id: number) {
  const { commonInfo }: CardObject = await client
    .get(`schools/${id}/card`)
    .then((res) => res.json() as any);

  return { name: commonInfo.schoolName, fullName: commonInfo.fullSchoolName };
}
