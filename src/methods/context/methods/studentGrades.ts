import Client from "@classes/Client";

interface RelatedObject {
  type: string;
  ref: string;
}

interface Dependency {
  relatedObject: RelatedObject;
  relatedValue?: any;
  condition: string;
}

interface Filter {
  id: string;
  title: string;
  order: number;
  filterType: string;
  optionalFlag: boolean;
  hideSingleOption: boolean;
  hasSureCheckedFlag: boolean;
  hideTitleFlag: boolean;
  existStateProvider: boolean;
  emptyText: string;
  dependencies: Dependency[];
}

interface FilterPanel {
  filters: Filter[];
}

interface Report {
  id: string;
  name: string;
  group: string;
  level: string;
  order: number;
  filterPanel: FilterPanel;
  presentTypes: any[];
}

interface Item {
  title: string;
  value: string;
}

interface Range {
  start: Date;
  end: Date;
}

interface DefaultRange {
  start: Date;
  end: Date;
}

interface FilterSource {
  items: Item[];
  defaultValue: string;
  filterId: string;
  nullText?: any;
  minValue?: Date;
  maxValue?: Date;
  range: Range;
  defaultRange: DefaultRange;
}

interface StudentGradesObject {
  report: Report;
  filterSources: FilterSource[];
}

export default async function (client: Client) {
  const { filterSources: data }: StudentGradesObject = await client
    .get("reports/studentGrades")
    .then((res) => res.json());

  const classes =
    data
      .find((f) => f.filterId == "PCLID_IUP")
      ?.items.map((c) => ({ id: parseInt(c.value), name: c.title })) ?? [];

  const subjects =
    data
      .find((f) => f.filterId == "SGID")
      ?.items.map((s) => ({ id: s.value, name: s.title })) ?? [];

  const students =
    data
      .find((f) => f.filterId == "SID")
      ?.items.map((s) => ({
        id: parseInt(s.value),
        name: s.title,
      })) ?? [];

  return {
    user: {
      classes,
      students,
    },
    subjects,
  };
}
