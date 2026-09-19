import { describe, expect, it } from "vitest";

import {
  from24Hour,
  hasSeconds,
  isTwelveHour,
  optionsFor,
  parseTime,
  partsToTime,
  segmentsFor,
  stepSegment,
  to24Hour,
  toValue
} from "./TimeInput.utils";

const parts = (over: Partial<Record<string, string>> = {}) => ({
  hour: "",
  minute: "",
  second: "",
  meridiem: "" as const,
  ...over
});

describe("format reading", () => {
  it.each([
    ["HH:mm", false, false, ["hour", "minute"]],
    ["hh:mm A", true, false, ["hour", "minute", "meridiem"]],
    ["HH:mm:ss", false, true, ["hour", "minute", "second"]],
    ["hh:mm:ss A", true, true, ["hour", "minute", "second", "meridiem"]]
  ] as const)("reads %s", (format, twelve, seconds, segments) => {
    expect(isTwelveHour(format)).toBe(twelve);
    expect(hasSeconds(format)).toBe(seconds);
    expect(segmentsFor(format)).toEqual(segments);
  });
});

describe("the 12 and 24 hour clocks", () => {
  it.each([
    [12, "AM", 0],
    [12, "PM", 12],
    [1, "AM", 1],
    [1, "PM", 13],
    [11, "PM", 23]
  ] as const)("%s %s is %s", (hour12, meridiem, expected) => {
    expect(to24Hour(hour12, meridiem)).toBe(expected);
    expect(from24Hour(expected)).toEqual({ hour12, meridiem });
  });
});

describe("parseTime", () => {
  it.each(["09:30", "00:00", "23:59", "09:30:15"])("takes %s", (value) => {
    expect(parseTime(value)).not.toBeNull();
  });

  it.each(["", "9:30", "0930", "24:00", "09:60", "09:30:60", "ab:cd", null, undefined])(
    "turns down %s",
    (value) => {
      expect(parseTime(value)).toBeNull();
    }
  );
});

describe("toValue", () => {
  it("pads, and only carries seconds when they are asked for", () => {
    expect(toValue(9, 5, 3, false)).toBe("09:05");
    expect(toValue(9, 5, 3, true)).toBe("09:05:03");
  });
});

describe("stepSegment", () => {
  it.each([
    ["09", "hour", 1, false, "10"],
    ["23", "hour", 1, false, "00"],
    ["00", "hour", -1, false, "23"],
    ["12", "hour", 1, true, "01"],
    ["01", "hour", -1, true, "12"],
    ["59", "minute", 1, false, "00"],
    ["00", "minute", -1, false, "59"]
  ] as const)("steps %s by %s", (current, segment, by, twelve, expected) => {
    expect(stepSegment(current, segment, by, twelve)).toBe(expected);
  });

  it("starts from the bottom of the segment when it is empty", () => {
    expect(stepSegment("", "minute", 1, false)).toBe("01");
    expect(stepSegment("", "hour", 1, true)).toBe("02");
  });
});

describe("partsToTime", () => {
  it("reads the 12 hour segments as 24 hour numbers", () => {
    expect(partsToTime(parts({ hour: "04", minute: "30", meridiem: "PM" }), true)).toEqual({
      hour: 16,
      minute: 30,
      second: 0
    });
  });

  it("stands the empty segments at zero", () => {
    expect(partsToTime(parts(), false)).toEqual({ hour: 0, minute: 0, second: 0 });
  });
});

describe("optionsFor", () => {
  const base = { twelve: false, step: 1, order: segmentsFor("HH:mm") };

  it("lists every hour and minute", () => {
    expect(optionsFor("hour", parts(), base)).toHaveLength(24);
    expect(optionsFor("minute", parts(), base)).toHaveLength(60);
  });

  it("thins the minutes by the step, and leaves the hours alone", () => {
    const stepped = { ...base, step: 15 };

    expect(optionsFor("minute", parts(), stepped).map((o) => o.value)).toEqual([
      "00",
      "15",
      "30",
      "45"
    ]);
    expect(optionsFor("hour", parts(), stepped)).toHaveLength(24);
  });

  it("leads with 12 on a 12 hour clock, the way a clock face does", () => {
    const twelve = { twelve: true, step: 1, order: segmentsFor("hh:mm A") };

    expect(optionsFor("hour", parts(), twelve).map((o) => o.value)).toEqual([
      "12",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11"
    ]);
  });

  it("greys out nothing without a rule", () => {
    expect(optionsFor("hour", parts(), base).every((o) => !o.disabled)).toBe(true);
  });

  describe("disabledTime", () => {
    const working = { ...base, disabledTime: ({ hour }: { hour: number }) => hour < 9 };

    it("greys out the hours the rule turns down", () => {
      const hours = optionsFor("hour", parts(), working);

      expect(hours.filter((o) => o.disabled).map((o) => o.value)).toEqual([
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08"
      ]);
    });

    it("leaves the minutes open while no hour is chosen", () => {
      // The unchosen hour is free to be anything, so an hour rule says nothing about
      // minutes yet. Reading it as hour zero would grey out the whole column.
      expect(optionsFor("minute", parts(), working).every((o) => !o.disabled)).toBe(true);
    });

    it("narrows the minutes once an hour is chosen", () => {
      const lunch = {
        ...base,
        disabledTime: ({ hour, minute }: { hour: number; minute: number }) =>
          hour === 12 && minute < 30
      };

      const minutes = optionsFor("minute", parts({ hour: "12" }), lunch);

      expect(minutes.filter((o) => o.disabled)).toHaveLength(30);
      expect(minutes.find((o) => o.value === "30")?.disabled).toBe(false);
    });

    it("never greys a column out on account of one to its right", () => {
      // 1 and 2 in the morning, 4 and 5 in the afternoon. Choosing PM must not lock the
      // hour column, or there is no way back to the morning without clearing the field.
      const split = {
        twelve: true,
        step: 1,
        order: segmentsFor("hh:mm A"),
        disabledTime: ({ hour }: { hour: number }) => ![1, 2, 16, 17].includes(hour)
      };

      const hours = optionsFor("hour", parts({ meridiem: "PM" }), split);

      expect(hours.find((o) => o.value === "01")?.disabled).toBe(false);
      expect(hours.find((o) => o.value === "02")?.disabled).toBe(false);
    });

    it("does narrow a column from one to its left", () => {
      const split = {
        twelve: true,
        step: 1,
        order: segmentsFor("hh:mm A"),
        disabledTime: ({ hour }: { hour: number }) => ![1, 2, 16, 17].includes(hour)
      };

      const halves = optionsFor("meridiem", parts({ hour: "01" }), split);

      expect(halves.find((o) => o.value === "AM")?.disabled).toBe(false);
      expect(halves.find((o) => o.value === "PM")?.disabled).toBe(true);
    });
  });
});
