import { generateRecurringEvents, CustomEventRecord } from "../utils/eventHelpers";

const testEvent: CustomEventRecord = {
  id: "test-1",
  name: "Test Sự Kiện Âm Lịch",
  content: "Test nội dung",
  event_date: "2026-05-24",
  location: "Nhà",
  created_by: "user-1",
  frequency: "yearly_lunar",
  lunar_month: 4,
  lunar_day: 28,
};

console.log("--- Bắt đầu Test ---");
const events = generateRecurringEvents(testEvent, 4, 28, "p1", "Thành viên test", "Nhà", "Nội dung");

console.log("Số lượng sự kiện tìm thấy:", events.length);
events.forEach((e, i) => {
  console.log(`Sự kiện ${i + 1}: ${e.eventDateLabel}, ngày diễn ra: ${e.nextOccurrence.toDateString()}, còn ${e.daysUntil} ngày`);
});
console.log("--- Kết thúc Test ---");
