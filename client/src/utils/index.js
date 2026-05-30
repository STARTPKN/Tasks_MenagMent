export const formatDate = (date) => {
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export function dateFormatter(dateString) {
  const inputDate = new Date(dateString);

  if (isNaN(inputDate.getTime())) {
    return "Invalid Date";
  }

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getInitials(fullName) {
  if (!fullName || typeof fullName !== "string") return "";
  const names = fullName.trim().split(/\s+/).filter(Boolean);
  if (names.length === 0) return "";
  const initials = names
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase());
  return initials.join("");
}

export const PRIOTITYSTYELS = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-blue-600",
};

export const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

export const BGS = [
  "bg-blue-600",
  "bg-yellow-600",
  "bg-red-600",
  "bg-green-600",
];

export const PRIORITY_THAI = {
  high: "สูง",
  medium: "ปานกลาง",
  low: "ต่ำ",
  normal: "ปกติ",
};

export const TASK_TYPE_THAI = {
  todo: "ที่ต้องทำ",
  "in progress": "กำลังดำเนินการ",
  completed: "เสร็จสิ้น",
};

export const ROLE_THAI = {
  Admin: "ผู้ดูแลระบบ",
  User: "ผู้ใช้งาน",
};
