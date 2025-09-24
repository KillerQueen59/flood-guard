const changeTailwindToHex = (color: string) => {
  switch (color) {
    case "bg-indicator-red":
      return "#E51717";
    case "bg-indicator-magenta":
      return "#E91D62";
    case "bg-indicator-purple":
      return "#9C29B2";
    case "bg-indicator-deepPurple":
      return "#663CB5";
    case "bg-indicator-indigo":
      return "#4153B5";
    case "bg-indicator-blue":
      return "#2176F5";
    case "bg-indicator-lightBlue":
      return "#02A9F7";
    case "bg-indicator-cyan":
      return "#01BCD6";
    case "bg-indicator-teal":
      return "#039789";
    case "bg-indicator-green":
      return "#4CB051";
    case "bg-indicator-lightGreen":
      return "#8DC34B";
    case "bg-indicator-lime":
      return "#CBDD38";
    case "bg-indicator-yellow":
      return "#FFE93D";
    case "bg-indicator-amber":
      return "#FCC005";
    case "bg-indicator-grande":
      return "#FF9800";
    case "bg-indicator-deepOrange":
      return "#FE5823";
    case "bg-indicator-brown":
      return "#7B5649";
    case "bg-indicator-grey":
      return "#9E9E9E";
    case "bg-indicator-blueGrey":
      return "#5F7D8C";
    case "bg-indicator-black":
      return "#373232";
    case "bg-primary-50":
      return "#E8EDFB";
    default:
      return "#FFFFFF";
  }
};

export const camel2title = (camelCase: any) =>
  camelCase
    .replace(/([A-Z])/g, (match: any) => ` ${match}`)
    .replace(/^./, (match: any) => match.toUpperCase())
    .trim();

export const numberWithSeparator = (x: any) => {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const transformColor = (backgroundColor: string[]) => {
  const _background: string[] = [];
  backgroundColor.map((d) => {
    _background.push(changeTailwindToHex(d));
  });
  return _background;
};

export function getWindDirection(degrees: number) {
  if (degrees < 0 || degrees >= 360) {
    throw new Error("Degrees must be between 0 and 359");
  }

  const directions = [
    "Utara",
    "Utara-Timur Laut",
    "Timur Laut",
    "Timur-Utara Laut",
    "Timur",
    "Timur-Selatan Laut",
    "Tenggara",
    "Selatan-Tenggara",
    "Selatan",
    "Selatan-Barat Daya",
    "Barat Daya",
    "Barat-Tenggara",
    "Barat",
    "Barat-Utara Laut",
    "Barat Laut",
    "Utara-Barat Laut",
  ];

  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export const convertToLabelValue = (data: any, selectedKebun: any) => {
  if (!selectedKebun) {
    const totals = {
      rusak: 0,
      idle: 0,
      active: 0,
      alert: 0,
    };

    data.forEach((item: any) => {
      totals.rusak += item.rusak;
      totals.idle += item.idle;
      totals.active += item.active;
      totals.alert += item.alert;
    });

    return [
      { label: "Rusak", value: totals.rusak },
      { label: "Idle", value: totals.idle },
      { label: "Active", value: totals.active },
      { label: "Alert", value: totals.alert },
    ];
  }

  const entry = data.find((item: any) => item.kebun === selectedKebun);

  if (entry) {
    return [
      { label: "Rusak", value: entry.rusak },
      { label: "Idle", value: entry.idle },
      { label: "Active", value: entry.active },
      { label: "Alert", value: entry.alert },
    ];
  }

  return [];
};
