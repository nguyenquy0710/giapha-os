"use client";

import { CustomEventRecord } from "@/utils/eventHelpers";
import { createClient } from "@/utils/supabase/client";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  AlertCircle,
  AlignLeft,
  Calendar as CalendarIcon,
  Loader2,
  MapPin,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { Lunar } from "lunar-javascript";
import { useEffect, useState } from "react";

interface CustomEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  eventToEdit?: CustomEventRecord | null;
}

export default function CustomEventModal({
  isOpen,
  onClose,
  onSuccess,
  eventToEdit,
}: CustomEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(eventToEdit?.name || "");
  const [eventDate, setEventDate] = useState(eventToEdit?.event_date || "");
  const [location, setLocation] = useState(eventToEdit?.location || "");
  const [content, setContent] = useState(eventToEdit?.content || "");
  const [isRecurring, setIsRecurring] = useState(eventToEdit?.frequency === 'yearly_lunar');
  const [lunarDay, setLunarDay] = useState<string | number>(eventToEdit?.lunar_day || "");

  // Lunar date mode
  const [dateMode, setDateMode] = useState<"solar" | "lunar">("solar");
  const [lunarMonth, setLunarMonth] = useState<number | "">("");
  const [lunarYear, setLunarYear] = useState<number | "">("");
  const [lunarConvertError, setLunarConvertError] = useState<string | null>(
    null,
  );

  useEffect(() => {
if (isOpen) {
        if (eventToEdit) {
          setName(eventToEdit.name);
          setEventDate(eventToEdit.event_date);
          setLocation(eventToEdit.location || "");
          setContent(eventToEdit.content || "");
          setIsRecurring(eventToEdit.frequency === 'yearly_lunar');
          setLunarMonth(eventToEdit.lunar_month || "");
          setLunarDay(eventToEdit.lunar_day ? String(eventToEdit.lunar_day) : "");
        } else {
          setName("");
          // Default to today
          const now = new Date();
          const y = now.getFullYear();
          const m = String(now.getMonth() + 1).padStart(2, "0");
          const d = String(now.getDate()).padStart(2, "0");
          setEventDate(`${y}-${m}-${d}`);
          setLocation("");
          setContent("");
          setIsRecurring(false);
          setLunarMonth("");
          setLunarDay("");
        }
        setError(null);
        setDateMode("solar");
        setLunarMonth("");
        setLunarYear("");
        setLunarConvertError(null);
      }
  }, [isOpen, eventToEdit]);

  // Auto-convert lunar → solar when all 3 fields are filled
  useEffect(() => {
    if (
      dateMode === "lunar" &&
      lunarDay !== "" &&
      lunarMonth !== "" &&
      lunarYear !== "" &&
      lunarYear > 100
    ) {
      try {
        const lunar = Lunar.fromYmd(
          lunarYear as number,
          lunarMonth as number,
          lunarDay as number,
        );
        const solar = lunar.getSolar();
        const y = solar.getYear();
        const m = String(solar.getMonth()).padStart(2, "0");
        const d = String(solar.getDay()).padStart(2, "0");
        setEventDate(`${y}-${m}-${d}`);
        setLunarConvertError(null);
      } catch {
        setLunarConvertError("Ngày âm lịch không hợp lệ.");
      }
    }
  }, [dateMode, lunarDay, lunarMonth, lunarYear]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const payload: any = {
        name,
        event_date: eventDate,
        location: location || null,
        content: content || null,
      };

      // Handle recurring yearly lunar events
      if (isRecurring && lunarDay && lunarMonth) {
        payload.frequency = 'yearly_lunar';
        payload.lunar_month = typeof lunarMonth === 'number' ? lunarMonth : parseInt(lunarMonth);
        payload.lunar_day = typeof lunarDay === 'number' ? lunarDay : parseInt(lunarDay);
      } else {
        // Default to single occurrence if not recurring
        payload.frequency = 'single';
        payload.lunar_month = null;
        payload.lunar_day = null;
      }

      let resultError;
      if (eventToEdit) {
        const { error: err } = await supabase
          .from("custom_events")
          .update(payload)
          .eq("id", eventToEdit.id);
        resultError = err;
      } else {
        const { error: err } = await supabase
          .from("custom_events")
          .insert([payload]);
        resultError = err;
      }

      if (resultError) throw resultError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message || "Đã xảy ra lỗi khi lưu sự kiện.");
      } else {
        setError("Đã xảy ra lỗi khi lưu sự kiện.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!eventToEdit) return;
    if (!window.confirm("Bạn có chắc chắn muốn xoá sự kiện này?")) return;

    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase
        .from("custom_events")
        .delete()
        .eq("id", eventToEdit.id);

      if (err) throw err;

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message || "Đã xảy ra lỗi khi xoá sự kiện.");
      } else {
        setError("Đã xảy ra lỗi khi xoá sự kiện.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formSectionVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const inputClasses =
    "bg-white text-stone-900 placeholder-stone-500 block w-full rounded-xl border border-stone-300 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white text-sm px-4 py-3 transition-all outline-none!";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-stone-900/40 backdrop-blur-sm"
        >
          {/* Click-away backdrop */}
          <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-stone-200"
          >
            {/* Sticky Header Actions */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="size-10 flex items-center justify-center bg-stone-100/80 text-stone-600 rounded-full hover:bg-stone-200 hover:text-stone-900 shadow-sm border border-stone-200/50 transition-colors"
                aria-label="Đóng"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-8 pt-16 pb-8">
              <h2 className="text-xl font-serif font-bold text-stone-800 mb-6">
                {eventToEdit ? "Sửa Sự Kiện" : "Thêm Sự Kiện Tuỳ Chỉnh"}
              </h2>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium flex items-start gap-3 shadow-sm"
                  >
                    <AlertCircle className="size-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  variants={formSectionVariants}
                  initial="hidden"
                  animate="show"
                  className="bg-white/80 p-5 sm:p-6 rounded-2xl shadow-sm border border-stone-200/80 space-y-5"
                >
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      Tên sự kiện <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      className={inputClasses}
                      placeholder="VD: Lễ Tảo Mộ Kỷ Tỵ"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-semibold text-stone-700">
                        Ngày diễn ra <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setDateMode((m) =>
                            m === "solar" ? "lunar" : "solar",
                          );
                          setLunarConvertError(null);
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-amber-700 transition-colors px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-amber-50 border border-stone-200/60"
                      >
                        {dateMode === "solar" ? (
                          <>
                            <Moon className="size-3" />
                            Nhập Âm lịch
                          </>
                        ) : (
                          <>
                            <Sun className="size-3" />
                            Nhập Dương lịch
                          </>
                        )}
                      </button>
                    </div>

                    {dateMode === "solar" ? (
                      <div className="relative">
                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                        <input
                          required
                          type="date"
                          className={`${inputClasses} pl-11`}
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="number"
                            placeholder="Ngày"
                            min="1"
                            max="30"
                            value={lunarDay}
                            onChange={(e) =>
                              setLunarDay(
                                e.target.value ? Number(e.target.value) : "",
                              )
                            }
                            className={inputClasses}
                          />
                          <input
                            type="number"
                            placeholder="Tháng"
                            min="1"
                            max="12"
                            value={lunarMonth}
                            onChange={(e) =>
                              setLunarMonth(
                                e.target.value ? Number(e.target.value) : "",
                              )
                            }
                            className={inputClasses}
                          />
                          <input
                            type="number"
                            placeholder="Năm"
                            value={lunarYear}
                            onChange={(e) =>
                              setLunarYear(
                                e.target.value ? Number(e.target.value) : "",
                              )
                            }
                            className={inputClasses}
                          />
                        </div>
                        {lunarConvertError && (
                          <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                            <AlertCircle className="size-3" />
                            {lunarConvertError}
                          </p>
                        )}
                        {eventDate && !lunarConvertError && (
                          <p className="text-xs text-stone-500 flex items-center gap-1.5">
                            <Sun className="size-3 text-amber-500" />
                            Dương lịch:{" "}
                            <span className="font-semibold text-stone-700">
                              {eventDate.split("-").reverse().join("/")}
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      Địa điểm
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                      <input
                        type="text"
                        className={`${inputClasses} pl-11`}
                        placeholder="VD: Nhà từ đường"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      Nội dung chi tiết
                    </label>
                    <div className="relative">
                      <AlignLeft className="absolute left-4 top-4 size-4 text-stone-400" />
                      <textarea
                        rows={3}
                        className={`${inputClasses} pl-11 resize-none custom-scrollbar`}
                        placeholder="Ghi chú thêm về sự kiện..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
</div>
                 </motion.div>

                {/* Repeat Event Section */}
                <motion.div
                  variants={formSectionVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.15 }}
                  className="bg-amber-50/60 p-5 sm:p-6 rounded-2xl shadow-sm border border-amber-200/60 space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={isRecurring}
                          onChange={(e) => setIsRecurring(e.target.checked)}
                        />
                        <div className="w-6 h-6 bg-white border-2 border-stone-300 rounded-lg peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all"></div>
                        <Moon className="absolute inset-0 m-auto w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm font-semibold text-stone-700">
                        Lặp lại hàng năm
                      </span>
                    </label>
                    {isRecurring && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-medium">
                        Âm lịch
                      </span>
                    )}
                  </div>

                  {isRecurring && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="bg-white/80 border border-stone-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 text-sm text-stone-600 mb-2">
                          <Moon className="size-5 text-amber-600" />
                          <span className="font-medium">Ngày tháng âm lịch</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-stone-500 mb-1">
                              Ngày
                            </label>
                            <input
                              type="number"
                              placeholder="VD: 23"
                              min="1"
                              max="30"
                              required
                              value={lunarDay}
                              onChange={(e) =>
                                setLunarDay(
                                  e.target.value ? Number(e.target.value) : ""
                                )
                              }
                              className={inputClasses}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-stone-500 mb-1">
                              Tháng
                            </label>
                            <input
                              type="number"
                              placeholder="VD: 12"
                              min="1"
                              max="12"
                              required
                              value={lunarMonth}
                              onChange={(e) =>
                                setLunarMonth(
                                  e.target.value ? Number(e.target.value) : ""
                                )
                              }
                              className={inputClasses}
                            />
                          </div>
                          <div className="col-span-3">
                            <div className="space-y-2">
                              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                                <AlertCircle className="size-3" />
                                <span>
                                  Hệ thống tự động điều chỉnh tháng nhuận và hiển thị chính xác.
                                </span>
                              </p>
                              {lunarDay && lunarMonth && (
                                <p className="text-xs text-amber-800 bg-amber-100/80 px-3 py-2 rounded-lg">
                                  <span className="font-semibold">Xem trước:</span> Lần tiếp theo sẽ hiển thị:{" "}
                                  <span className="font-bold text-amber-900">
                                    Ngày {lunarDay}/{lunarMonth} ÂL
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  variants={formSectionVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.1 }}
                  className="flex justify-between items-center gap-4 pt-4 sm:pt-6"
                >
                  {eventToEdit ? (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors disabled:opacity-50 border border-rose-200/50"
                    >
                      Xoá sự kiện
                    </button>
                  ) : (
                    <div /> /* Empty div to push right buttons to end */
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="btn"
                    >
                      Huỷ bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading && <Loader2 className="size-4 animate-spin" />}
                      {loading ? "Đang lưu..." : "Lưu sự kiện"}
                    </button>
                  </div>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
